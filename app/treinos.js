import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View
} from "react-native";
import { auth, db } from "./firebase";
import { getSharedStyles } from "./styles";
import { ThemeContext } from "./ThemeContext";

export default function Treinos() {

  const { theme } = useContext(ThemeContext);
  const styles = getSharedStyles(theme);
  const dark = theme === "dark";
  const router = useRouter();

  const [treinos, setTreinos] = useState([]);

  // Listener realtime
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    return onSnapshot(collection(db,"users",user.uid,"treinos"), snapshot => {
      setTreinos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const excluirTreino = async (id) => {
    const user = auth.currentUser;
    if (!user) return alert("Usuário não autenticado!");

    if (Platform.OS === "web" && !window.confirm("Excluir treino?")) return;

    try {
      await deleteDoc(doc(db,"users",user.uid,"treinos",id));
      Alert.alert("Removido","Treino excluído com sucesso!");
    } catch (error) {
      Alert.alert("Erro",error.message);
    }
  };

  const gradientColors = dark
    ? ["#050509","#121219","#181924"]
    : ["#FFFFFF","#FFFFFF","#FFFFFF"];

  const Card = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          padding: 20,
          marginBottom: 20,
          backgroundColor: dark ? "rgba(255,255,255,0.06)" : "#FFF",
          borderWidth: 1.2,
          borderColor: dark ? "rgba(255,255,255,0.08)" : "#E2E2E2"
        }
      ]}
    >
      <Text style={[styles.cardTitle, { color: "#FF7A2F", marginBottom: 6 }]}>
        <Ionicons name="barbell-outline" size={20} color="#FF7A2F" /> {item.nome}
      </Text>

      <Text style={styles.subtitle}>Tipo: <Text style={{color: styles.welcome.color}}>{item.tipo}</Text></Text>
      <Text style={styles.subtitle}>Duração: <Text style={{color: styles.welcome.color}}>{item.duracao} min</Text></Text>
      <Text style={styles.subtitle}>Data: <Text style={{color: styles.welcome.color}}>{item.data}</Text></Text>

      {/* BOTÕES */}
      <View style={{ flexDirection:"row", gap: 12, marginTop: 16 }}>
        
        <Btn 
          texto="Editar" 
          icon="create-outline"
          onPress={()=>router.push(`/editarTreino?id=${item.id}`)}
          colors={["#FFA726","#FB8C00"]}
        />

        <Btn 
          texto="Excluir" 
          icon="trash-outline"
          onPress={()=>excluirTreino(item.id)}
          colors={["#E53935","#B71C1C"]}
        />

      </View>
    </View>
  );

  return (
    <LinearGradient colors={gradientColors} style={styles.root}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />

      <View style={{ padding: 22, flex: 1 }}>

        {/* HEADER */}
        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom: 30 }}>
          
          <Text style={[styles.welcome, { fontSize: 26 }]}>
            Meus Treinos
          </Text>

          <Pressable
            onPress={()=>router.push("/novoTreino")}
            style={{
              backgroundColor:"#FF7A2F",
              width:46,
              height:46,
              borderRadius:16,
              alignItems:"center",
              justifyContent:"center",
              elevation:4
            }}
          >
            <Ionicons name="add" size={26} color="#FFF"/>
          </Pressable>
        </View>

        {/* LISTA */}
        <FlatList
          data={treinos}
          keyExtractor={i=>i.id}
          renderItem={Card}
          contentContainerStyle={{ paddingBottom: 140 }}
          ListEmptyComponent={() => (
            <Text style={{ color: dark ? "#AAA" : "#666", textAlign:"center", marginTop: 40 }}>
              Nenhum treino registrado ainda.
            </Text>
          )}
        />
      </View>

    </LinearGradient>
  );
}


// ---------- BOTÃO COESO AO TEMA ----------
const Btn = ({ texto, onPress, colors, icon }) => (
  <Pressable style={{ flex: 1 }} onPress={onPress}>
    <LinearGradient
      colors={colors}
      style={{
        paddingVertical: 12,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        elevation: 4
      }}
    >
      <Ionicons name={icon} size={18} color="#FFF"/>
      <Text style={{ color: "#FFF", fontWeight: "bold" }}>{texto}</Text>
    </LinearGradient>
  </Pressable>
);
