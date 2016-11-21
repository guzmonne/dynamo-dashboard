import React, {PropTypes as T} from 'react'
import {Panel} from '../_common/'
import {Label} from 'office-ui-fabric-react/lib/Label'
import {TextField} from 'office-ui-fabric-react/lib/TextField'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'

const TableSelectedValue = ({value}) => {
  if (isArray(value)) return (
    <div>
    {value.map((v, i) => <TableSelectedValue key={i} value={v} />)}
    </div>
  )
  if (isObject(value)) return (
    <ul>
    {Object.keys(value).map(key => 
      <li key={key}><TextField label={key+':'} value={value[key]} underlined disabled/></li>  
    )}
    </ul>
  )
  return <TextField value={value.toString()} underlined disabled/>
}

const TablePanel = ({isOpen, onDismiss, item}) => 
  <Panel isOpen={isOpen}
    header={'#' + item.TableName}
    onDismiss={onDismiss}
  >
  {Object.keys(item).map(key => 
    <div key={key} className="Table__selected-value">
      <div className="key">
        <Label>{key}:</Label>
      </div>
      <div className="value">
        <TableSelectedValue value={item[key]} />
      </div>
    </div>
  )}
</Panel>

TablePanel.propTypes = {
  isOpen: T.bool.isRequired,
  onDismiss: T.func.isRequired,
  item: T.object.isRequired,
}

export default TablePanel
export {TablePanel, TableSelectedValue}
