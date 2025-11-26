import { LinearGradient } from "expo-linear-gradient";
import { collection, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Dimensions, ScrollView, StatusBar, Text, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { AuthContext } from "./AuthContext";
import { db } from "./firebase";
import { getSharedStyles } from "./styles";

export default function Estatisticas() {
  const styles = getSharedStyles();
  const screenWidth = Dimensions.get("window").width - 40;

  const { user } = useContext(AuthContext);

  const [treinosSemana, setTreinosSemana] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [caloriasDia, setCaloriasDia] = useState([]);

  // 🟦 CARREGAR TREINOS (por dia da semana)
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "treinos");

    return onSnapshot(ref, (snapshot) => {
      // 7 dias → Dom a Sáb
      const contagem = [0, 0, 0, 0, 0, 0, 0];

      snapshot.forEach((doc) => {
        const t = doc.data();
        const d = new Date(t.criadoEm?.seconds * 1000);
        const dia = d.getDay(); // 0–6

        contagem[dia] += 1;
      });

      setTreinosSemana(contagem);
    });
  }, [user]);

  // 🟧 CARREGAR CALORIAS (alimentos)
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "alimentos");

    return onSnapshot(ref, (snapshot) => {
      const lista = [];

      snapshot.forEach((doc) => {
        const a = doc.data();
        lista.push(a.calorias || 0);
      });

      setCaloriasDia(lista);
    });
  }, [user]);

  return (
  <LinearGradient
    colors={["#050509", "#121219", "#181924"]}
    style={{ flex: 1, paddingTop: 35 }} // aumenta respiro na parte superior
  >
    <StatusBar barStyle="light-content" />

    <ScrollView contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 20 }}>
      
      <Text style={[styles.welcome, { marginTop: 10, fontSize: 26 }]}>
        Estatísticas 📊
      </Text>
      <Text style={[styles.subtitle, { marginBottom: 20 }]}>
        Acompanhe sua evolução nos treinos e alimentação
      </Text>

      {/* ===== Treinos Semana ===== */}
      <View style={[styles.card, { marginTop: 20, paddingBottom: 20 }]}>
        <Text style={styles.cardTitle}>Treinos na Semana</Text>

        <LineChart
          data={{
            labels: ["D","S","T","Q","Q","S","S"],
            datasets: [{ data: treinosSemana }],
          }}
          width={screenWidth}            // Agora o gráfico encaixa
          height={240}                    // Maior e mais confortável
          yAxisInterval={1}
          fromZero={true}                 // Começa no zero — visual melhor
          chartConfig={{
            backgroundColor:"#181924",
            backgroundGradientFrom:"#181924",
            backgroundGradientTo:"#181924",
            decimalPlaces:0,
            color:(o=1)=>`rgba(255,122,47,${o})`,
            labelColor:(o=1)=>`rgba(255,255,255,${o})`,
            propsForDots:{ r:"5" }        // Pontos mais visíveis
          }}
          bezier
          style={{
            borderRadius:16,
            marginTop:15,
            alignSelf:"center"           // CENTRALIZA GERAL NO DISPLAY
          }}
        />
      </View>

      {/* ===== Calorias ===== */}
      <View style={[styles.card, { marginTop: 25, paddingBottom: 20 }]}>
        <Text style={styles.cardTitle}>Calorias Consumidas</Text>

        {caloriasDia.length === 0 ? (
          <Text style={[styles.label, { marginTop: 12 }]}>
            Nenhum alimento registrado hoje.
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
              backgroundGradientFrom:"#181924",
              backgroundGradientTo:"#181924",
              color:(o=1)=>`rgba(255,78,26,${o})`,
              labelColor:()=>"#fff",
              barPercentage:0.5,        // barras mais proporcionais
            }}
            style={{
              borderRadius:16,
              marginTop:15,
              alignSelf:"center"
            }}
          />
        )}
      </View>

    </ScrollView>
  </LinearGradient>
);

}
