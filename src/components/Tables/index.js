import React, {PropTypes as T} from 'react'
import {BreadCrumbs, Panel} from '../_common/'
import {List, Label, TextField} from 'office-ui-fabric-react'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'

const TableItem = ({item, onSelect}) => 
  <div className="Table__item">
    <a href={`#${item.TableName}`} onClick={onSelect}>{item.TableName}</a>
  </div>

TableItem.propTypes = {
  item: T.object.isRequired,
  onSelect: T.func.isRequired,
}

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

const Tables = ({items, onSelect, isOpen, onDismiss, selectedItem}) => {
  const breadcrumbs = [{
    text: 'Tables', key: 'Tables', onClick: () => {},
  }]

  const dismiss = () => {
    location.hash = ""
    this.props.onDismiss()
  }

  return (
    <div className="Tables">
    {selectedItem &&
      <Panel isOpen={isOpen}
        header={'#' + selectedItem.TableName}
        onDismiss={dismiss}
      >
      {Object.keys(selectedItem).map(key => 
        <div key={key} className="Table__selected-value">
          <div className="key">
            <Label>{key}:</Label>
          </div>
          <div className="value">
            <TableSelectedValue value={selectedItem[key]} />
          </div>
        </div>
      )}
      </Panel>}
      <div className="Tables__Breadcrumbs">
        <BreadCrumbs items={breadcrumbs} />
      </div>
      <div className="Tables__list">
        <List items={items}
          onRenderCell={(item) => <TableItem key={item.TableName}
            onSelect={e => onSelect(item)}
            item={item}
          />}
        />
      </div>
    </div>
  )
}

Tables.propTypes = {
  items: T.arrayOf(T.object).isRequired,
  onSelect: T.func.isRequired,
  onDismiss: T.func.isRequired,
  isOpen: T.bool,
  selectedItem: T.object,
}

export default Tables
