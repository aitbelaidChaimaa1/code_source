from fastapi import APIRouter, Depends
from models import EnregistrementPerf
from database import get_app_connection
from utils.adaptive import detecter_concept, calculer_scores, CONCEPTS_LABELS
from utils.jwt_helper import get_user_id

router = APIRouter(prefix="/performance", tags=["Adaptive Learning"])


@router.post("/enregistrer")
def enregistrer(data: EnregistrementPerf, user_id: int = Depends(get_user_id)):
    concept = detecter_concept(data.requete)

    conn = get_app_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO performances (user_id, concept, reussi, requete, monde)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_id, concept, data.reussi, data.requete, data.monde))

    conn.commit()
    cur.close()
    conn.close()

    return {"concept": concept, "enregistre": True}


@router.get("/scores")
def get_scores(user_id: int = Depends(get_user_id)):
    scores = calculer_scores(user_id)
    return {
        "scores": scores,
        "labels": CONCEPTS_LABELS,
        "score_global": round(sum(scores.values()) / len(scores)) if scores else 0,
    }
