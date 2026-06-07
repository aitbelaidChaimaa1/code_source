from fastapi import APIRouter, Depends, HTTPException
from models import RequeteSQL
from database import get_app_connection
from utils.levels import get_niveau, get_xp_prochain_niveau, calculer_xp_requete, NIVEAUX
from utils.badges import BADGES, verifier_badges
from utils.jwt_helper import get_user_id

router = APIRouter(prefix="/gamification", tags=["Gamification"])


@router.post("/xp")
def ajouter_xp(data: RequeteSQL, user_id: int = Depends(get_user_id)):
    xp_gagne = calculer_xp_requete(data.requete)
    r = data.requete.upper()

    conn = get_app_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT xp, nb_requetes FROM utilisateurs WHERE id = %s",
        (user_id,)
    )
    row = cur.fetchone()
    xp_actuel, nb_requetes = row[0], (row[1] or 0)

    nb_requetes += 1
    nouveau_xp = xp_actuel + xp_gagne

    cur.execute(
        "SELECT badge_id FROM utilisateur_badges WHERE user_id = %s",
        (user_id,)
    )
    badges_deja = [r[0] for r in cur.fetchall()]

    niveau_avant = get_niveau(xp_actuel)
    niveau_apres = get_niveau(nouveau_xp)

    stats = {
        "xp": nouveau_xp,
        "nb_requetes": nb_requetes,
        "utilise_where":       "WHERE"    in r,
        "utilise_orderby":     "ORDER BY" in r,
        "utilise_groupby":     "GROUP BY" in r,
        "utilise_join":        "JOIN"     in r,
        "utilise_count":       "COUNT"    in r,
        "utilise_agregation":  any(k in r for k in ["SUM(", "AVG(", "MAX(", "MIN("]),
        "utilise_sous_requete": r.count("SELECT") > 1,
    }

    nouveaux_badges = verifier_badges(stats, badges_deja)

    cur.execute(
        "UPDATE utilisateurs SET xp = %s, nb_requetes = %s, niveau = %s WHERE id = %s",
        (nouveau_xp, nb_requetes, niveau_apres["nom"], user_id)
    )

    for badge in nouveaux_badges:
        cur.execute(
            "INSERT INTO utilisateur_badges (user_id, badge_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
            (user_id, badge["id"])
        )

    conn.commit()
    cur.close()
    conn.close()

    xp_suivant = get_xp_prochain_niveau(nouveau_xp)

    return {
        "xp_gagne": xp_gagne,
        "xp_total": nouveau_xp,
        "xp_prochain_niveau": xp_suivant,
        "niveau": niveau_apres,
        "nouveau_niveau": niveau_avant["nom"] != niveau_apres["nom"],
        "nouveaux_badges": [
            {"id": b["id"], "nom": b["nom"], "icone": b["icone"], "description": b["description"]}
            for b in nouveaux_badges
        ],
    }


@router.get("/stats")
def get_stats(user_id: int = Depends(get_user_id)):
    conn = get_app_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT nom, xp, nb_requetes FROM utilisateurs WHERE id = %s",
        (user_id,)
    )
    row = cur.fetchone()
    if not row:
        cur.close(); conn.close()
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    nom, xp, nb_requetes = row

    cur.execute(
        "SELECT badge_id FROM utilisateur_badges WHERE user_id = %s",
        (user_id,)
    )
    badges_ids = {r[0] for r in cur.fetchall()}

    cur.close()
    conn.close()

    niveau_info = get_niveau(xp)
    xp_suivant = get_xp_prochain_niveau(xp)

    badges_obtenus = [
        {"id": b["id"], "nom": b["nom"], "icone": b["icone"], "description": b["description"]}
        for b in BADGES if b["id"] in badges_ids
    ]

    return {
        "nom": nom,
        "xp": xp,
        "xp_prochain_niveau": xp_suivant,
        "niveau": niveau_info,
        "nb_requetes": nb_requetes or 0,
        "badges": badges_obtenus,
        "total_badges_possible": len(BADGES),
        "tous_les_niveaux": NIVEAUX,
    }
