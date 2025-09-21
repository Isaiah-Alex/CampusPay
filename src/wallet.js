import { ethers } from "ethers";

// To Connect the account to MetaMask
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not found. Please install it!");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const account = await signer.getAddress();
  const balance = await provider.getBalance(account);

  return {
    account,
    balance: ethers.formatEther(balance),
    signer,
    provider,
  };
};

// To Send ETH to another account
export const sendEth = async (signer, to, amount) => {
  const tx = await signer.sendTransaction({
    to,
    value: ethers.parseEther(amount), // NB: This amount is a string 
  });

  await tx.wait(); // to Wait for confirmation
  return tx.hash;
};
