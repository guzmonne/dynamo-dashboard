import React, {PropTypes as T} from 'react'
import logo from '../../_styles/svg/logo.svg'


const Header = ({className}) =>
  <header className={className}>
    <a href="#" className="brand">
      <img src={logo} alt="Logo" className="brand-logo"/>
      <span>Dynamo Dashboard</span>
    </a>
  </header>

Header.propTypes = {
  className: T.string,
}

export default Header