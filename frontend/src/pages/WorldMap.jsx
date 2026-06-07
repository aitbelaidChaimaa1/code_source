import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:8000'
const CONTAINER_W = 380
const NODE_SIZE = 72
const NODE_GAP = 110

const ZIGZAG = [190, 268, 296, 268, 190, 112, 84, 112]
const nodeLeft = (i) => ZIGZAG[i % ZIGZAG.length] - NODE_SIZE / 2

// ── CURRICULUM SQL ────────────────────────────────────────────
const CHEMIN = [
  {
    id: 'S1', titre: 'Fondamentaux', sous: 'Bases du SELECT',
    emoji: '🌱', couleur: '#58CC02', shadow: '#46A302', bg: '#1a3a0f',
    monde: 1, xp_requis: 0,
    lecons: [
      { id: 1,  emoji: '🔍', titre: 'SELECT *',        concept: 'select_simple' },
      { id: 2,  emoji: '📋', titre: 'SELECT colonnes', concept: 'select_simple' },
      { id: 3,  emoji: '🔎', titre: 'WHERE',           concept: 'where' },
      { id: 4,  emoji: '🔗', titre: 'AND / OR',        concept: 'where' },
      { id: 5,  emoji: '⭐', titre: 'Défi 1',          concept: 'where', isDefi: true },
    ],
  },
  {
    id: 'S2', titre: 'Trier & Filtrer', sous: 'ORDER BY, LIMIT, LIKE',
    emoji: '📊', couleur: '#1CB0F6', shadow: '#00A3E0', bg: '#0a2a3a',
    monde: 1, xp_requis: 0,
    lecons: [
      { id: 6,  emoji: '↕️', titre: 'ORDER BY',   concept: 'order_by' },
      { id: 7,  emoji: '✂️', titre: 'LIMIT',       concept: 'order_by' },
      { id: 8,  emoji: '🔤', titre: 'LIKE',        concept: 'where' },
      { id: 9,  emoji: '📦', titre: 'IN / BETWEEN',concept: 'where' },
      { id: 10, emoji: '⭐', titre: 'Défi 2',      concept: 'order_by', isDefi: true },
    ],
  },
  {
    id: 'S3', titre: 'Agrégation', sous: 'COUNT, SUM, GROUP BY',
    emoji: '🔢', couleur: '#FF9600', shadow: '#CC7700', bg: '#2a1a00',
    monde: 2, xp_requis: 300,
    lecons: [
      { id: 11, emoji: '🔢', titre: 'COUNT(*)',   concept: 'group_by' },
      { id: 12, emoji: '➕', titre: 'SUM / AVG',  concept: 'group_by' },
      { id: 13, emoji: '📈', titre: 'MIN / MAX',  concept: 'group_by' },
      { id: 14, emoji: '🗂️', titre: 'GROUP BY',   concept: 'group_by' },
      { id: 15, emoji: '🏷️', titre: 'HAVING',     concept: 'group_by' },
      { id: 16, emoji: '⭐', titre: 'Défi 3',     concept: 'group_by', isDefi: true },
    ],
  },
  {
    id: 'S4', titre: 'Jointures', sous: 'INNER JOIN, LEFT JOIN',
    emoji: '🔗', couleur: '#CE82FF', shadow: '#A855F7', bg: '#1e0a3a',
    monde: 2, xp_requis: 300,
    lecons: [
      { id: 17, emoji: '🔵', titre: 'INNER JOIN', concept: 'join' },
      { id: 18, emoji: '⬅️', titre: 'LEFT JOIN',  concept: 'join' },
      { id: 19, emoji: '🔗', titre: 'Multi-JOIN', concept: 'join' },
      { id: 20, emoji: '⭐', titre: 'Défi 4',     concept: 'join', isDefi: true },
    ],
  },
  {
    id: 'S5', titre: 'Niveau Expert', sous: 'Sous-requêtes & UNION',
    emoji: '🏆', couleur: '#FF4B4B', shadow: '#CC2222', bg: '#2a0a0a',
    monde: 3, xp_requis: 600,
    lecons: [
      { id: 21, emoji: '📝', titre: 'Sous-requêtes', concept: 'sous_requete' },
      { id: 22, emoji: '❓', titre: 'EXISTS',         concept: 'sous_requete' },
      { id: 23, emoji: '➕', titre: 'UNION',           concept: 'sous_requete' },
      { id: 24, emoji: '🧩', titre: 'SQL Avancé',     concept: 'sous_requete' },
      { id: 25, emoji: '🏆', titre: 'Défi FINAL',     concept: 'sous_requete', isDefi: true },
    ],
  },
]

