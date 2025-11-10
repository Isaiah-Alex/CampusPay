// src/services/transfer.js
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';

export const transfer = async (senderAccountNo, receiverAccountNo, amount) => {
  // Validations
  if (!senderAccountNo || !receiverAccountNo) {
    throw new Error('Both sender and receiver account numbers are required');
  }
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  if (senderAccountNo === receiverAccountNo) {
    throw new Error("You can't transfer to your own account");
  }

  try {
    // Get sender
    const senderQuery = query(collection(db, 'user'), where('accountNo', '==', senderAccountNo));
    const senderSnap = await getDocs(senderQuery);
    
    if (senderSnap.empty) {
      throw new Error('Sender account not found');
    }
    
    const senderDoc = senderSnap.docs[0];
    const senderData = senderDoc.data();

    // Check balance
    if (senderData.balance < amount) {
      throw new Error(`Insufficient balance. Available: ₦${senderData.balance.toLocaleString()}`);
    }

    // Get receiver
    const receiverQuery = query(collection(db, 'user'), where('accountNo', '==', receiverAccountNo));
    const receiverSnap = await getDocs(receiverQuery);
    
    if (receiverSnap.empty) {
      throw new Error('Receiver account not found');
    }
    
    const receiverDoc = receiverSnap.docs[0];
    const receiverData = receiverDoc.data();

    // Perform transfer
    const newSenderBalance = senderData.balance - amount;
    const newReceiverBalance = receiverData.balance + amount;

    // Update sender
    await updateDoc(doc(db, 'user', senderDoc.id), { 
      balance: newSenderBalance,
      lastUpdated: serverTimestamp()
    });

    // Update receiver
    await updateDoc(doc(db, 'user', receiverDoc.id), { 
      balance: newReceiverBalance,
      lastUpdated: serverTimestamp()
    });

    // Log transaction (optional but recommended)
    await addDoc(collection(db, 'transactions'), {
      type: 'transfer',
      senderAccountNo,
      receiverAccountNo,
      senderName: senderData.name,
      receiverName: receiverData.name,
      amount,
      timestamp: serverTimestamp(),
      status: 'completed'
    });

    return {
      success: true,
      newBalance: newSenderBalance,
      receiverName: receiverData.name
    };

  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  }
};
