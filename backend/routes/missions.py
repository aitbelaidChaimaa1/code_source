import json
from fastapi import APIRouter, Depends, HTTPException
from models import ValidationMission
from database import get_app_connection, get_edu_connection
from utils.adaptive import calculer_scores, get_concept_cible, monde_debloque, CONCEPTS_LABELS
from utils.jwt_helper import get_user_id
from utils.claude_client import get_client

router = APIRouter(prefix="/missions", tags=["Missions"])

SCHEMA = """
Tables disponibles (boutique en ligne) :
- clients(id, nom, email, ville, date_inscription)
- produits(id, nom, categorie, prix, stock)
- commandes(id, client_id, date_commande, total, statut)
- details_commande(id, commande_id, produit_id, quantite, prix_unitaire)

Données exemples :
- 5 clients (Ahmed Benali Casablanca, Sara Alaoui Rabat, Karim Tazi Marrakech...)
- 7 produits électroniques (Smartphone 3500 DH, Laptop 8900 DH...)
- 6 commandes avec statuts Livré / En cours / En attente
"""

INSTRUCTIONS_CONCEPT = {
    'select_simple': "Utilise uniquement SELECT et FROM. Pas de WHERE ni JOIN.",
    'where':         "Utilise SELECT + WHERE pour filtrer des données.",
    'order_by':      "Utilise SELECT + ORDER BY pour trier les résultats.",
    'join':          "Utilise un JOIN (INNER JOIN ou LEFT JOIN) entre deux tables.",
    'group_by':      "Utilise GROUP BY avec une fonction d'agrégation (COUNT, SUM, AVG).",
    'sous_requete':  "Utilise une sous-requête (SELECT imbriqué dans WHERE ou FROM).",
}


def _generer_mission_ia(monde: int, concept: str) -> dict:
    client = get_client()

    prompt = f"""Tu es un générateur de missions SQL pédagogiques.
Génère une mission pour un étudiant sur le concept : {CONCEPTS_LABELS.get(concept, concept)}.
Contrainte SQL : {INSTRUCTIONS_CONCEPT.get(concept, '')}
{SCHEMA}

Réponds UNIQUEMENT avec un JSON valide (sans markdown) :
{{
  "titre": "Titre court et accrocheur de la mission (max 8 mots)",
  "scenario": "Un scénario narratif court (2-3 phrases) qui donne du contexte à la mission",
  "question": "La question précise à résoudre en SQL (1 phrase claire)",
  "sql_attendu": "La requête SQL correcte qui répond à la question"
}}"""

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}],
    )

    texte = message.content[0].text.strip()
    # Nettoyer si Claude ajoute des balises markdown
    if texte.startswith("```"):
        texte = texte.split("```")[1]
        if texte.startswith("json"):
            texte = texte[4:]
    return json.loads(texte.strip())


@router.post("/generer")
def generer_mission(payload: dict, user_id: int = Depends(get_user_id)):
    monde = int(payload.get("monde", 1))

    conn = get_app_connection()
    cur = conn.cursor()
    cur.execute("SELECT xp FROM utilisateurs WHERE id = %s", (user_id,))
    xp = cur.fetchone()[0]

    if not monde_debloque(monde, xp):
        cur.close(); conn.close()
        raise HTTPException(status_code=403, detail="Monde verrouillé — gagne plus de XP !")

    scores = calculer_scores(user_id)
    concept_override = payload.get("concept")
    if concept_override and concept_override in INSTRUCTIONS_CONCEPT:
        concept = concept_override
    else:
        concept = get_concept_cible(scores, monde)

    try:
        data = _generer_mission_ia(monde, concept)
    except Exception as e:
        cur.close(); conn.close()
        raise HTTPException(status_code=500, detail=f"Erreur génération IA : {str(e)}")

    cur.execute("""
        INSERT INTO missions (user_id, monde, titre, scenario, question, sql_attendu, concept)
        VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id
    """, (user_id, monde, data["titre"], data["scenario"], data["question"], data["sql_attendu"], concept))
    mission_id = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {
        "id": mission_id,
        "monde": monde,
        "titre": data["titre"],
        "scenario": data["scenario"],
        "question": data["question"],
        "concept": concept,
        "concept_label": CONCEPTS_LABELS.get(concept, concept),
    }


