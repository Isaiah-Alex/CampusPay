import React, { useRef, useState } from 'react'
import './DashboardTransactions.css';
import Transactions from './Transactions'
import transactionDetails from '../../assets/transaction_details.json'

import Footer from '../../components/Footer/Footer'

const DashboardTransactions = () => {

  const [filterTransaction, setFilterTransaction] = useState("all");
  const [filterStatus, setStatusFilter] = useState("all");

  const handleStatusChange = (e) => {
   setStatusFilter(e.target.value);
 };

  const handleCategoriesChange = (e) => {
    setFilterTransaction(e.target.value);
  };

  const filteredTransactions = transactionDetails.filter((txn) => {
    const matchedStatus = filterStatus === 'all' || txn.status.toLowerCase() === filterStatus.toLowerCase();
    const matchedCategories = filterTransaction === 'all' || txn.type.toLowerCase() === filterTransaction.toLowerCase();
    return matchedCategories && matchedStatus;

  });





  return (
    <div className='dashboard-transaction'>
      <h4>Recent Transactions</h4>
      <hr />
      <div className='categories-status' >
        <select className='categories'
        onChange={handleCategoriesChange}>
          <option value="all"> All Categories</option>
          <option value="withdraw"> Withdraw</option>
          <option value="transfer">Transfer</option>
          <option value="deposit">Deposit</option>
        </select>

        <select className='status'  onChange={handleStatusChange} >
          <option value="all">All Status</option>
          <option value="pending"> pending</option>
          <option value="successful">successful</option>
          <option value="failed">faled</option>
        </select>
        </div>

        <div className="transaction-details">
        {filteredTransactions.map((txn) => (
          <Transactions 
          key={txn.id}
          transactionAmount={txn.amount.toLocaleString()}
          transactionStatus={txn.status === 'failed' ? <span style={{color: '#DD2F27'}}>{txn.status}</span> : txn.status === 'pending' ? <span style={{color: '#FEC51D'}}>{txn.status}</span> : <span style={{color: 'var(--orange)'}}>{txn.status}</span>} 
          transactionType={txn.type}
          transactionMonth={txn.month}
          transactionDay={txn.day}
          transactionTime={txn.time}
          
          transactionName={txn.type === "Withdraw" || txn.type === "Transfer" ? txn.name : ""}

          preposition={txn.type === "Transfer" ? "to" : txn.type === "Withdraw" ? "from" : "" }
          />
        )
        )} 
        </div>

        <div className="annoucement">
          <h4>Annoucement</h4>
          <ul>
          <li>We are excited to inform you that CampusPay v1.2 Update is Live</li>

          <li>Our system will undergo routine maintenance on friday, 6th sept, 2025 (12:00AM - 3:300PM). During this period, transactions may temporarily unavvaliable</li>
          </ul>
        </div>
        <Footer />

    </div>
  )
}

export default DashboardTransactions