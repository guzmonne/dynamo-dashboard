import React, {PropTypes as T} from 'react'
import NavBar from './NavBar.js'

class LeftBar extends React.Component {
  static propTypes = {
    className: T.string,
  }

  onClick = console.log

  groups = [{
    links: [{
      name: 'Tables',
      url: '/',
      isActive: true,
    }, {
      name: 'Query Table',
      url: '/query',
    }]
  }]
  
  render() {
    const {className} = this.props
    return (
      <div className={className}>
        <NavBar groups={this.groups} />
      </div>
    )
  }
}

export default LeftBar
