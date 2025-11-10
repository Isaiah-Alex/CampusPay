import React, { useRef, useState, useEffect } from 'react';
import security_icon from '../../assets/security-icon.svg';
import eye_icon from '../../assets/eye-icon.svg';
import naira_icon from '../../assets/naira-icon.svg';
import right_arrow_icon from '../../assets/right-arrow-icon.svg';
import texture from '../../assets/Background-texture.svg';
import closed_eye_icon from '../../assets/close-eye-icon.svg';
import './HeroDashboard.css';
import { auth, db } from '../../firebase';
import { doc, onSnapshot, getDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { withdraw } from '../../services/withdraw';
import { deposit } from '../../services/deposit';
import { transfer } from '../../services/transfer';
import { useAuth } from '../../Contexts/AuthContex';
import { Link } from 'react-router-dom';

const HeroDashboard = ({ scrollFunc }) => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [receiverAccountNo, setReceiverAccountNo] = useState('');
  const [isSendBtnClicked, setIsSendBtnClicked] = useState(false);
  const numberOfClickedRef = useRef(0);

  const { accountNo } = useAuth();

  // Fetch user name (one-time)
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(db, 'user', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setName(userSnap.data().name);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    fetchUserName();
  }, []);

  // Real-time balance listener
  useEffect(() => {
    if (!auth.currentUser) return;
    const userRef = doc(db, 'user', auth.currentUser.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) setBalance(snap.data().balance || 0);
    });
    return () => unsub();
  }, []);

  // Eye toggle
  const [isBalanceDisplaying, setIsBalanceDisplaying] = useState(true);
  const openEyeRef = useRef();
  const closedEyeRef = useRef();
  const handleBalanceDisplay = (e) => {
    if (e.target === openEyeRef.current) {
      openEyeRef.current.style.display = 'none';
      closedEyeRef.current.style.display = 'block';
      setIsBalanceDisplaying(false);
    } else if (e.target === closedEyeRef.current) {
      openEyeRef.current.style.display = 'block';
      closedEyeRef.current.style.display = 'none';
      setIsBalanceDisplaying(true);
    }
  };

  // Deposit
const handleDeposit = async () => {
  await deposit(accountNo, Number(amount)); // use accountNo
  setAmount('');
}

  // Withdraw
const handleWithdraw = async () => {
  try {
    await withdraw(accountNo, Number(amount)); // use accountNo
    setAmount('');
  } catch (err) {
    alert(err.message);
  }
}

  // Transfer
const handleTransfer = async () => {
  numberOfClickedRef.current++;
  
  if (numberOfClickedRef.current < 2) {
    setIsSendBtnClicked(true);
  } else {
    try {
      const transferAmount = Number(amount);
      const receiver = receiverAccountNo;
      
      // Validate inputs
      if (!receiver) {
        alert('Please enter receiver account number');
        return;
      }
      if (!transferAmount || transferAmount <= 0) {
        alert('Please enter a valid amount');
        return;
      }
      
      // Perform transfer
      const result = await transfer(accountNo, receiver, transferAmount);
      
      // Show success with receiver name
      const message = `Successfully sent ₦${transferAmount.toLocaleString()} to ${result.receiverName} (${receiver})`;
      console.log(message);
      alert(message);
      
      // Reset form
      setAmount('');
      setReceiverAccountNo('');
      setIsSendBtnClicked(false);
      numberOfClickedRef.current = 0;
      
      // Update balance display
      setBalance(result.newBalance); // if you have this state
      
    } catch (err) {
      console.error('Transfer error:', err);
      alert(`Transfer failed: ${err.message}`);
      
      // Reset counter on error
      numberOfClickedRef.current = 0;
      setIsSendBtnClicked(false);
    }
  }
}
  return (
    <>
      <div className="hero-dashboard">
        <div className="hero-dashboard__items">
          <div className='hero-welcome__header'>
            <h2>
              Welcome, <span>{name || 'Isaiah Alex'}</span>
            </h2>
            <p className="account-number">
              Acc No: <span>{accountNo || 'PSC2105296'}</span>
            </p>
          </div>
          <div className="hero-welcome__cards">
            <div className="balance-display">
              <div className="avaliable-balance">
                <img src={security_icon} alt="security icon" />
                <p>Available Balance</p>
                <img
                  src={eye_icon}
                  alt="eye icon"
                  onClick={handleBalanceDisplay}
                  ref={openEyeRef}
                />
                <img
                  src={closed_eye_icon}
                  alt="closed eye icon"
                  onClick={handleBalanceDisplay}
                  ref={closedEyeRef}
                />
              </div>

              <div className="balance">
                <img src={naira_icon} alt="naira icon" />
                {isBalanceDisplaying ? (
                  <h1>{balance.toLocaleString()}</h1>
                ) : (
                  <h1>{balance.toString().split('').map(() => '*').join('')}</h1>
                )}
              </div>
              <div className="transaction-history" onClick={scrollFunc}>
                <p>Transaction History</p>
                <img src={right_arrow_icon} alt="right arrow icon" />
              </div>

              <button className="btn dark" onClick={handleDeposit}>
                <span>+</span> Add Money
              </button>
            </div>

            <div className="send-receive-withdraw">
              <button className="btn dark" onClick={handleTransfer}>
                Send
              </button>
              
                <button className="btn dark"><Link style={{color: 'var(--grey-black)'}} to="/deposit">Receive</Link></button>

              <button className="btn dark" onClick={handleWithdraw}>
                Withdraw
              </button>
            </div>

            {isSendBtnClicked && (
              <div className="test-inputs">
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Receiver Account No"
                  value={receiverAccountNo}
                  onChange={(e) => setReceiverAccountNo(e.target.value)}
                />
              </div>
            )}
          </div>
          <img className="dashboard-texture" src={texture} alt=""/>
        </div>
      </div>
    </>
  );
};

export default HeroDashboard;
