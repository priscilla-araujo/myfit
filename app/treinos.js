import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View
} from "react-native";
import { auth, db } from "./firebase";
import { getSharedStyles } from "./styles";

export default function Treinos() {
  const styles = getSharedStyles();
  const router = useRouter();
  const [treinos, setTreinos] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = collection(db, "users", user.uid, "treinos");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTreinos(lista);
    });

    return unsubscribe;
  }, []);

  const renderItem = ({ item }) => (
    <Pressable style={[styles.card, { marginBottom: 12 }]}>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.label}>Tipo: <Text style={{ color: "#FFF" }}>{item.tipo}</Text></Text>
      <Text style={styles.label}>Duração: <Text style={{ color: "#FFF" }}>{item.duracao} min</Text></Text>
      <Text style={styles.label}>Data: <Text style={{ color: "#FFF" }}>{item.data}</Text></Text>
    </Pressable>
  );

  return (
    <LinearGradient
      colors={["#050509", "#121219", "#181924"]}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />

      <View style={{ padding: 20 }}>
        <Text style={styles.welcome}>Meus Treinos</Text>

        <FlatList
          data={treinos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <Text style={{ color: "#8F8FA0", marginTop: 20 }}>
              Nenhum treino registrado ainda.
            </Text>
          )}
        />

        <Pressable
          style={styles.primaryBtn}
          onPress={() => router.push("/novotreino")}
        >
          <LinearGradient
            colors={["#FF7A2F", "#FF4E1A"]}
            style={styles.primaryBtnGradient}
          >
            <Text style={styles.primaryBtnLabel}>Novo Treino</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
