import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View
} from "react-native";
import { auth } from "./firebase";
import { getSharedStyles } from "./styles";
import { ThemeContext } from "./ThemeContext";

export default function Home() {
  const router = useRouter();
  const userEmail = auth.currentUser?.email;

  // 🌙 Tema
  const { theme, toggleTheme } = useContext(ThemeContext);
  const styles = getSharedStyles(theme);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logout efetuado!", "Volte sempre!");
      router.replace("/");
    } catch (error) {
      Alert.alert("Erro ao sair", error.message);
    }
  };

  const handleGoToTreinos = () => router.push("/treinos");

  return (
    <LinearGradient
      colors={theme === "dark" ? ["#050509", "#121219", "#181924"] : ["#FFF", "#EEE", "#DDD"]}
      style={styles.root}
    >
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 🌞 / 🌙 BOTÃO DE TEMA */}
        <View style={{ 
          flexDirection: "row", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: 20
        }}>
          <View>
            <Text style={styles.welcome}>Olá 👋</Text>
            <Text style={styles.subtitle}>{userEmail}</Text>
          </View>

          <Pressable onPress={toggleTheme}>
            <Text style={{ fontSize: 32 }}>
              {theme === "dark" ? "🌞" : "🌙"}
            </Text>
          </Pressable>
        </View>

        {/* Card Resumo */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo da Semana</Text>
          <Text style={styles.label}>Treinos realizados: <Text style={{ color: "#FFF" }}>0</Text></Text>
          <Text style={styles.label}>Calorias gastas: <Text style={{ color: "#FFF" }}>0 kcal</Text></Text>
          <Text style={styles.label}>Calorias consumidas: <Text style={{ color: "#FFF" }}>0 kcal</Text></Text>
        </View>

        {/* Card Motivação */}
        <View style={[styles.card, { marginTop: 20 }]}>
          <Text style={styles.cardTitle}>Motivação do Dia 💪</Text>
          <Text style={{ color: theme === "dark" ? "#C7C7D8" : "#333", fontSize: 14 }}>
            “O sucesso é a soma de pequenos esforços repetidos todos os dias.”
          </Text>
        </View>

        {/* Botões */}
        <Pressable style={[styles.primaryBtn, { marginTop: 20 }]} onPress={() => router.push("/definicoes")}>
          <LinearGradient colors={["#FF7A2F", "#FF4E1A"]} style={styles.primaryBtnGradient}>
            <Text style={styles.primaryBtnLabel}>Definições</Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={[styles.primaryBtn, { marginTop: 12 }]} onPress={() => router.push("/alimentos")}>
          <LinearGradient colors={["#FF7A2F", "#FF4E1A"]} style={styles.primaryBtnGradient}>
            <Text style={styles.primaryBtnLabel}>Alimentos</Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={[styles.primaryBtn, { marginTop: 30 }]} onPress={handleGoToTreinos}>
          <LinearGradient colors={["#FF7A2F", "#FF4E1A"]} style={styles.primaryBtnGradient}>
            <Text style={styles.primaryBtnLabel}>Meus Treinos</Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={[styles.primaryBtn, { marginTop: 12 }]} onPress={() => router.push("/estatisticas")}>
          <LinearGradient colors={["#FF7A2F", "#FF4E1A"]} style={styles.primaryBtnGradient}>
            <Text style={styles.primaryBtnLabel}>Estatísticas</Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={[styles.primaryBtn, { marginTop: 20 }]} onPress={() => router.push("/perfil")}>
          <LinearGradient colors={["#FF7A2F", "#FF4E1A"]} style={styles.primaryBtnGradient}>
            <Text style={styles.primaryBtnLabel}>Meu Perfil</Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={[styles.primaryBtn, { marginTop: 12 }]} onPress={handleLogout}>
          <LinearGradient colors={["#FF7A2F", "#FF4E1A"]} style={styles.primaryBtnGradient}>
            <Text style={styles.primaryBtnLabel}>Sair</Text>
          </LinearGradient>
        </Pressable>

      </ScrollView>
    </LinearGradient>
  );
}
