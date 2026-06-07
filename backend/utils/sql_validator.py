# Liste des mots-clés SQL dangereux — interdit aux étudiants
MOTS_INTERDITS = [
    "INSERT", "UPDATE", "DELETE", "DROP",
    "ALTER", "CREATE", "TRUNCATE", "GRANT", "REVOKE"
]

def valider_requete(requete: str) -> bool:
    """
    Retourne True si la requête est autorisée.
    - Doit commencer par SELECT
    - Ne doit contenir aucun mot dangereux
    """
    requete_majuscules = requete.upper().strip()

    if not requete_majuscules.startswith("SELECT"):
        return False

    for mot in MOTS_INTERDITS:
        if mot in requete_majuscules:
            return False

    return True
