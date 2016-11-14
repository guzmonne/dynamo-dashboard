import React, {PropTypes as T} from 'react'
import {Copyright} from '../Icons/'

const Footer = ({className, year, company, address}) =>
  <footer className={className}>
    <span>
      <Copyright width={15} height={15}/>
    </span>
    <span>{`${year} ${company} in `} </span>
    <address className="footer-address">
      {address}
    </address>
    <span className="footer-bottom-rights">{' - All Rights Reserved - '}</span>
  </footer>

Footer.propTypes = {
  className: T.string,
  year: T.number,
  company: T.string,
  address: T.string,
}

Footer.defaultProps = {
  year: 2016,
  company: 'Gux',
  address: 'Montevideo, UY',
}

export default Footer
