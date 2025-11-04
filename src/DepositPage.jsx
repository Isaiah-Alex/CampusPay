import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connectWallet } from './wallet'; // Your existing wallet.js
import { 
  depositToContract, 
  getETHToNairaRate, 
  checkNetwork 
} from './contractService'; // The new file
import { auth, db } from './firebase'; // Your Firebase config
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const DepositPage = () => {
  // Wallet states
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);

  // Deposit states
  const [ethAmount, setEthAmount] = useState('');
  const [nairaAmount, setNairaAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Get current Firebase user
  const currentUser = auth.currentUser;

  // Fetch exchange rate on mount
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  // Calculate Naira amount when ETH amount changes
  useEffect(() => {
    if (ethAmount && exchangeRate) {
      const naira = parseFloat(ethAmount) * exchangeRate;
      setNairaAmount(naira.toFixed(2));
    } else {
      setNairaAmount(0);
    }
  }, [ethAmount, exchangeRate]);

  const fetchExchangeRate = async () => {
    try {
      const rate = await getETHToNairaRate();
      setExchangeRate(rate);
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      toast.error('Failed to fetch exchange rate');
    }
  };

  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      
      // Use your existing connectWallet function
      const wallet = await connectWallet();
      
      setAccount(wallet.account);
      setWalletBalance(wallet.balance);
      setSigner(wallet.signer);
      setProvider(wallet.provider);
      setWalletConnected(true);

      // Check if on correct network
      await checkNetwork(wallet.provider);

      const shortAddress = `${wallet.account.substring(0, 6)}...${wallet.account.substring(38)}`;
      showMessage(`Wallet connected: ${shortAddress}`, 'success');
      toast.success(`Wallet connected: ${shortAddress}`);
    } catch (error) {
      console.error('Connection error:', error);
      showMessage(error.message, 'error');
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    // Validations
    if (!currentUser) {
      const errorMsg = 'Please login to your account first';
      showMessage(errorMsg, 'error');
      toast.error(errorMsg);
      return;
    }

    if (!walletConnected) {
      const errorMsg = 'Please connect your MetaMask wallet first';
      showMessage(errorMsg, 'error');
      toast.error(errorMsg);
      return;
    }

    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      const errorMsg = 'Please enter a valid amount';
      showMessage(errorMsg, 'error');
      toast.error(errorMsg);
      return;
    }

    if (parseFloat(ethAmount) > parseFloat(walletBalance)) {
      const errorMsg = 'Insufficient ETH balance in your wallet';
      showMessage(errorMsg, 'error');
      toast.error(errorMsg);
      return;
    }

    try {
      setLoading(true);
      const processingMsg = 'Processing deposit... Please confirm in MetaMask';
      showMessage(processingMsg, 'info');
      toast.info(processingMsg);

      // Make deposit to smart contract using your signer
      const result = await depositToContract(
        signer,
        ethAmount,
        currentUser.uid
      );

      console.log('Deposit successful:', result);

      // Update Firebase balance with Naira amount
      await updateUserBalance(parseFloat(nairaAmount));

      // Save transaction record
      await saveTransaction(result, parseFloat(ethAmount), parseFloat(nairaAmount));

      const successMsg = `Deposit successful! ₦${parseFloat(nairaAmount).toLocaleString()} has been added to your account`;
      showMessage(successMsg, 'success');
      toast.success(successMsg);

      // Reset form
      setEthAmount('');
      setNairaAmount(0);

      // Refresh wallet balance
      const updatedWallet = await connectWallet();
      setWalletBalance(updatedWallet.balance);

    } catch (error) {
      console.error('Deposit failed:', error);

      let errorMessage = 'Deposit failed. Please try again.';

      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        errorMessage = 'Transaction was cancelled';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient ETH for transaction and gas fees';
      } else if (error.message.includes('user rejected') || error.message.includes('denied')) {
        errorMessage = 'Transaction was rejected in MetaMask';
      } else if (error.message) {
        errorMessage = error.message;
      }

      showMessage(errorMessage, 'error');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update user's Naira balance in Firebase
  const updateUserBalance = async (nairaAmount) => {
    try {
      // Using "user" collection as per your firebase.js
      const userRef = doc(db, 'user', currentUser.uid);
      
      await updateDoc(userRef, {
        balance: increment(nairaAmount),
        lastUpdated: new Date().toISOString()
      });

      console.log('✅ Firebase balance updated');
    } catch (error) {
      console.error('Error updating balance:', error);
      throw new Error('Failed to update account balance in database');
    }
  };

  // Save transaction to Firebase
  const saveTransaction = async (txResult, ethAmount, nairaAmount) => {
    try {
      const txRef = doc(db, 'transactions', txResult.transactionHash);
      
      await setDoc(txRef, {
        userId: currentUser.uid,
        type: 'deposit',
        method: 'ethereum',
        ethAmount: ethAmount,
        nairaAmount: nairaAmount,
        exchangeRate: exchangeRate,
        walletAddress: account,
        transactionHash: txResult.transactionHash,
        blockNumber: txResult.blockNumber,
        gasUsed: txResult.gasUsed,
        status: 'completed',
        timestamp: new Date().toISOString(),
        createdAt: new Date()
      });

      console.log('✅ Transaction logged');
    } catch (error) {
      console.error('Error saving transaction:', error);
      // Don't throw error - balance was already updated
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const getMessageStyle = () => {
    const baseStyle = {
      marginTop: '20px',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500'
    };

    if (messageType === 'success') {
      return {
        ...baseStyle,
        background: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb'
      };
    } else if (messageType === 'error') {
      return {
        ...baseStyle,
        background: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb'
      };
    } else {
      return {
        ...baseStyle,
        background: '#d1ecf1',
        color: '#0c5460',
        border: '1px solid #bee5eb'
      };
    }
  };

  return (
    <>
    <div style={{ 
      maxWidth: '550px', 
      margin: '50px auto', 
      padding: '30px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginTop: 0, color: '#333' }}>Deposit ETH</h2>

      {/* Exchange Rate Display */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <p style={{ margin: 0, color: '#495057' }}>
          <strong>Exchange Rate:</strong> 1 ETH = ₦{exchangeRate.toLocaleString('en-NG')}
        </p>
         <Link
          to={"/dashboard"}
          style={{ textDecoration: "none", color: "var(--white)" }}
        >
          <p className="back-to-dashboard"> Back to Dashboard</p>
        </Link>
      </div>

      {/* Wallet Connection */}
      {!walletConnected ? (
        <button
          onClick={handleConnectWallet}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px',
            transition: 'background 0.3s'
          }}
        >
          {loading ? 'Connecting...' : '🦊 Connect MetaMask'}
        </button>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            background: '#e7f5e7', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '10px',
            border: '1px solid #c3e6cb'
          }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#155724' }}>
              <strong>Connected Wallet</strong>
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: '#155724', wordBreak: 'break-all' }}>
              {account}
            </p>
          </div>
          <div style={{ 
            background: '#fff3cd', 
            padding: '12px', 
            borderRadius: '8px',
            border: '1px solid #ffc107'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
              <strong>Balance:</strong> {parseFloat(walletBalance).toFixed(4)} ETH
            </p>
          </div>
        </div>
      )}

      {/* Deposit Form */}
      {walletConnected && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: '600',
              color: '#495057'
            }}>
              Amount to Deposit (ETH)
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              placeholder="0.01"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                border: '2px solid #ced4da',
                borderRadius: '8px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border 0.3s'
              }}
              onFocus={(e) => e.target.style.border = '2px solid #007bff'}
              onBlur={(e) => e.target.style.border = '2px solid #ced4da'}
            />
            <small style={{ color: '#6c757d', fontSize: '12px' }}>
              Available: {parseFloat(walletBalance).toFixed(4)} ETH
            </small>
          </div>

          {/* Converted Amount Display */}
          {nairaAmount > 0 && (
            <div style={{
              background: '#fff8e1',
              padding: '18px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '2px solid #ffc107'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
                <strong>You will receive:</strong>
              </p>
              <p style={{ 
                margin: '8px 0 0 0', 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#f57c00'
              }}>
                ₦{parseFloat(nairaAmount).toLocaleString('en-NG', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
          )}

          {/* Deposit Button */}
          <button
            onClick={handleDeposit}
            disabled={loading || !ethAmount || parseFloat(ethAmount) <= 0}
            style={{
              width: '100%',
              padding: '16px',
              background: (loading || !ethAmount || parseFloat(ethAmount) <= 0) 
                ? '#6c757d' 
                : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (loading || !ethAmount || parseFloat(ethAmount) <= 0) 
                ? 'not-allowed' 
                : 'pointer',
              transition: 'background 0.3s'
            }}
          >
            {loading ? '⏳ Processing...' : '💰 Deposit Now'}
          </button>
        </>
      )}

      {/* Message Display */}
      {message && (
        <div style={getMessageStyle()}>
          {message}
        </div>
      )}

      {/* Information Section */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#495057'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: '12px', color: '#343a40' }}>
          ℹ️ Important Information
        </h4>
        <ul style={{ paddingLeft: '20px', margin: 0, lineHeight: '1.8' }}>
          <li>This is on <strong>Sepolia Testnet</strong> for testing</li>
          <li>ETH is automatically converted to Naira in your account</li>
          <li>Transaction takes 10-30 seconds to confirm</li>
          <li>You'll need ETH to pay for gas fees</li>
          <li>Your balance updates immediately after confirmation</li>
        </ul>
      </div>
    </div>
     <Link
          to={"/dashboard"}
          style={{ textDecoration: "none", color: "var(--white)", textAlign: 'center', marginBottom: '20px' }}
        >
          <p className="back-to-dashboard"> Back to Dashboard</p>
        </Link>
    </>
  );
};

export default DepositPage;