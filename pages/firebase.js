// firebase.js
import { initializeApp } from "@firebase/app";
import { getReactNativePersistence, initializeAuth } from "@firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBxfCRUqS9erTeoEH4mK0Lb61o-VdhDMpY",
  authDomain: "teste1-13afd.firebaseapp.com",
  projectId: "teste1-13afd",
  storageBucket: "teste1-13afd.firebasestorage.app",
  messagingSenderId: "959884756085",
  appId: "1:959884756085:web:bcc0193bbb54e1c605243c",
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
