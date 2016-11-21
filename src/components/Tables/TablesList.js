import React, {PropTypes as T} from 'react'
import {Checkbox} from 'office-ui-fabric-react/lib/Checkbox'
import {List} from 'office-ui-fabric-react/lib/List'

const TableItem = ({item, onSelect, onCheck}) => 
  <div className="Table__item">
    <div className="checkbox">
      <Checkbox checked={item.__checked__} onChange={e => onCheck(item, e)}/> 
    </div>
    <div className="item">
      <a href={`#${item.TableName}`} onClick={onSelect}>{item.TableName}</a>    
    </div>
  </div>

TableItem.propTypes = {
  item: T.object.isRequired,
  onSelect: T.func.isRequired,
  onCheck: T.func.isRequired,
}

const TablesList = ({items, onSelect, onCheck}) =>
  <List 
    items={items}
    onRenderCell={(item) =>
      <TableItem key={item.TableName}
        onSelect={e => onSelect(item)}
        onCheck={onCheck}
        item={item}
      />
    }
  />

TablesList.propTypes = {
  items: T.arrayOf(T.object).isRequired,
  onSelect: T.func.isRequired,
  onCheck: T.func.isRequired,
}

export default TablesList
export {TablesList, TableItem}
