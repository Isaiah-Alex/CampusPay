import React from 'react'
import './Hero.css'
import gradient_logo from '../../assets/Logo-Gradient.svg'
import texture from '../../assets/Background-texture.svg'
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";



const Hero = () => {
  return (
    <>
    <div className='hero' >
      <div className="hero-text">
        <h1>Secure <span>Payment</span> For Student <span>Life</span></h1>
        <p>Instant payment with safe transaction</p>
        <Link to={'/login'}>
          <button className='dark'>Get Started</button>
        </Link>
      </div>
      <div className="hero-img">
        <img src={gradient_logo} alt="" />
      </div>
    </div>
    <div className="texture"></div>
    <div className="hero-bg-gradient"></div>
    </>
  )
}

export default Hero