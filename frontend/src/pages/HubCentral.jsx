import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:8000'

const MODULES = [
  {
    id: 'SQL',
    nom: 'Module SQL',
    univers: 'La Cité des Requêtes',
    emoji: '🗄️',
    couleur: '#F59E0B',
    glow: 'rgba(245,158,11,0.3)',
    fond: 'rgba(245,158,11,0.08)',
    bordure: 'rgba(245,158,11,0.3)',
    route: '/monde',
    concepts: ['SELECT', 'WHERE', 'JOIN', 'GROUP BY', 'Sous-requêtes'],
  },
  {
    id: 'NoSQL',
    nom: 'Module NoSQL',
    univers: "L'Archipel des Documents",
    emoji: '🍃',
    couleur: '#10B981',
    glow: 'rgba(16,185,129,0.3)',
    fond: 'rgba(16,185,129,0.08)',
    bordure: 'rgba(16,185,129,0.3)',
    route: '/monde',
    concepts: ['find()', 'aggregate()', 'lookup', 'Pipeline', 'Index'],
    locked: true,
  },
  {
    id: 'DataViz',
    nom: 'Module Data Viz',
    univers: "L'Observatoire des Données",
    emoji: '📊',
    couleur: '#8B5CF6',
    glow: 'rgba(139,92,246,0.3)',
    fond: 'rgba(139,92,246,0.08)',
    bordure: 'rgba(139,92,246,0.3)',
    route: '/monde',
    concepts: ['Bar Chart', 'Line Chart', 'Pie Chart', 'Scatter', 'Radar'],
    locked: true,
  },
]

