import React, {PropTypes as T} from 'react'
import {connect} from 'react-redux'
import {listTables, selectTable} from '../actions/'
import TablesComponent from '../components/Tables/'

class TablesContainer extends React.Component {
  static propTypes = {
    listTables: T.func.isRequired,
    selectTable: T.func.isRequired,
    items: T.arrayOf(T.shape({
      TableName: T.string.isRequired,
    })).isRequired,
  }

  state = {
    isOpen: false,
  }

  componentWillMount() {
    this.props.listTables()
  }

  componentDidMount() {
    const TableName = location.hash.slice(1)
    if (TableName) {
      this.props.selectTable(TableName)
      this.setState({isOpen: true})
    }
  }

  onDismiss = () => this.setState({isOpen: false})

  onSelect = (table) => {
    this.props.selectTable(table.TableName)
    this.setState({isOpen: true})
  }

  render() {
    const {items, isLoading, selectedItem} = this.props
    if (items.length === 0 && isLoading)
      return <h1><i>Loading tables...</i></h1>
    const {onDismiss, onSelect} = this
    const {isOpen} = this.state
    return (
      <TablesComponent {...{items, selectedItem, isOpen, onDismiss, onSelect}}/>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    loadingStatus: {listTables:isLoading},
    entities: {tables},
    tables: {ids, selectedTable}
  } = state
  return {
    isLoading,
    items: ids.map(id => tables[id]),
    selectedItem: tables[selectedTable || location.hash.slice(1)],
  }
}

const ConnectedTablesContainer = connect(mapStateToProps, {
  listTables,
  selectTable
})(TablesContainer)

export default ConnectedTablesContainer
