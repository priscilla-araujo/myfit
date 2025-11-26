import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform // << ADICIONADO
  ,
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

  // 📌 LISTA EM TEMPO REAL
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

  // 📌 EXCLUSÃO COMPATÍVEL COM WEB + MOBILE
  const excluirTreino = async (id) => {
    const user = auth.currentUser;
    if (!user) return alert("Usuário não autenticado!");

    // WEB → usa window.confirm
    if (Platform.OS === "web") {
      const confirmar = window.confirm("Deseja realmente excluir este treino?");
      if (!confirmar) return;

      try {
        console.log("🔥 Excluindo no WEB:", id);
        await deleteDoc(doc(db, "users", user.uid, "treinos", id));
        alert("Treino excluído com sucesso!");
      } catch (error) {
        alert("Erro: " + error.message);
      }
      return;
    }

    // ANDROID / IOS → usa Alert-native
    Alert.alert(
      "Excluir treino?",
      "Deseja realmente apagar este treino?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("🔥 Excluindo no MOBILE:", id);
              await deleteDoc(doc(db, "users", user.uid, "treinos", id));
              Alert.alert("Sucesso", "Treino excluído!");
            } catch (error) {
              Alert.alert("Erro", error.message);
            }
          }
        }
      ]
    );
  };

  // 📌 ITEM DA LISTA
  const renderItem = ({ item }) => (
    <View style={[styles.card, { marginBottom: 12 }]}>

      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.label}>Tipo: <Text style={{ color: "#FFF" }}>{item.tipo}</Text></Text>
      <Text style={styles.label}>Duração: <Text style={{ color: "#FFF" }}>{item.duracao} min</Text></Text>
      <Text style={styles.label}>Data: <Text style={{ color: "#FFF" }}>{item.data}</Text></Text>

      <View style={{ flexDirection: "row", marginTop: 12, gap: 10 }}>

        {/* -------- BOTÃO EDITAR -------- */}
        <Pressable
          style={[styles.primaryBtn, { flex: 1, overflow: "hidden" }]}
          onPress={() => router.push(`/editarTreino?id=${item.id}`)}
        >
          <LinearGradient
            colors={["#FFA726", "#FB8C00"]}
            style={[styles.primaryBtnGradient, { pointerEvents: "none" }]}
          >
            <Text style={styles.primaryBtnLabel}>Editar</Text>
          </LinearGradient>
        </Pressable>

        {/* -------- BOTÃO EXCLUIR -------- */}
        <Pressable
          style={[styles.primaryBtn, { flex: 1, overflow: "hidden" }]}
          onPress={() => excluirTreino(item.id)}
        >
          <LinearGradient
            colors={["#E53935", "#B71C1C"]}
            style={[styles.primaryBtnGradient, { pointerEvents: "none" }]}
          >
            <Text style={styles.primaryBtnLabel}>Excluir</Text>
          </LinearGradient>
        </Pressable>

      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#050509", "#121219", "#181924"]}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />

      <View style={{ padding: 20, flex: 1 }}>
        
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Text style={styles.welcome}>Meus Treinos</Text>

          <Pressable
            onPress={() => router.push("/novoTreino")}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: "#FF7A2F",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#FFF", fontSize: 28, fontWeight: "bold" }}>+</Text>
          </Pressable>
        </View>

        <FlatList
          data={treinos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={() => (
            <Text style={{ color: "#8F8FA0", marginTop: 20 }}>
              Nenhum treino registrado ainda.
            </Text>
          )}
        />
      </View>

    </LinearGradient>
  );
}
