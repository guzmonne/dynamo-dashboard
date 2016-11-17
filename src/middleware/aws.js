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
const validAWSMethods = ['listTables']

const tableSchema = new Schema('tables', {
  idAttribute: table => table.TableName
})

export const Schemas = {
  TABLE: tableSchema,
  TABLE_ARRAY: arrayOf(tableSchema),
}

const buildListTablesParams = ({limit, exclusiveStartKey}) => {
  const params = {}
  if (limit !== 0 && isNumber(limit))
    params.Limit = limit
  if (isString(exclusiveStartKey))
    params.ExclusiveStartTableName = exclusiveStartKey
  return params
}

const buildParams = ({method, ...rest}) => {
  switch(method){
    case 'listTables':
      return buildListTablesParams(rest)
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
    if (method === 'listTables')
      return next(actionWith({
        type: successType,
        response: normalize(response.TableNames.map(TableName => ({TableName})), schema),
        lastEvaluatedKey: response.LastEvaluatedTableName,
      }))
    return next(actionWith({
      response,
      type: successType,
    }))
  })
  .catch(error => {
    console.error(error)
    next(actionWith({
      error,
      type: failureType,
    }))
  })
  /*
  .on('success', (response) => {
    if (method === 'listTables')
      return next(actionWith({
        response: normalize(response.TableNames.map(TableName => ({TableName})), schema),
        lastEvaluatedKey: response.LastEvaluatedTableName,
      }))
    return next(actionWith({
      response,
      type: successType,
    }))
  })
  .on('error', (error) => next(actionWith({
    error,
    type: failureType,
  })))
  .send()
  */
}