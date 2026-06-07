import os
import anthropic

_client = None

def get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise RuntimeError("ANTHROPIC_API_KEY manquant — ajoutez-le dans docker-compose.yml")
        _client = anthropic.Anthropic(api_key=api_key)
    return _client


SCHEMA_BASE = """
Tables disponibles (base pédagogique Boutique en ligne) :
- clients      : id, nom, email, ville, date_inscription
- produits     : id, nom, categorie, prix, stock
- commandes    : id, client_id, date_commande, total, statut
- details_commande : id, commande_id, produit_id, quantite, prix_unitaire
"""


def demander_indice(requete_sql: str, erreur: str, niveau: int) -> str:
    """
    Retourne un indice pédagogique de niveau 1, 2 ou 3.
    niveau 1 → piste vague | niveau 2 → syntaxe ciblée | niveau 3 → structure guidée
    """
    client = get_client()

    system = (
        "Tu es un tuteur SQL bienveillant pour des étudiants débutants en data. "
        "Tu guides SANS jamais donner la réponse complète. "
        "Tu utilises la méthode socratique : questions + pistes. "
        "Réponds en français. Sois encourageant, concis (3-4 phrases max)."
    )

    if niveau == 1:
        consigne = (
            "Donne un indice très vague. Identifie uniquement le concept SQL concerné "
            "sans mentionner la correction. Ex : 'Pense à la façon dont SQL sélectionne des colonnes'."
        )
    elif niveau == 2:
        consigne = (
            "Donne un indice plus précis. Nomme la clause SQL à utiliser ou à corriger, "
            "explique son rôle mais ne donne pas le code. "
            "Ex : 'La clause WHERE filtre les lignes — as-tu bien comparé une colonne à une valeur ?'."
        )
    else:
        consigne = (
            "Donne un indice détaillé avec la structure à compléter. "
            "Utilise des ___ pour les parties à remplir par l'étudiant. "
            "Ex : 'Essaie : SELECT ___ FROM ___ WHERE ___ = ___'. "
            "Ne complète pas les blancs toi-même."
        )

    user_msg = (
        f"Requête SQL de l'étudiant :\n```sql\n{requete_sql}\n```\n\n"
        f"Message d'erreur obtenu : {erreur}\n\n"
        f"Schéma de la base :\n{SCHEMA_BASE}\n\n"
        f"Instruction : {consigne}"
    )

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=350,
        system=system,
        messages=[{"role": "user", "content": user_msg}],
    )

    return message.content[0].text
