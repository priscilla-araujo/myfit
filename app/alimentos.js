import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
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

export default function Alimentos() {
  const { theme } = useContext(ThemeContext);
  const styles = getSharedStyles(theme);
  const dark = theme === "dark";

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
  // 🔵 REALTIME LISTAGEM
  // ============================================
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "alimentos");

    return onSnapshot(ref, (snapshot) => {
      const lista = [];
      const soma = { calorias: 0, proteinas: 0, hidratos: 0, gorduras: 0 };

      snapshot.forEach((docu) => {
        const d = { id: docu.id, ...docu.data() };
        lista.push(d);

        soma.calorias += d.calorias;
        soma.proteinas += d.proteinas;
        soma.hidratos += d.hidratos;
        soma.gorduras += d.gorduras;
      });

      setAlimentos(lista);
      setResumo(soma);
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
        Alert.alert("Permissão negada", "Autorize a câmera.");
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
  // 💾 SALVAR
  // ============================================
  const salvarAlimento = async () => {
    if (!resultado || !user) return;

    try {
      await addDoc(collection(db, "users", user.uid, "alimentos"), {
        ...resultado,
        criadoEm: new Date(),
      });

      Alert.alert("Sucesso!", "Alimento salvo.");
      setResultado(null);
      setBusca("");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  };

  // ============================================
  // 🗑 EXCLUIR
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
  // SCANNER UI
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
  // GRADIENT TEMA
  // ============================================
  const gradientColors = dark
    ? ["#050509", "#121219", "#181924"]
    : ["#FFFFFF", "#FFFFFF", "#FFFFFF"];

  return (
    <LinearGradient colors={gradientColors} style={styles.root}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={[styles.scrollContent]}>
        
        {/* HEADER */}
        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom: 25 }}>
          
          <Text style={[styles.welcome, { fontSize: 26 }]}>
            Alimentos
          </Text>

          <Pressable
            onPress={ativarScanner}
            style={{
              backgroundColor: "#FF7A2F",
              width: 46,
              height: 46,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              elevation: 4,
            }}
          >
            <Ionicons name="barcode-outline" size={26} color="#FFF" />
          </Pressable>

        </View>

        {/* BUSCA CARD */}
        <View style={[styles.card,{padding:22}]}>
          
          <Text style={[styles.cardTitle,{marginBottom:10}]}>
            <Ionicons name="search-outline" size={20} color="#FF7A2F"/> Buscar alimento
          </Text>

          <View style={{
            backgroundColor: dark ? "rgba(255,255,255,0.05)" : "#F3F3F3",
            borderRadius: 14,
            paddingHorizontal: 14,
            marginBottom: 12
          }}>
            <TextInput
              style={{paddingVertical:12, color: styles.welcome.color}}
              placeholder="Digite nome ou código"
              placeholderTextColor={dark ? "#888" : "#777"}
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          <PrimaryBtn label="Buscar" icon="search-outline" onPress={buscarPorNome}/>
        </View>

        {/* LOADING */}
        {loading && <ActivityIndicator size="large" color="#FF7A2F" style={{marginTop:10}} />}

        {/* RESULTADO */}
        {resultado && (
          <View style={[styles.card,{marginTop:20,padding:22}]}>
            <Text style={[styles.cardTitle]}>{resultado.nome}</Text>

            <Nutriente label="Calorias" valor={`${resultado.calorias}`} dark={dark}/>
            <Nutriente label="Proteínas" valor={`${resultado.proteinas}g`} dark={dark}/>
            <Nutriente label="Hidratos" valor={`${resultado.hidratos}g`} dark={dark}/>
            <Nutriente label="Gorduras" valor={`${resultado.gorduras}g`} dark={dark}/>

            <PrimaryBtn label="Salvar alimento" icon="save-outline" onPress={salvarAlimento}/>
          </View>
        )}

        {/* LISTA POR DIA */}
        {alimentos.length > 0 && (
          <View style={{marginTop:30}}>
            
            <Text style={[styles.cardTitle, {fontSize:20}]}>
              <Ionicons name="calendar-outline" size={20} color="#FF7A2F"/> Histórico
            </Text>

            {Object.entries(
              alimentos.reduce((acc, item) => {
                const dia = new Date(item.criadoEm?.seconds * 1000).toLocaleDateString("pt-BR");
                if (!acc[dia]) acc[dia] = [];
                acc[dia].push(item);
                return acc;
              }, {})
            )
              .sort((a, b) => new Date(b[0]) - new Date(a[0]))
              .map(([dia, lista]) => (
                <View key={dia} style={{ marginBottom: 20 }}>
                  
                  <Text style={{ color:"#FF7A2F", fontSize:18, fontWeight:"bold", marginTop:10 }}>
                     {dia}
                  </Text>

                  {lista.map((alimento) => (
                    <View key={alimento.id} style={[styles.card,{marginTop:10,padding:20}]}>
                      
                      <Text style={styles.cardTitle}>{alimento.nome}</Text>

                      <Nutriente label="Calorias" valor={alimento.calorias} dark={dark}/>
                      <Nutriente label="Proteínas" valor={`${alimento.proteinas}g`} dark={dark}/>
                      <Nutriente label="Hidratos" valor={`${alimento.hidratos}g`} dark={dark}/>
                      <Nutriente label="Gorduras" valor={`${alimento.gorduras}g`} dark={dark}/>

                      <PrimaryBtn
                        label="Remover"
                        icon="trash-outline"
                        colors={["#FF3B3B","#C40000"]}
                        onPress={() => removerAlimento(alimento.id)}
                      />
                    </View>
                  ))}
                </View>
              ))
            }
          </View>
        )}

        {/* RESUMO */}
        <View style={[styles.card,{marginTop:20,padding:22}]}>
          
          <Text style={styles.cardTitle}>
            <Ionicons name="stats-chart-outline" size={20} color="#FF7A2F"/> Resumo Diário
          </Text>

          <Nutriente label="Calorias totais" valor={resumo.calorias} dark={dark}/>
          <Nutriente label="Proteínas totais" valor={`${resumo.proteinas}g`} dark={dark}/>
          <Nutriente label="Hidratos totais" valor={`${resumo.hidratos}g`} dark={dark}/>
          <Nutriente label="Gorduras totais" valor={`${resumo.gorduras}g`} dark={dark}/>
        
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

/* ------------------------------------------
   COMPONENTES COESOS COM O TEMA DO APP
------------------------------------------- */

const PrimaryBtn = ({ label, icon, onPress, colors=["#FF7A2F","#FF4E1A"] }) => (
  <Pressable style={{marginTop:10}} onPress={onPress}>
    <LinearGradient
      colors={colors}
      style={{
        paddingVertical:12,
        borderRadius:14,
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
        gap:8,
        elevation:4
      }}
    >
      <Ionicons name={icon} size={18} color="#FFF"/>
      <Text style={{color:"#FFF",fontWeight:"bold"}}>{label}</Text>
    </LinearGradient>
  </Pressable>
);

const Nutriente = ({ label, valor, dark }) => (
  <Text style={{ 
    color: dark ? "#DDD" : "#333",
    fontSize: 15,
    marginBottom: 4
  }}>
    {label}: <Text style={{color: dark ? "#FFF" : "#000", fontWeight:"700"}}>{valor}</Text>
  </Text>
);
