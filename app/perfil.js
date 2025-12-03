import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
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
import { ThemeContext } from "./ThemeContext";

export default function Perfil() {
  const { theme } = useContext(ThemeContext);
  const styles = getSharedStyles(theme);
  const dark = theme === "dark";

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

  // Carregar dados =====================================================
  const carregarPerfil = async () => {
    if (!user) return setLoading(false);

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
    } catch (err) {
      Alert.alert("Erro", "Falha ao carregar perfil.");
    }

    setLoading(false);
  };

  useEffect(() => {
    carregarPerfil();
  }, [user]);

  // Salvar alterações ===================================================
  const salvarPerfil = async () => {
    if (!user) return;
    setSaving(true);

    try {
      await setDoc(
        doc(db, "users", user.uid, "perfil", "informacoes"),
        {
          nome,
          idade,
          altura,
          peso,
          objetivo,
          atualizadoEm: new Date(),
        },
        { merge: true }
      );

      Alert.alert("Sucesso", "Perfil atualizado!");
      setEditMode(false);
    } catch (err) {
      Alert.alert("Erro", "Falha ao salvar.");
    }

    setSaving(false);
  };

  // Loading =============================================================
  if (loading) {
    return (
      <LinearGradient
        colors={dark ? ["#050509", "#121219", "#181924"] : ["#FFF", "#FFF", "#FFF"]}
        style={[styles.root, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color="#FF7A2F" />
      </LinearGradient>
    );
  }

  const gradientColors = dark
    ? ["#050509", "#121219", "#181924"]
    : ["#FFFFFF", "#FFFFFF", "#FFFFFF"];

  return (
    <LinearGradient colors={gradientColors} style={styles.root}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER COM O NOVO ÍCONE (padronizado) */}
        <View style={{ alignItems: "center", marginBottom: 28 }}>
          <Ionicons
            name="person-circle-outline"
            size={60}
            color="#FF7A2F"
            style={{ marginBottom: 10 }}
          />
          
          <Text style={[styles.welcome, { fontSize: 26 }]}>Meu Perfil</Text>
          <Text style={[styles.subtitle, { marginTop: 6 }]}>{user?.email}</Text>
        </View>

        {/* =========================== MODO VISUALIZAÇÃO =========================== */}
        {!editMode && (
          <View style={[styles.card, { padding: 22 }]}>
            <Text style={[styles.cardTitle, { textAlign: "center" }]}>
              Informações Pessoais
            </Text>

            <InfoRow styles={styles} label="Nome" value={nome} />
            <InfoRow styles={styles} label="Idade" value={idade} />
            <InfoRow styles={styles} label="Altura" value={`${altura} cm`} />
            <InfoRow styles={styles} label="Peso" value={`${peso} kg`} />
            <InfoRow styles={styles} label="Objetivo" value={objetivo} />

            {/* BOTÃO EDITAR – estilo igual ao resto do app */}
            <Pressable style={{ marginTop: 20 }} onPress={() => setEditMode(true)}>
              <LinearGradient
                colors={["#FF7A2F", "#FF4E1A"]}
                style={{
                  paddingVertical: 12,
                  borderRadius: 16,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons name="create-outline" size={20} color="#FFF" />
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  Editar Perfil
                </Text>
              </LinearGradient>
            </Pressable>

            {/* ❌ Botão excluir foi completamente removido ❌ */}
          </View>
        )}

        {/* ============================ MODO EDIÇÃO ============================= */}
        {editMode && (
          <View style={[styles.card, { padding: 22 }]}>
            <Text style={[styles.cardTitle, { textAlign: "center" }]}>
              Editar Informações
            </Text>

            <Input label="Nome" value={nome} setValue={setNome} dark={dark} styles={styles} />
            <Input label="Idade" value={idade} setValue={setIdade} dark={dark} styles={styles} keyboard="numeric" />
            <Input label="Altura (cm)" value={altura} setValue={setAltura} dark={dark} styles={styles} keyboard="numeric" />
            <Input label="Peso (kg)" value={peso} setValue={setPeso} dark={dark} styles={styles} keyboard="numeric" />
            <Input label="Objetivo" value={objetivo} setValue={setObjetivo} dark={dark} styles={styles} />

            <Pressable style={{ marginTop: 20 }} onPress={salvarPerfil} disabled={saving}>
              <LinearGradient
                colors={["#FF7A2F", "#FF4E1A"]}
                style={{
                  paddingVertical: 12,
                  borderRadius: 16,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons name="save-outline" size={20} color="#FFF" />
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable style={{ marginTop: 12 }} onPress={() => setEditMode(false)}>
              <LinearGradient
                colors={["#555", "#333"]}
                style={{
                  paddingVertical: 12,
                  borderRadius: 16,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons name="close-circle-outline" size={20} color="#FFF" />
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>Cancelar</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </LinearGradient>
  );
}


/* -------------------------------------------
   COMPONENTES AUXILIARES
---------------------------------------------*/

const InfoRow = ({ styles, label, value }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.08)",
    }}
  >
    <Text style={[styles.label]}>{label}</Text>
    <Text style={[styles.welcome, { fontSize: 16 }]}>{value || "N/A"}</Text>
  </View>
);

const Input = ({ label, value, setValue, dark, keyboard = "default", styles }) => (
  <>
    <Text style={[styles.label, { marginTop: 18 }]}>{label}</Text>
    <View
      style={[
        styles.inputWrapper,
        { backgroundColor: dark ? "rgba(255,255,255,0.05)" : "#F3F3F3" },
      ]}
    >
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor={dark ? "#777" : "#999"}
        value={value}
        onChangeText={setValue}
        keyboardType={keyboard}
      />
    </View>
  </>
);
