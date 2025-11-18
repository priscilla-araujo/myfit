import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, db } from "./firebase";
import { getSharedStyles } from "./styles";

export default function NovoTreino() {
  const styles = getSharedStyles();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [duracao, setDuracao] = useState("");
  const [tipo, setTipo] = useState("");
  const [data, setData] = useState("");

  const salvarTreino = async () => {
  const user = auth.currentUser;

  if (!user) {
    Alert.alert("Erro", "Você precisa estar logado.");
    return;
  }

  if (!nome || !duracao || !tipo || !data) {
    Alert.alert("Atenção", "Preencha todos os campos!");
    return;
  }

  try {
    await addDoc(collection(db, "users", user.uid, "treinos"), {
      nome,
      duracao,
      tipo,
      data,
      criadoEm: new Date(),
    });

    // 🏁 Limpa os campos antes de sair
    setNome("");
    setDuracao("");
    setTipo("");
    setData("");

    // 🎉 Agora sim! Alerta + Redirecionamento
   Alert.alert("Sucesso 🎉", "Treino salvo com sucesso!");
router.replace("/treinos");

  } catch (error) {
    console.log("Erro ao salvar treino:", error);
    Alert.alert("Erro", "Não foi possível salvar o treino.\n" + error.message);
  }
};


  return (
    <LinearGradient
      colors={["#050509", "#121219", "#181924"]}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Novo Treino</Text>

          <Text style={styles.label}>Nome</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ex: Peito"
              placeholderTextColor="#72727D"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <Text style={styles.label}>Duração (min)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ex: 45"
              placeholderTextColor="#72727D"
              keyboardType="numeric"
              value={duracao}
              onChangeText={setDuracao}
            />
          </View>

          <Text style={styles.label}>Tipo</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ex: Musculação"
              placeholderTextColor="#72727D"
              value={tipo}
              onChangeText={setTipo}
            />
          </View>

          <Text style={styles.label}>Data</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#72727D"
              value={data}
              onChangeText={setData}
            />
          </View>

          <Pressable style={styles.primaryBtn} onPress={salvarTreino}>
            <LinearGradient
              colors={["#FF7A2F", "#FF4E1A"]}
              style={styles.primaryBtnGradient}
            >
              <Text style={styles.primaryBtnLabel}>Salvar Treino</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
