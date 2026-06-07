import { useState, useEffect, useRef } from 'react'

const API = 'http://localhost:8000'

const LABELS_INDICE = ['', 'Indice 1 — Piste générale', 'Indice 2 — Syntaxe ciblée', 'Indice 3 — Structure guidée']
const COULEURS_INDICE = ['', '#6366F1', '#8B5CF6', '#A855F7']

function TypingDots() {
  return (
    <div style={styles.typingWrap}>
      <div style={styles.typingBubble}>
        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
            40%            { transform: translateY(-6px); opacity: 1; }
          }
        `}</style>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ ...styles.dot, animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}

function Message({ msg }) {
  if (msg.role === 'erreur') {
    return (
      <div style={styles.msgErreurWrap}>
        <div style={styles.msgErreur}>
          <span style={styles.msgErreurLabel}>⚠ Ton erreur SQL</span>
          <p style={styles.msgErreurTexte}>{msg.content}</p>
        </div>
      </div>
    )
  }

  const couleur = COULEURS_INDICE[msg.niveau] || '#6366F1'

  return (
    <div style={styles.msgAIWrap}>
      <div style={styles.avatar}>🤖</div>
      <div style={styles.msgAICorps}>
        <span style={{ ...styles.msgNiveauLabel, background: couleur }}>
          {LABELS_INDICE[msg.niveau]}
        </span>
        <div style={{ ...styles.msgAIBulle, borderColor: couleur + '55' }}>
          <p style={styles.msgAITexte}>{msg.content}</p>
        </div>
      </div>
    </div>
  )
}

export default function TutorChat({ requete, erreur, token, onClose }) {
  const [messages,     setMessages]     = useState([])
  const [niveauActuel, setNiveauActuel] = useState(0)
  const [chargement,   setChargement]   = useState(false)
  const [visible,      setVisible]      = useState(false)
  const bas = useRef(null)

  useEffect(() => {
    setMessages([{ role: 'erreur', content: erreur }])
    setTimeout(() => setVisible(true), 30)
  }, [erreur])

  useEffect(() => {
    bas.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chargement])

  const demanderIndice = async () => {
    const niveau = niveauActuel + 1
    setChargement(true)

    try {
      const res = await fetch(`${API}/tutor/indice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requete, erreur, niveau_indice: niveau }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail)

      setMessages(prev => [...prev, { role: 'ai', content: data.indice, niveau }])
      setNiveauActuel(niveau)
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `Désolé, le tuteur IA est indisponible : ${e.message}`,
        niveau: niveau,
      }])
    } finally {
      setChargement(false)
    }
  }

  const fermer = () => {
    setVisible(false)
    setTimeout(onClose, 350)
  }

  const indicesFinis = niveauActuel >= 3

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeUp {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes gradientShift {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
        .msg-fadein { animation: fadeUp 0.4s ease forwards; }
      `}</style>

      {/* Overlay flou */}
      <div style={{ ...styles.overlay, opacity: visible ? 1 : 0 }} onClick={fermer} />

      {/* Panneau principal */}
      <div style={{
        ...styles.panneau,
        animation: visible ? 'slideIn 0.35s cubic-bezier(.22,.68,0,1.2)' : 'slideOut 0.3s ease',
      }}>

        {/* Gradient border animé en haut */}
        <div style={styles.gradientBar} />

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerGauche}>
            <div style={styles.avatarHeader}>
              <span style={{ fontSize: '22px' }}>🤖</span>
              <div style={styles.onlineDot} />
            </div>
            <div>
              <p style={styles.headerTitre}>Tuteur IA</p>
              <p style={styles.headerSous}>DataQuest · Powered by Claude</p>
            </div>
          </div>
          <button style={styles.btnFermer} onClick={fermer}>✕</button>
        </div>

        {/* Progression indices */}
        <div style={styles.progression}>
          {[1, 2, 3].map(n => (
            <div key={n} style={styles.etapeWrap}>
              <div style={{
                ...styles.etape,
                background: n <= niveauActuel ? COULEURS_INDICE[n] : 'rgba(255,255,255,0.08)',
                boxShadow: n <= niveauActuel ? `0 0 10px ${COULEURS_INDICE[n]}88` : 'none',
              }}>
                {n <= niveauActuel ? '✓' : n}
              </div>
              <span style={{ ...styles.etapeLabel, color: n <= niveauActuel ? COULEURS_INDICE[n] : 'rgba(255,255,255,0.3)' }}>
                Indice {n}
              </span>
              {n < 3 && <div style={{ ...styles.etapeLigne, background: n < niveauActuel ? COULEURS_INDICE[n] : 'rgba(255,255,255,0.08)' }} />}
            </div>
          ))}
        </div>

        {/* Messages */}
        <div style={styles.messages}>
          {messages.map((msg, i) => (
            <div key={i} className="msg-fadein" style={{ animationDelay: `${i * 0.05}s` }}>
              <Message msg={msg} />
            </div>
          ))}
          {chargement && <TypingDots />}
          <div ref={bas} />
        </div>

        {/* Footer / bouton */}
        <div style={styles.footer}>
          {!indicesFinis ? (
            <button
              style={{ ...styles.btnIndice, opacity: chargement ? 0.6 : 1 }}
              onClick={demanderIndice}
              disabled={chargement}
            >
              {chargement
                ? 'Le tuteur réfléchit...'
                : niveauActuel === 0
                  ? '💡 Demander un indice'
                  : `💡 Indice suivant (${niveauActuel + 1}/3)`}
            </button>
          ) : (
            <div style={styles.finMsg}>
              ✅ Tu as reçu les 3 indices. Retourne à ton éditeur et essaie !
            </div>
          )}
          <p style={styles.footerNote}>
            Le tuteur ne donne jamais la réponse directement — il te guide.
          </p>
        </div>
      </div>
    </>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(2px)',
    zIndex: 1000,
    transition: 'opacity 0.3s',
  },
  panneau: {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
    width: '420px',
    background: 'rgba(12, 12, 28, 0.97)',
    backdropFilter: 'blur(24px)',
    borderLeft: '1px solid rgba(255,255,255,0.08)',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  gradientBar: {
    height: '3px',
    background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #A855F7, #EC4899, #6366F1)',
    backgroundSize: '300% 300%',
    animation: 'gradientShift 3s ease infinite',
    flexShrink: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  headerGauche: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatarHeader: {
    position: 'relative',
    width: '44px',
    height: '44px',
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px #6366F144',
  },
  onlineDot: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '10px',
    height: '10px',
    background: '#10B981',
    borderRadius: '50%',
    border: '2px solid rgba(12,12,28,0.97)',
  },
  headerTitre: { color: 'white', fontWeight: '700', fontSize: '15px', margin: 0 },
  headerSous: { color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 },
  btnFermer: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.6)',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progression: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 20px',
    gap: '0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  etapeWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  etape: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: 'white',
    transition: 'all 0.4s ease',
    flexShrink: 0,
  },
  etapeLabel: {
    fontSize: '11px',
    fontWeight: '600',
    transition: 'color 0.4s ease',
    whiteSpace: 'nowrap',
  },
  etapeLigne: {
    width: '24px',
    height: '2px',
    borderRadius: '1px',
    transition: 'background 0.4s ease',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(255,255,255,0.1) transparent',
  },

  // Bulle erreur
  msgErreurWrap: { display: 'flex', justifyContent: 'flex-end' },
  msgErreur: {
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '12px 4px 12px 12px',
    padding: '12px 14px',
    maxWidth: '85%',
  },
  msgErreurLabel: {
    color: '#F87171',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '6px',
  },
  msgErreurTexte: { color: '#FCA5A5', fontSize: '12px', margin: 0, fontFamily: 'monospace', lineHeight: '1.5' },

  // Bulle IA
  msgAIWrap: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
  avatar: {
    width: '34px',
    height: '34px',
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },
  msgAICorps: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' },
  msgNiveauLabel: {
    display: 'inline-block',
    color: 'white',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    padding: '3px 8px',
    borderRadius: '99px',
    alignSelf: 'flex-start',
  },
  msgAIBulle: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid',
    borderRadius: '4px 12px 12px 12px',
    padding: '12px 14px',
  },
  msgAITexte: { color: 'rgba(255,255,255,0.88)', fontSize: '13px', margin: 0, lineHeight: '1.7' },

  // Typing dots
  typingWrap: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
  typingBubble: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '4px 12px 12px 12px',
    padding: '14px 18px',
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
    marginLeft: '44px',
  },
  dot: {
    display: 'inline-block',
    width: '7px',
    height: '7px',
    background: '#8B5CF6',
    borderRadius: '50%',
    animation: 'bounce 1.2s ease infinite',
  },

  // Footer
  footer: {
    padding: '16px 20px 24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  btnIndice: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 20px #6366F144',
    transition: 'opacity 0.2s',
  },
  finMsg: {
    background: 'rgba(16,185,129,0.12)',
    border: '1px solid rgba(16,185,129,0.3)',
    color: '#6EE7B7',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'center',
  },
  footerNote: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: '11px',
    textAlign: 'center',
    margin: 0,
  },
}
