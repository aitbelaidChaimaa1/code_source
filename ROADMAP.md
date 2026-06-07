# ROADMAP — DataQuest / BrainQuest
## PFE 2025-2026 · ISGA & Web4Jobs
### Durée totale : 3 mois (13 semaines)

---

## PHASE 1 — Les fondations (Semaines 1-2)
> Objectif : avoir un projet qui tourne, avec une base de données et une connexion sécurisée

| Semaine | Tâche | Fichiers créés |
|---------|-------|----------------|
| 1 | Structure des dossiers du projet | `backend/`, `frontend/`, `docker-compose.yml` |
| 1 | Docker Compose (PostgreSQL + FastAPI + React) | `docker-compose.yml`, `Dockerfile` |
| 1 | Création de toutes les tables PostgreSQL | `backend/database/schema.sql` |
| 2 | Inscription utilisateur (nom, email, mot de passe chiffré) | `backend/routes/auth.py` |
| 2 | Connexion utilisateur + génération JWT | `backend/routes/auth.py` |
| 2 | Page inscription + connexion React | `frontend/src/pages/Login.jsx` |

---

## PHASE 2 — L'éditeur SQL (Semaines 3-4)
> Objectif : l'étudiant peut écrire et exécuter du SQL dans le navigateur

| Semaine | Tâche | Fichiers créés |
|---------|-------|----------------|
| 3 | Créer les 3 bases pédagogiques (boutique, hôpital, bibliothèque) | `backend/database/seed_data.sql` |
| 3 | API FastAPI qui exécute les requêtes SQL | `backend/routes/sql_editor.py` |
| 3 | Sécurité : bloquer INSERT, UPDATE, DELETE, DROP | `backend/utils/sql_validator.py` |
| 4 | Éditeur SQL React avec coloration syntaxique | `frontend/src/pages/SqlEditor.jsx` |
| 4 | Affichage des résultats en tableau | `frontend/src/components/ResultTable.jsx` |
| 4 | Connecter frontend ↔ backend, tester | Tests manuels |

---

## PHASE 3 — La gamification (Semaines 5-6)
> Objectif : points XP, badges, niveaux, classement fonctionnels

| Semaine | Tâche | Fichiers créés |
|---------|-------|----------------|
| 5 | Logique XP : calculer et attribuer les points | `backend/routes/gamification.py` |
| 5 | Système de niveaux (Apprenti → Architecte) | `backend/utils/levels.py` |
| 5 | Système de badges (20 badges, conditions) | `backend/utils/badges.py` |
| 6 | Classement hebdomadaire des étudiants | `backend/routes/leaderboard.py` |
| 6 | Affichage React : XP, niveau, badges, classement | `frontend/src/components/GameStats.jsx` |
| 6 | Animations de récompense (badge débloqué, montée de niveau) | `frontend/src/components/RewardAnimation.jsx` |

---

## PHASE 4 — Le tuteur IA (Semaines 7-8)
> Objectif : l'IA guide l'étudiant avec 3 indices progressifs sans donner la réponse

| Semaine | Tâche | Fichiers créés |
|---------|-------|----------------|
| 7 | Connexion à l'API Claude (Anthropic) | `backend/utils/claude_client.py` |
| 7 | Écriture des prompts pédagogiques (3 niveaux) | `backend/utils/prompts.py` |
| 7 | Endpoint FastAPI : reçoit erreur → renvoie indice | `backend/routes/tutor.py` |
| 8 | Interface de chat React dans la page mission | `frontend/src/components/TutorChat.jsx` |
| 8 | Bouton "Demander un indice" + affichage réponse IA | intégré dans SqlEditor |
| 8 | Tests et ajustement des prompts | Tests manuels |

---

## PHASE 5 — L'Adaptive Learning (Semaines 9-10)
> Objectif : le système adapte automatiquement la difficulté au niveau réel de l'étudiant

| Semaine | Tâche | Fichiers créés |
|---------|-------|----------------|
| 9 | Enregistrer l'historique de chaque réponse | `backend/routes/performance.py` |
| 9 | Algorithme Scikit-learn : calcul score de maîtrise 0-100% | `backend/utils/adaptive.py` |
| 10 | FastAPI appelle Claude avec le score → Claude génère la mission | `backend/routes/missions.py` |
| 10 | Affichage carte du monde avec mondes bloqués/débloqués | `frontend/src/pages/WorldMap.jsx` |
| 10 | Recommandations de révision dans le tableau de bord | `frontend/src/components/Recommendations.jsx` |

---

## PHASE 6 — Le dashboard analytics (Semaine 11)
> Objectif : l'étudiant voit sa progression en graphiques

| Semaine | Tâche | Fichiers créés |
|---------|-------|----------------|
| 11 | Pandas calcule : progression, moyennes, points faibles | `backend/utils/analytics.py` |
| 11 | API FastAPI qui renvoie les stats au frontend | `backend/routes/analytics.py` |
| 11 | Chart.js React : courbe XP, radar compétences, heatmap | `frontend/src/pages/Dashboard.jsx` |

---

## PHASE 7 — Finition et déploiement (Semaines 12-13)
> Objectif : tout assembler, tester, préparer la soutenance

| Semaine | Tâche |
|---------|-------|
| 12 | Tests complets de toutes les fonctionnalités |
| 12 | Corrections des bugs trouvés |
| 12 | Amélioration du design et de l'expérience utilisateur |
| 13 | Docker final : tout fonctionne avec `docker-compose up` |
| 13 | Préparation des slides de soutenance |
| 13 | Répétition et questions/réponses sur le code |

---

## Récapitulatif

| Phase | Contenu | Semaines | Durée |
|-------|---------|----------|-------|
| 1 | Fondations + Auth | 1-2 | 2 sem |
| 2 | Éditeur SQL | 3-4 | 2 sem |
| 3 | Gamification | 5-6 | 2 sem |
| 4 | Tuteur IA | 7-8 | 2 sem |
| 5 | Adaptive Learning | 9-10 | 2 sem |
| 6 | Dashboard Analytics | 11 | 1 sem |
| 7 | Finition + Déploiement | 12-13 | 2 sem |

**Total : 13 semaines — 80% du projet livré et fonctionnel**
