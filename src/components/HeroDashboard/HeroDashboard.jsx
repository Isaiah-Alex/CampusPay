import React, { useRef, useState, useEffect } from 'react'
import security_icon from '../../assets/security-icon.svg'
import eye_icon from '../../assets/eye-icon.svg'
import naira_icon from '../../assets/naira-icon.svg'
import right_arrow_icon from '../../assets/right-arrow-icon.svg'
import texture from '../../assets/Background-texture.svg'
import './HeroDashboard.css'
import closed_eye_icon from '../../assets/close-eye-icon.svg'
import { auth, db } from '../../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore';

const HeroDashboard = () => {

  //to get userName
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // look for the document in "user" collection where uid matches
        const q = query(collection(db, "user"), where("uid", "==", user.uid));
        const docs = await getDocs(q);

        if (!docs.empty) {
          setName(docs.docs[0].data().name);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserName();
  }, []);




  //end of getting userName


const [isBalanceDisplaying, setIsBalanceDisplaying] = useState(true);
const openEyeRef = useRef();
const ClosedEyeRef = useRef();

const handleBalanceDisplay = (e) => {
  if (e.target === openEyeRef.current){
    openEyeRef.current.style.display = 'none';
    ClosedEyeRef.current.style.display = 'block';
    setIsBalanceDisplaying(false);
  } else if(e.target == ClosedEyeRef.current){
    openEyeRef.current.style.display = 'block';
    ClosedEyeRef.current.style.display = 'none';
    setIsBalanceDisplaying(true);
  }
}

const accountBalance = 10000.00;

  return (

    <div className='hero-dashboard'>
      <h2>Welcome, <span>{name || 'loading...'}!</span></h2>
      <div className="balance-display">
        <div className="left-balance-display">
            <div className="avaliable-balance">
                <img src={security_icon} alt="security icon" />
                <p>Avaliable Balance</p>
                <img src={eye_icon} alt="eye icon" onClick={handleBalanceDisplay} ref={openEyeRef}/>
                <img src={closed_eye_icon} alt="" onClick={handleBalanceDisplay} ref={ClosedEyeRef} />
            </div>
            <div className="balance">
                <img src={naira_icon} alt="naira icon" />
                {isBalanceDisplaying? <h1>{accountBalance.toLocaleString()}</h1> :
                                      <h1>{accountBalance
                                          .toString()
                                          .split('') 
                                          .map(() => '*')
                                          .join('')
                                          } </h1>}
            </div>
        </div>
        <div className="right-balance-display">
            <div className="transaction-history">
                <p>Transaction History</p>
                <img src={right_arrow_icon} alt="right arrow icon" />

            </div>
            <button className="btn dark"><span>+</span> Add Money</button>
        </div>
      </div>
      <div className="send-receive-withdraw">
        <button className="btn dark">Send Money</button>
        <button className="btn dark">Receive Money</button>
        <button className="btn dark">Withdraw</button>
      </div>
      <img  className='dashboard-texture' src={texture} alt="" />
    </div>
  )
}

export default HeroDashboard
