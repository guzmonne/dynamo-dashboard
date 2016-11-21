import React from 'react'
import {Nav, INavProps} from 'office-ui-fabric-react/lib/Nav'

const NavBar = ({groups}) =>
  <Nav groups={groups} expandedStateText="expanded" collapsedStateText="collapsed"/>

NavBar.propTypes = Object.assign({}, INavProps)

export default NavBar
