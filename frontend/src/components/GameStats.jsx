export default function GameStats({ xp, niveau, xpProchain, nbBadges }) {
  const xpMin = niveau?.xp_min ?? 0
  const xpMax = xpProchain ?? xpMin + 500
  const progression = xpMax > xpMin
    ? Math.min(100, Math.round(((xp - xpMin) / (xpMax - xpMin)) * 100))
    : 100

  return (
    <div style={styles.conteneur}>
      {/* Niveau */}
      <div style={styles.niveauBox}>
        <span style={styles.icone}>{niveau?.icone}</span>
        <span style={{ ...styles.niveauNom, color: niveau?.couleur }}>{niveau?.nom}</span>
      </div>

      {/* Barre XP */}
      <div style={styles.xpZone}>
        <div style={styles.xpTexte}>
          <span style={styles.xpValeur}>{xp} XP</span>
          {xpProchain && (
            <span style={styles.xpMax}>/ {xpProchain}</span>
          )}
        </div>
        <div style={styles.barreContenant}>
          <div style={{ ...styles.barreFill, width: `${progression}%`, background: niveau?.couleur }} />
        </div>
      </div>

      {/* Badges */}
      <div style={styles.badgesBox}>
        <span style={styles.badgeIcone}>🏅</span>
        <span style={styles.badgeCount}>{nbBadges}</span>
      </div>
    </div>
  )
}

const styles = {
  conteneur: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '6px 14px',
  },
  niveauBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  icone: { fontSize: '16px' },
  niveauNom: {
    fontSize: '13px',
    fontWeight: '700',
  },
  xpZone: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    minWidth: '120px',
  },
  xpTexte: {
    display: 'flex',
    gap: '4px',
    alignItems: 'baseline',
  },
  xpValeur: {
    color: 'white',
    fontSize: '12px',
    fontWeight: '700',
  },
  xpMax: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '11px',
  },
  barreContenant: {
    height: '5px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '99px',
    overflow: 'hidden',
  },
  barreFill: {
    height: '100%',
    borderRadius: '99px',
    transition: 'width 0.6s ease',
  },
  badgesBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  badgeIcone: { fontSize: '14px' },
  badgeCount: {
    color: 'white',
    fontSize: '13px',
    fontWeight: '700',
  },
}
