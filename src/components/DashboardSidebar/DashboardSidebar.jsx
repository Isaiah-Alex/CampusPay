import React from 'react'
import './DashboardSidebar.css'
import profile_photo from '../../assets/profile-photo.svg'
import { logout } from '../../firebase'
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"

const DashboardSidebar = () => {
  return (
    <div className='dashboard-sidebar'>
        <img src={profile_photo} alt="Profile Photo" />
        <ul>
            <li>Wallet</li>
            <span></span>
            <li>Transaction</li>
            <span></span>
            <li>Notification</li>
            <span></span>
            <li>KYC</li>
            <span></span>
            <li>Settings</li>
        </ul>
        <Link to={'/connect-wallet'}>
            <button className='connectWallet'>Connect Wallet</button>
        </Link>
        <button onClick={()=> {logout()}} className="dark logout">Logout</button>
        
    </div>
  )
}

export default DashboardSidebar