import React, {PropTypes as T} from 'react'
import {BreadCrumbs, MediumPanel} from '../_common/'
import {List} from 'office-ui-fabric-react'

const TableItem = ({item, onSelect}) => 
  <div className="Table__item">
    <a href={`#${item.TableName}`} onClick={onSelect}>{item.TableName}</a>
  </div>

TableItem.propTypes = {
  item: T.object.isRequired,
  onSelect: T.func.isRequired,
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
      <MediumPanel isOpen={isOpen}
        header={'#' + selectedItem.TableName}
        onDismiss={dismiss}
      >
        <pre>{JSON.stringify(selectedItem)}</pre>
      </MediumPanel>}
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
