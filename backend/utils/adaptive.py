from database import get_app_connection

CONCEPTS = ['select_simple', 'where', 'order_by', 'join', 'group_by', 'sous_requete']

CONCEPTS_MONDE = {
    1: ['select_simple', 'where', 'order_by'],
    2: ['join', 'group_by'],
    3: ['sous_requete'],
}

CONCEPTS_LABELS = {
    'select_simple': 'SELECT de base',
    'where':         'Filtrage WHERE',
    'order_by':      'Tri ORDER BY',
    'join':          'Jointures JOIN',
    'group_by':      'Agrégation GROUP BY',
    'sous_requete':  'Sous-requêtes',
}


def detecter_concept(requete: str) -> str:
    r = requete.upper()
    if r.count('SELECT') > 1:
        return 'sous_requete'
    if 'JOIN' in r:
        return 'join'
    if 'GROUP BY' in r:
        return 'group_by'
    if 'ORDER BY' in r:
        return 'order_by'
    if 'WHERE' in r:
        return 'where'
    return 'select_simple'


def calculer_scores(user_id: int) -> dict:
    """Calcule le score de maîtrise 0-100% pour chaque concept SQL."""
    conn = get_app_connection()
    cur = conn.cursor()

    scores = {}
    for concept in CONCEPTS:
        cur.execute("""
            SELECT reussi FROM performances
            WHERE user_id = %s AND concept = %s
            ORDER BY created_at DESC
            LIMIT 20
        """, (user_id, concept))
        rows = cur.fetchall()

        if not rows:
            scores[concept] = 0
        else:
            total_poids, poids_reussis = 0.0, 0.0
            for i, (reussi,) in enumerate(rows):
                poids = 1.0 / (1 + i * 0.15)
                total_poids += poids
                if reussi:
                    poids_reussis += poids
            scores[concept] = round((poids_reussis / total_poids) * 100)

    cur.close()
    conn.close()
    return scores


def get_concept_cible(scores: dict, monde: int) -> str:
    """Retourne le concept le moins maîtrisé dans le monde donné."""
    concepts_monde = CONCEPTS_MONDE.get(monde, CONCEPTS_MONDE[1])
    return min(concepts_monde, key=lambda c: scores.get(c, 0))


def get_monde_recommande(scores: dict) -> int:
    bases_ok = all(scores.get(c, 0) >= 60 for c in CONCEPTS_MONDE[1])
    inter_ok  = all(scores.get(c, 0) >= 60 for c in CONCEPTS_MONDE[2])
    if not bases_ok:
        return 1
    if not inter_ok:
        return 2
    return 3


def monde_debloque(monde: int, xp: int) -> bool:
    seuils = {1: 0, 2: 300, 3: 600}
    return xp >= seuils.get(monde, 9999)
