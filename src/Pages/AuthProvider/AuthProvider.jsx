import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import app from "../../firebase/firebase.config";

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (userInfo) => {
    return updateProfile(auth.currentUser, userInfo);
  };

  const googleUser = (provider) => {
    return signInWithPopup(auth, provider);
  };

  const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const verifyUser = () => {
    return sendEmailVerification(auth.currentUser);
  };

  const passwordEmail = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      //   console.log("user Observing");
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    createUser,
    updateUser,
    googleUser,
    loginUser,
    verifyUser,
    passwordEmail,
    user,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;