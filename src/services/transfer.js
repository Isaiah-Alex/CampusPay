// src/services/transfer.js
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export const transfer = async (senderAccountNo, receiverAccountNo, amount) => {
  if (!senderAccountNo || !receiverAccountNo) throw new Error('Both sender and receiver account numbers are required');
  if (amount <= 0) throw new Error('Amount must be greater than 0');
  if (senderAccountNo === receiverAccountNo) throw new Error("You can't transfer to your own account");

  // Get sender
  const senderQuery = query(collection(db, 'user'), where('accountNo', '==', senderAccountNo));
  const senderSnap = await getDocs(senderQuery);
  if (senderSnap.empty) throw new Error('Sender account not found');
  const senderDoc = senderSnap.docs[0];
  const senderData = senderDoc.data();

  if (senderData.balance < amount) throw new Error('Insufficient balance');

  // Get receiver
  const receiverQuery = query(collection(db, 'user'), where('accountNo', '==', receiverAccountNo));
  const receiverSnap = await getDocs(receiverQuery);
  if (receiverSnap.empty) throw new Error('Receiver account not found');
  const receiverDoc = receiverSnap.docs[0];
  const receiverData = receiverDoc.data();

  // Update balances
  await updateDoc(doc(db, 'user', senderDoc.id), { balance: senderData.balance - amount });
  await updateDoc(doc(db, 'user', receiverDoc.id), { balance: receiverData.balance + amount });

  return true;
};
