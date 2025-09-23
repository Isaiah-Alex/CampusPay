import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

export async function deposit(uid, amount) {
  const userRef = doc(db, "user", uid);
  await updateDoc(userRef, { balance: increment(amount) });
}
