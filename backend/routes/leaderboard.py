from fastapi import APIRouter
from database import get_app_connection

router = APIRouter(prefix="/leaderboard", tags=["Classement"])


@router.get("")
def get_classement():
    conn = get_app_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT u.nom, u.xp, u.niveau, COUNT(ub.badge_id) AS nb_badges, u.nb_requetes
        FROM utilisateurs u
        LEFT JOIN utilisateur_badges ub ON u.id = ub.user_id
        GROUP BY u.id, u.nom, u.xp, u.niveau, u.nb_requetes
        ORDER BY u.xp DESC
        LIMIT 10
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [
        {
            "rang": i + 1,
            "nom": r[0],
            "xp": r[1],
            "niveau": r[2],
            "nb_badges": r[3],
            "nb_requetes": r[4] or 0,
        }
        for i, r in enumerate(rows)
    ]
