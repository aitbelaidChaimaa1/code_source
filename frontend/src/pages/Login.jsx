import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:8000'

// ── MASCOTTE BRAINIUS ─────────────────────────────────────────
function Brainius({ size = 100 }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 100 110" fill="none">
      <ellipse cx="50" cy="106" rx="22" ry="5" fill="rgba(0,0,0,0.15)"/>
      <ellipse cx="50" cy="60" rx="38" ry="38" fill="#7C3AED"/>
      <ellipse cx="32" cy="32" rx="22" ry="24" fill="#7C3AED"/>
      <ellipse cx="68" cy="32" rx="22" ry="24" fill="#7C3AED"/>
      <ellipse cx="70" cy="40" rx="18" ry="22" fill="#8B5CF6" opacity="0.35"/>
      <path d="M50 14 L50 72" stroke="#6D28D9" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M24 38 C28 32 34 34 35 40" stroke="rgba(255,255,255,0.22)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M22 52 C26 46 32 48 33 54" stroke="rgba(255,255,255,0.18)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M76 38 C72 32 66 34 65 40" stroke="rgba(255,255,255,0.22)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M78 52 C74 46 68 48 67 54" stroke="rgba(255,255,255,0.18)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <ellipse cx="35" cy="68" rx="10" ry="11" fill="white"/>
      <ellipse cx="65" cy="68" rx="10" ry="11" fill="white"/>
      <circle cx="35" cy="69" r="6" fill="#1E1B4B"/>
      <circle cx="65" cy="69" r="6" fill="#1E1B4B"/>
      <circle cx="37.5" cy="66.5" r="2.5" fill="white"/>
      <circle cx="67.5" cy="66.5" r="2.5" fill="white"/>
      <path d="M39 82 Q50 91 61 82" stroke="#1E1B4B" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <ellipse cx="26" cy="76" rx="5.5" ry="3.5" fill="rgba(251,113,133,0.3)"/>
      <ellipse cx="74" cy="76" rx="5.5" ry="3.5" fill="rgba(251,113,133,0.3)"/>
      <circle cx="10" cy="48" r="4" fill="#A78BFA"/>
      <circle cx="10" cy="48" r="2.2" fill="#DDD6FE"/>
      <line x1="14" y1="48" x2="20" y2="48" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="90" cy="48" r="4" fill="#A78BFA"/>
      <circle cx="90" cy="48" r="2.2" fill="#DDD6FE"/>
      <line x1="86" y1="48" x2="80" y2="48" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// ── DONNÉES ───────────────────────────────────────────────────
const MODULES = [
  { id: 'SQL',     nom: 'SQL',      desc: 'La Cité des Requêtes',       emoji: '🗄️', couleur: '#58CC02', shadow: '#46A302', bg: 'rgba(88,204,2,0.12)' },
  { id: 'NoSQL',   nom: 'NoSQL',    desc: "L'Archipel des Documents",   emoji: '🍃', couleur: '#1CB0F6', shadow: '#00A3E0', bg: 'rgba(28,176,246,0.12)' },
  { id: 'DataViz', nom: 'Data Viz', desc: "L'Observatoire des Données", emoji: '📊', couleur: '#CE82FF', shadow: '#B062E8', bg: 'rgba(206,130,255,0.12)' },
]

const NIVEAUX = [
  { id: 'debutant',   emoji: '🌱', titre: 'Débutant complet',    desc: "C'est ma toute première fois" },
  { id: 'bases',      emoji: '📖', titre: "J'ai quelques bases",  desc: "J'ai déjà vu quelques notions" },
  { id: 'pratiquant', emoji: '💪', titre: 'Je pratique',          desc: "Je connais les fondamentaux" },
  { id: 'avance',     emoji: '🏆', titre: 'Je suis avancé',       desc: "Je maîtrise bien le sujet" },
]

const SOURCES = [
  { id: 'ecole',     emoji: '🎓', titre: 'École / Université',  desc: "Un cours ou un prof m'en a parlé" },
  { id: 'ami',       emoji: '👥', titre: 'Ami ou collègue',     desc: 'Quelqu\'un me l\'a recommandé' },
  { id: 'reseaux',   emoji: '📱', titre: 'Réseaux sociaux',     desc: 'Vu sur Instagram, TikTok, LinkedIn...' },
  { id: 'formateur', emoji: '👨‍🏫', titre: 'Mon formateur',       desc: 'Proposé dans ma formation' },
]

const MOTIVATIONS = [
  { id: 'diplome',   emoji: '📚', titre: 'Mon diplôme',         desc: "J'en ai besoin pour mes études" },
  { id: 'emploi',    emoji: '💼', titre: 'Trouver un emploi',   desc: 'Booster mon CV et mes entretiens' },
  { id: 'projet',    emoji: '🚀', titre: 'Un projet personnel', desc: "J'ai une idée qui en a besoin" },
  { id: 'curiosite', emoji: '🔮', titre: 'Par curiosité',       desc: "J'aime simplement apprendre" },
]

const OBJECTIFS = [
  { id: '5min',  emoji: '🎯', titre: '5 min / jour',  desc: 'Décontracté' },
  { id: '15min', emoji: '📚', titre: '15 min / jour', desc: 'Régulier' },
  { id: '30min', emoji: '💪', titre: '30 min / jour', desc: 'Sérieux' },
  { id: '40min', emoji: '🔥', titre: '40 min / jour', desc: 'Intensif' },
]

const TEST_QUESTIONS = [
  {
    niveau: '⭐ Très facile',
    question: "Quelle requête affiche tous les produits de la boutique ?",
    context: "Table : produits (id, nom, categorie, prix, stock)",
    options: [
      { text: "SELECT * FROM produits",   correct: true  },
      { text: "SHOW ALL FROM produits",   correct: false },
      { text: "GET produits",             correct: false },
      { text: "LIST * FROM produits",     correct: false },
    ],
  },
  {
    niveau: '⭐⭐ Facile',
    question: "Afficher les produits de la catégorie 'Informatique' :",
    context: "Table : produits (nom, categorie, prix, stock)",
    options: [
      { text: "SELECT * FROM produits WHERE categorie = 'Informatique'",  correct: true  },
      { text: "SELECT * FROM produits IF categorie = 'Informatique'",     correct: false },
      { text: "SELECT * FROM produits FILTER categorie = 'Informatique'", correct: false },
      { text: "SELECT categorie FROM produits WHERE = 'Informatique'",    correct: false },
    ],
  },
  {
    niveau: '⭐⭐⭐ Moyen',
    question: "Compter le nombre de produits par catégorie :",
    context: "Table : produits (nom, categorie, prix)",
    options: [
      { text: "SELECT categorie, COUNT(*) FROM produits GROUP BY categorie",  correct: true  },
      { text: "SELECT categorie, COUNT(*) FROM produits ORDER BY categorie",  correct: false },
      { text: "SELECT COUNT(*) FROM produits WHERE categorie",               correct: false },
      { text: "SELECT categorie, TOTAL(*) FROM produits GROUP BY categorie", correct: false },
    ],
  },
  {
    niveau: '⭐⭐⭐⭐ Difficile',
    question: "Afficher le nom du client et le total de chaque commande :",
    context: "Tables : commandes (client_id, total) — clients (id, nom)",
    options: [
      { text: "SELECT clients.nom, commandes.total FROM commandes JOIN clients ON commandes.client_id = clients.id", correct: true  },
      { text: "SELECT clients.nom, commandes.total FROM commandes, clients",                                         correct: false },
      { text: "SELECT nom, total FROM clients WHERE commandes.client_id = clients.id",                               correct: false },
      { text: "SELECT clients.nom, commandes.total FROM clients COMBINE commandes ON client_id",                     correct: false },
    ],
  },
  {
    niveau: '⭐⭐⭐⭐⭐ Complexe',
    question: "Clients ayant passé plus d'une commande avec le total de leurs achats :",
    context: "Tables : commandes (client_id, total) — clients (id, nom)",
    options: [
      { text: "SELECT clients.nom, COUNT(*) AS nb, SUM(commandes.total) AS total FROM commandes JOIN clients ON commandes.client_id = clients.id GROUP BY clients.nom HAVING COUNT(*) > 1", correct: true  },
      { text: "SELECT clients.nom, COUNT(*) FROM commandes JOIN clients GROUP BY clients.nom WHERE COUNT(*) > 1",                                                                           correct: false },
      { text: "SELECT nom, SUM(total) FROM clients JOIN commandes ON id = client_id WHERE COUNT(*) > 1",                                                                                   correct: false },
      { text: "SELECT clients.nom, SUM(commandes.total) FROM commandes JOIN clients ON client_id GROUP BY nom",                                                                            correct: false },
    ],
  },
]

// ══════════════════════════════════════════════════════════════
export default function Login() {
  const navigate = useNavigate()

  const [ecran, setEcran]               = useState('welcome')
  const [moduleChoisi, setModuleChoisi] = useState(null)
  const [sourceConn, setSourceConn]     = useState(null)
  const [motivation, setMotivation]     = useState(null)
  const [objectifJour, setObjectifJour] = useState(null)
  const [niveauChoisi, setNiveauChoisi] = useState(null)
  const [form, setForm]                 = useState({ nom: '', email: '', mdp: '', confirmer: '' })
  const [showMdp, setShowMdp]           = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [erreur, setErreur]             = useState('')
  const [chargement, setChargement]     = useState(false)

  // Brainius typing
  const [typedText, setTypedText]             = useState('')
  const [introTypingDone, setIntroTypingDone] = useState(false)
  const [qTyped, setQTyped]                   = useState('')
  const [qDone, setQDone]                     = useState(false)

  // Test
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  const [testIndex, setTestIndex]     = useState(0)
  const [testSelected, setTestSelected] = useState(-1)
  const [testFeedback, setTestFeedback] = useState(false)
  const [testScores, setTestScores]   = useState([])
  const [testScore, setTestScore]     = useState(null)

  const goTo = (e) => { setErreur(''); setEcran(e) }
  const ch   = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // Texte qui s'écrit dans la bulle de chaque question profil
  useEffect(() => {
    const labels = {
      q_source:     "Comment as-tu entendu parler de BrainQuest ?",
      q_motivation: "Pourquoi veux-tu apprendre ?",
      q_objectif:   "Quel est ton objectif quotidien ?",
      q_niveau:     "Quel est ton niveau actuel ?",
    }
    const txt = labels[ecran]
    if (!txt) { setQTyped(''); setQDone(false); return }
    setQTyped(''); setQDone(false)
    let i = 0
    const iv = setInterval(() => {
      i++; setQTyped(txt.slice(0, i))
      if (i >= txt.length) { clearInterval(iv); setQDone(true) }
    }, 28)
    return () => clearInterval(iv)
  }, [ecran])

  // Animation texte Brainius intro
  useEffect(() => {
    if (ecran !== 'brainius_intro') { setTypedText(''); setIntroTypingDone(false); return }
    const mod = MODULES.find(m => m.id === moduleChoisi)
    const txt = `Super choix ! Tu vas apprendre ${mod?.nom || ''} ${mod?.emoji || ''} 🎉\nJe suis Brainius, ton guide BrainQuest 🧠\nOn va préparer ton parcours en quelques questions.\nPrêt ? On y va ! 🚀`
    setTypedText(''); setIntroTypingDone(false)
    let i = 0
    const iv = setInterval(() => {
      i++; setTypedText(txt.slice(0, i))
      if (i >= txt.length) { clearInterval(iv); setIntroTypingDone(true) }
    }, 30)
    return () => clearInterval(iv)
  }, [ecran])

  // Redirect succes → /monde
  useEffect(() => {
    if (ecran === 'succes') {
      const t = setTimeout(() => navigate('/monde'), 2500)
      return () => clearTimeout(t)
    }
  }, [ecran])

  // Connexion
  const handleConnexion = async (e) => {
    e.preventDefault(); setErreur(''); setChargement(true)
    try {
      const res  = await fetch(`${API}/auth/connexion`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, mot_de_passe: form.mdp }) })
      const data = await res.json()
      if (!res.ok) { setErreur(data.detail || 'Email ou mot de passe incorrect'); return }
      localStorage.setItem('token', data.token); localStorage.setItem('nom', data.nom)
      localStorage.setItem('xp', String(data.xp)); localStorage.setItem('module', data.module_depart || 'SQL')
      localStorage.setItem('streak', String(data.streak_count || 0))
      navigate('/hub')
    } catch { setErreur('Impossible de joindre le serveur. Docker est démarré ?') }
    finally { setChargement(false) }
  }

  // Démarrer test (mélange les réponses)
  const demarrerTest = () => {
    const shuffled = TEST_QUESTIONS.map(q => ({ ...q, options: [...q.options].sort(() => Math.random() - 0.5) }))
    setShuffledQuestions(shuffled); setTestIndex(0); setTestSelected(-1)
    setTestFeedback(false); setTestScores([]); setTestScore(null); goTo('test')
  }

  // Avancer dans le test
  const avancerTest = () => {
    const isCorrect = shuffledQuestions[testIndex].options[testSelected].correct
    const newScores = [...testScores, isCorrect]
    setTestScores(newScores)
    if (testIndex + 1 >= TEST_QUESTIONS.length) {
      const score = newScores.filter(Boolean).length
      setTestScore(score); setTestIndex(0); setTestSelected(-1); setTestFeedback(false)
      goTo('register_fin')
    } else {
      setTestIndex(i => i + 1); setTestSelected(-1); setTestFeedback(false)
    }
  }

  // Inscription
  const handleInscription = async () => {
    setChargement(true); setErreur('')
    try {
      const res  = await fetch(`${API}/auth/inscription`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nom: form.nom, email: form.email, mot_de_passe: form.mdp, module_depart: moduleChoisi }) })
      const data = await res.json()
      if (!res.ok) { setErreur(data.detail || "Erreur lors de la création du compte"); return }
      localStorage.setItem('token', data.token); localStorage.setItem('nom', data.nom)
      localStorage.setItem('xp', '0'); localStorage.setItem('module', moduleChoisi)
      localStorage.setItem('streak', '0'); localStorage.setItem('bq_source', sourceConn || '')
      localStorage.setItem('bq_motivation', motivation || ''); localStorage.setItem('bq_objectif', objectifJour || '')

      // Positionner l'étudiant selon le test ou le niveau déclaré
      let leconsInitiales = [], xpInitial = 0
      if (testScore !== null) {
        if (testScore >= 4) { leconsInitiales = [1,2,3,4,5,6,7,8,9,10]; xpInitial = 350 }
        else if (testScore >= 2) { leconsInitiales = [1,2,3,4,5] }
      } else {
        if (niveauChoisi === 'avance')     { leconsInitiales = [1,2,3,4,5,6,7,8,9,10]; xpInitial = 350 }
        else if (niveauChoisi === 'pratiquant') { leconsInitiales = [1,2,3,4,5] }
      }
      localStorage.setItem('bq_lecons_ok', JSON.stringify(leconsInitiales))
      localStorage.setItem('bq_xp_initial', String(xpInitial))
      goTo('succes')
    } catch { setErreur('Impossible de joindre le serveur. Docker est démarré ?') }
    finally { setChargement(false) }
  }

  // Données courantes du test
  const q = shuffledQuestions[testIndex] || TEST_QUESTIONS[0]
  const optionCorrecte = shuffledQuestions[testIndex]?.options[testSelected]?.correct

  // Message final
  const getFinMsg = () => {
    if (testScore === null) return { titre: "C'est parti !", sub: 'Ton parcours est prêt', emoji: '🚀', couleur: '#58CC02' }
    if (testScore <= 1) return { titre: 'On reprend les bases !',   sub: `${testScore}/5 — Parcours adapté depuis le début`,   emoji: '🌱', couleur: '#58CC02' }
    if (testScore <= 3) return { titre: 'Tu as de bonnes bases !',  sub: `${testScore}/5 — On approfondit tes connaissances`,   emoji: '📈', couleur: '#1CB0F6' }
    return               { titre: 'Excellent niveau !',             sub: `${testScore}/5 — Tu es directement challengé !`,      emoji: '🏆', couleur: '#CE82FF' }
  }
  const finMsg = getFinMsg()

  // ── EARLY RETURN — Questions profil (plein écran indépendant) ─
  const Q_CONFIG = {
    q_source:     { label: "Comment as-tu entendu parler de BrainQuest ?", data: SOURCES,     val: sourceConn,  set: setSourceConn,  back: 'brainius_intro',  next: 'q_motivation',    pct: '25%' },
    q_motivation: { label: "Pourquoi veux-tu apprendre ?",                  data: MOTIVATIONS, val: motivation,   set: setMotivation,  back: 'q_source',        next: 'q_objectif',      pct: '50%' },
    q_objectif:   { label: "Quel est ton objectif quotidien ?",              data: OBJECTIFS,   val: objectifJour,set: setObjectifJour, back: 'q_motivation',    next: 'q_niveau',        pct: '70%' },
    q_niveau:     { label: "Quel est ton niveau actuel ?",                   data: NIVEAUX,     val: niveauChoisi,set: setNiveauChoisi, back: 'q_objectif',      next: 'register_compte', pct: '90%' },
  }

  // ── EARLY RETURN — Test de placement (même style que questions) ─
  if (ecran === 'test') {
    const isLast = testIndex + 1 >= TEST_QUESTIONS.length
    return (
      <div style={{ minHeight:'100vh', background:'#131f24', display:'flex', flexDirection:'column', fontFamily:"'Nunito','Segoe UI',sans-serif", color:'white' }}>
        <style>{`
          @keyframes br_talk { 0%,100%{transform:translateY(0) rotate(0deg)} 30%{transform:translateY(-8px) rotate(-3deg)} 70%{transform:translateY(-4px) rotate(2deg)} }
          @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
        `}</style>

        {/* Barre : ← + 5 points de progression + compteur */}
        <div style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 32px' }}>
          <button onClick={() => goTo('register_test_choice')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:'24px', cursor:'pointer', padding:0, lineHeight:1 }}>←</button>
          <div style={{ display:'flex', gap:'6px', flex:1 }}>
            {TEST_QUESTIONS.map((_, i) => (
              <div key={i} style={{ flex:1, height:'16px', borderRadius:'99px', background: i < testIndex ? '#58CC02' : i === testIndex ? '#84CC16' : '#1a2e35', transition:'all 0.3s' }} />
            ))}
          </div>
          <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'13px', fontWeight:'800', flexShrink:0 }}>{testIndex + 1}/{TEST_QUESTIONS.length}</span>
        </div>

        {/* Brainius + badge niveau + bulle question */}
        <div style={{ display:'flex', alignItems:'center', gap:'16px', padding:'10px 32px 0', paddingLeft:'60px' }}>
          <div style={{ animation:'br_talk 2s ease infinite', flexShrink:0 }}>
            <Brainius size={80} />
          </div>
          <div style={{ flex:1 }}>
            <span style={{ fontSize:'12px', fontWeight:'800', color:'#CE82FF', background:'rgba(206,130,255,0.15)', padding:'4px 12px', borderRadius:'99px', display:'inline-block', marginBottom:'8px' }}>
              {q.niveau}
            </span>
            <div style={{ position:'relative', background:'#1a2e35', border:'2px solid #2a3d4a', borderRadius:'16px', padding:'14px 20px' }}>
              <div style={{ position:'absolute', right:'100%', top:'50%', transform:'translateY(-50%)', width:0, height:0, borderTop:'10px solid transparent', borderBottom:'10px solid transparent', borderRight:'14px solid #2a3d4a' }} />
              <p style={{ margin:0, fontSize:'18px', fontWeight:'800', color:'white', lineHeight:1.4 }}>{q.question}</p>
            </div>
            {/* Contexte SQL */}
            <div style={{ background:'#0d1b24', border:'1px solid #2a3d4a', borderRadius:'10px', padding:'10px 14px', marginTop:'10px', fontFamily:'monospace', fontSize:'13px', color:'#84CC16' }}>
              <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'11px', textTransform:'uppercase', letterSpacing:'1px' }}>Contexte — </span>
              {q.context}
            </div>
          </div>
        </div>

        {/* Options — colonne unique alignée avec la bulle */}
        <div style={{ display:'flex', flexDirection:'column', gap:'10px', padding:'14px 32px 0', paddingLeft:`${60 + 80 + 16}px` }}>
          {q.options.map((opt, i) => {
            const sel = testSelected === i
            let bg = '#1a2e35', border = '#2a3d4a', color = 'rgba(255,255,255,0.85)'
            if (testFeedback) {
              if (opt.correct)  { bg = 'rgba(88,204,2,0.12)';  border = '#58CC02'; color = '#58CC02' }
              else if (sel)     { bg = 'rgba(255,75,75,0.12)'; border = '#FF4B4B'; color = '#FF4B4B' }
            } else if (sel)     { bg = 'rgba(28,176,246,0.1)'; border = '#1CB0F6' }
            return (
              <div key={i} onClick={() => !testFeedback && setTestSelected(i)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', padding:'14px 18px', borderRadius:'14px', border:`2px solid ${border}`, background:bg, cursor: testFeedback ? 'default' : 'pointer', transition:'all 0.12s' }}>
                <span style={{ fontFamily:'monospace', fontSize:'14px', fontWeight:'700', color, flex:1 }}>{opt.text}</span>
                {testFeedback && opt.correct && <span style={{ fontSize:'20px', flexShrink:0 }}>✅</span>}
                {testFeedback && sel && !opt.correct && <span style={{ fontSize:'20px', flexShrink:0 }}>❌</span>}
              </div>
            )
          })}
        </div>

        {/* Feedback */}
        {testFeedback && (
          <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'12px 32px 0', marginLeft:`${60 + 80 + 16}px`, padding:'12px 18px', borderRadius:'14px', background: optionCorrecte ? 'rgba(88,204,2,0.1)' : 'rgba(255,75,75,0.1)', border:`2px solid ${optionCorrecte ? '#58CC02' : '#FF4B4B'}` }}>
            <span style={{ fontSize:'22px' }}>{optionCorrecte ? '🎉' : '💡'}</span>
            <div>
              <p style={{ margin:0, fontWeight:'800', color: optionCorrecte ? '#58CC02' : '#FF4B4B' }}>{optionCorrecte ? 'Bonne réponse !' : 'Pas tout à fait...'}</p>
              {!optionCorrecte && <p style={{ margin:'2px 0 0', fontSize:'12px', color:'rgba(255,255,255,0.45)' }}>La bonne réponse est indiquée en vert</p>}
            </div>
          </div>
        )}

        {/* Footer : VALIDER ou CONTINUER bas droite */}
        <div style={{ marginTop:'auto', padding:'16px 32px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'flex-end' }}>
          {!testFeedback
            ? <button onClick={() => setTestFeedback(true)} disabled={testSelected === -1} style={{ padding:'13px 40px', borderRadius:'14px', border:'none', fontSize:'15px', fontWeight:'900', letterSpacing:'1px', textTransform:'uppercase', fontFamily:'inherit', background: testSelected !== -1 ? '#1CB0F6' : '#1a2e35', color: testSelected !== -1 ? 'white' : '#2a3d4a', boxShadow: testSelected !== -1 ? '0 4px 0 #00A3E0' : 'none', cursor: testSelected !== -1 ? 'pointer' : 'not-allowed' }}>VALIDER</button>
            : <button onClick={avancerTest} style={{ padding:'13px 40px', borderRadius:'14px', border:'none', fontSize:'15px', fontWeight:'900', letterSpacing:'1px', textTransform:'uppercase', fontFamily:'inherit', background: optionCorrecte ? '#58CC02' : '#1CB0F6', boxShadow: optionCorrecte ? '0 4px 0 #46A302' : '0 4px 0 #00A3E0', color:'white', cursor:'pointer' }}>{isLast ? 'RÉSULTATS' : 'CONTINUER'}</button>
          }
        </div>
      </div>
    )
  }

  if (Q_CONFIG[ecran]) {
    const { label, data, val, set, back, next, pct } = Q_CONFIG[ecran]
    return (
      <div style={{ minHeight:'100vh', background:'#131f24', display:'flex', flexDirection:'column', fontFamily:"'Nunito','Segoe UI',sans-serif", color:'white' }}>
        <style>{`
          @keyframes br_talk { 0%,100%{transform:translateY(0) rotate(0deg)} 30%{transform:translateY(-8px) rotate(-3deg)} 70%{transform:translateY(-4px) rotate(2deg)} }
          @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
        `}</style>

        {/* Barre : ← + barre verte */}
        <div style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 32px' }}>
          <button onClick={() => goTo(back)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:'24px', cursor:'pointer', padding:0, lineHeight:1 }}>←</button>
          <div style={{ flex:1, height:'16px', background:'#1a2e35', borderRadius:'99px', overflow:'hidden' }}>
            <div style={{ height:'100%', width:pct, background:'#58CC02', borderRadius:'99px', transition:'width 0.4s ease' }} />
          </div>
        </div>

        {/* Logo à gauche + bulle message — indenté */}
        <div style={{ display:'flex', alignItems:'center', gap:'16px', padding:'30px 32px 0', paddingLeft:'90px' }}>
          <div style={{ animation:'br_talk 2s ease infinite', flexShrink:0 }}>
            <Brainius size={80} />
          </div>
          <div style={{ position:'relative', background:'#1a2e35', border:'2px solid #2a3d4a', borderRadius:'16px', padding:'14px 20px', maxWidth:'600px' }}>
            <div style={{ position:'absolute', right:'100%', top:'50%', transform:'translateY(-50%)', width:0, height:0, borderTop:'10px solid transparent', borderBottom:'10px solid transparent', borderRight:'14px solid #2a3d4a' }} />
            <p style={{ margin:0, fontSize:'19px', fontWeight:'800', color:'white', lineHeight:1.4 }}>
              {qTyped}
              {!qDone && <span style={{ animation:'blink 0.5s infinite', color:'#58CC02' }}>|</span>}
            </p>
          </div>
        </div>

        {/* Cartes 2×2 — alignées avec le début de la bulle */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', padding:'14px 200px 0', paddingLeft:`${90 + 80 + 16}px` }}>
          {data.map(opt => {
            const sel = val === opt.id
            return (
              <div key={opt.id} onClick={() => set(opt.id)} style={{
                display:'flex', alignItems:'center', gap:'18px',
                padding:'0 20px', height:'76px', borderRadius:'14px',
                border:`2px solid ${sel ? '#58CC02' : '#2a3d4a'}`,
                background: sel ? 'rgba(88,204,2,0.1)' : '#1a2e35',
                cursor:'pointer', transition:'border-color 0.15s, background 0.15s',
              }}>
                <span style={{ fontSize:'34px', flexShrink:0 }}>{opt.emoji}</span>
                <span style={{ fontWeight:'800', fontSize:'17px', color: sel ? '#58CC02' : 'white' }}>{opt.titre}</span>
              </div>
            )
          })}
        </div>

        {/* Footer : CONTINUER bas droite */}
        <div style={{ marginTop:'auto', padding:'16px 32px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'flex-end' }}>
          <button onClick={() => val && goTo(next)} disabled={!val} style={{
            padding:'13px 40px', borderRadius:'14px', border:'none',
            fontSize:'15px', fontWeight:'900', letterSpacing:'1px', textTransform:'uppercase',
            fontFamily:'inherit', cursor: val ? 'pointer' : 'not-allowed',
            background: val ? '#58CC02' : '#1a2e35',
            color: val ? 'white' : '#2a3d4a',
            boxShadow: val ? '0 4px 0 #46A302' : 'none',
          }}>CONTINUER</button>
        </div>
      </div>
    )
  }

  // ── RENDU PRINCIPAL ────────────────────────────────────────
  return (
    <div style={S.page}>
      <style>{`
        @keyframes br_excited { 0%,100%{transform:translateY(0) scale(1) rotate(0deg)} 25%{transform:translateY(-16px) scale(1.1) rotate(-5deg)} 75%{transform:translateY(-8px) scale(1.05) rotate(4deg)} }
        @keyframes br_talk    { 0%,100%{transform:translateY(0) rotate(0deg)} 30%{transform:translateY(-8px) rotate(-3deg)} 70%{transform:translateY(-4px) rotate(2deg)} }
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn     { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ════ ACCUEIL ════ */}
      {ecran === 'welcome' && (
        <div style={S.center}>
          <div style={{ animation: 'br_excited 2.5s ease infinite' }}><Brainius size={130} /></div>
          <h1 style={S.brand}>BrainQuest</h1>
          <p style={S.tagline}>Maîtrise SQL, NoSQL et Data Viz<br />en jouant !</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '40px', width: '100%', maxWidth: '360px' }}>
            <Btn onClick={() => goTo('choose_module')} color="#58CC02" shadow="#46A302">Commencer gratuitement</Btn>
            <BtnGhost onClick={() => goTo('connexion')}>J'ai déjà un compte</BtnGhost>
          </div>
        </div>
      )}

      {/* ════ CONNEXION ════ */}
      {ecran === 'connexion' && (
        <div style={S.card}>
          <button onClick={() => goTo('welcome')} style={S.back}>← Retour</button>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}><Brainius size={70} /></div>
          <h2 style={S.titre}>Bon retour ! 👋</h2>
          <p style={S.sub}>Connecte-toi pour continuer ton aventure</p>
          <form onSubmit={handleConnexion} style={{ marginTop: '24px' }}>
            <Input label="Email" type="email" name="email" value={form.email} onChange={ch} placeholder="ahmed@exemple.com" />
            <Input label="Mot de passe" type={showMdp ? 'text' : 'password'} name="mdp" value={form.mdp} onChange={ch} placeholder="Ton mot de passe" showToggle onToggle={() => setShowMdp(v => !v)} />
            {erreur && <div style={S.erreur}>{erreur}</div>}
            <div style={{ marginTop: '20px' }}>
              <Btn type="submit" disabled={chargement} color="#58CC02" shadow="#46A302">{chargement ? 'Connexion...' : 'Se connecter'}</Btn>
            </div>
          </form>
          <p style={S.switch}>Pas de compte ?{' '}<span onClick={() => goTo('choose_module')} style={S.lien}>S'inscrire</span></p>
        </div>
      )}

      {/* ════ CHOIX MODULE ════ */}
      {ecran === 'choose_module' && (
        <div style={S.center}>
          <h1 style={{ ...S.titre, fontSize: '26px', marginBottom: '8px' }}>Qu'est-ce que tu veux apprendre ?</h1>
          <p style={S.sub}>Choisis ton module de départ</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '32px', width: '100%', maxWidth: '480px' }}>
            {MODULES.map(mod => {
              const sel = moduleChoisi === mod.id
              return (
                <div key={mod.id} onClick={() => setModuleChoisi(mod.id)} style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: '20px 22px', borderRadius: '18px', border: `2px solid ${sel ? mod.couleur : '#2a3d4a'}`, background: sel ? mod.bg : '#1a2e35', boxShadow: sel ? `0 5px 0 ${mod.shadow}` : '0 5px 0 #10202a', cursor: 'pointer', transition: 'all 0.15s', transform: sel ? 'translateY(-2px)' : 'none' }}>
                  <span style={{ fontSize: '40px' }}>{mod.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: '900', fontSize: '18px', color: sel ? mod.couleur : 'white' }}>{mod.nom}</p>
                    <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>{mod.desc}</p>
                  </div>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: `2.5px solid ${mod.couleur}`, background: sel ? mod.couleur : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sel && <span style={{ color: 'white', fontSize: '14px', fontWeight: '900' }}>✓</span>}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: '28px', width: '100%', maxWidth: '480px' }}>
            <Btn onClick={() => moduleChoisi && goTo('brainius_intro')} disabled={!moduleChoisi} color="#58CC02" shadow="#46A302">CONTINUER →</Btn>
          </div>
          <p style={{ ...S.switch, marginTop: '20px' }}>Déjà un compte ?{' '}<span onClick={() => goTo('connexion')} style={S.lien}>Se connecter</span></p>
        </div>
      )}

      {/* ════ BRAINIUS INTRO (texte qui s'écrit) ════ */}
      {ecran === 'brainius_intro' && (
        <div style={S.center}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', maxWidth: '580px', width: '100%', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ animation: 'br_excited 2s ease infinite', flexShrink: 0 }}><Brainius size={110} /></div>
            <div style={S.bubble}>
              <div style={S.bubbleArrow} />
              <p style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: 'white', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                {typedText}
                {!introTypingDone && <span style={{ animation: 'blink 0.6s infinite', color: '#58CC02', fontWeight: '900' }}>|</span>}
              </p>
            </div>
          </div>
          {introTypingDone && (
            <div style={{ marginTop: '40px', animation: 'fadeIn 0.4s ease' }}>
              <Btn onClick={() => goTo('q_source')} color="#58CC02" shadow="#46A302" style={{ padding: '16px 64px', fontSize: '17px' }}>On y va ! →</Btn>
            </div>
          )}
        </div>
      )}


      {/* ════ CRÉATION DE COMPTE ════ */}
      {ecran === 'register_compte' && (
        <div style={S.card}>
          <button onClick={() => goTo('q_niveau')} style={S.back}>← Retour</button>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}><Brainius size={60} /></div>
          <h2 style={S.titre}>Crée ton compte 🎓</h2>
          <p style={S.sub}>Plus qu'une étape avant l'aventure !</p>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Input label="Ton prénom / nom" type="text" name="nom" value={form.nom} onChange={ch} placeholder="Ahmed Benali" />
            <Input label="Email" type="email" name="email" value={form.email} onChange={ch} placeholder="ahmed@exemple.com" />
            <Input label="Mot de passe" type={showMdp ? 'text' : 'password'} name="mdp" value={form.mdp} onChange={ch} placeholder="Minimum 6 caractères" showToggle onToggle={() => setShowMdp(v => !v)} />
            <Input label="Confirmer" type={showConfirm ? 'text' : 'password'} name="confirmer" value={form.confirmer} onChange={ch} placeholder="Répète ton mot de passe" showToggle onToggle={() => setShowConfirm(v => !v)} />
          </div>
          {erreur && <div style={S.erreur}>{erreur}</div>}
          <div style={{ marginTop: '20px' }}>
            <Btn onClick={() => {
              setErreur('')
              if (!form.nom.trim()) { setErreur("Ton nom est requis"); return }
              if (form.mdp.length < 6) { setErreur("Mot de passe : 6 caractères minimum"); return }
              if (form.mdp !== form.confirmer) { setErreur("Les mots de passe ne correspondent pas"); return }
              goTo('register_test_choice')
            }} color="#58CC02" shadow="#46A302">Continuer →</Btn>
          </div>
        </div>
      )}

      {/* ════ CHOIX TEST ════ */}
      {ecran === 'register_test_choice' && (
        <div style={S.card}>
          <button onClick={() => goTo('register_compte')} style={S.back}>← Retour</button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ animation: 'br_talk 2s ease infinite', display: 'inline-block' }}><Brainius size={80} /></div>
            <h2 style={{ ...S.titre, marginTop: '12px' }}>Test de placement 📝</h2>
            <p style={S.sub}>5 questions pour calibrer ton parcours — optionnel</p>
          </div>
          <div style={{ ...S.infoCard }}>
            {[['⏱️','Environ 3 minutes'],['📊','5 questions progressives'],['🎯','Ton parcours adapté selon le score'],['✅','Correction après chaque réponse']].map(([ico,txt]) => (
              <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>
                <span>{ico}</span><span>{txt}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            <Btn onClick={demarrerTest} color="#58CC02" shadow="#46A302">Je passe le test 🚀</Btn>
            <BtnGhost onClick={() => goTo('register_fin')}>Commencer directement →</BtnGhost>
          </div>
        </div>
      )}

      {/* ════ TEST DE PLACEMENT ════ */}
      {ecran === 'test' && (
        <div style={{ ...S.page, flexDirection: 'column' }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 32px' }}>
            <button onClick={() => goTo('register_test_choice')} style={S.back}>←</button>
            <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
              {TEST_QUESTIONS.map((_, i) => (
                <div key={i} style={{ flex: 1, height: '10px', borderRadius: '99px', background: i < testIndex ? '#58CC02' : i === testIndex ? '#84CC16' : '#1a2e35', transition: 'all 0.3s' }} />
              ))}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: '800' }}>{testIndex + 1}/{TEST_QUESTIONS.length}</span>
          </div>

          {/* Mascotte + question */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', padding: '8px 32px 0', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div style={{ animation: 'br_talk 2.2s ease infinite', flexShrink: 0, marginTop: '6px' }}><Brainius size={75} /></div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#CE82FF', background: 'rgba(206,130,255,0.15)', padding: '4px 12px', borderRadius: '99px' }}>{q.niveau}</span>
              <div style={{ ...S.bubble, marginTop: '10px' }}>
                <div style={S.bubbleArrow} />
                <p style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'white' }}>{q.question}</p>
              </div>
              <div style={{ background: '#0d1b24', border: '1px solid #2a3d4a', borderRadius: '10px', padding: '10px 14px', marginTop: '10px', fontFamily: 'monospace', fontSize: '13px', color: '#84CC16' }}>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contexte — </span>{q.context}
              </div>
            </div>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px 32px', maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            {q.options.map((opt, i) => {
              const sel = testSelected === i
              let bg = '#1a2e35', border = '#2a3d4a', shadow = '#10202a', color = 'rgba(255,255,255,0.85)'
              if (testFeedback) {
                if (opt.correct)   { bg = 'rgba(88,204,2,0.12)'; border = '#58CC02'; shadow = '#46A302'; color = '#58CC02' }
                else if (sel)      { bg = 'rgba(255,75,75,0.12)'; border = '#FF4B4B'; shadow = '#CC2222'; color = '#FF4B4B' }
              } else if (sel) { bg = 'rgba(28,176,246,0.1)'; border = '#1CB0F6'; shadow = '#00A3E0' }
              return (
                <div key={i} onClick={() => !testFeedback && setTestSelected(i)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 18px', borderRadius: '14px', border: `2px solid ${border}`, background: bg, boxShadow: `0 4px 0 ${shadow}`, cursor: testFeedback ? 'default' : 'pointer', transition: 'all 0.12s' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: '700', color, flex: 1 }}>{opt.text}</span>
                  {testFeedback && opt.correct && <span style={{ fontSize: '20px' }}>✅</span>}
                  {testFeedback && sel && !opt.correct && <span style={{ fontSize: '20px' }}>❌</span>}
                </div>
              )
            })}
          </div>

          {/* Feedback */}
          {testFeedback && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0 32px', padding: '14px 18px', borderRadius: '14px', background: optionCorrecte ? 'rgba(88,204,2,0.1)' : 'rgba(255,75,75,0.1)', border: `2px solid ${optionCorrecte ? '#58CC02' : '#FF4B4B'}` }}>
              <span style={{ fontSize: '22px' }}>{optionCorrecte ? '🎉' : '💡'}</span>
              <div>
                <p style={{ margin: 0, fontWeight: '800', color: optionCorrecte ? '#58CC02' : '#FF4B4B' }}>{optionCorrecte ? 'Bonne réponse !' : 'Pas tout à fait...'}</p>
                {!optionCorrecte && <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>La bonne réponse est en vert</p>}
              </div>
            </div>
          )}

          {/* Bouton */}
          <div style={{ marginTop: 'auto', padding: '20px 32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end' }}>
            {!testFeedback
              ? <button onClick={() => setTestFeedback(true)} disabled={testSelected === -1} style={{ padding: '14px 44px', borderRadius: '14px', border: 'none', fontSize: '15px', fontWeight: '900', fontFamily: 'inherit', background: testSelected !== -1 ? '#1CB0F6' : '#1a2e35', boxShadow: testSelected !== -1 ? '0 5px 0 #00A3E0' : '0 5px 0 #10202a', color: testSelected !== -1 ? 'white' : '#2a3d4a', cursor: testSelected !== -1 ? 'pointer' : 'not-allowed' }}>VALIDER →</button>
              : <button onClick={avancerTest} style={{ padding: '14px 44px', borderRadius: '14px', border: 'none', fontSize: '15px', fontWeight: '900', fontFamily: 'inherit', background: optionCorrecte ? '#58CC02' : '#1CB0F6', boxShadow: optionCorrecte ? '0 5px 0 #46A302' : '0 5px 0 #00A3E0', color: 'white', cursor: 'pointer' }}>{testIndex + 1 >= TEST_QUESTIONS.length ? 'VOIR MES RÉSULTATS →' : 'CONTINUER →'}</button>
            }
          </div>
        </div>
      )}

      {/* ════ FIN INSCRIPTION ════ */}
      {ecran === 'register_fin' && (
        <div style={{ ...S.card, textAlign: 'center' }}>
          <div style={{ animation: 'br_excited 2s ease infinite', display: 'inline-block' }}><Brainius size={90} /></div>
          <div style={{ fontSize: '40px', margin: '8px 0' }}>{finMsg.emoji}</div>
          <h2 style={{ ...S.titre, color: finMsg.couleur, fontSize: '22px' }}>{finMsg.titre}</h2>
          <p style={S.sub}>{finMsg.sub}</p>
          {testScore !== null && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', margin: '14px 0' }}>
              {TEST_QUESTIONS.map((_, i) => (
                <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: testScores[i] ? '#58CC02' : '#FF4B4B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'white', fontWeight: '900' }}>
                  {testScores[i] ? '✓' : '✗'}
                </div>
              ))}
            </div>
          )}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '14px 18px', margin: '16px 0', border: '1px solid #2a3d4a', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              [MODULES.find(m=>m.id===moduleChoisi)?.emoji, MODULES.find(m=>m.id===moduleChoisi)?.nom],
              [NIVEAUX.find(n=>n.id===niveauChoisi)?.emoji, NIVEAUX.find(n=>n.id===niveauChoisi)?.titre],
              [OBJECTIFS.find(o=>o.id===objectifJour)?.emoji, OBJECTIFS.find(o=>o.id===objectifJour)?.titre],
              ['👤', form.nom],
            ].map(([ico, txt]) => ico && txt && (
              <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>
                <span>{ico}</span><span>{txt}</span>
              </div>
            ))}
          </div>
          {erreur && <div style={S.erreur}>{erreur}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            <Btn onClick={handleInscription} disabled={chargement} color={finMsg.couleur} shadow="#46A302">{chargement ? 'Création...' : "C'est parti ! 🚀"}</Btn>
            <BtnGhost onClick={() => goTo('register_test_choice')}>← Modifier</BtnGhost>
          </div>
        </div>
      )}

      {/* ════ SUCCÈS ════ */}
      {ecran === 'succes' && (
        <div style={{ ...S.center }}>
          <div style={{ fontSize: '90px', lineHeight: 1 }}>✅</div>
          <h2 style={{ ...S.titre, color: '#58CC02', fontSize: '28px', marginTop: '16px' }}>Compte créé !</h2>
          <p style={S.sub}>Bienvenue dans BrainQuest, <strong style={{ color: 'white' }}>{form.nom}</strong> ! 🎉</p>
          <p style={{ ...S.sub, marginTop: '8px' }}>Redirection vers ton parcours...</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '28px 0' }}>
            {[0,1,2].map(i => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#58CC02', opacity: 0.3 + i * 0.35 }} />)}
          </div>
          <Btn onClick={() => navigate('/monde')} color="#58CC02" shadow="#46A302">Commencer l'aventure !</Btn>
        </div>
      )}
    </div>
  )
}

// ── COMPOSANTS UI ─────────────────────────────────────────────
function Btn({ children, onClick, disabled, color = '#58CC02', shadow = '#46A302', type = 'button' }) {
  const [p, setP] = useState(false)
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseDown={() => !disabled && setP(true)} onMouseUp={() => setP(false)} onMouseLeave={() => setP(false)}
      style={{ width: '100%', padding: '15px 16px', borderRadius: '16px', background: disabled ? '#1a2e35' : color, border: 'none', boxShadow: p || disabled ? 'none' : `0 4px 0 ${disabled ? '#10202a' : shadow}`, transform: p ? 'translateY(4px)' : 'none', color: disabled ? '#2a3d4a' : 'white', fontSize: '15px', fontWeight: '900', letterSpacing: '0.8px', textTransform: 'uppercase', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'transform 0.06s, box-shadow 0.06s', outline: 'none' }}
    >{children}</button>
  )
}

function BtnGhost({ children, onClick }) {
  const [p, setP] = useState(false)
  return (
    <button onClick={onClick} onMouseDown={() => setP(true)} onMouseUp={() => setP(false)} onMouseLeave={() => setP(false)}
      style={{ width: '100%', padding: '14px 16px', borderRadius: '16px', background: 'transparent', border: '2px solid #2a3d4a', boxShadow: p ? 'none' : '0 4px 0 #10202a', transform: p ? 'translateY(4px)' : 'none', color: 'rgba(255,255,255,0.45)', fontSize: '15px', fontWeight: '900', letterSpacing: '0.8px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'transform 0.06s, box-shadow 0.06s', outline: 'none' }}
    >{children}</button>
  )
}

function Input({ label, type = 'text', name, value, onChange, placeholder, showToggle, onToggle }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '12px' }}>
      {label && <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.4)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width: '100%', padding: '13px 16px', paddingRight: showToggle ? '48px' : '16px', borderRadius: '12px', border: `2px solid ${focused ? '#58CC02' : '#2a3d4a'}`, fontSize: '15px', color: 'white', background: '#0d1b24', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }} />
        {showToggle && (
          <button type="button" onClick={onToggle} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: 0 }}>
            {type === 'password' ? '👁️' : '🙈'}
          </button>
        )}
      </div>
    </div>
  )
}

// ── STYLES ────────────────────────────────────────────────────
const S = {
  page:   { minHeight: '100vh', background: '#131f24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito','Segoe UI',sans-serif", color: 'white', flexDirection: 'row' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 24px', textAlign: 'center', width: '100%' },
  card:   { background: '#1a2e35', borderRadius: '24px', padding: '32px 28px', width: '100%', maxWidth: '420px', border: '1px solid #2a3d4a', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', margin: '20px auto' },
  brand:  { fontSize: '32px', fontWeight: '900', background: 'linear-gradient(135deg,#a78bfa,#58CC02)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '12px 0 8px' },
  tagline:{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', lineHeight: 1.6, margin: 0, fontWeight: '600' },
  titre:  { fontSize: '22px', fontWeight: '900', color: 'white', margin: '0 0 6px' },
  sub:    { color: 'rgba(255,255,255,0.45)', fontSize: '14px', fontWeight: '600', margin: 0 },
  back:   { background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '20px', cursor: 'pointer', padding: '0 0 16px', display: 'block', fontFamily: 'inherit' },
  erreur: { color: '#FF4B4B', fontSize: '13px', fontWeight: '700', background: 'rgba(255,75,75,0.1)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255,75,75,0.3)', marginTop: '10px', textAlign: 'center' },
  switch: { textAlign: 'center', marginTop: '20px', color: 'rgba(255,255,255,0.35)', fontSize: '14px', fontWeight: '600' },
  lien:   { color: '#58CC02', fontWeight: '800', cursor: 'pointer' },
  infoCard: { background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '14px 16px', marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #2a3d4a' },
  bubble: { position: 'relative', background: '#1a2e35', border: '2px solid #2a3d4a', borderRadius: '18px', padding: '16px 20px' },
  bubbleArrow: { position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '14px solid #2a3d4a', marginRight: '2px' },
}