import React, {PropTypes as T} from 'react'
import {CommandBar} from 'office-ui-fabric-react/lib/CommandBar'

const items = ({onNew, onEdit, onDownload}) => ([{
  name: 'New',
  key: 'new',
  icon: 'Add',
  onClick: onNew,
}, {
  name: 'Edit',
  key: 'edit',
  icon: 'Edit',
  onClick: onEdit,
}, {
  name: 'Download CloudFormation stack',
  key: 'download',
  icon: 'CloudDownload',
  onClick: onDownload,
}])

const farItems = ({onInfo}) => ([{
  name: 'Info',
  key: 'info',
  icon: 'Info',
  onClick: onInfo,
}])

const TablesMenu = (props) => 
  <CommandBar 
    isSearchBoxVisible={true}
    searchPlaceholderText="Search..."
    elipsisAriaLabel="More options"
    items={items(props)}
    farItems={farItems(props)}
    overflowItems={true}
  />

TablesMenu.propTypes = {
  onNew: T.func,
  onEdit: T.func,
  onDownload: T.func,
  onInfo: T.func,
}

const noop = () => {}

TablesMenu.defaultProps = {
  onNew: noop,
  onEdit: noop,
  onDownload: noop,
  onInfo: noop,
}

export default TablesMenu