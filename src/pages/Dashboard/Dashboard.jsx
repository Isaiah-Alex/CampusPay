import React from 'react'
import './Dashboard.css'
import DashboardSidebar from '../../components/DashboardSidebar/DashboardSidebar'
import HeroDashboard from '../../components/HeroDashboard/HeroDashboard'
import DashboardTransactions from '../../components/DashboardTransactions/DashboardTransactions'


const Dashboard = () => {
  return (
    <div className = 'dashboard'>
      <div className="dashbord-sidebar-container">
         <DashboardSidebar />
      </div>
      <div className="dashboard-hero-container">
        <HeroDashboard />
      </div>
      <div className="dashboard-transaction">
        <DashboardTransactions />
      </div>

    </div>
  )
}

export default Dashboard