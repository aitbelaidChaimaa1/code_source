from fastapi import APIRouter, HTTPException, Header
from jose import jwt, JWTError
from models import RequeteSQL
from database import get_edu_connection
from utils.sql_validator import valider_requete

router = APIRouter(prefix="/sql", tags=["Éditeur SQL"])

SECRET_KEY = "dataquest_secret_2025"
ALGORITHME = "HS256"


def verifier_token(authorization: str) -> dict:
    """Vérifie que le token JWT est valide et retourne les infos de l'utilisateur"""
    try:
        token = authorization.replace("Bearer ", "")
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHME])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré. Reconnectez-vous.")


@router.post("/executer")
def executer_requete(requete: RequeteSQL, authorization: str = Header(...)):

    # Étape 1 : vérifier que l'étudiant est connecté
    verifier_token(authorization)

    # Étape 2 : vérifier que la requête est autorisée (SELECT uniquement)
    if not valider_requete(requete.requete):
        raise HTTPException(
            status_code=403,
            detail="Seules les requêtes SELECT sont autorisées. Les commandes INSERT, DELETE, DROP sont bloquées."
        )

    # Étape 3 : exécuter la requête sur la base pédagogique
    try:
        conn = get_edu_connection()
        cur = conn.cursor()
        cur.execute(requete.requete)

        colonnes = [desc[0] for desc in cur.description]
        lignes = cur.fetchmany(100)  # Limité à 100 lignes maximum

        cur.close()
        conn.close()

        return {
            "colonnes": colonnes,
            "lignes": [list(ligne) for ligne in lignes],
            "nombre_resultats": len(lignes)
        }

    except Exception as erreur:
        raise HTTPException(status_code=400, detail=f"Erreur SQL : {str(erreur)}")


@router.get("/tables")
def lister_tables(authorization: str = Header(...)):
    """Retourne la liste des tables disponibles pour l'étudiant"""
    verifier_token(authorization)
    return {
        "tables": [
            {
                "nom": "clients",
                "colonnes": ["id", "nom", "email", "ville", "date_inscription"]
            },
            {
                "nom": "produits",
                "colonnes": ["id", "nom", "categorie", "prix", "stock"]
            },
            {
                "nom": "commandes",
                "colonnes": ["id", "client_id", "date_commande", "total", "statut"]
            },
            {
                "nom": "details_commande",
                "colonnes": ["id", "commande_id", "produit_id", "quantite", "prix_unitaire"]
            }
        ]
    }
