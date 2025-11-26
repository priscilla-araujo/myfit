import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform // << IMPORT ADICIONADO
  ,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View
} from "react-native";
import { auth, db } from "./firebase";
import { getSharedStyles } from "./styles";

export default function EditarTreino() {
  const styles = getSharedStyles();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [nome, setNome] = useState("");
  const [duracao, setDuracao] = useState("");
  const [tipo, setTipo] = useState("");
  const [data, setData] = useState("");

  const user = auth.currentUser;

  // 🔥 Carregar dados do treino
  useEffect(() => {
    async function carregar() {
      if (!user || !id) return;

      try {
        const ref = doc(db, "users", user.uid, "treinos", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const t = snap.data();
          setNome(t.nome || "");
          setDuracao(String(t.duracao || ""));
          setTipo(t.tipo || "");
          setData(t.data || "");
        }
      } catch (err) {
        alert("Erro ao carregar treino!");
      }
    }

    carregar();
  }, []);

  // 🔥 Salvar alteração
  const salvar = async () => {
    if (!user) {
      alert("Usuário não autenticado!");
      return;
    }

    try {
      const ref = doc(db, "users", user.uid, "treinos", id);
      await updateDoc(ref, { nome, duracao, tipo, data });

      // WEB → usa alert normal
      if (Platform.OS === "web") {
        alert("Treino atualizado com sucesso! 😎");
        router.replace("/treinos");
        return;
      }

      // MOBILE → usa Alert do sistema
      Alert.alert("Sucesso", "Treino atualizado com sucesso!", [
        { text: "OK", onPress: () => router.replace("/treinos") },
      ]);

    } catch (err) {
      alert("Erro ao salvar alterações!");
    }
  };

  return (
    <LinearGradient colors={["#050509", "#121219", "#181924"]} style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Editar Treino</Text>

          <Text style={styles.label}>Nome</Text>
          <View style={styles.inputWrapper}>
            <TextInput value={nome} onChangeText={setNome} style={styles.input}/>
          </View>

          <Text style={styles.label}>Duração (min)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={duracao}
              onChangeText={setDuracao}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.label}>Tipo</Text>
          <View style={styles.inputWrapper}>
            <TextInput value={tipo} onChangeText={setTipo} style={styles.input}/>
          </View>

          <Text style={styles.label}>Data</Text>
          <View style={styles.inputWrapper}>
            <TextInput value={data} onChangeText={setData} style={styles.input}/>
          </View>

          {/* 🔥 BOTÃO SALVAR FUNCIONANDO NO WEB */}
          <Pressable
            onPress={salvar}
            style={[styles.primaryBtn, { marginTop: 20, overflow: "hidden" }]}
          >
            <LinearGradient
              colors={["#FF7A2F", "#FF4E1A"]}
              style={[styles.primaryBtnGradient, { pointerEvents: "none" }]}
            >
              <Text style={styles.primaryBtnLabel}>Salvar</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
