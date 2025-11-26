// firebase.js
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDykfhBulSl7l5eTibdochOG3n97EtKE8Y",
  authDomain: "myfit-87bc8.firebaseapp.com",
  projectId: "myfit-87bc8",
  storageBucket: "myfit-87bc8.firebasestorage.app",
  messagingSenderId: "486805968738",
  appId: "1:486805968738:web:f50516f50a335f39533e3b",
  measurementId: "G-CC244QLKEQ"
};

// 🔥 Evita erro de inicialização duplicada
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Exporta serviços Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
