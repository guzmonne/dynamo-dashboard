import Validate from '../../modules/Validate.js'

describe('Validate', () => {
  let values = {}

  it('should be defined', () => {
    expect(Validate).not.toBe(undefined)
  })

  it('should throw if "values" is undefined', () => {
    expect(Validate).toThrowError('"values" can\'t be undefined.')
  })

  describe('#isRequired(...paths, options)', () => {

    it('should be defined', () => {
      expect(Validate(values).isRequired).not.toBe(undefined)
    })

    it('should return a Validate object', () => {
      const expected = Validate(values).isRequired()
      expect(expected.isRequired).not.toBe(undefined)
    })

    it('should allow to be chained', () => {
      const errors = {error: 'Dummy'}
      const values = {a: true, b: true, c: true}
      const expected = Validate(values, errors)
      .isRequired('a')
      .isRequired('b')
      .isRequired('c')
      .isRequired('d')
      .isRequired('e')
      .isRequired('f')
      expect(expected.errors.error).toEqual('Dummy')
      expect(expected.errors.a).toBeUndefined()
      expect(expected.errors.b).toBeUndefined()
      expect(expected.errors.c).toBeUndefined()
      expect(expected.errors.d).toEqual('Required')
      expect(expected.errors.e).toEqual('Required')
      expect(expected.errors.f).toEqual('Required')
    })

    const shouldAddAnErrorMessageIfValueIsUndefinedOrEmpty = (path) => () => {
      const expected = Validate({}).isRequired(path)
      expect(expected.errors.exists).not.toBeUndefined()
    }

    const shouldDoNothingIfTheValueIsDefined = (path) => () => {
      const errors = {inexistant: 'Required'}
      const values = {exists: true}
      const expected = Validate(values, errors).isRequired(path)
      expect(expected.errors.inexistant).toBe('Required')
      expect(expected.errors.exists).toBeUndefined()
    }

    const shouldAllowMultipleValuesAsArgumentsToTest = (...paths) => () => {
      const values = {a: true, b: true}
      const expected = Validate(values).isRequired(...paths)
      expect(expected.errors.a).toBeUndefined()
      expect(expected.errors.b).toBeUndefined()
      expect(expected.errors.c).toEqual('Required')
      expect(expected.errors.d).toEqual('Required')
    }

    const shouldAllowNestedObjectsToBeWalkedByProvidingAPath = (...paths) => () => {
      const values = {tree: {nest: {egg: true}}}
      const expected = Validate(values).isRequired(...paths)
      expect(expected.errors.tree.nest.egg.bird).toEqual('Required')
    }

    const shouldAllowToTestInsideArrays = (...paths) => () => {
      const values = {array: [{a:1}, {a:1}, {b:2}]}
      const expected = Validate(values).isRequired(...paths)
      expect(expected.errors.array[2].a).toEqual('Required')
    }
  
    it('should add an error message if value is undefined or empty', shouldAddAnErrorMessageIfValueIsUndefinedOrEmpty('exists'))

    it('should do nothing if the "value" is defined', shouldDoNothingIfTheValueIsDefined('exists'))

    it ('should allow multiple values as arguments to test', shouldAllowMultipleValuesAsArgumentsToTest('a', 'b', 'c', 'd'))

    it('should allow nested objects to be walked by providing a path', shouldAllowNestedObjectsToBeWalkedByProvidingAPath('tree', 'tree.nest', 'tree.nest.egg', 'tree.nest.egg.bird'))

    it('should allow to test inside arrays', shouldAllowToTestInsideArrays('array[0].a', 'array[1].a', 'array[2].a'))

    it('should not be applied if the "isDefined" option is set and it\s value is missing', () => {
      const values = {}
      let expected = Validate(values).isRequired({isDefined: 'canApply'}, 'exists')
      expect(expected.errors.exists).toBeUndefined()
      values.canApply = 'now the error should be set'
      expected = Validate(values).isRequired({isDefined: 'canApply'}, 'exists')
      expect(expected.errors.exists).toBe('Required')
    })

    it('shold not be applied if the "isDefined" option is set and the value difers from the "andEquals" value', () => {
      const values = {canApply: 'that'}
      let expected = Validate(values).isRequired({isDefined: 'canApply', andEquals: 'this'}, 'exists')
      expect(expected.errors.exists).toBeUndefined()
      values.canApply = 'this'
      expected = Validate(values).isRequired({isDefined: 'canApply'}, 'exists')
      expect(expected.errors.exists).toBe('Required')
    })

    it('should append the prefix specified on the "withPrefix" option if defined', () => {
      const values = {tree: {nests: [{eggs: 3}, {eggs: 2}, {birds: 1}]}}
      const expected = Validate(values).isRequired({withPrefix: 'tree.nests[2]'}, 'eggs')
      expect(expected.errors.tree.nests[2].eggs).toEqual('Required')
    })

  })

  describe('#isRequiredInCollection(pathToCollection|config, ...paths)', () => {
    const shouldBeDefined = () => {
      expect(Validate({}).isRequiredInCollection).not.toBeUndefined()
    }

    const shouldDefineAnErrorOnTheCollectionPathIfItIsUndefined = (pathToCollection) => () => {
      const values = {}
      const expected = Validate({}).isRequiredInCollection(pathToCollection, 'egg')
      expect(expected.errors.tree.nest).toEqual('Required')
    }

    const shouldThrowIfThePathDoesNotPointToACollection = (pathToCollection) => () => {
      const values = {tree: {nest: 'egg'}}
      const expected = () => Validate(values).isRequiredInCollection(pathToCollection, 'egg')
      expect(expected).toThrowError('The "path" does not point to a "collection".')  
    }

    const shouldSetAnErrorIfAValueIsMissingInACollection = (pathToCollection) => () => {
      const values = {array: [{a:1}, {a:2}, {b:1}, {a:3}]}
      const expected = Validate(values)
      .isRequiredInCollection(pathToCollection, 'a')
      expect(expected.errors.array[2].a).toEqual('Required')
    }

    const shouldSetAnErrorIfEitherValueIsMissingInACollection = (pathToCollection) => () => {
      const values = {array: [{a:1}, {a:2}, {b:1}, {a:3}]}
      const expected = Validate(values)
      .isRequiredInCollection(pathToCollection, 'a', 'b')
      expect(expected.errors.array[2].a).toEqual('Required')
      expect(expected.errors.array[0].b).toEqual('Required')
      expect(expected.errors.array[1].b).toEqual('Required')
      expect(expected.errors.array[3].b).toEqual('Required')
    }

    const shouldWorkWithComplexPaths = (pathToCollection) => () => {
      const values = {forest: [{tree: {nest: {egg: true}}}, {tree: {nest: false}}]}
      const expected = Validate(values).isRequiredInCollection(pathToCollection, 'tree.nest.egg')
      expect(expected.errors.forest[1].tree.nest.egg).toEqual('Required')      
    }

    it('should be defined', shouldBeDefined)

    it('should define an error on the collection path if it is undefined', shouldDefineAnErrorOnTheCollectionPathIfItIsUndefined('tree.nest'))

    it('should throw if the path does not point to a collection', shouldThrowIfThePathDoesNotPointToACollection('tree.nest'))

    it('should set an error if a value is missing in a collection', shouldSetAnErrorIfAValueIsMissingInACollection('array'))

    it('should set an error if either value is missing in a collection', shouldSetAnErrorIfEitherValueIsMissingInACollection('array'))

    it('should work with complex paths', shouldWorkWithComplexPaths('forest'))

    it('should work the same if the "pathToCollection" is a correct config object', () => {
      shouldDefineAnErrorOnTheCollectionPathIfItIsUndefined({pathToCollection: 'tree.nest'})()
      shouldThrowIfThePathDoesNotPointToACollection({pathToCollection: 'tree.nest'})()
      shouldSetAnErrorIfAValueIsMissingInACollection({pathToCollection: 'array'})()
      shouldSetAnErrorIfEitherValueIsMissingInACollection({pathToCollection: 'array'})()
      shouldWorkWithComplexPaths({pathToCollection: 'forest'})()
    })

    it('should not set an error if the collection is not defined when "ifDefine" flag is set to true', () => {
      const values = {}
      let expected = Validate(values).isRequiredInCollection({pathToCollection: 'array', ifDefined: true}, 'a')
      expect(expected.errors.array).toBeUndefined()
      expected = Validate(values).isRequiredInCollection({pathToCollection: 'array', ifDefined: false}, 'a')
      expect(expected.errors.array).not.toBeUndefined()      
    })

    it('should look in the collection nested in the "pathToCollection" if the "nestedCollection" value is set', () => {
      const values = {array: [{a: [{b:1}]}, {a: [{b:2}, {c:1}]}]}
      const expected = Validate(values).isRequiredInCollection({pathToCollection: 'array', pathToNestedCollection: 'a'}, 'b')
      expect(expected.errors.array[1].a[1].b).toEqual('Required')      
    })

    it('should pass the options to the #isRequired method', () => {
      const values = {array: [{a:1}, {a:2}, {b:1}, {a:3}, {b:3}]}
      const expected = Validate(values)
      .isRequiredInCollection({pathToCollection: 'array', isDefined: 'b', andEquals: 3}, 'a')
      expect(expected.errors.array[2]).toBeUndefined()
      expect(expected.errors.array[4].a).toEqual('Required')
    })

  })

  describe('#merge(errors)', () => {
  
    it('should be defined', () => {
      const expected = Validate({})
      expect(expected.merge).not.toBeUndefined()
    })

    it('should merge the new errors into its internal errors object', () => {
      const values = {}
      const errors = {error: 'Dummy'}
      const validate = Validate({}).isRequired('exists')
      expect(validate.errors.exists).toEqual('Required')
      expect(validate.errors.error).toBeUndefined()
      validate.merge(errors)
      expect(validate.errors.exists).toEqual('Required')
      expect(validate.errors.error).toEqual('Dummy')
    })

    it('should merge the errors of a different object with an "errors" key', () => {
      const v1 = Validate({}, {error1: true})
      expect(v1.errors.error1).toEqual(true)      
      const v2 = Validate({}, {error1: false, error2: true})
      const expected = v1.merge(v2)
      expect(expected.errors.error1).toEqual(false)
      expect(expected.errors.error2).toEqual(true)
    })

    it('should merge all the error arguments given', () => {
      const v1 = Validate({}, {e1: 'e1'})
      const v2 = Validate({}).isRequired('e2')
      const v3 = {errors: {e3: 'e3'}}
      const v4 = {e4: 'e4'}
      const expected = v1.merge(v2, v3, v4)
      expect(expected.errors.e1).toEqual('e1')
      expect(expected.errors.e2).toEqual('Required')
      expect(expected.errors.e3).toEqual('e3')
      expect(expected.errors.e4).toEqual('e4')
    })

  })

  describe('options', () => {

    describe('prefix', () => {

      it('should add the prefix to all the new errors paths if set', () => {
        const values = {}
        const errors = {error: 'Dummy'}
        const prefix = 'tree.nest'
        const expected = Validate(values, errors, {prefix}).isRequired('egg')
        expect(expected.errors.tree.nest.egg).toEqual('Required')
      })

    })

  })

})