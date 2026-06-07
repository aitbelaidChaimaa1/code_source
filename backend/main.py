from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, sql_editor, gamification, leaderboard, tutor, performance, missions

app = FastAPI(title="DataQuest API")

# Autoriser React (port 3000) à communiquer avec FastAPI (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enregistrer les routes
app.include_router(auth.router)
app.include_router(sql_editor.router)
app.include_router(gamification.router)
app.include_router(leaderboard.router)
app.include_router(tutor.router)
app.include_router(performance.router)
app.include_router(missions.router)

@app.get("/")
def accueil():
    return {"message": "DataQuest API fonctionne !"}
