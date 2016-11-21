// Select table action
export const SELECT_TABLE = 'SELECT_TABLE'
// Select table action creator
export const selectTable = (tableName) => ({
  type: SELECT_TABLE,
  tableName,
})
// Update ui action.
export const TABLES_UPDATE_UI = 'TABLES_UPDATE_UI'
// Update ui action creator.
export const tablesUpdateUi = (ui) => ({
  type: TABLES_UPDATE_UI,
  ui,
})