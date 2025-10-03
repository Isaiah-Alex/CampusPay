import React from 'react'
import './Transactions.css';
import orange_naira_icon from '../../assets/orange-naira-icon.svg'
import { withdraw } from '../../services/withdraw';
// import transactionDetails from '../../assets/transaction_details.json'

const Transactions = ({transactionAmount,transactionStatus,transactionType,transactionName,transactionMonth, transactionDay, transactionTime,preposition, limit}) => {
  // formatTransaction = () => {
  //   const transactions = transactionDetails.map();

  // }
  const formatTransactionName = (name) => {
    const summaryLength = 20;
    if (name.length === 0){
      return '';
    } else if(name.length < summaryLength){
      return name;
    } else if(name.length > summaryLength){
      return (name.substring(0, summaryLength) + '...')
    }
  }

  const changeSign = (type) => {
    if (type.toLowerCase() === 'withdraw' || type.toLowerCase() === 'transfer' ){
      return '-';
    }else{
      return '+'
    }
  } 
  

  return (
    <div className='transactions'>
        <div className="transaction-left">
            <h4>{`${transactionType} ${preposition} ${formatTransactionName(transactionName)}`}</h4>
            <p>{`${transactionMonth} ${transactionDay}, ${transactionTime}`}</p>
        </div>
        <div className="transaction-right">
          <div className="transaction-right-amount">
            <span style={{fontSize: '18px', paddingBottom: '4px'}}>{changeSign(transactionType)}</span>
            <img src={orange_naira_icon} alt="" />
            <p>{transactionAmount}</p>
          </div>
            <p className={transactionStatus}>{transactionStatus}</p>

        </div>
        <div>
        </div>
    </div>
  )
}

export default Transactions