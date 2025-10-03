import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc
} from "firebase/firestore";
import { toast } from "react-toastify";

// Use environment variables (Vite requires VITE_ prefix)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Register Student
const registerStudent = async (name, matNo, password) => {
  try {
    const fakeEmail = `${matNo}@gmail.com`; 
    const res = await createUserWithEmailAndPassword(auth, fakeEmail, password);
    const user = res.user;

    await setDoc(doc(db, "user", user.uid), {
      uid: user.uid,
      name,
      email: fakeEmail,
      role: "student",
      accountNo: matNo,   // ✅ account number = mat number
      balance: 1000000000,
      createdAt: new Date()
    });
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

// Register Vendor
const registerVendor = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // generate vendor account number
    const prefix = 'VND';
    const number = Math.floor(100000 + Math.random() * 900000);
    const year = new Date().getFullYear();
    const yearSum = year.toString().split('').reduce((acc, d) => acc + Number(d), 0);
    const accountNo = `${prefix}${number}${yearSum}`;

    await setDoc(doc(db, "user", user.uid), {
      uid: user.uid,
      name,
      email,
      role: "vendor",
      accountNo,  // ✅ save generated account number
      balance: 0,
      createdAt: new Date()
    });
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

// Login Student
const loginStudent = async (matNo, password) => {
  try {
    const fakeEmail = `${matNo}@gmail.com`; // convert mat number to email
    await signInWithEmailAndPassword(auth, fakeEmail, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

// Login Vendor
const loginVendor = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

// Logout
const logout = () => {
  signOut(auth);
};

export { auth, db, registerStudent, registerVendor, loginStudent, loginVendor, logout };
