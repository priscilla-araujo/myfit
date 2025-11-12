// components/AuthContext.js
import {
  auth, createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from "@firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  const signUp = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Sucesso", "Conta criada com sucesso!");
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login efetuado", "Bem-vindo!");
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Email enviado", "Verifique sua caixa de entrada.");
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, signIn, signUp, resetPassword, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
