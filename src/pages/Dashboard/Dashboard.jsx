import React, { useEffect, useRef } from 'react'
import './Dashboard.css'
import DashboardSidebar from '../../components/DashboardSidebar/DashboardSidebar'
import HeroDashboard from '../../components/HeroDashboard/HeroDashboard'
import DashboardTransactions from '../../components/DashboardTransactions/DashboardTransactions'
import { useAuth } from '../../Contexts/AuthContex'


const Dashboard = () => {



  const scrollRef = useRef(null);
  const scrollToSection = () =>{
    scrollRef.current.scrollIntoView({behavior: "smooth"});
    console.log(scrollRef)
  }

  useEffect(()=>{
    if (scrollRef.current){
      console.log('ref is avaliable')
    }
  },[]);

  return (
    <div className = 'dashboard'>
      <div className="dashbord-sidebar-container">
         <DashboardSidebar/>
      </div>
      <div className="dashboard-hero-container">
        <HeroDashboard scrollFunc = {scrollToSection} />
      </div>
      <div className="dashboard-transaction">
        <DashboardTransactions ref={scrollRef}/>
      </div>

    </div>
  )
}

export default Dashboard