// ── MENU SIDEBAR ──────────────────────────────────────────────
const MENU = [
  { emoji: '🏠', label: 'MON COURS',  actif: true,  route: '/monde' },
  { emoji: '🛡️', label: 'LIGUES',     actif: false, route: null },
  { emoji: '🎯', label: 'QUÊTES',     actif: false, route: null },
  { emoji: '🛒', label: 'BOUTIQUE',   actif: false, route: null },
  { emoji: '👤', label: 'PROFIL',     actif: false, route: null },
  { emoji: '···', label: 'PLUS',      actif: false, route: null },
]

// ── NŒUD LEÇON ────────────────────────────────────────────────
function NoeudLecon({ lecon, section, etat, loading, onClick }) {
  const [pressed, setPressed] = useState(false)
  const { couleur, shadow } = section
  const { done, active, locked } = etat

  const bg     = locked ? '#2a3a42' : done ? couleur : couleur
  const opacity = locked ? 0.45 : 1
  const bshadow = locked
    ? '0 6px 0 #1a2530'
    : pressed ? 'none'
    : `0 6px 0 ${shadow}`

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bulle COMMENCER au-dessus du nœud actif */}
      {active && !done && (
        <div style={s.commencerBubble}>
          <span style={s.commencerText}>COMMENCER</span>
          <div style={s.commencerArrow} />
        </div>
      )}

      <button
        onClick={onClick}
        disabled={locked || loading}
        onMouseDown={() => !locked && setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        style={{
          width: NODE_SIZE, height: NODE_SIZE,
          borderRadius: '50%',
          background: bg,
          border: `4px solid ${locked ? '#3a4d58' : done ? shadow : shadow}`,
          boxShadow: bshadow,
          transform: pressed ? 'translateY(6px)' : 'translateY(0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: done ? '28px' : locked ? '24px' : '28px',
          cursor: locked ? 'not-allowed' : 'pointer',
          outline: 'none',
          transition: 'transform 0.08s',
          opacity,
          animation: active && !done ? 'pulse_node 2s ease infinite' : 'none',
        }}
      >
        {loading ? '⏳' : done ? '✓' : locked ? lecon.emoji : lecon.emoji}
      </button>
    </div>
  )
}

