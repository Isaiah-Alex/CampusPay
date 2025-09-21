import React, { useEffect, useRef } from 'react'
import './Navbar.css'
import gradient_logo from '../../assets/Logo-Gradient.svg'
import hamburger from '../../assets/Hamburger-icon.svg'
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"

const Navbar = () => {

  const menuRef = useRef("");
  // const [isSignIn, setIsSignIn] = useEffect()

  const handleForm = (formType) => {
    if (formType === Login) {
      setIsSignIn(true);
    }
    else if(formType === Register){
      setIsSignIn(false)
    }
  };

  const toggleMenu = () =>{
    if (menuRef.current) {
      menuRef.current.classList.toggle('hide');
    }
  }


  return (
    <div className='navbar container'>
      <div className="navbar-left">
        <img src={gradient_logo} alt="CampusPay Logo" />
      <p>CampusPay</p>
      </div>
      <div className="navbar-right">
        <ul>
        <li className='underline' >Home</li>
        <li className='underline' >Features</li>
        <li className='underline' >Suport</li>
        {/* <Link to={'/connect-wallet'}>
          <li><button className='dark'>Connect Wallet</button></li>
        </Link> */}
        <Link to={'/login'}>
        <li><button className='btn'  onClick={()=>{handleForm(Login)}}>Login</button></li>
        </Link>
      </ul>
      <img src={hamburger} alt="Hamburger Menu Icon" onClick={()=>{toggleMenu()}} className='hamburger'/>

      </div>
      <ul className='hamburger-menu hide' ref={menuRef}>
        <li>Features</li>
        <li>Support</li>
        <li>Connect Wallet</li>
        <li>Login</li>
      </ul>
      
    </div>
  )                  
}

export default Navbar