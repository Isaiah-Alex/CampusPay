import React, { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import gradient_logo from '../../assets/Logo-Gradient.svg'
import hamburger from '../../assets/Hamburger-icon.svg'
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"

const Navbar = () => {

  const menuRef = useRef("");
  const navRef = useRef("");
  const [isActive, setIsActive] = useState(0)
  // const [isSignIn, setIsSignIn] = useEffect()

  // const handleForm = (formType) => {
  //   if (formType === Login) {
  //     setIsSignIn(true);
  //   }
  //   else if(formType === Register){
  //     setIsSignIn(false)
  //   }
  // };

  const toggleMenu = () =>{
    if (menuRef.current) {
      menuRef.current.classList.toggle('hide');
    }
  }
  const navItems = ['Home', 'Features', 'Support'];


  return (
    <div className='navbar container'>
      <div className="navbar-left">
        <img src={gradient_logo} alt="CampusPay Logo" />
      <p>CampusPay</p>
      </div>
      <nav className="navbar-right">
        <ul>
        {navItems.map((item, index)=>{
          return (<li key={index}
          onClick={()=>{setIsActive(index)}}
          className={isActive === index ? 'nav-active': 'underline'}>
            {item}
          </li>)
        })}
         <Link to={'/connect-wallet'}>
          <li><button className='dark'>Connect Wallet</button></li>
        </Link> 
        <Link to={'/login'}>
        <li><button className='btn'>Login</button></li>
        </Link>
      </ul>
      <img src={hamburger} alt="Hamburger Menu Icon" onClick={()=>{toggleMenu()}} className='hamburger'/>

      </nav>
      <ul className='hamburger-menu hide' ref={menuRef}>
        <li>Features</li>
        <li>Support</li>
        <li>Connect Wallet</li>
        <li><Link   to={'/login'}>Login</Link></li>
      </ul>
      
    </div>
  )                  
}

export default Navbar