import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function transfer(senderUid, receiverUid, amount) {
  const senderRef = doc(db, "user", senderUid);
  const receiverRef = doc(db, "user", receiverUid);

  const senderSnap = await getDoc(senderRef);
  const receiverSnap = await getDoc(receiverRef);

  if (!senderSnap.exists() || !receiverSnap.exists())
    throw new Error("Sender or receiver not found");

  const senderBalance = senderSnap.data().balance || 0;
  if (senderBalance < amount) throw new Error("Insufficient funds");

  await updateDoc(senderRef, { balance: senderBalance - amount });
  await updateDoc(receiverRef, { balance: (receiverSnap.data().balance || 0) + amount });
}
