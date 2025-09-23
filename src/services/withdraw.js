import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function withdraw(uid, amount) {
  const userRef = doc(db, "user", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) throw new Error("User not found");

  const balance = snap.data().balance || 0;
  if (balance < amount) throw new Error("Insufficient funds");

  await updateDoc(userRef, { balance: balance - amount });
}
