import {CALL_AWS, Schemas} from '../middleware/aws.js'
/* LIST_TABLES ACTIONS */
export const LIST_TABLES_REQUEST = 'LIST_TABLES_REQUEST'
export const LIST_TABLES_SUCCESS = 'LIST_TABLES_SUCCESS'
export const LIST_TABLES_ERROR = 'LIST_TABLES_ERROR'
/**
 * Action to call DynamoDB listItems() method.
 * Relies on the custom AWS middleware defined in ../middleware/aws.js
 * @param  {Number} limit             Limit the number of returned tables.
 * @param  {String} exclusiveStartKey Name of the last evaluated table.
 *                                    Useful to implement pagination.
 * @return {ReduxAction} 
 */
const callListTables = ({limit, exclusiveStartKey}) => ({
  [CALL_AWS]: {
    types: [LIST_TABLES_REQUEST, LIST_TABLES_SUCCESS, LIST_TABLES_ERROR],
    method: 'listTables',
    schema: Schemas.TABLE_ARRAY,
    limit,
    exclusiveStartKey
  }
})
/**
 * Calls DynamoDB listItems() method.
 * Relies on Redux Thunk middleware.
 * @param  {Object} params DynamoDB listItems() call options.
 * @return {ThunkAction}
 */
export const listTables = (params={}) => dispatch => dispatch(callListTables(params))
/* DESCRIBE_TABLE ACTIONS */
export const DESCRIBE_TABLE_REQUEST = 'DESCRIBE_TABLE_REQUEST'
export const DESCRIBE_TABLE_SUCCESS = 'DESCRIBE_TABLE_SUCCESS'
export const DESCRIBE_TABLE_ERROR = 'DESCRIBE_TABLE_ERROR'
/**
 * Action to call DynamoDB describeTable() method.
 * Relies on the custom AWS middleware defined in ../middleware/aws.js
 * @param  {String}  tableName  Name of the table.
 * @return {ReduxAction} 
 */
const callDescribeTable = ({tableName}) => ({
  [CALL_AWS]: {
    types: [DESCRIBE_TABLE_REQUEST, DESCRIBE_TABLE_SUCCESS, DESCRIBE_TABLE_ERROR],
    method: 'describeTable',
    schema: Schemas.TABLE,
    tableName,
  }
})
/**
 * Calls DynamoDB describeTable() method.
 * Relies on Redux Thunk middleware.
 * @param  {Object} params DynamoDB listItems() call options.
 * @return {ThunkAction}
 */
export const describeTable = (params={}) => dispatch => dispatch(callDescribeTable(params))
