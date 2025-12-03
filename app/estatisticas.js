import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Dimensions, ScrollView, StatusBar, Text, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { AuthContext } from "./AuthContext";
import { db } from "./firebase";
import { getSharedStyles } from "./styles";
import { ThemeContext } from "./ThemeContext"; // 💥 NOVO: Importar ThemeContext

export default function Estatisticas() {
  const { theme } = useContext(ThemeContext); // 💥 CHAVE: Obter tema
  const dark = theme === "dark";

  const styles = getSharedStyles(theme); // 💥 CHAVE: Passar tema para estilos
  const screenWidth = Dimensions.get("window").width - 40;

  const { user } = useContext(AuthContext);

  const [treinosSemana, setTreinosSemana] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [caloriasDia, setCaloriasDia] = useState([]);

  // 🟦 CARREGAR TREINOS (por dia da semana)
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "treinos");

    // 💥 CORREÇÃO: uid como dependência
    return onSnapshot(ref, (snapshot) => {
      // 7 dias → Dom a Sáb
      const contagem = [0, 0, 0, 0, 0, 0, 0];

      snapshot.forEach((doc) => {
        const t = doc.data();
        // Garante que a data é tratada corretamente
        const timestamp = t.criadoEm?.seconds || new Date().getTime() / 1000;
        const d = new Date(timestamp * 1000); 
        const dia = d.getDay(); // 0–6

        contagem[dia] += 1;
      });

      setTreinosSemana(contagem);
    });
  }, [user]); // 💥 CORREÇÃO: user como dependência

  // 🍎 CARREGAR CALORIAS (por alimento/dia)
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "alimentos");

    // 💥 CORREÇÃO: uid como dependência
    return onSnapshot(ref, (snapshot) => {
      const totais = [];
      snapshot.forEach((doc) => {
        const c = doc.data();
        totais.push(c.calorias || 0);
      });
      setCaloriasDia(totais);
    });
  }, [user]); // 💥 CORREÇÃO: user como dependência
  
  // Cores do Gradiente
  const gradientColors = dark 
    ? ["#050509","#121219","#181924"] 
    : ["#FFFFFF","#FFFFFF","#FFFFFF"];

  // Configuração comum para gráficos (adaptada ao tema)
  const chartConfig = {
    backgroundGradientFrom: styles.card.backgroundColor, // Fundo do card
    backgroundGradientTo: styles.card.backgroundColor,
    decimalPlaces: 0,
    color: (opacity = 1) => dark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`, // Cor das linhas e texto
    labelColor: (opacity = 1) => dark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "5", strokeWidth: "2", stroke: "#FF7A2F" },
  };


  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.root}
    >
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 20 }}>
        
        <Text style={[styles.welcome, { marginTop: 10, fontSize: 26 }]}>
          Estatísticas 📊
        </Text>
        <Text style={[styles.subtitle, { marginBottom: 20 }]}>
          Acompanhe sua evolução nos treinos e alimentação
        </Text>

        {/* ===== Treinos na Semana ===== */}
        <View style={[styles.card, { marginTop: 20, paddingBottom: 20 }]}>
          <Text style={styles.cardTitle}>Treinos na Semana</Text>
          
          {/* Se todos os valores forem zero, mostra a mensagem */}
          {treinosSemana.every(v => v === 0) ? (
            <Text style={[styles.label, { marginTop: 12, textAlign: 'center' }]}>
              Nenhum treino registrado nesta semana.
            </Text>
          ) : (
            <LineChart
              data={{
                labels: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
                datasets: [{ data: treinosSemana }],
              }}
              width={screenWidth}
              height={240}
              chartConfig={{
                ...chartConfig,
                color: (o=1)=>`rgba(255,122,47,${o})`, // Laranja
              }}
              bezier
              style={{
                borderRadius:16,
                marginTop:15,
                alignSelf:"center"
              }}
            />
          )}
        </View>

        {/* ===== Calorias ===== */}
        <View style={[styles.card, { marginTop: 25, paddingBottom: 20 }]}>
          <Text style={styles.cardTitle}>Calorias Consumidas (por item)</Text>

          {caloriasDia.length === 0 ? (
            <Text style={[styles.label, { marginTop: 12, textAlign: 'center' }]}>
              Nenhum alimento registrado.
            </Text>
          ) : (
            <BarChart
              data={{
                labels: caloriasDia.map((_, i) => `${i + 1}`),
                datasets: [{ data: caloriasDia }],
              }}
              width={screenWidth}
              height={240}
              chartConfig={{
                ...chartConfig,
                color:(o=1)=>`rgba(255,78,26,${o})`, // Vermelho/Laranja mais forte
              }}
              verticalLabelRotation={30}
              style={{
                borderRadius:16,
                marginTop:15,
                alignSelf:"center"
              }}
            />
          )}
        </View>
        <View style={{ height: 50 }} />

      </ScrollView>
    </LinearGradient>
  );
}