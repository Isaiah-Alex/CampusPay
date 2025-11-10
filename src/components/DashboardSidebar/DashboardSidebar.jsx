import React, {useEffect, useState} from 'react'
import './DashboardSidebar.css'
import profile_photo from '../../assets/profile-photo.svg'
import { logout } from '../../firebase'
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"
import { FaWallet, FaBell, FaIdCard, FaSignOutAlt } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5'
import { MdSwapHoriz } from 'react-icons/md'
import { FiLink } from "react-icons/fi";


const DashboardSidebar = () => {

  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth >= 1024) {
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  }, [windowWidth]);

  return (
    <aside className='dashboard-sidebar'
    {...(windowWidth < 1024 && {
      // onMouseEnter: () => setIsHovered(true),
      // onMouseLeave: () => setIsHovered(false),
      onClick: () =>  setIsHovered(prev => !prev),
    })}
    style={{width: isHovered ? '250px' : '80px'}}
    >
        <img src={profile_photo} alt="Profile Photo" />
        <ul>
            <li><FaWallet/>&nbsp;&nbsp;{isHovered?'Wallet' : ''}</li>
            <span style={{width: isHovered ? '100%' : '60%'}}></span>
            <li><MdSwapHoriz/>&nbsp;&nbsp;{isHovered?'Transaction' : ''}</li>
            <span style={{width: isHovered ? '100%' : '60%'}}></span>
            <li><FaBell/>&nbsp;&nbsp;{isHovered?'Notification' : ''}</li>
            <span style={{width: isHovered ? '100%' : '60%'}}></span>
            <li><FaIdCard/>&nbsp;&nbsp;{isHovered?'KYC' : ''}</li>
            <span style={{width: isHovered ? '100%' : '60%'}}></span>
            <li> <IoSettings/>&nbsp;&nbsp;{isHovered?'Setting' : ''}</li>
        </ul>
        <Link to={'/connect-wallet'}>
            <button className='connectWallet'><FiLink/>{isHovered?' Connect Wallet' : ''}</button>
            <br />
        </Link>
        <button style={{padding: isHovered ? '15px 45px': '15px 20px'}} onClick={()=> {logout()}} className="dark logout"><FaSignOutAlt/>{isHovered?' Logout' : ''}</button>
        
    </aside>
  )
}

export default DashboardSidebar