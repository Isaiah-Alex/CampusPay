import React, { useRef, useState, useEffect } from 'react'
import security_icon from '../../assets/security-icon.svg'
import eye_icon from '../../assets/eye-icon.svg'
import naira_icon from '../../assets/naira-icon.svg'
import right_arrow_icon from '../../assets/right-arrow-icon.svg'
import texture from '../../assets/Background-texture.svg'
import './HeroDashboard.css'
import closed_eye_icon from '../../assets/close-eye-icon.svg'
import { auth, db } from '../../firebase'


import { doc, onSnapshot, getDoc } from 'firebase/firestore'

import { withdraw } from '../../services/withdraw'
import { deposit } from '../../services/deposit'
import { transfer } from '../../services/transfer'

const HeroDashboard = () => {
  const [name, setName] = useState('')
  const [balance, setBalance] = useState(1000)
  const [amount, setAmount] = useState('')
  const [receiverUid, setReceiverUid] = useState('')

  // Fetch user name (one-time, not real-time)
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth.currentUser
        if (!user) return

        const userRef = doc(db, "user", user.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          setName(userSnap.data().name)
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
      }
    }

    fetchUserName()
  }, [])

  // Real-time balance listener
  useEffect(() => {
    if (!auth.currentUser) return
    const userRef = doc(db, "user", auth.currentUser.uid)

    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) setBalance(snap.data().balance || 0)
    })

    return () => unsub()
  }, [])

  // Eye toggle
  const [isBalanceDisplaying, setIsBalanceDisplaying] = useState(true)
  const openEyeRef = useRef()
  const closedEyeRef = useRef()

  const handleBalanceDisplay = (e) => {
    if (e.target === openEyeRef.current) {
      openEyeRef.current.style.display = 'none'
      closedEyeRef.current.style.display = 'block'
      setIsBalanceDisplaying(false)
    } else if (e.target === closedEyeRef.current) {
      openEyeRef.current.style.display = 'block'
      closedEyeRef.current.style.display = 'none'
      setIsBalanceDisplaying(true)
    }
  }

  // Actions
  const handleDeposit = async () => {
    await deposit(auth.currentUser.uid, Number(amount))
    setAmount('')
  }

  const handleWithdraw = async () => {
    try {
      await withdraw(auth.currentUser.uid, Number(amount))
      setAmount('')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleTransfer = async () => {
    try {
      await transfer(auth.currentUser.uid, receiverUid, Number(amount))
      setAmount('')
      setReceiverUid('')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className='hero-dashboard'>
      <h2>Welcome, <span>{name || 'loading...'}!</span></h2>

      <div className="balance-display">
        <div className="left-balance-display">
          <div className="avaliable-balance">
            <img src={security_icon} alt="security icon" />
            <p>Available Balance</p>
            <img src={eye_icon} alt="eye icon" onClick={handleBalanceDisplay} ref={openEyeRef} />
            <img src={closed_eye_icon} alt="closed eye icon" onClick={handleBalanceDisplay} ref={closedEyeRef} />
          </div>

          <div className="balance">
            <img src={naira_icon} alt="naira icon" />
            {isBalanceDisplaying
              ? <h1>{balance.toLocaleString()}</h1>
              : <h1>{balance.toString().split('').map(() => '*').join('')}</h1>
            }
          </div>
        </div>

        <div className="right-balance-display">
          <div className="transaction-history">
            <p>Transaction History</p>
            <img src={right_arrow_icon} alt="right arrow icon" />
          </div>

          <button className="btn dark" onClick={handleDeposit}>
            <span>+</span> Add Money
          </button>
        </div>
      </div>

      <div className="send-receive-withdraw">
        <button className="btn dark" onClick={handleTransfer}>Send Money</button>
        <button className="btn dark">Receive Money</button>
        <button className="btn dark" onClick={handleWithdraw}>Withdraw</button>
      </div>

      {/* Simple inputs for testing deposit/transfer */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Receiver UID (for transfer)"
          value={receiverUid}
          onChange={(e) => setReceiverUid(e.target.value)}
        />
      </div>

      <img className='dashboard-texture' src={texture} alt="" />
    </div>
  )
}

export default HeroDashboard
