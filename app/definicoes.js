import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { AuthContext } from "./AuthContext";
import { getSharedStyles } from "./styles";
import { ThemeContext } from "./ThemeContext";

export default function Definicoes() {
  const router = useRouter();
  const { toggleTheme, theme } = useContext(ThemeContext);
  const { signOutUser } = useContext(AuthContext);

  const styles = getSharedStyles(theme);

  const handleLogout = async () => {
    try {
      await signOutUser();
      Alert.alert("Sessão terminada!", "Você saiu da conta.");
      router.replace("/index");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível sair.");
    }
  };

  return (
    <LinearGradient
      colors={theme === "dark" ? ["#050509", "#121219", "#181924"] : ["#EEE", "#FFF", "#FFF"]}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Definições ⚙️</Text>

          {/* Alternar Tema */}
          <Pressable style={styles.primaryBtn} onPress={toggleTheme}>
            <LinearGradient
              colors={["#FF7A2F", "#FF4E1A"]}
              style={styles.primaryBtnGradient}
            >
              <Text style={styles.primaryBtnLabel}>
                Alternar para {theme === "dark" ? "Tema Claro" : "Tema Escuro"}
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Logout */}
          <Pressable style={styles.primaryBtn} onPress={handleLogout}>
            <LinearGradient
              colors={["#FF7A2F", "#FF4E1A"]}
              style={styles.primaryBtnGradient}
            >
              <Text style={styles.primaryBtnLabel}>Sair da Conta</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
