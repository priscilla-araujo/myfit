import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 🚀 GARANTE QUE O DOCUMENTO DO USER EXISTE NO FIRESTORE
        await criarDocumentoUser(currentUser.uid);

        setUser(currentUser);
      } else {
        setUser(null);
      }

      setLoadingAuth(false);
    });

    return unsub;
  }, []);

  // ⚡ Cria o documento no Firestore caso não exista
  const criarDocumentoUser = async (uid) => {
    try {
      await setDoc(
        doc(db, "users", uid),
        {
          criadoEm: new Date(),
        },
        { merge: true } // evita sobrescrever algo existente
      );
    } catch (e) {
      console.log("Erro ao criar documento do usuário:", e);
    }
  };

  // 💬 LOGIN
  const signIn = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);

    // cria documento do usuário
    await criarDocumentoUser(res.user.uid);

    return res.user;
  };

  // ✨ REGISTRO
  const signUp = async (email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    // cria documento do usuário
    await criarDocumentoUser(res.user.uid);

    return res.user;
  };

  // 🚪 SAIR
  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingAuth,
        signIn,
        signUp,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