// ── SECTION PATH ──────────────────────────────────────────────
function SectionPath({ section, sectionIndex, leconsOk, xpUser, enCours, onChoisir }) {
  const { lecons, couleur, shadow, titre, sous, emoji, xp_requis, bg } = section
  const sectUnlocked = xpUser >= xp_requis
  const N = lecons.length
  const containerH = N * NODE_GAP + 20

  const isLeconUnlocked = (lecon) => {
    if (!sectUnlocked) return false
    if (lecon.id === 1) return true
    return leconsOk.has(lecon.id - 1)
  }

  const completees = lecons.filter(l => leconsOk.has(l.id)).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

      {/* Bannière section — style Duolingo */}
      <div style={{
        width: '100%', maxWidth: '400px',
        background: sectUnlocked ? couleur : '#2a3a42',
        borderRadius: '16px',
        padding: '14px 20px',
        boxShadow: sectUnlocked ? `0 4px 0 ${shadow}` : '0 4px 0 #1a2530',
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '6px',
        cursor: 'default',
      }}>
        <span style={{ fontSize: '28px', flexShrink: 0 }}>{emoji}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: '900', fontSize: '15px', color: 'white', letterSpacing: '-0.2px' }}>
            {sectUnlocked ? `SECTION ${sectionIndex + 1}, UNITÉ ${sectionIndex + 1}` : `🔒 ${xp_requis} XP requis`}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: '700' }}>
            {titre} — {sous}
          </p>
        </div>
        {sectUnlocked && (
          <div style={{
            background: 'rgba(255,255,255,0.25)', borderRadius: '10px',
            padding: '6px 12px', fontSize: '12px', fontWeight: '800',
            color: 'white', flexShrink: 0,
          }}>
            {completees}/{N}
          </div>
        )}
      </div>

      {/* Nœuds + connecteurs */}
      <div style={{ position: 'relative', width: `${CONTAINER_W}px`, height: `${containerH}px` }}>

        {/* SVG connecteurs */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          {lecons.slice(0, -1).map((l, i) => {
            const x1 = ZIGZAG[i % ZIGZAG.length]
            const x2 = ZIGZAG[(i + 1) % ZIGZAG.length]
            const y1 = i * NODE_GAP + 10 + NODE_SIZE
            const y2 = (i + 1) * NODE_GAP + 10
            const done = leconsOk.has(l.id)
            return (
              <path key={i}
                d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
                stroke={done && sectUnlocked ? couleur : '#2a3a42'}
                strokeWidth="6" fill="none" strokeLinecap="round"
                strokeDasharray={done && sectUnlocked ? '0' : '12 8'}
              />
            )
          })}
        </svg>

        {/* Nœuds */}
        {lecons.map((lecon, i) => {
          const nx   = nodeLeft(i)
          const ny   = i * NODE_GAP + 10
          const cx   = ZIGZAG[i % ZIGZAG.length]
          const done = leconsOk.has(lecon.id)
          const unlocked = isLeconUnlocked(lecon)
          const active = unlocked && !done
          const loading = enCours === lecon.id
          const labelRight = cx < CONTAINER_W / 2

          return (
            <div key={lecon.id} style={{ position: 'absolute', left: nx, top: ny }}>
              <NoeudLecon
                lecon={lecon} section={section}
                etat={{ done, active, locked: !unlocked }}
                loading={loading}
                onClick={() => unlocked && !loading && onChoisir(lecon, section)}
              />
              {/* Étiquette */}
              <div style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                ...(labelRight ? { left: NODE_SIZE + 12, textAlign: 'left' } : { right: NODE_SIZE + 12, textAlign: 'right' }),
                width: '100px', pointerEvents: 'none',
              }}>
                <p style={{
                  margin: 0, fontSize: '12px', fontWeight: '800', lineHeight: 1.3,
                  color: done ? couleur : active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                }}>
                  {lecon.titre}
                </p>
                {lecon.isDefi && unlocked && (
                  <p style={{ margin: '2px 0 0', fontSize: '10px', fontWeight: '800', color: done ? couleur : active ? shadow : '#3a4d58' }}>
                    ⭐ Défi
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Séparateur inter-sections */}
      {sectionIndex < CHEMIN.length - 1 && (
        <div style={{ width: '4px', height: '32px', background: '#2a3a42', borderRadius: '3px', margin: '4px 0' }} />
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
export default function WorldMap() {
  const navigate = useNavigate()
  const token  = localStorage.getItem('token')
  const nom    = localStorage.getItem('nom') || 'Étudiant'
  const xpLS   = parseInt(localStorage.getItem('xp') || '0')

  const [xpUser, setXpUser]   = useState(xpLS)
  const [streak, setStreak]   = useState(parseInt(localStorage.getItem('streak') || '0'))
  const [niveau, setNiveau]   = useState(localStorage.getItem('niveau_nom') || 'Apprenti')
  const [enCours, setEnCours] = useState(null)
  const [erreur, setErreur]   = useState('')

  const xpInitial  = parseInt(localStorage.getItem('bq_xp_initial') || '0')
  const xpEffectif = Math.max(xpUser, xpInitial)

  const [leconsOk, setLeconsOk] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('bq_lecons_ok') || '[]')) }
    catch { return new Set() }
  })

  useEffect(() => {
    const leconActive  = parseInt(localStorage.getItem('bq_lecon_active') || '0')
    const prevMissions = parseInt(localStorage.getItem('bq_missions_prev') || '0')

    Promise.all([
      fetch(`${API}/missions/scores-mondes`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API}/gamification/stats`,     { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([scores, stats]) => {
      if (stats?.xp !== undefined) {
        setXpUser(stats.xp)
        localStorage.setItem('xp', String(stats.xp))
        setNiveau(stats.niveau?.nom || 'Apprenti')
        localStorage.setItem('niveau_nom', stats.niveau?.nom || 'Apprenti')
      }
      if (stats?.streak_count) {
        setStreak(stats.streak_count)
        localStorage.setItem('streak', String(stats.streak_count))
      }
      if (leconActive && scores.missions_completes > prevMissions) {
        setLeconsOk(prev => {
          const next = new Set([...prev, leconActive])
          localStorage.setItem('bq_lecons_ok', JSON.stringify([...next]))
          return next
        })
        localStorage.removeItem('bq_lecon_active')
      }
      localStorage.setItem('bq_missions_prev', String(scores.missions_completes))
    }).catch(() => {})
  }, [token])

  const totalLecons    = CHEMIN.reduce((s, sec) => s + sec.lecons.length, 0)
  const totalCompletes = [...leconsOk].length
  const progressPct    = Math.round((totalCompletes / totalLecons) * 100)

  const choisirLecon = async (lecon, section) => {
    setErreur(''); setEnCours(lecon.id)
    try {
      const res = await fetch(`${API}/missions/generer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ monde: section.monde, concept: lecon.concept }),
      })
      const mission = await res.json()
      if (!res.ok) throw new Error(mission.detail)
      localStorage.setItem('mission_active', JSON.stringify(mission))
      localStorage.setItem('bq_lecon_active', String(lecon.id))
      navigate('/editeur')
    } catch (e) {
      setErreur(e.message || 'Erreur de connexion')
    } finally {
      setEnCours(null)
    }
  }

  // Niveau suivant et XP nécessaire
  const NIVEAUX_XP = [0, 100, 300, 600, 1000, 1500]
  const niveauIdx = NIVEAUX_XP.findIndex(x => xpUser < x)
  const xpProchain = niveauIdx >= 0 ? NIVEAUX_XP[niveauIdx] : 1500
  const xpPrecedent = niveauIdx > 0 ? NIVEAUX_XP[niveauIdx - 1] : 0
  const xpPct = Math.min(Math.round(((xpUser - xpPrecedent) / (xpProchain - xpPrecedent)) * 100), 100)

  return (
    <div style={s.page}>
      <style>{`
        @keyframes pulse_node {
          0%,100% { box-shadow: 0 6px 0 #46A302, 0 0 0 0 rgba(88,204,2,0.35); }
          50%      { box-shadow: 0 6px 0 #46A302, 0 0 0 12px rgba(88,204,2,0); }
        }
      `}</style>

      {/* ══ SIDEBAR GAUCHE ══ */}
      <aside style={s.sidebar}>
        {/* Logo */}
        <div style={s.sidebarLogo} onClick={() => navigate('/hub')}>
          <span style={{ fontSize: '28px' }}>🧠</span>
          <span style={s.sidebarBrand}>BrainQuest</span>
        </div>

        {/* Menu */}
        <nav style={s.sidebarNav}>
          {MENU.map((item, i) => (
            <div
              key={i}
              onClick={() => item.route && navigate(item.route)}
              style={{
                ...s.sidebarItem,
                ...(item.actif ? s.sidebarItemActif : {}),
                cursor: item.route ? 'pointer' : 'default',
                opacity: item.actif ? 1 : 0.45,
              }}
            >
              <span style={{ fontSize: '22px', width: '28px', textAlign: 'center' }}>{item.emoji}</span>
              <span style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '0.5px' }}>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Déconnexion */}
        <button style={s.sidebarDeconnexion} onClick={() => { localStorage.clear(); navigate('/login') }}>
          🚪 Déconnexion
        </button>
      </aside>

      {/* ══ CONTENU CENTRAL ══ */}
      <main style={s.main}>
        {erreur && (
          <div style={s.erreurBanner}>{erreur}</div>
        )}

        {/* Chemin d'apprentissage */}
        <div style={s.path}>
          {CHEMIN.map((section, i) => (
            <SectionPath
              key={section.id}
              section={section}
              sectionIndex={i}
              leconsOk={leconsOk}
              xpUser={xpEffectif}
              enCours={enCours}
              onChoisir={choisirLecon}
            />
          ))}

          {/* Fin du parcours */}
          <div style={s.finChemin}>
            <span style={{ fontSize: '52px' }}>🎓</span>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '900', fontSize: '17px', margin: '10px 0 4px' }}>
              Maître SQL accompli !
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: 0 }}>
              NoSQL & Data Viz arrivent bientôt...
            </p>
          </div>
        </div>
      </main>

      {/* ══ PANNEAU DROIT ══ */}
      <aside style={s.rightPanel}>

        {/* Stats en pills — style Duolingo */}
        <div style={s.statsPills}>
          <div style={s.pill}>
            <span style={{ fontSize: '20px' }}>🔥</span>
            <span style={{ ...s.pillVal, color: '#FF9600' }}>{streak}</span>
          </div>
          <div style={s.pill}>
            <span style={{ fontSize: '20px' }}>⭐</span>
            <span style={{ ...s.pillVal, color: '#FFD700' }}>{xpUser}</span>
          </div>
          <div style={s.pill}>
            <span style={{ fontSize: '20px' }}>💎</span>
            <span style={{ ...s.pillVal, color: '#1CB0F6' }}>{totalCompletes}</span>
          </div>
        </div>

        {/* Carte Profil / Progression */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.avatar}>{nom[0]?.toUpperCase()}</div>
            <div>
              <p style={s.cardNom}>{nom}</p>
              <p style={s.cardNiveau}>✨ {niveau}</p>
            </div>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={s.cardLabel}>Progression SQL</span>
              <span style={{ ...s.cardLabel, color: '#58CC02', fontWeight: '800' }}>{progressPct}%</span>
            </div>
            <div style={s.progressTrack}>
              <div style={{ ...s.progressFill, width: `${progressPct}%` }} />
            </div>
            <p style={{ ...s.cardLabel, marginTop: '6px', textAlign: 'right' }}>
              {totalCompletes} / {totalLecons} leçons
            </p>
          </div>
        </div>

        {/* Carte XP vers prochain niveau */}
        <div style={s.card}>
          <p style={s.cardTitre}>Prochain niveau</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={s.cardLabel}>XP actuel</span>
            <span style={{ ...s.cardLabel, color: '#FFD700', fontWeight: '800' }}>{xpUser} XP</span>
          </div>
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, background: 'linear-gradient(90deg, #FFD700, #FF9600)', width: `${xpPct}%` }} />
          </div>
          <p style={{ ...s.cardLabel, marginTop: '6px', textAlign: 'right' }}>
            {xpProchain - xpUser} XP restants
          </p>
        </div>

        {/* Carte Ligues (placeholder) */}
        <div style={{ ...s.card, opacity: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#2a3a42', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              🛡️
            </div>
            <div>
              <p style={s.cardTitre}>Débloque les Ligues !</p>
              <p style={s.cardLabel}>Termine encore {Math.max(0, 5 - totalCompletes)} leçons pour rejoindre la compétition</p>
            </div>
          </div>
        </div>

        {/* Classement rapide */}
        <button style={s.btnClassement} onClick={() => navigate('/classement')}>
          🏆 Voir le classement
        </button>

      </aside>
    </div>
  )
}

