import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
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

export default function Alimentos() {
  const styles = getSharedStyles();

  const [busca, setBusca] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Scanner
  const [permission, requestPermission] = useCameraPermissions();
  const [scannerAtivo, setScannerAtivo] = useState(false);

  // Lista e resumo
  const [alimentos, setAlimentos] = useState([]);
  const [resumo, setResumo] = useState({
    calorias: 0,
    proteinas: 0,
    hidratos: 0,
    gorduras: 0,
  });

  const user = auth.currentUser;

  // ============================================
  // 🔵 CARREGA ALIMENTOS EM TEMPO REAL
  // ============================================
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "alimentos");

    return onSnapshot(ref, (snapshot) => {
      const lista = [];
      let calorias = 0;
      let proteinas = 0;
      let hidratos = 0;
      let gorduras = 0;

      snapshot.forEach((docu) => {
        const d = { id: docu.id, ...docu.data() };
        lista.push(d);

        calorias += d.calorias;
        proteinas += d.proteinas;
        hidratos += d.hidratos;
        gorduras += d.gorduras;
      });

      setAlimentos(lista);
      setResumo({ calorias, proteinas, hidratos, gorduras });
    });
  }, []);

  // ============================================
  // 🔍 BUSCAR POR NOME / CÓDIGO
  // ============================================
  const buscarPorNome = async () => {
    if (!busca.trim()) return;

    setLoading(true);

    try {
      const url = `https://world.openfoodfacts.org/api/v0/product/${busca}.json`;
      const r = await fetch(url);
      const data = await r.json();

      if (!data.product) {
        Alert.alert("Não encontrado", "Nenhum alimento encontrado.");
        setLoading(false);
        return;
      }

      const info = data.product.nutriments;

      setResultado({
        nome: data.product.product_name || "Desconhecido",
        calorias: info["energy-kcal_100g"] || 0,
        proteinas: info.proteins_100g || 0,
        hidratos: info.carbohydrates_100g || 0,
        gorduras: info.fat_100g || 0,
      });
    } catch (e) {
      Alert.alert("Erro", "Falha ao buscar alimento.");
    }

    setLoading(false);
  };

  // ============================================
  // 📷 SCANNER
  // ============================================
  const ativarScanner = async () => {
    if (!permission?.granted) {
      const status = await requestPermission();
      if (!status.granted) {
        Alert.alert("Permissão negada", "Autorize o uso da câmera.");
        return;
      }
    }
    setScannerAtivo(true);
  };

  const onBarCodeScanned = ({ data }) => {
    setScannerAtivo(false);
    setBusca(data);
    buscarPorNome();
  };

  // ============================================
  // 💾 SALVAR ALIMENTO
  // ============================================
  const salvarAlimento = async () => {
    if (!resultado || !user) return;

    try {
      await addDoc(collection(db, "users", user.uid, "alimentos"), {
        ...resultado,
        criadoEm: new Date(),
      });

      Alert.alert("Sucesso!", "Alimento salvo com sucesso.");
      setResultado(null);
      setBusca("");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  };

  // ============================================
  // 🗑 REMOVER
  // ============================================
  const removerAlimento = async (id) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "alimentos", id));
      Alert.alert("Removido", "Alimento excluído.");
    } catch (e) {
      Alert.alert("Erro", "Erro ao excluir.");
    }
  };

  // ============================================
  // 📱 UI DO SCANNER
  // ============================================
  if (scannerAtivo)
    return (
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "code128", "upc_a", "upc_e"],
        }}
        onBarcodeScanned={onBarCodeScanned}
      />
    );

  // ============================================
  // UI PRINCIPAL
  // ============================================
  return (
    <LinearGradient
      colors={["#050509", "#121219", "#181924"]}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.welcome}>Base de Dados de Alimentos 🍎</Text>
        <Text style={styles.subtitle}>
          Registre, consulte e acompanhe sua alimentação
          </Text>

        {/* BUSCA */}
        <View style={styles.card}>
          <Text style={styles.label}>Buscar alimento</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Digite nome ou código"
              placeholderTextColor="#72727D"
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          <Pressable style={styles.primaryBtn} onPress={buscarPorNome}>
            <LinearGradient colors={["#FF7A2F", "#FF4E1A"]} style={styles.primaryBtnGradient}>
              <Text style={styles.primaryBtnLabel}>Buscar</Text>
            </LinearGradient>
          </Pressable>

          <Pressable style={[styles.primaryBtn,{marginTop:10}]} onPress={ativarScanner}>
            <LinearGradient colors={["#FF7A2F", "#FF4E1A"]} style={styles.primaryBtnGradient}>
              <Text style={styles.primaryBtnLabel}>Ler Código de Barras</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* LOADING */}
        {loading && <ActivityIndicator size="large" color="#FF7A2F" />}

        {/* RESULTADO DA BUSCA */}
        {resultado && (
          <View style={[styles.card,{marginTop:20}]}>
            <Text style={styles.cardTitle}>{resultado.nome}</Text>
            <Text style={styles.label}>Calorias: <Text style={{color:"#FFF"}}>{resultado.calorias}</Text></Text>
            <Text style={styles.label}>Proteínas: <Text style={{color:"#FFF"}}>{resultado.proteinas}g</Text></Text>
            <Text style={styles.label}>Hidratos: <Text style={{color:"#FFF"}}>{resultado.hidratos}g</Text></Text>
            <Text style={styles.label}>Gorduras: <Text style={{color:"#FFF"}}>{resultado.gorduras}g</Text></Text>

            <Pressable style={styles.primaryBtn} onPress={salvarAlimento}>
              <LinearGradient colors={["#FF7A2F", "#FF4E1A"]} style={styles.primaryBtnGradient}>
                <Text style={styles.primaryBtnLabel}>Salvar alimento</Text>
              </LinearGradient>
            </Pressable>
          </View>
        )}

        {/* LISTAGEM AGRUPADA POR DIA */}
        {alimentos.length > 0 && (
          <View style={{marginTop:20}}>
            <Text style={[styles.cardTitle,{marginBottom:10}]}>Histórico por Dia 🍽</Text>

            {Object.entries(
              alimentos.reduce((acc,item)=>{
                const dia = new Date(item.criadoEm?.seconds*1000).toLocaleDateString("pt-BR");
                if(!acc[dia]) acc[dia]=[];
                acc[dia].push(item);
                return acc;
              },{})
            )
            .sort((a,b)=>new Date(b[0])-new Date(a[0]))
            .map(([dia,lista])=>(
              <View key={dia} style={{marginBottom:20}}>
                <Text style={{color:"#FF7A2F",fontSize:18,fontWeight:"bold",marginBottom:10}}>
                  📅 {dia}
                </Text>

                {lista.map(alimento=>(
                  <View key={alimento.id} style={[styles.card,{marginBottom:10}]}>
                    <Text style={styles.cardTitle}>{alimento.nome}</Text>
                    <Text style={styles.label}>Calorias: <Text style={{color:"#FFF"}}>{alimento.calorias}</Text></Text>
                    <Text style={styles.label}>Proteínas: <Text style={{color:"#FFF"}}>{alimento.proteinas}g</Text></Text>
                    <Text style={styles.label}>Hidratos: <Text style={{color:"#FFF"}}>{alimento.hidratos}g</Text></Text>
                    <Text style={styles.label}>Gorduras: <Text style={{color:"#FFF"}}>{alimento.gorduras}g</Text></Text>

                    <Pressable style={[styles.primaryBtn,{marginTop:10}]} onPress={()=>removerAlimento(alimento.id)}>
                      <LinearGradient colors={["#FF3B3B","#C40000"]} style={styles.primaryBtnGradient}>
                        <Text style={styles.primaryBtnLabel}>Remover</Text>
                      </LinearGradient>
                    </Pressable>
                  </View>
                ))}

              </View>
            ))}
          </View>
        )}

        {/* RESUMO */}
        <View style={[styles.card,{marginTop:20}]}>
          <Text style={styles.cardTitle}>Resumo Diário 📊</Text>
          <Text style={styles.label}>Calorias totais: <Text style={{color:"#FFF"}}>{resumo.calorias}</Text></Text>
          <Text style={styles.label}>Proteínas totais: <Text style={{color:"#FFF"}}>{resumo.proteinas}g</Text></Text>
          <Text style={styles.label}>Hidratos totais: <Text style={{color:"#FFF"}}>{resumo.hidratos}g</Text></Text>
          <Text style={styles.label}>Gorduras totais: <Text style={{color:"#FFF"}}>{resumo.gorduras}g</Text></Text>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}
