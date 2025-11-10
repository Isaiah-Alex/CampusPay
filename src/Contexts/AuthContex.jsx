import React, { useState, useContext, createContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext({
  accountNo: 0,
  setAccountNo: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accountNo, setAccountNo] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // fetch account number from Firestore
        const userRef = doc(db, "user", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setAccountNo(userSnap.data().accountNo || null);
        }
      } else {
        setAccountNo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const contextValue = {
    accountNo,
    setAccountNo,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
