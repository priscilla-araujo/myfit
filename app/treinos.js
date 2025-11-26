import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
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

export default function Treinos() {
  const styles = getSharedStyles();
  const router = useRouter();
  const [treinos, setTreinos] = useState([]);

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

    if (Platform.OS === "web") {
      if (!window.confirm("Excluir treino?")) return;
    }

    try {
      await deleteDoc(doc(db,"users",user.uid,"treinos",id));
      Alert.alert("Removido","Treino excluído com sucesso!");
    } catch (error) {
      Alert.alert("Erro",error.message);
    }
  };

  // ---------- CARD LISTA ----------
  const Item = ({ item }) => (
    <View style={{ 
      backgroundColor:"rgba(255,255,255,0.06)",
      borderRadius:18,
      padding:18,
      marginBottom:18
    }}>

      <Text style={{ color:"#FF7A2F", fontSize:18, fontWeight:"bold" }}>
        {item.nome}
      </Text>

      <Text style={styles.label}>Tipo: <Text style={{color:"#FFF"}}>{item.tipo}</Text></Text>
      <Text style={styles.label}>Duração: <Text style={{color:"#FFF"}}>{item.duracao} min</Text></Text>
      <Text style={styles.label}>Data: <Text style={{color:"#FFF"}}>{item.data}</Text></Text>

      <View style={{ flexDirection:"row", marginTop:14, gap:12 }}>

        {/* EDITAR */}
        <Btn 
          texto="Editar" 
          icon="create-outline" 
          onPress={()=>router.push(`/editarTreino?id=${item.id}`)} 
          colors={["#FFA726","#FB8C00"]} 
        />

        {/* EXCLUIR */}
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
    <LinearGradient
      colors={["#050509","#121219","#181924"]}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />

      <View style={{ padding:22, flex:1 }}>

        {/* HEADER */}
        <View style={{ flexDirection:"row", justifyContent:"space-between", marginBottom:28 }}>
          <Text style={{ color:"#FFF", fontSize:24, fontWeight:"bold" }}>
            Meus Treinos
          </Text>

          {/* ADICIONAR TREINO */}
          <Pressable
            onPress={()=>router.push("/novoTreino")}
            style={{
              backgroundColor:"#FF7A2F",
              width:44,
              height:44,
              borderRadius:14,
              alignItems:"center",
              justifyContent:"center"
            }}
          >
            <Ionicons name="add" size={26} color="#FFF"/>
          </Pressable>
        </View>

        <FlatList
          data={treinos}
          keyExtractor={i=>i.id}
          renderItem={Item}
          contentContainerStyle={{paddingBottom:120}}
          ListEmptyComponent={() => (
            <Text style={{ color:"#888", textAlign:"center", marginTop:30 }}>
              Nenhum treino registrado ainda.
            </Text>
          )}
        />
      </View>

    </LinearGradient>
  );
}


// ---------- BOTÃO PADRÃO ----------
const Btn = ({texto,onPress,colors,icon}) => (
  <Pressable style={{flex:1}} onPress={onPress}>
    <LinearGradient 
      colors={colors} 
      style={{
        paddingVertical:12,
        borderRadius:12,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        gap:6
      }}
    >
      <Ionicons name={icon} size={18} color="#FFF"/>
      <Text style={{ color:"#FFF", fontWeight:"bold" }}>{texto}</Text>
    </LinearGradient>
  </Pressable>
);
