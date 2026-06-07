import { useEffect, useState } from 'react'

export default function RewardAnimation({ recompenses, onClose }) {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)

  const items = []
  if (recompenses?.nouveau_niveau) {
    items.push({
      type: 'niveau',
      icone: recompenses.niveau?.icone ?? '⬆️',
      titre: 'Niveau supérieur !',
      message: `Tu es maintenant ${recompenses.niveau?.nom}`,
      couleur: recompenses.niveau?.couleur ?? '#10B981',
    })
  }
  for (const badge of recompenses?.nouveaux_badges ?? []) {
    items.push({
      type: 'badge',
      icone: badge.icone,
      titre: 'Badge débloqué !',
      message: badge.nom,
      sousTitre: badge.description,
      couleur: '#F59E0B',
    })
  }

  useEffect(() => {
    if (items.length === 0) { onClose(); return }
    const timer = setTimeout(() => {
      if (index < items.length - 1) {
        setIndex(i => i + 1)
      } else {
        setVisible(false)
        setTimeout(onClose, 400)
      }
    }, 2800)
    return () => clearTimeout(timer)
  }, [index, items.length])

  if (!visible || items.length === 0) return null

  const item = items[index]

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.carte, borderColor: item.couleur, animation: 'popIn 0.4s ease' }}>
        <style>{`
          @keyframes popIn {
            from { transform: scale(0.5); opacity: 0; }
            to   { transform: scale(1);   opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50%       { transform: scale(1.15); }
          }
        `}</style>

        {/* Indicateur pagination */}
        {items.length > 1 && (
          <div style={styles.pagination}>
            {items.map((_, i) => (
              <div
                key={i}
                style={{ ...styles.point, background: i === index ? item.couleur : 'rgba(255,255,255,0.3)' }}
              />
            ))}
          </div>
        )}

        <div style={{ ...styles.iconeZone, background: `${item.couleur}22`, animation: 'pulse 1.5s ease infinite' }}>
          <span style={styles.icone}>{item.icone}</span>
        </div>

        <div style={{ ...styles.badge, background: item.couleur }}>
          {item.titre}
        </div>

        <p style={styles.message}>{item.message}</p>
        {item.sousTitre && <p style={styles.sousTitre}>{item.sousTitre}</p>}

        <button style={{ ...styles.btn, background: item.couleur }} onClick={() => {
          if (index < items.length - 1) {
            setIndex(i => i + 1)
          } else {
            setVisible(false)
            setTimeout(onClose, 400)
          }
        }}>
          {index < items.length - 1 ? 'Suivant ➡' : 'Super ! ✓'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  carte: {
    background: '#1A1A2E',
    border: '2px solid',
    borderRadius: '20px',
    padding: '36px 40px',
    textAlign: 'center',
    maxWidth: '340px',
    width: '90%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    position: 'relative',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '16px',
  },
  point: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'background 0.3s',
  },
  iconeZone: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  icone: { fontSize: '44px', lineHeight: 1 },
  badge: {
    display: 'inline-block',
    color: 'white',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    padding: '4px 12px',
    borderRadius: '99px',
    marginBottom: '12px',
  },
  message: {
    color: 'white',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 6px',
  },
  sousTitre: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    margin: '0 0 20px',
  },
  btn: {
    marginTop: '16px',
    color: 'white',
    border: 'none',
    padding: '11px 28px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
}
