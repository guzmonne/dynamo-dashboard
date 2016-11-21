import React, {PropTypes as T} from 'react'
import {BreadCrumbs} from '../_common/'
import TablesMenu from './TablesMenu.js'
import TablesList from './TablesList.js'
import TablePanel from './TablePanel.js'
import TableNewPanel from './TableNewPanel.js'

const Tables = ({items, onSelect, onDismiss, onNew, isOpen, selectedItem, ui}) => {
  
  const breadcrumbs = [{
    text: 'Tables', key: 'Tables', onClick: () => {},
  }]

  const dismiss = (flag) => {
    if (!flag) location.hash = ""
    onDismiss(flag)
  }

  const check = (item) => {
    console.log(item)
  }

  const onCreate = (table) => {
    console.log(table)
  }

  const {isTableNewPanelOpen} = ui

  return (
    <div className="Tables">
    {selectedItem && <TablePanel isOpen={isOpen} onDismiss={dismiss} item={selectedItem} />}
      <div className="Tables__Breadcrumbs">
        <BreadCrumbs items={breadcrumbs} />
      </div>
      <div className="Tables__menu">
        <TablesMenu onNew={onNew}/>
      </div>
      <div className="Tables__list">
        <TablesList items={items} onSelect={onSelect} onCheck={check}/>
      </div>
      <TableNewPanel isOpen={isTableNewPanelOpen}
        onDismiss={dismiss.bind(null, 'isTableNewPanelOpen')}
        onCreate={onCreate}  
      />
    </div>
  )
}

Tables.propTypes = {
  items: T.arrayOf(T.object).isRequired,
  onSelect: T.func.isRequired,
  onDismiss: T.func.isRequired,
  isOpen: T.bool,
  selectedItem: T.object,
  ui: T.shape({
    isSelectedTablePanelOpen: T.bool,
    isNewTablePanelOpen: T.bool,
    selectedItem: T.object,
  }).isRequired,
}

export default Tables
