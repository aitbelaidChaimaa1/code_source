import psycopg2
import os

def get_app_connection():
    """Connexion à la base principale (utilisateurs)"""
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "dataquest"),
        user=os.getenv("DB_USER", "admin"),
        password=os.getenv("DB_PASSWORD", "password123")
    )

def get_edu_connection():
    """Connexion en lecture seule pour exécuter les requêtes des étudiants"""
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "dataquest"),
        user="etudiant",
        password="etudiant123"
    )
