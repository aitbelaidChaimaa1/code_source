NIVEAUX = [
    {"nom": "Apprenti",    "xp_min": 0,    "couleur": "#6B7280", "icone": "🌱"},
    {"nom": "Explorateur", "xp_min": 100,  "couleur": "#3B82F6", "icone": "🔍"},
    {"nom": "Analyste",    "xp_min": 300,  "couleur": "#8B5CF6", "icone": "📊"},
    {"nom": "Expert",      "xp_min": 600,  "couleur": "#F59E0B", "icone": "⭐"},
    {"nom": "Maître",      "xp_min": 1000, "couleur": "#EF4444", "icone": "🔥"},
    {"nom": "Architecte",  "xp_min": 1500, "couleur": "#10B981", "icone": "🏗️"},
]


def get_niveau(xp: int) -> dict:
    niveau_actuel = NIVEAUX[0]
    for n in NIVEAUX:
        if xp >= n["xp_min"]:
            niveau_actuel = n
    return niveau_actuel


def get_xp_prochain_niveau(xp: int) -> int | None:
    for n in NIVEAUX:
        if xp < n["xp_min"]:
            return n["xp_min"]
    return None


def calculer_xp_requete(requete: str) -> int:
    r = requete.upper()
    # Difficile : sous-requêtes
    if r.count("SELECT") > 1:
        return 50
    # Moyen : JOIN, GROUP BY, HAVING
    if "JOIN" in r or "GROUP BY" in r or "HAVING" in r:
        return 25
    # Facile : SELECT simple, WHERE, ORDER BY
    return 10
