from fastapi import APIRouter, HTTPException, Depends
from models import DemandeIndice
from utils.claude_client import demander_indice
from utils.jwt_helper import get_user_id

router = APIRouter(prefix="/tutor", tags=["Tuteur IA"])


@router.post("/indice")
def obtenir_indice(data: DemandeIndice, user_id: int = Depends(get_user_id)):
    if data.niveau_indice not in (1, 2, 3):
        raise HTTPException(status_code=400, detail="niveau_indice doit être 1, 2 ou 3")

    try:
        indice = demander_indice(data.requete, data.erreur, data.niveau_indice)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur IA : {str(e)}")

    return {
        "indice": indice,
        "niveau": data.niveau_indice,
        "est_final": data.niveau_indice >= 3,
    }
