import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

export default function Perfil() {
  const styles = getSharedStyles();
  const router = useRouter();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [objetivo, setObjetivo] = useState("");

  // =====================================================================
  // 🔥 Carregar dados do Firestore
  // =====================================================================
  const carregarPerfil = async () => {
    if (!user) return;

    try {
      const ref = doc(db, "users", user.uid, "perfil", "informacoes");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setNome(data.nome || "");
        setIdade(data.idade || "");
        setAltura(data.altura || "");
        setPeso(data.peso || "");
        setObjetivo(data.objetivo || "");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o perfil.");
    }

    setLoading(false);
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  // =====================================================================
  // 🔥 SALVAR PERFIL
  // =====================================================================
  const salvarPerfil = async () => {
    if (!nome || !idade || !altura || !peso || !objetivo) {
      return Alert.alert("Atenção", "Preencha todos os campos!");
    }

    try {
      setSaving(true);

      const ref = doc(db, "users", user.uid, "perfil", "informacoes");

      await setDoc(ref, {
        nome,
        idade,
        altura,
        peso,
        objetivo,
        atualizadoEm: new Date(),
      });

      await carregarPerfil();
      setEditMode(false);

      // 🔥 Mensagem de sucesso EXIBIDA APÓS SALVAR
      Alert.alert("Sucesso!", "As informações do perfil foram atualizadas corretamente. 🎉");
      
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar o perfil.");
    }

    setSaving(false);
  };

  // =====================================================================
  // ❌ EXCLUIR PERFIL
  // =====================================================================
  const excluirPerfil = () => {
    Alert.alert(
      "Remover Perfil",
      "Tem certeza que deseja remover todas as informações do perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "users", user.uid, "perfil", "informacoes"));

              setNome("");
              setIdade("");
              setAltura("");
              setPeso("");
              setObjetivo("");

              Alert.alert("Perfil apagado", "As informações foram excluídas.");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir.");
            }
          },
        },
      ]
    );
  };

  // =====================================================================
  // 🔄 LOADING
  // =====================================================================
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#050509",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#FF7A2F" />
        <Text style={{ color: "#FFF", marginTop: 12 }}>Carregando perfil...</Text>
      </View>
    );
  }

  // =====================================================================
  // 🔥 MODO DE VISUALIZAÇÃO
  // =====================================================================
  if (!editMode) {
    return (
      <LinearGradient colors={["#050509", "#121219", "#181924"]} style={styles.root}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Meu Perfil</Text>

            <Text style={styles.label}>Nome:</Text>
            <Text style={{ color: "#FFF", fontSize: 16 }}>{nome || "-"}</Text>

            <Text style={styles.label}>Idade:</Text>
            <Text style={{ color: "#FFF", fontSize: 16 }}>{idade || "-"}</Text>

            <Text style={styles.label}>Altura:</Text>
            <Text style={{ color: "#FFF", fontSize: 16 }}>{altura || "-"} cm</Text>

            <Text style={styles.label}>Peso:</Text>
            <Text style={{ color: "#FFF", fontSize: 16 }}>{peso || "-"} kg</Text>

            <Text style={styles.label}>Objetivo:</Text>
            <Text style={{ color: "#FFF", fontSize: 16 }}>{objetivo || "-"}</Text>

            {/* Botão Editar */}
            <Pressable
              style={[styles.primaryBtn, { marginTop: 20 }]}
              onPress={() => setEditMode(true)}
            >
              <LinearGradient
                colors={["#FF7A2F", "#FF4E1A"]}
                style={styles.primaryBtnGradient}
              >
                <Text style={styles.primaryBtnLabel}>Editar Perfil</Text>
              </LinearGradient>
            </Pressable>

            {/* Excluir Perfil */}
            <Pressable
              style={[styles.primaryBtn, { marginTop: 12 }]}
              onPress={excluirPerfil}
            >
              <LinearGradient
                colors={["#cc0000", "#990000"]}
                style={styles.primaryBtnGradient}
              >
                <Text style={styles.primaryBtnLabel}>Excluir Perfil</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  // =====================================================================
  // ✍️ MODO DE EDIÇÃO
  // =====================================================================
  return (
    <LinearGradient colors={["#050509", "#121219", "#181924"]} style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Editar Perfil</Text>

          {/* Campos */}
          <Text style={styles.label}>Nome</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#72727D"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <Text style={styles.label}>Idade</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="28"
              placeholderTextColor="#72727D"
              value={idade}
              onChangeText={setIdade}
            />
          </View>

          <Text style={styles.label}>Altura (cm)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="170"
              placeholderTextColor="#72727D"
              value={altura}
              onChangeText={setAltura}
            />
          </View>

          <Text style={styles.label}>Peso (kg)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="65"
              placeholderTextColor="#72727D"
              value={peso}
              onChangeText={setPeso}
            />
          </View>

          <Text style={styles.label}>Objetivo</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ganhar massa, perder peso..."
              placeholderTextColor="#72727D"
              value={objetivo}
              onChangeText={setObjetivo}
            />
          </View>

          {/* Botão Salvar */}
          <Pressable
            style={[styles.primaryBtn, { marginTop: 20 }]}
            onPress={salvarPerfil}
          >
            <LinearGradient
              colors={["#FF7A2F", "#FF4E1A"]}
              style={styles.primaryBtnGradient}
            >
              <Text style={styles.primaryBtnLabel}>
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Cancelar */}
          <Pressable
            style={[styles.primaryBtn, { marginTop: 12 }]}
            onPress={() => setEditMode(false)}
          >
            <LinearGradient
              colors={["#555", "#333"]}
              style={styles.primaryBtnGradient}
            >
              <Text style={styles.primaryBtnLabel}>Cancelar</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
