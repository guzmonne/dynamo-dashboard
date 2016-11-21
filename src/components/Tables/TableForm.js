import React, {PropTypes as T} from 'react'
import {Field, FieldArray, reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import {Button, ButtonType} from 'office-ui-fabric-react/lib/Button'
import {Label} from 'office-ui-fabric-react/lib/Label'
import {MessageBar} from 'office-ui-fabric-react/lib/MessageBar'
import {TagItem} from 'office-ui-fabric-react/lib/components/pickers/TagPicker/TagItem'
import {ControlledCheckbox, ControlledDropdown, ControlledTextField, ControlledTagPicker} from '../_common/'
import isString from 'lodash/isString'
import Joi from 'joi-browser'
import set from 'lodash/set'
import merge from 'lodash/merge'
 
const toDropdownItem = value => ({key: value, text: value})

const attributeTypeOptions = ['S', 'N', 'B'].map(toDropdownItem)

const keyTypeOptions = ['HASH', 'RANGE'].map(toDropdownItem)

const streamViewTypes = ['NEW_IMAGE ', 'OLD_IMAGE ', 'NEW_AND_OLD_IMAGES ', 'KEYS_ONLY'].map(toDropdownItem)

const projectionTypeOptions = ['ALL', 'KEYS_ONLY', 'INCLUDE'].map(toDropdownItem)

const formatWhiteSpaceToDash = value => isString(value) ? value.replace(/\s/g, '-') : value

const AttributeDefinitionJoiSchema = Joi.object({
  AttributeName: Joi.string().required(),
  AttributeType: Joi.string().valid('S', 'N', 'B').required(),
}) 

const AttributeDefinitionsJoiSchema = Joi.array().items(AttributeDefinitionJoiSchema)

const KeySchemaJoiSchema = Joi.object({
  AttributeName: Joi.string().required(),
  KeyType: Joi.string().valid('HASH', 'RANGE').required()
})

const KeySchemasJoiSchema = Joi.array().items(KeySchemaJoiSchema)

const ProvisionedThroughputJoiSchema = Joi.object({
  ReadCapacityUnits: Joi.number().min(1).required(),
  WriteCapacityUnits: Joi.number().min(1).required(),
})

const ProjectionJoiSchema = Joi.object({
  ProjectionType: Joi.string().valid('ALL', 'KEYS_ONLY', 'INCLUDE'),
  NonKeyAttributes: Joi.array().items(Joi.string()).when('ProjectionType', {is: 'INCLUDE', then: Joi.required()}),
})

const GlobalSecondaryIndexJoiSchema = Joi.object({
  IndexName: Joi.string().required(),
  KeySchema: KeySchemasJoiSchema.required(),
  Projection: ProjectionJoiSchema.required(),
  ProvisionedThroughput: ProvisionedThroughputJoiSchema.required(),
})

const GlobalSecondaryIndexesJoiSchema = Joi.array().items(GlobalSecondaryIndexJoiSchema)

const LocalSecondaryIndexJoiSchema = Joi.object({
  IndexName: Joi.string().required(),
  KeySchema: KeySchemasJoiSchema.required(),
  Projection: ProjectionJoiSchema.required(),
})

const LocalSecondaryIndexesJoiSchema = Joi.array().items(LocalSecondaryIndexJoiSchema)

const StreamSpecificationJoiSchema = Joi.object({
  StreamEnabled: Joi.boolean(),
  StreamViewType: Joi.string().valid('NEW_IMAGE', 'OLD_IMAGE', 'NEW_AND_OLD_IMAGES', 'KEYS_ONLY').when('StreamEnabled', {is: true, then: Joi.required()})
})

const TableJoiSchema = Joi.object({
  TableName: Joi.string().required(),
  AttributeDefinitions: AttributeDefinitionsJoiSchema.required(),
  KeySchema: KeySchemasJoiSchema.required(),
  ProvisionedThroughput: ProvisionedThroughputJoiSchema.required(),
  GlobalSecondaryIndexes: GlobalSecondaryIndexesJoiSchema,
  LocalSecondaryIndexes: LocalSecondaryIndexesJoiSchema,
  StreamSpecification: StreamSpecificationJoiSchema,
})

const validate = values => {
  const result = Joi.validate(values, TableJoiSchema, {abortEarly: false})
  const errors = result.error.details.reduce((errors, detail) => {
    const _error = {}
    const path = detail.path.replace(/(\.)(\d+)(\.)/g, '[$2].').replace(/\.$/, '')
    set(_error, path, detail.message)
    return merge(errors, _error)
  }, {}) 
  console.log(errors)
  return errors 
}

const KeySchema = ({fields, store}) =>
  <div className="KeySchema">
    {fields.map((field, i) =>
      <div key={`${field}-${i}`} required={true} className="Key">
        <Button
          buttonType={ ButtonType.command }
          icon="Cancel"
          type="button"
          description={`Key #${i+1}`}
          onClick={e => fields.remove(i)}
        >
          {`Key #${i+1}`}
        </Button>
        <Label className="label-s" required={true}>AttributeName</Label>
        <Field name={`${field}.AttributeName`}
          store={store}
          component={ControlledTextField}
          format={formatWhiteSpaceToDash}
          textFieldProps={{
            placeholder: 'AttributeName',
          }}
        />
        <Label className="label-s" required={true}>KeyType</Label>    
        <Field name={`${field}.KeyType`}
          store={store}
          component={ControlledDropdown}
          options={keyTypeOptions}
          parse={value => value && value.text ? value.text : value}
        />
      </div>
    )}  
    <Button
      buttonType={ ButtonType.command }
      icon="Add"
      type="button"
      description="Add new key"
      onClick={e => fields.push({
        AttributeName: '',
        KeyType: 'HASH',
      })}
    >
      Add new key
    </Button>
  </div>

const AttributeDefinitions = ({fields, store}) =>
  <div className="AttributeDefinitions">
  {fields.map((field, i) =>
    <div key={`${field}-${i}`} required={true} className="AttributeDefinition">
      <Button
        buttonType={ ButtonType.command }
        icon="Cancel"
        type="button"
        description={`Attribute definition #${i+1}`}
        onClick={e => fields.remove(i)}
      >
        {`Attribute definition #${i+1}`}
      </Button>
      <Label className="label-s" required={true}>AttributeName</Label>
      <Field name={`${field}.AttributeName`}
        store={store}
        component={ControlledTextField}
        format={formatWhiteSpaceToDash}
        textFieldProps={{
          placeholder: 'AttributeName',
        }}
      />
      <Label className="label-s" required={true}>AttributeType</Label>    
      <Field name={`${field}.AttributeType`}
        store={store}
        component={ControlledDropdown}
        options={attributeTypeOptions}
        parse={value => value && value.text ? value.text : value}
      />
    </div>
  )}
    <MessageBar>
      <ul className="unstyled-list mono">
        <li>S - the attribute is of type String</li>
        <li>N - the attribute is of type Number</li>
        <li>B - the attribute is of type Binary</li>
      </ul>
    </MessageBar>    
    <Button
      buttonType={ ButtonType.command }
      icon="Add"
      type="button"
      description="Add new attribute definition"
      onClick={e => fields.push({
        AttributeName: '',
        AttributeType: 'S',
      })}
    >
      Add new attribute definition
    </Button>
  </div>

const Index = (className, name, provisionThroughput, defaults) => ({fields, store, indexes}) =>
  <div className={className}>
  {fields.map((field, i) => 
    <div key={i} className={`${className}__index`}>
      <Button
        buttonType={ ButtonType.command }
        icon="Cancel"
        type="button"
        description={`${name} #${i+1}`}
        onClick={e => fields.remove(i)}
      >
      {`${name} #${i+1}`}
      </Button>
      <Label className="label" required={true}>IndexName</Label>    
      <Field name={`${field}.IndexName`}
        store={store}
        component={ControlledTextField}
        format={formatWhiteSpaceToDash}
        textFieldProps={{
          placeholder: 'IndexName',
        }}
      />
      <Label className="label">KeySchema</Label>
      <FieldArray name={`${field}.KeySchema`}
        store={store}
        component={KeySchema}
      />
      <Label className="label" required={true}>Projection</Label>
      <Label className="label-s">ProjectionType</Label>                
      <Field name={`${field}.Projection.ProjectionType`}
        store={store}
        component={ControlledDropdown}
        options={projectionTypeOptions}
        parse={value => value && value.text ? value.text : value}
      />
      <Label className="label-s">NonKeyAttributes</Label>          
      <Field name={`${field}.Projection.NonKeyAttributes`}
        store={store}
        component={ControlledTagPicker}
        parse={values => values && values.length ? values.map(v => v.name) : values}
        transform={formatWhiteSpaceToDash}
        shouldNotResolve={() => {console.log(indexes[i]); return !indexes[i] ||
          !indexes[i].Projection.ProjectionType ||
          indexes[i].Projection.ProjectionType !== 'INCLUDE'}
        }
        tagPickerProps={{          
          pickerSuggestionsProps: {
            suggestionsHeaderText: 'NonKeyAttribute',
            noResultsFoundText: 'ProjectionType must be: INCLUDE'
          },
          getTextFromItem: ({name}) => formatWhiteSpaceToDash(name),
          onRenderItem: ({item:{name, key}, ...rest}) => <TagItem key={key} {...rest}>{formatWhiteSpaceToDash(name)}</TagItem>,
        }}
      />
    {provisionThroughput && 
      <Label required={true} className="label">ProvisionedThroughput</Label>}
    {provisionThroughput &&       
      <Label className="label-s" required={true}>ReadCapacityUnits</Label>}
    {provisionThroughput &&       
      <Field name={`${field}.ProvisionedThroughput.ReadCapacityUnits`}
        store={store}
        component={ControlledTextField}
        format={formatWhiteSpaceToDash}
        textFieldProps={{
          placeholder: 'ReadCapacityUnits',
        }}
      />}
    {provisionThroughput &&       
      <Label className="label-s" required={true}>WriteCapacityUnits</Label>}
    {provisionThroughput &&       
      <Field name={`${field}.ProvisionedThroughput.WriteCapacityUnits`}
        store={store}
        component={ControlledTextField}
        format={formatWhiteSpaceToDash}
        textFieldProps={{
          placeholder: 'WriteCapacityUnits',
        }}
      />}  
    </div>  
  )}  
    <div className={`${className}__button`}>
      <Button
        buttonType={ ButtonType.command }
        icon="Add"
        type="button"
        description={`Add new ${name}`}
        onClick={e => fields.push(Object.assign({}, defaults))}
      >
        {`Add new ${name}`}
      </Button>
    </div>
  </div>

const LocalSecondaryIndexes = Index('LocalSecondaryIndexes', 'Local Secondary Index', false, {
  KeySchema: [{
    AttributeName: '',
    KeyType: 'HASH',
  }]
})

const GlobalSecondaryIndexes = Index('GlobalSecondaryIndexes', 'Global Secondary Index', true, {
  ProvisionedThroughput: {
    ReadCapacityUnits: '5',
    WriteCapacityUnits: '5',
  },
  KeySchema: [{
    AttributeName: '',
    KeyType: 'HASH',
  }]
})
/**
 * We need to explicitly pass the redux store to each individual
 * Field component if we want to render them inside an Office ui
 * Fabric Panel. This is beacause this components are instantiated
 * outside the Provider component. The method reduxForm() calls
 * internally redux-form connect method. This looks for the store
 * inside React context or on the wrapped component props. 
 * ReduxForm calls the connect method on each Field component, so
 * just defining the store as a prop of the form is not enough, it
 * must be passed to every Field component used.
 */
const TableForm = ({store, handleSubmit, pristine, invalid, streamEnabled, localSecondaryIndexes, globalSecondaryIndexes}) =>
  <form onSubmit={handleSubmit} className="TableForm">
    <Label className="label-l" required={true}>TableName</Label>
    <Field name="TableName"
      store={store}
      component={ControlledTextField}
      format={formatWhiteSpaceToDash}
      textFieldProps={{
        placeholder: 'TableName',
      }}
    />
    <hr/>
    <Label required={true} className="label-l">AttributeDefinitions</Label>
    <FieldArray name="AttributeDefinitions"
      store={store}
      component={AttributeDefinitions}
    />
    <hr/>
    <Label required={true} className="label-l">KeySchema</Label>
    <FieldArray name="KeySchema"
      store={store}
      component={KeySchema}
    />
    <hr/>
    <Label required={true} className="label-l">ProvisionedThroughput</Label>
    <Label className="label-s" required={true}>ReadCapacityUnits</Label>    
    <Field name="ProvisionedThroughput.ReadCapacityUnits"
      store={store}
      component={ControlledTextField}
      format={formatWhiteSpaceToDash}
      textFieldProps={{
        placeholder: 'ReadCapacityUnits',
      }}
    />
    <Label className="label-s" required={true}>WriteCapacityUnits</Label>
    <Field name="ProvisionedThroughput.WriteCapacityUnits"
      store={store}
      component={ControlledTextField}
      format={formatWhiteSpaceToDash}
      textFieldProps={{
        placeholder: 'WriteCapacityUnits',
      }}
    />
    <hr/>    
    <Label className="label-l">LocalSecondaryIndexes</Label>
    <FieldArray name="LocalSecondaryIndexes"
      store={store}
      component={LocalSecondaryIndexes}
      props={{indexes: localSecondaryIndexes}}
    />
    <hr/>        
    <Label className="label-l">GlobalSecondaryIndexes</Label>
    <FieldArray name="GlobalSecondaryIndexes"
      store={store}
      component={GlobalSecondaryIndexes}
      props={{indexes: globalSecondaryIndexes}}
    />
    <hr/>    
    <Label className="label-l" required={false}>StreamSpecification</Label>
    <Field name="StreamSpecification.StreamEnabled"
      store={store}
      component={ControlledCheckbox}
      checkboxProps={{
        label: 'StreamEnabled',
      }}
    />
    <Field name="StreamSpecification.StreamViewType"
      className="fit-height"
      store={store}
      component={ControlledDropdown}
      options={streamViewTypes}
      dropdownProps={{
        disabled: !streamEnabled,
      }}
      normalize={(value) => value && streamEnabled ? value.text : undefined}
    />
    <hr/>    
    <div className="padding"></div>
    <Button
      disabled={pristine || invalid}
      buttonType={ButtonType.hero}
      type="submit"
      icon="Add"
    >
      Create table
    </Button>
  </form>

TableForm.propTypes = {
  onSubmit: T.func.isRequired,
  store: T.shape({
    subscribe: T.func.isRequired,
    dispatch: T.func.isRequired,
    getState: T.func.isRequired
  })
}

const form = 'table'

let TableReduxForm = reduxForm({
  form,
  validate,
  initialValues: {
    AttributeDefinitions: [{
      AttributeName: '',
      AttributeType: 'S',
    }],
    KeySchema: [{
      AttributeName: '',
      KeyType: 'HASH',
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits: '5',
      WriteCapacityUnits: '5',
    }
  }
})(TableForm)

const selector = formValueSelector(form)

TableReduxForm = connect(state => {
  const streamEnabled = selector(state, 'StreamSpecification.StreamEnabled')
  const localSecondaryIndexes = selector(state, 'LocalSecondaryIndexes')
  const globalSecondaryIndexes = selector(state, 'GlobalSecondaryIndexes')
  return {streamEnabled, localSecondaryIndexes, globalSecondaryIndexes}
})(TableReduxForm)

export default TableReduxForm