@router.post("/valider")
def valider_mission(data: ValidationMission, user_id: int = Depends(get_user_id)):
    conn = get_app_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT sql_attendu, concept, monde, complete
        FROM missions WHERE id = %s AND user_id = %s
    """, (data.mission_id, user_id))
    row = cur.fetchone()

    if not row:
        cur.close(); conn.close()
        raise HTTPException(status_code=404, detail="Mission introuvable")

    sql_attendu, concept, monde, deja_complete = row

    if deja_complete:
        cur.close(); conn.close()
        return {"succes": True, "deja_complete": True, "message": "Mission déjà complétée !"}

    # Exécuter les deux requêtes et comparer les résultats
    edu = get_edu_connection()
    edu_cur = edu.cursor()

    try:
        edu_cur.execute(data.requete_etudiant)
        res_etudiant = set(tuple(r) for r in edu_cur.fetchall())

        edu_cur.execute(sql_attendu)
        res_attendu = set(tuple(r) for r in edu_cur.fetchall())

        succes = res_etudiant == res_attendu
    except Exception as e:
        edu_cur.close(); edu.close()
        cur.close(); conn.close()
        raise HTTPException(status_code=400, detail=f"Erreur SQL : {str(e)}")
    finally:
        edu_cur.close()
        edu.close()

    # Enregistrer la performance
    cur.execute("""
        INSERT INTO performances (user_id, concept, reussi, requete, monde)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_id, concept, succes, data.requete_etudiant, monde))

    if succes:
        cur.execute("UPDATE missions SET complete = TRUE WHERE id = %s", (data.mission_id,))

    conn.commit()
    cur.close()
    conn.close()

    return {
        "succes": succes,
        "deja_complete": False,
        "message": "Bravo ! Mission accomplie !" if succes else "Pas tout à fait... réessaie !",
        "concept": concept,
    }


@router.get("/scores-mondes")
def scores_mondes(user_id: int = Depends(get_user_id)):
    conn = get_app_connection()
    cur = conn.cursor()
    cur.execute("SELECT xp FROM utilisateurs WHERE id = %s", (user_id,))
    xp = cur.fetchone()[0]

    cur.execute("""
        SELECT monde, COUNT(*) AS total, SUM(CASE WHEN reussi THEN 1 ELSE 0 END) AS reussies
        FROM performances WHERE user_id = %s GROUP BY monde
    """, (user_id,))
    stats = {r[0]: {"total": r[1], "reussies": r[2]} for r in cur.fetchall()}

    cur.execute("SELECT COUNT(*) FROM missions WHERE user_id = %s AND complete = TRUE", (user_id,))
    missions_completes = cur.fetchone()[0]

    cur.close()
    conn.close()

    return {
        "xp": xp,
        "missions_completes": missions_completes,
        "stats_par_monde": stats,
        "mondes": [
            {"id": 1, "nom": "Monde SQL — Bases",          "icone": "🌍", "couleur": "#3B82F6", "xp_requis": 0,   "debloque": monde_debloque(1, xp)},
            {"id": 2, "nom": "Monde SQL — Intermédiaire",  "icone": "🪐", "couleur": "#8B5CF6", "xp_requis": 300, "debloque": monde_debloque(2, xp)},
            {"id": 3, "nom": "Monde SQL — Expert",         "icone": "⭐", "couleur": "#F59E0B", "xp_requis": 600, "debloque": monde_debloque(3, xp)},
            {"id": 4, "nom": "Monde NoSQL",                "icone": "🔮", "couleur": "#6B7280", "xp_requis": 999, "debloque": False},
            {"id": 5, "nom": "Monde Data Viz",             "icone": "📊", "couleur": "#6B7280", "xp_requis": 999, "debloque": False},
        ],
    }
