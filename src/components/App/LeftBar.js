import React, {PropTypes as T} from 'react'
import NavBar from './NavBar.js'

const LeftBar = ({className}) => {
  const groups = [{
    links: [{
      name: 'Tables',
      url: '/',
      isActive: true,
    }, {
      name: 'Query Table',
      url: '/query',
    }]
  }]
  
  return (
    <div className={className}>
      <NavBar groups={groups} />
    </div>
  )
}

LeftBar.propTypes = {
  className: T.string,
}

export default LeftBar
