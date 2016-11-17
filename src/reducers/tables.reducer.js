import * as ActionTypes from '../actions/'
import union from 'lodash/union'

export default (state = {
  ids: [],
  selectedTable: undefined,
  exclusiveStartKey: undefined, /* Not used yet! */
  limit: 10,               /* Not used yet! */
}, action) => {
  switch(action.type){
    case ActionTypes.LIST_TABLES_SUCCESS:
      return {
        ...state,
        ids: union(state.ids, action.response.result),
        exclusiveStartKey: action.lastEvaluatedKey,
      }
    case ActionTypes.SELECT_TABLE:
      return {
        ...state,
        selectedTable: action.tableName,
      }
    default:
      return state
  }
}
