import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { auth } from "./firebase";
import { getSharedStyles } from "./styles";

export default function Home() {
  const styles = getSharedStyles();
  const router = useRouter();
  const userEmail = auth.currentUser?.email;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logout efetuado!", "Volte sempre!");
      router.replace("/"); // Volta para login
    } catch (error) {
      Alert.alert("Erro ao sair", error.message);
    }
  };

  const handleGoToTreinos = () => {
    router.push("/treinos"); // 🚀 Navega para Treinos.js
  };

  return (
    <LinearGradient
      colors={["#050509", "#121219", "#181924"]}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroRow}>
          <Text style={styles.welcome}>Olá 👋</Text>
          <Text style={styles.subtitle}>{userEmail}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo da Semana</Text>
          <Text style={styles.label}>Treinos realizados: <Text style={{ color: "#FFF" }}>0</Text></Text>
          <Text style={styles.label}>Calorias gastas: <Text style={{ color: "#FFF" }}>0 kcal</Text></Text>
          <Text style={styles.label}>Calorias consumidas: <Text style={{ color: "#FFF" }}>0 kcal</Text></Text>
        </View>

        <View style={[styles.card, { marginTop: 20 }]}>
          <Text style={styles.cardTitle}>Motivação do Dia 💪</Text>
          <Text style={{ color: "#C7C7D8", fontSize: 14 }}>
            “O sucesso é a soma de pequenos esforços repetidos todos os dias.”
          </Text>
        </View>

        <Pressable style={[styles.primaryBtn, { marginTop: 30 }]} onPress={handleGoToTreinos}>
          <LinearGradient colors={["#FF7A2F", "#FF4E1A"]} style={styles.primaryBtnGradient}>
            <Text style={styles.primaryBtnLabel}>Meus Treinos</Text>
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
