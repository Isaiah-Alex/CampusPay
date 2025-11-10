import React from 'react'
import './Footer.css'
import logo from '../../assets/logo-orange.svg'

const Footer = () => {
  return (
    <footer className='footer' >
      <div className="footer-list">
        <div className="footer-left">
          <img src={logo} alt="footer-logo" />
          <p>CampusPay</p>

        </div>
        <div className="footer-right">
          <ul>
            <li>About</li>
            <li>FAQ</li>
            <li>Terms</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <p className='footer-reserve'>&copy; CampusPay 2025. All rights reserved</p>

    </footer>
  )
}

export default Footer