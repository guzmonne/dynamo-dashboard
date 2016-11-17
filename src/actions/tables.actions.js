// Select table action
export const SELECT_TABLE = 'SELECT_TABLE'
// Select table action creator
export const selectTable = (tableName) => ({
  type: SELECT_TABLE,
  tableName,
})