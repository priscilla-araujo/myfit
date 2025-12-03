// firebase.js
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// 🔥 Evita erro de inicialização duplicada
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Exporta serviços Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
