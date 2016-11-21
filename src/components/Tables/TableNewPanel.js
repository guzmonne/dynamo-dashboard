import React, {PropTypes as T} from 'react'
import {Panel} from '../_common/'
import TableForm from './TableForm.js'

const TableNewPanel = ({isOpen, onDismiss, onCreate}, {store}) => {
  return (
  <Panel isOpen={isOpen}
    header="New Table"
    type="medium"
    onDismiss={onDismiss}
  >
    <TableForm store={store} onSubmit={onCreate}/>
  </Panel>
  )
}

TableNewPanel.propTypes = {
  isOpen: T.bool.isRequired,
  onDismiss: T.func.isRequired,
}

TableNewPanel.contextTypes = {
  store: T.shape({
    subscribe: T.func.isRequired,
    dispatch: T.func.isRequired,
    getState: T.func.isRequired
  })
}

export default TableNewPanel
