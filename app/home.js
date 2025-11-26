import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { auth, db } from "./firebase";
import { getSharedStyles } from "./styles";
import { ThemeContext } from "./ThemeContext";

export default function Home() {

  const router = useRouter();
  const userEmail = auth.currentUser?.email;
  const { theme, toggleTheme } = useContext(ThemeContext);
  const styles = getSharedStyles(theme);

  const [treinosSemana, setTreinosSemana] = useState(0);
  const [caloriasConsumidas, setCaloriasConsumidas] = useState(0);

  // 🔥 FRASES MANUAIS
  const frases = [
    "Acredite no processo — grandes resultados começam pequenos! 💪",
    "Você não precisa ser perfeito, apenas constante.",
    "Disciplina supera motivação. Faça mesmo sem vontade!",
    "Um treino por dia mantém as desculpas longe. 🔥",
    "Seu corpo é capaz — dê a ele a chance de provar!",
    "Persistência transforma esforço em resultado.",
    "Consistência é o caminho mais curto até a evolução.",
    "Você é mais forte do que imagina!",
    "Foco diário → vitória semanal.",
    "Corpo forte, mente firme, vida leve."
  ];

  // Seleciona frase ao abrir o app
  const fraseMotivacional = frases[Math.floor(Math.random() * frases.length)];

  // ===================== 🔥 BUSCA TREINOS DA SEMANA =====================
  useEffect(() => {
    if (!auth.currentUser) return;

    const ref = collection(db, "users", auth.currentUser.uid, "treinos");

    return onSnapshot(ref, (snapshot) => {
      const hoje = new Date();
      const inicioSemana = hoje.getDate() - hoje.getDay(); // domingo

      let count = 0;

      snapshot.forEach((doc) => {
        const t = doc.data();
        if (!t.criadoEm?.seconds) return;

        const d = new Date(t.criadoEm.seconds * 1000);
        if (d >= new Date(hoje.setDate(inicioSemana))) count += 1;
      });

      setTreinosSemana(count);
    });
  }, []);

  // ===================== 🔥 BUSCA CALORIAS CONSUMIDAS =====================
  useEffect(() => {
    if (!auth.currentUser) return;

    const ref = collection(db, "users", auth.currentUser.uid, "alimentos");

    return onSnapshot(ref, (snapshot) => {
      let total = 0;

      snapshot.forEach((doc) => total += doc.data()?.calorias || 0);

      setCaloriasConsumidas(total);
    });
  }, []);

  // ESTIMATIVA APENAS
  const caloriasGastas = treinosSemana * 300;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logout efetuado!", "Volte sempre!");
      router.replace("/");
    } catch (error) {
      Alert.alert("Erro ao sair", error.message);
    }
  };

  return (
    <LinearGradient
      colors={theme === "dark" ? ["#050509", "#121219", "#181924"] : ["#FFF", "#EEE", "#DDD"]}
      style={styles.root}
    >
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* USER + TEMA */}
        <View style={{ flexDirection:"row", justifyContent:"space-between", marginBottom:20 }}>
          <View>
            <Text style={styles.welcome}>Olá 👋</Text>
            <Text style={styles.subtitle}>{userEmail}</Text>
          </View>

          <Pressable onPress={toggleTheme}>
            <Text style={{ fontSize:32 }}>
              {theme === "dark" ? "🌞" : "🌙"}
            </Text>
          </Pressable>
        </View>

        {/* 📊 RESUMO DA SEMANA */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo da Semana</Text>
          <Text style={styles.label}>
            Treinos realizados: <Text style={{ color:"#FFF" }}>{treinosSemana}</Text>
          </Text>
          <Text style={styles.label}>
            Calorias gastas: <Text style={{ color:"#FFF" }}>{caloriasGastas} kcal</Text>
          </Text>
          <Text style={styles.label}>
            Calorias consumidas: <Text style={{ color:"#FFF" }}>{caloriasConsumidas} kcal</Text>
          </Text>
        </View>

        {/* 🔥 MOTIVAÇÃO DO DIA */}
        <View style={[styles.card,{marginTop:20}]}>
          <Text style={styles.cardTitle}>Motivação do Dia 💪</Text>

          <Text style={{ color: theme === "dark" ? "#C7C7D8" : "#333", fontSize:14 }}>
            {fraseMotivacional}
          </Text>
        </View>

        {/* NAVIGAÇÃO */}
        <Pressable style={[styles.primaryBtn,{marginTop:20}]} onPress={()=>router.push("/definicoes")}>
          <LinearGradient colors={["#FF7A2F","#FF4E1A"]} style={styles.primaryBtnGradient}>
            <Text style={styles.primaryBtnLabel}>Definições</Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={[styles.primaryBtn,{marginTop:12}]} onPress={()=>router.push("/alimentos")}>
          <LinearGradient colors={["#FF7A2F","#FF4E1A"]} style={styles.primaryBtnGradient}>
            <Text style={styles.primaryBtnLabel}>Alimentos</Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={[styles.primaryBtn,{marginTop:30}]} onPress={()=>router.push("/treinos")}>
          <LinearGradient colors={["#FF7A2F","#FF4E1A"]} style={styles.primaryBtnGradient}>
            <Text style={styles.primaryBtnLabel}>Meus Treinos</Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={[styles.primaryBtn,{marginTop:12}]} onPress={()=>router.push("/estatisticas")}>
          <LinearGradient colors={["#FF7A2F","#FF4E1A"]} style={styles.primaryBtnGradient}>
            <Text style={styles.primaryBtnLabel}>Estatísticas</Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={[styles.primaryBtn,{marginTop:20}]} onPress={()=>router.push("/perfil")}>
          <LinearGradient colors={["#FF7A2F","#FF4E1A"]} style={styles.primaryBtnGradient}>
            <Text style={styles.primaryBtnLabel}>Meu Perfil</Text>
          </LinearGradient>
        </Pressable>

        <Pressable style={[styles.primaryBtn,{marginTop:12}]} onPress={handleLogout}>
          <LinearGradient colors={["#FF7A2F","#FF4E1A"]} style={styles.primaryBtnGradient}>
            <Text style={styles.primaryBtnLabel}>Sair</Text>
          </LinearGradient>
        </Pressable>

      </ScrollView>
    </LinearGradient>
  );
}
