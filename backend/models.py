from pydantic import BaseModel

# Données envoyées lors de l'inscription
class InscriptionData(BaseModel):
    nom: str
    email: str
    mot_de_passe: str
    module_depart: str = 'SQL'
    telephone: str = ''

# Données envoyées lors de la connexion
class ConnexionData(BaseModel):
    email: str
    mot_de_passe: str

# Requête SQL envoyée par l'étudiant
class RequeteSQL(BaseModel):
    requete: str

# Demande d'indice au tuteur IA
class DemandeIndice(BaseModel):
    requete: str
    erreur: str
    niveau_indice: int  # 1, 2 ou 3

# Enregistrement d'une performance (adaptive learning)
class EnregistrementPerf(BaseModel):
    requete: str
    reussi: bool
    monde: int = 1

# Validation d'une mission
class ValidationMission(BaseModel):
    mission_id: int
    requete_etudiant: str
