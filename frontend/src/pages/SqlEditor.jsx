import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ResultTable from '../components/ResultTable'
import GameStats from '../components/GameStats'
import RewardAnimation from '../components/RewardAnimation'
import TutorChat from '../components/TutorChat'

const API = 'http://localhost:8000'

const EXEMPLES = [
  { label: 'Tous les clients',        requete: 'SELECT * FROM clients;' },
  { label: 'Produits > 1000 DH',      requete: 'SELECT nom, prix FROM produits WHERE prix > 1000;' },
  { label: 'Commandes livrées',       requete: "SELECT * FROM commandes WHERE statut = 'Livré';" },
  { label: 'Clients et nb commandes', requete: 'SELECT c.nom, COUNT(cmd.id) AS nombre_commandes\nFROM clients c\nJOIN commandes cmd ON c.id = cmd.client_id\nGROUP BY c.nom\nORDER BY nombre_commandes DESC;' },
]

export default function SqlEditor() {
  const navigate = useNavigate()
  const nom   = localStorage.getItem('nom')   || 'Étudiant'
  const token = localStorage.getItem('token')

  const [requete,      setRequete]      = useState('SELECT * FROM clients;')
  const [resultat,     setResultat]     = useState(null)
  const [erreur,       setErreur]       = useState('')
  const [chargement,   setChargement]   = useState(false)
  const [recompenses,    setRecompenses]    = useState(null)
  const [tuteurOuvert,   setTuteurOuvert]   = useState(false)
  const [mission,        setMission]        = useState(null)
  const [missionSucces,  setMissionSucces]  = useState(false)
  const [gameStats,      setGameStats]      = useState({
    xp: parseInt(localStorage.getItem('xp') || '0'),
    niveau: JSON.parse(localStorage.getItem('niveau') || '{"nom":"Apprenti","xp_min":0,"couleur":"#6B7280","icone":"🌱"}'),
    xpProchain: null,
    nbBadges: 0,
  })

  // Charger la mission active depuis localStorage
  useEffect(() => {
    const m = localStorage.getItem('mission_active')
    if (m) { setMission(JSON.parse(m)); localStorage.removeItem('mission_active') }
  }, [])

  // Charger les stats au montage
  useEffect(() => {
    fetch(`${API}/gamification/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setGameStats({
          xp: data.xp,
          niveau: data.niveau,
          xpProchain: data.xp_prochain_niveau,
          nbBadges: data.badges.length,
        })
        localStorage.setItem('xp', data.xp)
        localStorage.setItem('niveau', JSON.stringify(data.niveau))
      })
      .catch(() => {})
  }, [token])

  const deconnexion = () => {
    localStorage.clear()
    navigate('/login')
  }

  const executerRequete = async () => {
    setErreur('')
    setResultat(null)
    setChargement(true)

    try {
      const reponse = await fetch(`${API}/sql/executer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requete }),
      })

      const data = await reponse.json()

      if (!reponse.ok) {
        setErreur(data.detail || "Erreur lors de l'exécution")
        return
      }

      setResultat(data)
      setTuteurOuvert(false)

      // Validation mission si active
      if (mission && !missionSucces) {
        const valRes = await fetch(`${API}/missions/valider`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ mission_id: mission.id, requete_etudiant: requete }),
        })
        const valData = await valRes.json()
        if (valRes.ok && valData.succes) setMissionSucces(true)
      }

      // Appel gamification : XP + badges
      const xpReponse = await fetch(`${API}/gamification/xp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requete }),
      })
      const xpData = await xpReponse.json()

      if (xpReponse.ok) {
        setGameStats({
          xp: xpData.xp_total,
          niveau: xpData.niveau,
          xpProchain: xpData.xp_prochain_niveau,
          nbBadges: gameStats.nbBadges + xpData.nouveaux_badges.length,
        })
        localStorage.setItem('xp', xpData.xp_total)
        localStorage.setItem('niveau', JSON.stringify(xpData.niveau))

        if (xpData.nouveau_niveau || xpData.nouveaux_badges.length > 0) {
          setRecompenses(xpData)
        }
      }

    } catch {
      setErreur('Impossible de contacter le serveur.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div style={styles.page}>

      {/* Tuteur IA */}
      {tuteurOuvert && (
        <TutorChat
          requete={requete}
          erreur={erreur}
          token={token}
          onClose={() => setTuteurOuvert(false)}
        />
      )}

      {/* Animation de récompense */}
      {recompenses && (
        <RewardAnimation
          recompenses={recompenses}
          onClose={() => setRecompenses(null)}
        />
      )}

      {/* Barre de navigation */}
      <div style={styles.navbar}>
        <span style={styles.logo}>DataQuest</span>
        <div style={styles.navDroite}>
          <GameStats
            xp={gameStats.xp}
            niveau={gameStats.niveau}
            xpProchain={gameStats.xpProchain}
            nbBadges={gameStats.nbBadges}
          />
          <button style={styles.btnClassement} onClick={() => navigate('/classement')}>
            🏆 Classement
          </button>
          <span style={styles.nomUser}>Bonjour, {nom}</span>
          <button style={styles.btnDeconnexion} onClick={deconnexion}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Corps de la page */}
      <div style={styles.corps}>

        {/* Panneau gauche */}
        <div style={styles.panneau}>

          {/* Panneau mission OU panneau libre */}
          {mission && !missionSucces ? (
            <>
              <div style={styles.missionBadge}>🎯 Mission active — {mission.concept_label}</div>
              <div style={styles.missionBox}>
                <p style={styles.missionTitre}>{mission.titre}</p>
                <p style={styles.missionScenario}>{mission.scenario}</p>
                <div style={styles.missionQuestion}>
                  <span style={styles.missionQuestionLabel}>Question :</span>
                  <p style={styles.missionQuestionTexte}>{mission.question}</p>
                </div>
              </div>
              <button style={styles.btnAbandonner} onClick={() => { setMission(null); navigate('/monde') }}>
                ← Choisir une autre mission
              </button>
            </>
          ) : mission && missionSucces ? (
            <div style={styles.missionSuccesBox}>
              <span style={{ fontSize: '40px' }}>🎉</span>
              <p style={styles.missionSuccesTitre}>Mission accomplie !</p>
              <button style={styles.btnRetourMonde} onClick={() => navigate('/monde')}>
                → Retour à la carte
              </button>
            </div>
          ) : (
            <>
              <h3 style={styles.sectionTitre}>Base disponible</h3>
              <div style={styles.baseBox}>
                <strong style={{ fontSize: '14px' }}>Boutique en ligne</strong>
                <p style={styles.baseDesc}>Tables disponibles :</p>
                <ul style={styles.listeTables}>
                  <li><code>clients</code> — nom, email, ville</li>
                  <li><code>produits</code> — nom, categorie, prix, stock</li>
                  <li><code>commandes</code> — client_id, date, total, statut</li>
                  <li><code>details_commande</code> — produit_id, quantite</li>
                </ul>
              </div>
              <h3 style={{ ...styles.sectionTitre, marginTop: '20px' }}>Exemples rapides</h3>
              <div style={styles.exemples}>
                {EXEMPLES.map((ex, i) => (
                  <button key={i} style={styles.exempleBtn} onClick={() => setRequete(ex.requete)}>
                    {ex.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <div style={styles.alerteInfo}>
            Seules les requêtes <strong>SELECT</strong> sont autorisées.
          </div>

          {/* Mini guide XP */}
          <div style={styles.guideXP}>
            <h3 style={{ ...styles.sectionTitre, marginTop: 0 }}>XP gagnés</h3>
            <div style={styles.xpLigne}><span>Simple SELECT</span><span style={styles.xpPts}>+10 XP</span></div>
            <div style={styles.xpLigne}><span>Avec WHERE / ORDER BY</span><span style={styles.xpPts}>+15 XP</span></div>
            <div style={styles.xpLigne}><span>Avec JOIN / GROUP BY</span><span style={styles.xpPts}>+25 XP</span></div>
            <div style={styles.xpLigne}><span>Sous-requête</span><span style={styles.xpPts}>+35 XP</span></div>
          </div>
        </div>

        {/* Zone principale */}
        <div style={styles.editeur}>

          <h2 style={styles.titreEditeur}>Éditeur SQL</h2>

          <textarea
            style={styles.textarea}
            value={requete}
            onChange={(e) => setRequete(e.target.value)}
            placeholder="Écrivez votre requête SQL ici..."
            rows={7}
            spellCheck={false}
          />

          <button style={styles.btnExecuter} onClick={executerRequete} disabled={chargement}>
            {chargement ? 'Exécution en cours...' : '▶  Exécuter la requête'}
          </button>

          {erreur && (
            <div style={styles.erreurZone}>
              <div style={styles.erreur}>
                <strong>Erreur :</strong> {erreur}
              </div>
              <button
                style={styles.btnTuteur}
                onClick={() => setTuteurOuvert(true)}
              >
                🤖 Demander un indice au tuteur IA
              </button>
            </div>
          )}

          {resultat && (
            <div style={styles.resultatsZone}>
              <p style={styles.nbResultats}>
                {resultat.nombre_resultats} ligne(s) retournée(s)
              </p>
              <ResultTable colonnes={resultat.colonnes} lignes={resultat.lignes} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#F0F2F5' },

  navbar: {
    background: '#1F3864',
    padding: '0 28px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { color: 'white', fontWeight: '800', fontSize: '20px', flexShrink: 0 },
  navDroite: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  nomUser: { color: 'rgba(255,255,255,0.75)', fontSize: '14px' },
  btnDeconnexion: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    color: 'white',
    padding: '7px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  btnClassement: {
    background: 'rgba(245,158,11,0.25)',
    border: '1px solid rgba(245,158,11,0.5)',
    color: '#FCD34D',
    padding: '7px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },

  corps: {
    display: 'flex',
    gap: '20px',
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    alignItems: 'flex-start',
  },

  panneau: {
    width: '260px',
    flexShrink: 0,
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    border: '1.5px solid #E5E7EB',
  },
  sectionTitre: {
    fontSize: '11px',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    fontWeight: '700',
    marginBottom: '10px',
  },
  baseBox: {
    background: '#F8FAFC',
    borderRadius: '8px',
    padding: '12px 14px',
    border: '1px solid #E5E7EB',
  },
  baseDesc: { fontSize: '12px', color: '#6B7280', margin: '8px 0 4px' },
  listeTables: { paddingLeft: '14px', fontSize: '12px', color: '#374151', lineHeight: '2.2' },
  exemples: { display: 'flex', flexDirection: 'column', gap: '6px' },
  exempleBtn: {
    textAlign: 'left',
    padding: '8px 12px',
    background: '#F3F4F6',
    border: '1px solid #E5E7EB',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#374151',
  },
  alerteInfo: {
    marginTop: '16px',
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    color: '#1E40AF',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    lineHeight: '1.5',
  },
  guideXP: {
    marginTop: '16px',
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '8px',
    padding: '12px 14px',
  },
  xpLigne: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#374151',
    padding: '3px 0',
  },
  xpPts: { fontWeight: '700', color: '#16A34A' },

  missionBadge: {
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    color: 'white', fontSize: '11px', fontWeight: '700',
    padding: '5px 10px', borderRadius: '6px', marginBottom: '12px',
    letterSpacing: '0.5px',
  },
  missionBox: {
    background: '#F5F3FF', border: '1.5px solid #DDD6FE',
    borderRadius: '10px', padding: '14px',
  },
  missionTitre: { fontWeight: '800', fontSize: '14px', color: '#4C1D95', margin: '0 0 8px' },
  missionScenario: { fontSize: '12px', color: '#6B7280', margin: '0 0 10px', lineHeight: '1.6' },
  missionQuestion: {
    background: 'white', borderRadius: '8px', padding: '10px 12px',
    border: '1px solid #DDD6FE',
  },
  missionQuestionLabel: { fontSize: '10px', fontWeight: '800', color: '#7C3AED', letterSpacing: '1px', textTransform: 'uppercase' },
  missionQuestionTexte: { fontSize: '13px', color: '#1A1A2E', margin: '4px 0 0', fontWeight: '600', lineHeight: '1.5' },
  btnAbandonner: {
    marginTop: '12px', width: '100%', padding: '8px',
    background: 'transparent', border: '1px solid #E5E7EB',
    borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#6B7280',
  },
  missionSuccesBox: {
    background: '#F0FDF4', border: '2px solid #86EFAC',
    borderRadius: '12px', padding: '24px 16px',
    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
  },
  missionSuccesTitre: { fontWeight: '800', fontSize: '16px', color: '#15803D', margin: 0 },
  btnRetourMonde: {
    background: '#16A34A', color: 'white', border: 'none',
    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '700',
  },

  editeur: {
    flex: 1,
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    border: '1.5px solid #E5E7EB',
  },
  titreEditeur: { fontSize: '20px', fontWeight: '700', color: '#1A1A2E', marginBottom: '16px' },
  textarea: {
    width: '100%',
    padding: '16px',
    fontFamily: "'Courier New', monospace",
    fontSize: '14px',
    border: '1.5px solid #374151',
    borderRadius: '8px',
    resize: 'vertical',
    outline: 'none',
    background: '#1A1A2E',
    color: '#E2E8F0',
    lineHeight: '1.6',
    boxSizing: 'border-box',
  },
  btnExecuter: {
    display: 'block',
    marginTop: '12px',
    padding: '12px 28px',
    background: '#1F3864',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  erreurZone: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  erreur: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#991B1B',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
  },
  btnTuteur: {
    padding: '11px 20px',
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 16px #6366F133',
    alignSelf: 'flex-start',
  },
  resultatsZone: { marginTop: '24px' },
  nbResultats: { fontSize: '13px', color: '#6B7280', marginBottom: '10px' },
}
