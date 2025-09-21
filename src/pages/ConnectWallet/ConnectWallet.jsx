import React, { useState } from "react";
import "./ConnectWallet.css";
import wallet from "../../assets/wallet-illustration.svg";
import wallet_icon from "../../assets/wallet-icon.svg";
import vector from "../../assets/Vector.svg";
import { connectWallet } from "../../wallet";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"

const ConnectWallet = () => {
  // state variables
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  // handle wallet connection
  const handleConnect = async () => {
    try {
      const { account, balance } = await connectWallet();
      setAccount(account);
      setBalance(balance);
    } catch (err) {
      alert(err.message);
    }
  };

  // handle wallet disconnect
  const handleDisconnect = () => {
    setAccount(null);
    setBalance(null);
  };

  return (
    <div className="connect-wallet-container">
      <div className="connect-wallet">
        <div className="connect-title">
          {account ? (
            <h1>
              Wallet <span>Connected</span>
            </h1>
          ) : (
            <h1>
              <span>Connect Your</span> Wallet
            </h1>
          )}

          {/* ✅ Show wallet details */}
          {account ? (
            <p>
              <strong>Address:</strong> {account} <br />
              <strong>Balance:</strong> <span style={{color: 'var(--orange)'}} >{balance} ETH</span>
            </p>
          ) : (
            <p>Kindly connect your wallet to your account</p>
          )}
        </div>

        <img src={wallet} alt="wallet-svg" />

        <div className="connect-wallet-button">
          <img src={wallet_icon} alt="wallet-icon" />
          <button onClick={account ? handleDisconnect : handleConnect}>
            {account ? "Disconnect Wallet" : "Connect Wallet"}
          </button>
        </div>

        {/* link to dashboard */}
        <Link to={'/dashboard'} style={{textDecoration: 'none', color: 'var(--white)'}} >  
        <p className="back-to-dashboard"> Back to Dadhboard</p>
        </Link>
      </div>

      <img src={vector} alt="" className="connect-left-vector" />
      <img src={vector} alt="" className="connect-right-vector" />
    </div>
  );
};

export default ConnectWallet;
