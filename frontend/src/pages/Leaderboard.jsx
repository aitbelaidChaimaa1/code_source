import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:8000'

const MEDAILLES = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const navigate = useNavigate()
  const nom = localStorage.getItem('nom') || 'Étudiant'
  const [classement, setClassement] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    fetch(`${API}/leaderboard`)
      .then(r => r.json())
      .then(data => { setClassement(data); setChargement(false) })
      .catch(() => setChargement(false))
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <span style={styles.logo}>DataQuest</span>
        <div style={styles.navDroite}>
          <button style={styles.btnRetour} onClick={() => navigate('/editeur')}>
            ← Retour à l'éditeur
          </button>
          <span style={styles.nomUser}>Bonjour, {nom}</span>
        </div>
      </div>

      <div style={styles.corps}>
        <div style={styles.entete}>
          <h1 style={styles.titre}>🏆 Classement</h1>
          <p style={styles.sousTitre}>Top 10 des étudiants DataQuest</p>
        </div>

        {chargement ? (
          <p style={styles.chargement}>Chargement...</p>
        ) : (
          <div style={styles.tableau}>
            {classement.map((etudiant, i) => (
              <div
                key={i}
                style={{
                  ...styles.ligne,
                  ...(etudiant.nom === nom ? styles.ligneMoi : {}),
                  ...(i === 0 ? styles.ligne1er : {}),
                }}
              >
                <div style={styles.rang}>
                  {i < 3 ? MEDAILLES[i] : <span style={styles.rangNum}>{etudiant.rang}</span>}
                </div>

                <div style={styles.info}>
                  <span style={styles.nomEtudiant}>
                    {etudiant.nom}
                    {etudiant.nom === nom && <span style={styles.moiTag}> (moi)</span>}
                  </span>
                  <span style={styles.niveauTag}>{etudiant.niveau}</span>
                </div>

                <div style={styles.stats}>
                  <div style={styles.statItem}>
                    <span style={styles.statValeur}>{etudiant.xp}</span>
                    <span style={styles.statLabel}>XP</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statValeur}>{etudiant.nb_badges}</span>
                    <span style={styles.statLabel}>🏅</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statValeur}>{etudiant.nb_requetes}</span>
                    <span style={styles.statLabel}>requêtes</span>
                  </div>
                </div>
              </div>
            ))}

            {classement.length === 0 && (
              <p style={styles.vide}>Aucun étudiant pour le moment. Sois le premier !</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#F0F2F5' },
  navbar: {
    background: '#1F3864',
    padding: '0 28px',
    height: '58px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { color: 'white', fontWeight: '800', fontSize: '20px' },
  navDroite: { display: 'flex', alignItems: 'center', gap: '16px' },
  nomUser: { color: 'rgba(255,255,255,0.75)', fontSize: '14px' },
  btnRetour: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    color: 'white',
    padding: '7px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  corps: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  entete: { textAlign: 'center', marginBottom: '32px' },
  titre: { fontSize: '32px', fontWeight: '800', color: '#1A1A2E', margin: 0 },
  sousTitre: { color: '#6B7280', fontSize: '15px', marginTop: '6px' },
  chargement: { textAlign: 'center', color: '#6B7280' },
  tableau: { display: 'flex', flexDirection: 'column', gap: '10px' },
  ligne: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '1.5px solid #E5E7EB',
    transition: 'transform 0.15s',
  },
  ligne1er: {
    border: '2px solid #F59E0B',
    background: '#FFFBEB',
  },
  ligneMoi: {
    border: '2px solid #3B82F6',
    background: '#EFF6FF',
  },
  rang: { fontSize: '24px', width: '40px', textAlign: 'center', flexShrink: 0 },
  rangNum: { fontSize: '16px', fontWeight: '700', color: '#6B7280' },
  info: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
  nomEtudiant: { fontWeight: '700', fontSize: '15px', color: '#1A1A2E' },
  moiTag: { color: '#3B82F6', fontWeight: '600', fontSize: '13px' },
  niveauTag: { fontSize: '12px', color: '#6B7280' },
  stats: { display: 'flex', gap: '20px' },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  statValeur: { fontWeight: '800', fontSize: '16px', color: '#1A1A2E' },
  statLabel: { fontSize: '11px', color: '#9CA3AF' },
  vide: { textAlign: 'center', color: '#9CA3AF', padding: '40px' },
}
