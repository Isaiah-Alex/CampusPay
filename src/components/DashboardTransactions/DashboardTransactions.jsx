import React, { useRef, useState } from 'react'
import './DashboardTransactions.css';
import Transactions from './Transactions'
import transactionDetails from '../../assets/transaction_details.json'
import Footer from '../../components/Footer/Footer'
import announcements from '../../assets/announcements.json'



// Component for announcement
  const AnnouncementListItems = ({announce}) => {
    const [isSummarized, setIsSumarized] = useState(true);
    const summaryLength = 90;

    const toggleSummary = () =>{
      setIsSumarized( prev => !prev)}

      return(
        <li style={{paddingTop: '10px'}} key={announce.id}>
          {isSummarized ? (
            <span>
              {announce.message.substring(0, summaryLength)}
              {announce.message.length > summaryLength && (
                <span 
                style={{ cursor: 'pointer', color: 'var(--grey-light)' }}
                onClick={toggleSummary}
                >
                  ...see more
                </span>
              )}
            </span>

          ) : (
            <span>
              {announce.message}
              {announce.message.length > summaryLength && (
                <span 
                style={{ cursor: 'pointer', color: 'var(--grey-light)' }}
                onClick={toggleSummary}
                >
                  ...see less
                </span>
              )}
            </span>
          )
          
        }
        </li>

      );
  }




//Main component

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

  const [seeMoreTransactionHistory, setSeeMoreTransactionHistory] = useState(5);
  const isShowMoreRef = useRef(null);

  //to change the more to less and vice versa
  const handleShowMoreChange = () => {
    if((filteredTransactions.length - seeMoreTransactionHistory)< 5 && 
       (filteredTransactions.length - seeMoreTransactionHistory)>= 0){
        isShowMoreRef.current.textContent = 'less '
    } else{
      isShowMoreRef.current.textContent = 'more '
    }
  }

//A callback function that changes the state of transaction and calls the ref state change function
  const handleTransactionHistory = (callback) =>{
    if (seeMoreTransactionHistory < filteredTransactions.length){
      setSeeMoreTransactionHistory(prev => prev + 5);
      callback();
      
    } else if (seeMoreTransactionHistory >= filteredTransactions.length){
      callback();
      setSeeMoreTransactionHistory(5);
    }

  }


  //limit the number of transactions displayed to 5
  const recentTransaction = filteredTransactions.slice(0, seeMoreTransactionHistory);

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
          <option value="failed">falied</option>
        </select>
        </div>

        <div className="transaction-details">
        {recentTransaction.map((txn) => (
          <Transactions
          key={txn.id}
          transactionAmount={txn.amount.toLocaleString()}
          transactionStatus={txn.status === 'failed' ? <span style={{color: '#DD2F27'}}>{txn.status}</span> : txn.status === 'pending' ? <span style={{color: '#FEC51D'}}>{txn.status}</span> : <span style={{color: 'var(--orange)'}}>{txn.status}</span>} 
          transactionType={txn.type}
          transactionMonth={txn.month}
          transactionDay={txn.day}
          transactionTime={txn.time}
          transactionName={txn.type === "Withdraw" || txn.type === "Transfer" ? txn.name : ""}
          

          preposition={txn.type === "Transfer" ? "to" : txn.type === "Withdraw" ? "" : "" }
          />
        )
        )} 
        <p style={{textAlign: 'center'
                  , paddingTop: '20px',
                  color: 'var(--grey-middle)',
                  cursor: 'pointer'
                  }} 
                  onClick={()=> {handleTransactionHistory(handleShowMoreChange)}} 
                  
                  >
                  ...See <span ref={isShowMoreRef}>more </span>transactions</p>
        </div>

        <div className="annoucement">
          <h4>Annoucement</h4>
          <ul>
            {announcements.map((announce) => (
              <AnnouncementListItems
              key={announce.id}
              announce = {announce}
              />
            ))}
          </ul>
        </div>
        <Footer />

    </div>
  )
};

export default DashboardTransactions