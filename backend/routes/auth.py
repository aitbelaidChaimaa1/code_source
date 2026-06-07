from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from models import InscriptionData, ConnexionData
from database import get_app_connection

router = APIRouter(prefix="/auth", tags=["Authentification"])

# Clé secrète pour signer les tokens JWT
SECRET_KEY = "dataquest_secret_2025"
ALGORITHME = "HS256"
DUREE_JWT_JOURS = 7

# Outil pour chiffrer et vérifier les mots de passe
bcrypt = CryptContext(schemes=["bcrypt"])


def creer_token(user_id: int, email: str, module_depart: str = 'SQL') -> str:
    expiration = datetime.utcnow() + timedelta(days=DUREE_JWT_JOURS)
    donnees = {
        "sub": str(user_id),
        "email": email,
        "module": module_depart,
        "exp": expiration
    }
    return jwt.encode(donnees, SECRET_KEY, algorithm=ALGORITHME)


@router.post("/inscription")
def inscription(data: InscriptionData):
    conn = get_app_connection()
    cur = conn.cursor()

    # Vérifier si l'email est déjà utilisé
    cur.execute("SELECT id FROM utilisateurs WHERE email = %s", (data.email,))
    if cur.fetchone():
        cur.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    # Chiffrer le mot de passe avant de le stocker
    mot_de_passe_chiffre = bcrypt.hash(data.mot_de_passe)

    cur.execute(
        "INSERT INTO utilisateurs (nom, email, mot_de_passe_hash, module_depart, telephone) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (data.nom, data.email, mot_de_passe_chiffre, data.module_depart, data.telephone)
    )
    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    token = creer_token(user_id, data.email, data.module_depart)
    return {"message": "Compte créé avec succès", "token": token, "nom": data.nom, "module_depart": data.module_depart}


@router.post("/connexion")
def connexion(data: ConnexionData):
    conn = get_app_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, nom, mot_de_passe_hash, xp, niveau, module_depart, streak_count FROM utilisateurs WHERE email = %s",
        (data.email,)
    )
    user = cur.fetchone()

    if not user or not bcrypt.verify(data.mot_de_passe, user[2]):
        cur.close()
        conn.close()
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    cur.execute(
        """UPDATE utilisateurs SET
            streak_count = CASE
                WHEN derniere_connexion >= NOW() - INTERVAL '48 hours' THEN streak_count + 1
                ELSE 1
            END,
            derniere_connexion = NOW()
        WHERE id = %s""",
        (user[0],)
    )
    conn.commit()
    cur.close()
    conn.close()

    module = user[5] or 'SQL'
    token = creer_token(user[0], data.email, module)
    return {
        "token": token,
        "nom": user[1],
        "xp": user[3],
        "niveau": user[4],
        "module_depart": module,
        "streak_count": user[6] or 0
    }
