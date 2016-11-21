import React, {PropTypes as T} from 'react'
import {connect} from 'react-redux'
import {listTables, selectTable, describeTable, tablesUpdateUi} from '../actions/'
import TablesComponent from '../components/Tables/'
import pick from 'lodash/pick'

class TablesContainer extends React.Component {
  static propTypes = {
    listTables: T.func.isRequired,
    selectTable: T.func.isRequired,
    onUpdateUi: T.func.isRequired,
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
    if (TableName) this.onSelect({TableName}) 
  }

  onDismiss = (flag) => {
    if (!flag) return this.setState({isOpen: false})
    this.props.onUpdateUi({[flag]: false})
  }

  onNew = () => this.props.onUpdateUi({isTableNewPanelOpen: true})

  onSelect = (table) => {
    this.props.selectTable(table.TableName)
    this.setState({isOpen: true})
    this.props.describeTable({tableName: table.TableName})
  }

  render() {
    const fromProps = pick(this.props, 'items', 'isLoading', 'selectedItem', 'ui')
    if (fromProps.items.length === 0 && fromProps.isLoading)
      return <h1><i>Loading tables...</i></h1>
    const fromThis = pick(this, 'onDismiss', 'onSelect', 'onNew')
    const fromState = pick(this.state, 'isOpen')
    return (
      <TablesComponent {...fromProps} {...fromThis} {...fromState}/>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    loadingStatus: {listTables:isLoading},
    entities: {tables},
    tables: {ids, selectedTable, ui}
  } = state
  return {
    isLoading,
    items: ids.map(id => tables[id]),
    selectedItem: tables[selectedTable || location.hash.slice(1)],
    ui,
  }
}

const ConnectedTablesContainer = connect(mapStateToProps, {
  listTables,
  describeTable,
  selectTable,
  onUpdateUi: tablesUpdateUi,
})(TablesContainer)

export default ConnectedTablesContainer
