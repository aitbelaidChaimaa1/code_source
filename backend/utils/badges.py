BADGES = [
    # --- Nombre de requêtes ---
    {
        "id": "premiere_requete",
        "nom": "Première requête",
        "description": "Exécuter sa toute première requête SQL",
        "icone": "🚀",
        "condition": lambda s: s["nb_requetes"] >= 1,
    },
    {
        "id": "explorateur_5",
        "nom": "Explorateur",
        "description": "Exécuter 5 requêtes",
        "icone": "🔍",
        "condition": lambda s: s["nb_requetes"] >= 5,
    },
    {
        "id": "curieux_10",
        "nom": "Curieux",
        "description": "Exécuter 10 requêtes",
        "icone": "🧐",
        "condition": lambda s: s["nb_requetes"] >= 10,
    },
    {
        "id": "assidu_25",
        "nom": "Assidu",
        "description": "Exécuter 25 requêtes",
        "icone": "💪",
        "condition": lambda s: s["nb_requetes"] >= 25,
    },
    {
        "id": "centurion_100",
        "nom": "Centurion",
        "description": "Exécuter 100 requêtes",
        "icone": "⚔️",
        "condition": lambda s: s["nb_requetes"] >= 100,
    },
    # --- Niveaux atteints ---
    {
        "id": "niveau_explorateur",
        "nom": "En route !",
        "description": "Atteindre le niveau Explorateur",
        "icone": "📈",
        "condition": lambda s: s["xp"] >= 100,
    },
    {
        "id": "niveau_analyste",
        "nom": "Analyste confirmé",
        "description": "Atteindre le niveau Analyste",
        "icone": "📊",
        "condition": lambda s: s["xp"] >= 300,
    },
    {
        "id": "niveau_expert",
        "nom": "Expert SQL",
        "description": "Atteindre le niveau Expert",
        "icone": "🏆",
        "condition": lambda s: s["xp"] >= 600,
    },
    {
        "id": "niveau_maitre",
        "nom": "Maître des données",
        "description": "Atteindre le niveau Maître",
        "icone": "👑",
        "condition": lambda s: s["xp"] >= 1000,
    },
    {
        "id": "niveau_architecte",
        "nom": "Architecte",
        "description": "Atteindre le niveau Architecte",
        "icone": "🏗️",
        "condition": lambda s: s["xp"] >= 1500,
    },
    # --- Types de clauses SQL utilisées ---
    {
        "id": "filtreur",
        "nom": "Filtreur",
        "description": "Utiliser WHERE dans une requête",
        "icone": "🔎",
        "condition": lambda s: s["utilise_where"],
    },
    {
        "id": "organisateur",
        "nom": "Organisateur",
        "description": "Utiliser ORDER BY",
        "icone": "📋",
        "condition": lambda s: s["utilise_orderby"],
    },
    {
        "id": "groupeur",
        "nom": "Groupeur",
        "description": "Utiliser GROUP BY",
        "icone": "📦",
        "condition": lambda s: s["utilise_groupby"],
    },
    {
        "id": "joineur",
        "nom": "Maître des JOINs",
        "description": "Utiliser une jointure JOIN",
        "icone": "🔗",
        "condition": lambda s: s["utilise_join"],
    },
    {
        "id": "compteur",
        "nom": "Compteur",
        "description": "Utiliser COUNT() dans une requête",
        "icone": "🔢",
        "condition": lambda s: s["utilise_count"],
    },
    {
        "id": "agregateur",
        "nom": "Agrégateur",
        "description": "Utiliser SUM, AVG, MAX ou MIN",
        "icone": "➕",
        "condition": lambda s: s["utilise_agregation"],
    },
    {
        "id": "ninja_sql",
        "nom": "Ninja SQL",
        "description": "Utiliser une sous-requête",
        "icone": "🥷",
        "condition": lambda s: s["utilise_sous_requete"],
    },
    # --- XP accumulés ---
    {
        "id": "collecteur_100xp",
        "nom": "Collecteur",
        "description": "Accumuler 100 XP",
        "icone": "💎",
        "condition": lambda s: s["xp"] >= 100,
    },
    {
        "id": "riche_500xp",
        "nom": "Riche en XP",
        "description": "Accumuler 500 XP",
        "icone": "💰",
        "condition": lambda s: s["xp"] >= 500,
    },
    {
        "id": "millionnaire_1000xp",
        "nom": "Millionnaire XP",
        "description": "Accumuler 1000 XP",
        "icone": "🤑",
        "condition": lambda s: s["xp"] >= 1000,
    },
]


def verifier_badges(stats: dict, badges_deja_obtenus: list) -> list:
    nouveaux = []
    for badge in BADGES:
        if badge["id"] not in badges_deja_obtenus:
            try:
                if badge["condition"](stats):
                    nouveaux.append(badge)
            except Exception:
                pass
    return nouveaux
