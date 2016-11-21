import at from 'lodash/at'
import set from 'lodash/set'
import isEmpty from 'lodash/isEmpty'
import isBoolean from 'lodash/isBoolean'
import isArray from 'lodash/isArray'
import isNumber from 'lodash/isNumber'
import isObject from 'lodash/isObject'
import _merge from 'lodash/merge'

const Validate = function(_values, _errors={}, _options) {
  /** CONSTRUCTOR CHECKS */

  if (!_values)
    throw new Error('"values" can\'t be undefined.')

  /** VALUES */

  const values = Object.assign({}, _values)
  const errors = _errors ? Object.assign({}, _errors) : {}
  const options = Object.assign({}, _options)

  /** PRIVATE */

  const _valueAt = path => at(values, path)[0]

  const _checkPath = path => {
    const value = _valueAt(path)
    if (isBoolean(value) || isNumber(value)) return 
    if (isEmpty(value)) set(errors, options.prefix ? `${options.prefix}.${path}` : path, 'Required')           
  } 

  const _self = () => Validate(values, errors, options)

  /** PUBLIC */
  /**
   * Checks if the values have a non empty value on each of
   * the provided paths. It also accepts an options object as
   * its first argument to force the check to run upon
   * specific conditions, or to be usde by other methods.
   * @param  {Object|String} options  Can be the first path or an options object.
   * @param  {String} options.isDefined  Path to another value. Will make the test run
   *                                     only if the value pointed by this option is 
   *                                     defined. Can be made more granular by using
   *                                     the "andEquals" and "definedWithPrefix" option.
   * @param  {Any} options.andEquals  Makes the test run only if the key defined by
   *                                  the "isDefined" option is valid and it matches
   *                                  the value represented by "andEquals".
   *                                  TODO: Use a better function to check for 
   *                                  equality instead of ===.
   * @param  {String} options.withPrefix  Path to use as prefix on all the given paths.
   * @param  {String} options.definedWithPrefix  Path to use with the "isDefined" option.
   *                                             Uses its value as prefix to find the value
   *                                             pointed by "isDefined". Used by the
   *                                             #isRequiredInCollection method.
   * @param  {...String} paths  List of paths to check for existance.
   * @return {Validate}
   */
  const isRequired = (options, ...paths) => {
    let isDefined, andEquals, withPrefix, definedWithPrefix
    // If options is not an object then is must be a path.
    // So it is concatenated with the rest of the paths.
    if (!isObject(options))
      paths = [options].concat(paths)
    else {
    // Else we get the values from the options
      isDefined = options.isDefined
      andEquals = options.andEquals
      withPrefix = options.withPrefix
      definedWithPrefix = options.definedWithPrefix
    }
    if (isDefined) {
      // This is used by #isRequiredInCollection() it lets the function searhc inside the
      // collection instead of the main "values" object.
      const value = _valueAt(definedWithPrefix ? `${definedWithPrefix}.${isDefined}` : isDefined)
      if (!value) return _self()
      if (andEquals && value !== andEquals) return _self()
    }
    if (paths) 
      paths.map(path => withPrefix ? `${withPrefix}.${path}` : path).forEach(_checkPath)
    return _self()
  }

  const isRequiredInCollection = (config, ...paths) => {
    let pathToCollection, ifDefined, pathToNestedCollection
    // Set variables according to the config argument.
    // It can be just a string, or an object.
    if (isObject(config)) {
      pathToCollection = config.pathToCollection
      ifDefined = config.ifDefined
      pathToNestedCollection = config.pathToNestedCollection
    } else {
      pathToCollection = config
      ifDefined = false
      pathToNestedCollection = false
    }
    // Get the collection
    const collection = _valueAt(pathToCollection)
    // Handle the error when the collection is not defined:
    // 1.- If the "isDefined" flag is not true, set the error.
    if (!collection && !!ifDefined === false)
      return isRequired(pathToCollection)
    // 2.- If the "isDefined" flag is true, don's set the error.
    else if (!collection && !!ifDefined === true)
      return _self()
    // If the provided path does not points to a collection, throw an error.
    if (!isArray(collection)) throw new Error('The "path" does not point to a "collection".')
    // TODO: Improve this API
    // If the "pathToNestedCollection" value is set, we handle it.
    if (pathToNestedCollection) {
      return merge(...collection.map((element, i) => 
        Validate(element, null, {
          prefix: `${pathToCollection}[${i}]`
        })
        .isRequiredInCollection(pathToNestedCollection, ...paths)
      ))
    }
    // Else we run the normal checks on the collection.
    if (paths){
      const buildCollectionPaths = (path) => collection.map((_, i) => `${pathToCollection}[${i}].${path}`)
      const collectionPaths = paths.reduce((acc, path) => acc.concat(buildCollectionPaths(path)), [])   
      return _self().merge(...collectionPaths.map(path => {
        const _config = Object.assign({}, config)
        if (_config.isDefined) _config.definedWithPrefix = path.split('.').slice(0, path.split('.').length-1).join('.')
        return isRequired(_config, path)
      }))
    }
  }

  const merge = (...errorsArgs) => {
    const allErrors = errorsArgs.reduce((accErrors, _errors_) => {
      const newErrors = _errors_.errors ? _errors_.errors : _errors_
      return _merge(accErrors, newErrors)
    }, errors)
    return Validate(values, allErrors, options)
  }

  return Object.assign({}, {
    values,
    errors,
    isRequired,
    isRequiredInCollection,
    merge,
  })
}

export default Validate
