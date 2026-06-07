// Composant qui affiche les résultats SQL dans un tableau
export default function ResultTable({ colonnes, lignes }) {
  if (!colonnes || colonnes.length === 0) return null

  return (
    <div style={styles.conteneur}>
      <table style={styles.table}>

        {/* En-tête : noms des colonnes */}
        <thead>
          <tr>
            {colonnes.map((col, i) => (
              <th key={i} style={styles.th}>{col}</th>
            ))}
          </tr>
        </thead>

        {/* Corps : les données */}
        <tbody>
          {lignes.length === 0 ? (
            <tr>
              <td colSpan={colonnes.length} style={styles.videMessage}>
                Aucun résultat trouvé
              </td>
            </tr>
          ) : (
            lignes.map((ligne, i) => (
              <tr key={i} style={i % 2 === 0 ? styles.trPair : styles.trImpair}>
                {ligne.map((cellule, j) => (
                  <td key={j} style={styles.td}>
                    {cellule === null
                      ? <span style={styles.null}>NULL</span>
                      : String(cellule)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  conteneur: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1.5px solid #E5E7EB',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    background: '#1F3864',
    color: 'white',
    padding: '10px 16px',
    textAlign: 'left',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    fontSize: '13px',
  },
  trPair:   { background: 'white' },
  trImpair: { background: '#F8FAFC' },
  td: {
    padding: '9px 16px',
    borderBottom: '1px solid #F3F4F6',
    color: '#374151',
    whiteSpace: 'nowrap',
  },
  null: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    fontSize: '12px',
  },
  videMessage: {
    textAlign: 'center',
    padding: '20px',
    color: '#9CA3AF',
    fontStyle: 'italic',
  }
}
