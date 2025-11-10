import { createContext, useState } from "react"
import transactionDetails from '../assets/transaction_details.json'
import { db } from "../firebase";
const TransactionsContext = createContext(null);

// { "id": 1, "type": "Transfer", "name": "Jason Jeremiah", "month":"August", "day": "31", "time": "01:24:36", "amount": 230000, "status": "pending" },

const TransactionsProvider = ({children}) => {
    const [transactions, setTransactions] = useState([]);

    const addTransaction = (data) => {

        const {type, account_no, amount, time} = data
         

    }

  return (
    <TransactionsContext.Provider>
      {children}
    </TransactionsContext.Provider>
  )
}

export default TransactionsProvider