export default function HubCentral() {
  const navigate = useNavigate()
  const nom = localStorage.getItem('nom') || 'Étudiant'
  const xp = parseInt(localStorage.getItem('xp') || '0')
  const moduleActif = localStorage.getItem('module') || 'SQL'
  const streak = parseInt(localStorage.getItem('streak') || '0')
  const [stats, setStats] = useState(null)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch(`${API}/gamification/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
  }, [])

  const entrerModule = (mod) => {
    if (mod.locked) return
    localStorage.setItem('module', mod.id)
    navigate(mod.route)
  }

  const niveau = stats?.niveau?.nom || 'Apprenti'
  const xpTotal = stats?.xp || xp
  const xpSuivant = stats?.xp_prochain_niveau || 100

  return (
    <div style={s.page}>
      <div style={s.stars} />

      {/* NAVBAR */}
      <nav style={s.nav}>
        <div style={s.navLogo}>
          <span style={{ fontSize: '22px' }}>🧠</span>
          <span style={s.navTitre}>BrainQuest</span>
        </div>
        <div style={s.navRight}>
          <span style={s.streak}>🔥 {streak} jours</span>
          <div style={s.xpBadge}>
            <span style={s.xpNom}>{niveau}</span>
            <span style={s.xpVal}>{xpTotal} XP</span>
          </div>
          <div style={s.avatar}>{nom[0]?.toUpperCase()}</div>
        </div>
      </nav>

      {/* CONTENU */}
      <div style={s.contenu}>

        {/* Bienvenue */}
        <div style={s.welcome}>
          <h1 style={s.welcomeTitre}>Bonjour, {nom} 👋</h1>
          <p style={s.welcomeSub}>Choisissez un module et continuez votre aventure</p>
        </div>

        {/* Barre XP globale */}
        <div style={s.xpBar}>
          <div style={s.xpBarLabel}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Progression globale</span>
            <span style={{ color: '#a78bfa', fontSize: '13px', fontWeight: '700' }}>{xpTotal} / {xpSuivant} XP</span>
          </div>
          <div style={s.xpBarBg}>
            <div style={{ ...s.xpBarFill, width: `${Math.min((xpTotal / (xpSuivant || 100)) * 100, 100)}%` }} />
          </div>
        </div>

        {/* Grille des 3 modules */}
        <div style={s.grille}>
          {MODULES.map(mod => (
            <div
              key={mod.id}
              onClick={() => entrerModule(mod)}
              onMouseEnter={() => setHovered(mod.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...s.card,
                borderColor: hovered === mod.id || moduleActif === mod.id ? mod.bordure : 'rgba(255,255,255,0.06)',
                background: hovered === mod.id || moduleActif === mod.id ? mod.fond : 'rgba(255,255,255,0.03)',
                boxShadow: hovered === mod.id ? `0 0 40px ${mod.glow}` : '0 4px 20px rgba(0,0,0,0.3)',
                cursor: mod.locked ? 'not-allowed' : 'pointer',
                opacity: mod.locked ? 0.5 : 1,
                transform: hovered === mod.id && !mod.locked ? 'translateY(-4px)' : 'none',
                transition: 'all 0.3s ease',
              }}>

              {/* Badge module actif */}
              {moduleActif === mod.id && !mod.locked && (
                <div style={{ ...s.badgeActif, background: mod.couleur }}>Module actif</div>
              )}

              {/* Lock */}
              {mod.locked && (
                <div style={s.lock}>🔒 Bientôt disponible</div>
              )}

              {/* Emoji + Titre */}
              <div style={s.cardEmoji}>{mod.emoji}</div>
              <h2 style={{ ...s.cardTitre, color: mod.couleur }}>{mod.nom}</h2>
              <p style={s.cardUnivers}>{mod.univers}</p>

              {/* Concepts */}
              <div style={s.concepts}>
                {mod.concepts.map(c => (
                  <span key={c} style={{ ...s.concept, borderColor: mod.bordure, color: mod.couleur }}>{c}</span>
                ))}
              </div>

              {/* Bouton */}
              {!mod.locked && (
                <button style={{ ...s.bouton, background: `linear-gradient(135deg, ${mod.couleur}88, ${mod.couleur}44)`, borderColor: mod.bordure }}>
                  {moduleActif === mod.id ? '▶ Continuer' : '→ Changer de module'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Liens rapides */}
        <div style={s.liens}>
          <button style={s.lien} onClick={() => navigate('/classement')}>🏆 Classement</button>
          <button style={s.lien} onClick={() => { localStorage.clear(); navigate('/login') }}>🚪 Déconnexion</button>
        </div>

      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #0f0c29 0%, #090818 50%, #000000 100%)',
    fontFamily: "'Segoe UI', sans-serif",
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  },
  stars: {
    position: 'fixed', inset: 0, pointerEvents: 'none',
    background: `
      radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 35% 65%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 55% 15%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 75% 45%, rgba(255,255,255,0.4) 0%, transparent 100%),
      radial-gradient(1px 1px at 88% 75%, rgba(255,255,255,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 25% 85%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(1px 1px at 65% 92%, rgba(255,255,255,0.4) 0%, transparent 100%)
    `,
  },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 32px',
    background: 'rgba(255,255,255,0.03)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  navLogo: { display: 'flex', alignItems: 'center', gap: '8px' },
  navTitre: { fontWeight: '800', fontSize: '18px', background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  streak: { color: '#F59E0B', fontWeight: '700', fontSize: '14px' },
  xpBadge: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  xpNom: { color: '#a78bfa', fontSize: '11px', fontWeight: '600' },
  xpVal: { color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '700' },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '800', fontSize: '16px',
  },
  contenu: { maxWidth: '960px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 },
  welcome: { textAlign: 'center', marginBottom: '32px' },
  welcomeTitre: { fontSize: '32px', fontWeight: '800', margin: 0 },
  welcomeSub: { color: 'rgba(255,255,255,0.45)', fontSize: '15px', marginTop: '8px' },
  xpBar: { marginBottom: '40px' },
  xpBarLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  xpBarBg: { height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' },
  xpBarFill: { height: '100%', background: 'linear-gradient(90deg, #7c3aed, #2563eb)', borderRadius: '99px', transition: 'width 0.6s ease' },
  grille: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' },
  card: {
    border: '1px solid', borderRadius: '20px', padding: '28px 24px',
    display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative',
  },
  badgeActif: { position: 'absolute', top: '14px', right: '14px', color: '#000', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px' },
  lock: { position: 'absolute', top: '14px', right: '14px', color: 'rgba(255,255,255,0.4)', fontSize: '11px' },
  cardEmoji: { fontSize: '40px' },
  cardTitre: { margin: 0, fontSize: '18px', fontWeight: '800' },
  cardUnivers: { margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '13px' },
  concepts: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' },
  concept: { border: '1px solid', borderRadius: '99px', padding: '3px 10px', fontSize: '11px', fontWeight: '600' },
  bouton: { marginTop: '8px', padding: '10px', borderRadius: '10px', border: '1px solid', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer' },
  liens: { display: 'flex', justifyContent: 'center', gap: '16px' },
  lien: { padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '14px' },
}
