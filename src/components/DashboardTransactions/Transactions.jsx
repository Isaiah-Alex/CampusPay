import React from 'react'
import './Transactions.css';
import orange_naira_icon from '../../assets/orange-naira-icon.svg'

const Transactions = ({transactionAmount,transactionStatus,transactionType,transactionName,transactionMonth, transactionDay, transactionTime,preposition}) => {
  return (
    <div className='transactions'>
        <div className="transaction-left">
            <h4>{`${transactionType} ${preposition} ${transactionName}`}</h4>
            <p>{`${transactionMonth} ${transactionDay}, ${transactionTime}`}</p>
        </div>
        <div className="transaction-right">
          <div className="transaction-right-amount">
            <img src={orange_naira_icon} alt="" />
            <p>{transactionAmount}</p>
          </div>
            <p className={transactionStatus}>{transactionStatus}</p>

        </div>
    </div>
  )
}

export default Transactions