// ── STYLES ────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: '100vh',
    background: '#131f24',
    display: 'flex',
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    color: 'white',
  },

  // ── Sidebar gauche
  sidebar: {
    width: '240px',
    flexShrink: 0,
    background: '#1a2e35',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
  },
  sidebarLogo: {
    display: 'flex', alignItems: 'center', gap: '10px',
    marginBottom: '32px', cursor: 'pointer', paddingLeft: '8px',
  },
  sidebarBrand: {
    fontWeight: '900', fontSize: '20px',
    background: 'linear-gradient(135deg, #58CC02, #1CB0F6)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  sidebarNav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  sidebarItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 14px', borderRadius: '14px',
    color: 'rgba(255,255,255,0.7)', transition: 'all 0.15s',
    userSelect: 'none',
  },
  sidebarItemActif: {
    background: 'rgba(88,204,2,0.12)',
    border: '2px solid rgba(88,204,2,0.3)',
    color: '#58CC02',
    opacity: 1,
  },
  sidebarDeconnexion: {
    background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.4)', padding: '10px 14px',
    borderRadius: '12px', cursor: 'pointer', fontSize: '13px',
    fontWeight: '700', fontFamily: 'inherit', marginTop: '16px',
  },

  // ── Centre
  main: {
    flex: 1,
    padding: '32px 24px 80px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    overflowY: 'auto',
  },
  erreurBanner: {
    background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)',
    color: '#FCA5A5', padding: '10px 16px', borderRadius: '10px',
    fontSize: '13px', marginBottom: '16px', width: '100%', maxWidth: '400px',
  },
  path: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 0, width: '100%',
  },
  finChemin: {
    textAlign: 'center', padding: '32px 0',
    borderTop: '1px solid rgba(255,255,255,0.06)', width: '100%', marginTop: '20px',
  },

  // Bulle COMMENCER
  commencerBubble: {
    position: 'absolute', bottom: '100%', left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '10px',
    background: '#58CC02', borderRadius: '12px',
    padding: '6px 14px', whiteSpace: 'nowrap', zIndex: 10,
    boxShadow: '0 4px 0 #46A302',
  },
  commencerText: {
    color: 'white', fontWeight: '900', fontSize: '13px', letterSpacing: '0.5px',
  },
  commencerArrow: {
    position: 'absolute', top: '100%', left: '50%',
    transform: 'translateX(-50%)',
    width: 0, height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderTop: '8px solid #58CC02',
  },

  // ── Panneau droit
  rightPanel: {
    width: '300px',
    flexShrink: 0,
    padding: '24px 20px',
    display: 'flex', flexDirection: 'column', gap: '16px',
    position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
    borderLeft: '1px solid rgba(255,255,255,0.06)',
  },
  statsPills: {
    display: 'flex', gap: '8px', justifyContent: 'center',
  },
  pill: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    background: '#1a2e35', borderRadius: '14px', padding: '10px 8px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  pillVal: {
    fontWeight: '900', fontSize: '16px',
  },
  card: {
    background: '#1a2e35', borderRadius: '16px',
    padding: '18px 16px', border: '1px solid rgba(255,255,255,0.08)',
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: {
    width: '44px', height: '44px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #58CC02, #1CB0F6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '900', fontSize: '18px', flexShrink: 0,
  },
  cardNom: { margin: 0, fontWeight: '800', fontSize: '15px' },
  cardNiveau: { margin: '3px 0 0', fontSize: '12px', color: '#a78bfa', fontWeight: '700' },
  cardTitre: { margin: '0 0 10px', fontWeight: '800', fontSize: '14px', color: 'white' },
  cardLabel: { margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontWeight: '600' },
  progressTrack: {
    height: '10px', background: 'rgba(255,255,255,0.08)',
    borderRadius: '99px', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', background: 'linear-gradient(90deg,#58CC02,#84CC16)',
    borderRadius: '99px', transition: 'width 0.8s ease',
  },
  btnClassement: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.7)', padding: '12px',
    borderRadius: '14px', cursor: 'pointer', fontSize: '14px',
    fontWeight: '800', fontFamily: 'inherit', width: '100%',
    transition: 'all 0.15s',
  },
}
