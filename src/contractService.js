import { ethers } from "ethers";

// Get contract address from environment variable
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Contract ABI - Interface for your deposit contract
const CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "userId", "type": "string"}],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDeposits",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "depositor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "userId", "type": "string"}
    ],
    "name": "DepositMade",
    "type": "event"
  }
];

/**
 * Deposit ETH to the smart contract
 * This will work with your existing wallet connection
 * @param {object} signer - Signer from your connectWallet function
 * @param {string} amountInETH - Amount in ETH (e.g., "0.01")
 * @param {string} userId - Firebase user ID
 */
export const depositToContract = async (signer, amountInETH, userId) => {
  try {
    // Create contract instance with signer
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Convert ETH to Wei
    const amountInWei = ethers.parseEther(amountInETH);

    console.log("Sending deposit transaction...");
    
    // Call the deposit function
    const tx = await contract.deposit(userId, {
      value: amountInWei
    });

    console.log("Transaction sent! Hash:", tx.hash);
    console.log("Waiting for confirmation...");

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    console.log("Transaction confirmed!", receipt);

    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };

  } catch (error) {
    console.error("Deposit error:", error);
    throw error;
  }
};

/**
 * Get the total deposits in the contract
 */
export const getTotalDeposits = async (provider) => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const total = await contract.totalDeposits();
    return ethers.formatEther(total);
  } catch (error) {
    console.error("Error getting total deposits:", error);
    throw error;
  }
};

/**
 * Get contract balance
 */
export const getContractBalance = async (provider) => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const balance = await contract.getBalance();
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error getting contract balance:", error);
    throw error;
  }
};

/**
 * Get ETH to Naira exchange rate
 */
export const getETHToNairaRate = async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=ngn'
    );
    const data = await response.json();
    return data.ethereum.ngn;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    // Fallback rate if API fails
    return 5000000; // Update this manually
  }
};

/**
 * Convert ETH to Naira
 */
export const convertETHToNaira = async (ethAmount) => {
  const rate = await getETHToNairaRate();
  const nairaAmount = parseFloat(ethAmount) * rate;
  return Math.round(nairaAmount * 100) / 100;
};

/**
 * Check if user is on Sepolia network
 */
export const checkNetwork = async (provider) => {
  try {
    const network = await provider.getNetwork();
    const chainId = network.chainId;
    
    // Sepolia chainId is 11155111
    if (chainId !== 11155111n) {
      throw new Error("Please switch to Sepolia Testnet");
    }
    
    return true;
  } catch (error) {
    console.error("Network check error:", error);
    throw error;
  }
};