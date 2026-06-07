from fastapi import HTTPException, Header
from jose import jwt, JWTError

SECRET_KEY = "dataquest_secret_2025"
ALGORITHME = "HS256"


def get_user_id(authorization: str = Header(...)) -> int:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token manquant")
    token = authorization[7:]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHME])
        return int(payload["sub"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")
