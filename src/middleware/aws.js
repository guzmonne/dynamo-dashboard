import { Schema, arrayOf, normalize } from 'normalizr'
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
// Import AWS
const AWS = require('aws-sdk')
// AWS Config
const credentials = new AWS.Credentials('accessKeyId', 'secretAccessKey', 'sessionToken')
AWS.config.update({
  credentials,
  region: 'us-east-1',
})
// DynamoDB
const DynamoDB = new AWS.DynamoDB({
  endpoint: new AWS.Endpoint('http://localhost:8000')
})
// Action key that carries the call info by this Redux middleware
export const CALL_AWS = Symbol('Call AWS')
// Valid AWS Methods that can be called. They must be passes as the
// method value inside the action call.
const validAWSMethods = ['listTables', 'describeTable']
/**
 * Table Schema
 */
const tableSchema = new Schema('tables', {
  idAttribute: table => table.TableName
})
/** Schemas */
export const Schemas = {
  TABLE: tableSchema,
  TABLE_ARRAY: arrayOf(tableSchema),
}
/**
 * Takes in a config object and returns a valid DynamoDB object to 
 * call DynamoDB listItems() method.
 * @param  {Object} config  Configuration object.
 * @param  {Number} config.limit   Number to limit the lenght of the result.
 * @param  {String|Object} config.exclusiveStartKey  Sets the first key from
 *                                            which DynamoDB will query
 *                                            a table.
 * @return {Object} Valid DynamoDB params object.
 */
const buildListTablesParams = ({limit, exclusiveStartKey, tableName}) => {
  const params = {}
  if (limit !== 0 && isNumber(limit))
    params.Limit = limit
  if (isString(exclusiveStartKey))
    params.ExclusiveStartTableName = exclusiveStartKey
  if (isString(tableName))
    params.TableName = tableName
  return params
}
/**
 * Takes in a config object and returns a valid DynamoDB object to 
 * call DynamoDB describeTable() method.
 * @param  {Object} config             Configuration object.
 * @param  {String} config.tableName   Name of the target function.
 * @return {Object} Valid DynamoDB params object.
 */
const buildDescribeTableParams = ({tableName}) => {
  console.log(tableName)
  const params = {}
  if (isString(tableName))
    params.TableName = tableName
  return params
}
/**
 * Call the appropiate build function to construct the params object
 * needed to call the DynamoDB method identified by the method value.
 * @param  {String} method  DynamDB method name.
 * @param  {Any} ...rest    Any other config values.
 * @return {Object} Valid DynamoDB params object. 
 */
const buildParams = ({method, ...rest}) => {
  switch(method){
    case 'listTables':
      return buildListTablesParams(rest)
    case 'describeTable':
      return buildDescribeTableParams(rest)
    default:
      return
  }
}
/**
 * A redux middleware that interprets actions with CALL_AWS info 
 * specified. Performs the call to the DynamoDB local process 
 * using the AWS JavaScript SDK, and promises when such actions
 * are dispatched.
 */
export default store => next => action => {
  const callAWS = action[CALL_AWS]
  if (typeof callAWS === 'undefined')
    return next(action)
  const {method, types, schema} = callAWS
  if (!isString(method))
    throw new Error('Specify a string method to call.')
  if (validAWSMethods.indexOf(method) === -1)
    throw new Error('Invalid DynamoDB method to call' +
      `${method} was given when only: ${JSON.stringify(validAWSMethods)} are valid.`
    )
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
  console.log(callAWS)
  const params = buildParams(callAWS)
  if (!params)
    throw new Error('Invalid arguments. Unable to build params.')
  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_AWS]
    return finalAction
  }
  const [requestType, successType, failureType] = types
  next(actionWith({type: requestType}))
  DynamoDB[method](params)
  .promise()
  .then(response => {
    const options = {}
    if (method === 'listTables') {
      options.lastEvaluatedKey = response.LastEvaluatedTableName
      response = response.TableNames.map(TableName => ({TableName}))
    }
    if (method === 'describeTable') {
      response = response.Table
    }
    next(actionWith(Object.assign({}, {
      response: normalize(response, schema),
      type: successType,
    }, options)))
  })
  .catch(error => {
    console.error(error)
    next(actionWith({
      error,
      type: failureType,
    }))
  })
}