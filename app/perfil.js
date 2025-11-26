import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { auth, db } from "./firebase";
import { getSharedStyles } from "./styles";

export default function Perfil() {
  const styles = getSharedStyles();
  const router = useRouter();
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [objetivo, setObjetivo] = useState("");

  // =====================================================================
  // 🔥 Carrega perfil no Firestore
  // =====================================================================
  const carregarPerfil = async () => {
    if (!user) return;

    try {
      const ref = doc(db, "users", user.uid, "perfil", "informacoes");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const p = snap.data();
        setNome(p.nome ?? "");
        setIdade(p.idade ?? "");
        setAltura(p.altura ?? "");
        setPeso(p.peso ?? "");
        setObjetivo(p.objetivo ?? "");
      } else {
        console.log("⚠ Nenhum perfil encontrado—novo usuário.");
      }
    } catch (e) {
      alert("Erro ao carregar perfil!");
    }

    setLoading(false);
  };

  useEffect(() => { carregarPerfil(); }, []);

  // =====================================================================
  // 🔥 Salvar Perfil (Web + Mobile)
  // =====================================================================
  const salvarPerfil = async () => {
    if (!nome || !idade || !altura || !peso || !objetivo)
      return alert("Preencha todos os campos!");

    try {
      setSaving(true);

      await setDoc(
        doc(db, "users", user.uid, "perfil", "informacoes"),
        { nome, idade, altura, peso, objetivo, atualizadoEm: new Date() },
        { merge: true }
      );

      // WEB
      if (Platform.OS === "web") {
        alert("Perfil atualizado com sucesso! 🎉");
        setEditMode(false);
        return;
      }

      // MOBILE
      Alert.alert("Sucesso!", "Perfil atualizado com sucesso!", [
        { text: "OK", onPress: () => setEditMode(false) }
      ]);

    } catch {
      alert("Erro ao salvar perfil!");
    }

    setSaving(false);
  };

  // =====================================================================
  // ❌ Excluir Perfil com suporte Web + Mobile
  // =====================================================================
  const excluirPerfil = async () => {
  try {
    await deleteDoc(doc(db, "users", user.uid, "perfil", "informacoes"));

    // 🔥 limpa os estados imediatamente na UI
    setNome("");
    setIdade("");
    setAltura("");
    setPeso("");
    setObjetivo("");

    // 🔥 recarrega a tela sem dados
    carregarPerfil();        // Atualiza a interface em seguida
    setEditMode(false);      // volta para tela principal

    // 🔥 mensagem para Web + Mobile
    if (Platform.OS === "web") {
      alert("Perfil excluído com sucesso!");
    } else {
      Alert.alert("Perfil excluído", "Todos os dados foram removidos.");
    }

  } catch (error) {
    alert("Erro ao excluir o perfil.");
  }
};


  // =====================================================================
  // ⏳ Tela de Carregamento
  // =====================================================================
  if (loading) return (
    <View style={{flex:1,backgroundColor:"#050509",justifyContent:"center",alignItems:"center"}}>
      <ActivityIndicator size="large" color="#FF7A2F"/>
      <Text style={{color:"#FFF",marginTop:10}}>Carregando perfil...</Text>
    </View>
  );

  // =====================================================================
  // 🔥 VISUALIZAÇÃO DO PERFIL
  // =====================================================================
  if (!editMode)
    return (
      <LinearGradient colors={["#050509","#121219","#181924"]} style={styles.root}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Meu Perfil</Text>

            <Item label="Nome" valor={nome}/>
            <Item label="Idade" valor={idade}/>
            <Item label="Altura" valor={`${altura} cm`}/>
            <Item label="Peso" valor={`${peso} kg`}/>
            <Item label="Objetivo" valor={objetivo}/>

            {/* Botão Editar */}
            <Btn texto="Editar Perfil" onPress={()=>setEditMode(true)}/>

            {/* Botão Excluir */}
            <Btn texto="Excluir Perfil" vermelho onPress={excluirPerfil}/>
          </View>
        </ScrollView>
      </LinearGradient>
    );

  // =====================================================================
  // ✍️ MODO DE EDIÇÃO
  // =====================================================================
  return (
    <LinearGradient colors={["#050509","#121219","#181924"]} style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Editar Perfil</Text>

          <Campo label="Nome" valor={nome} set={setNome}/>
          <Campo label="Idade" valor={idade} set={setIdade} num/>
          <Campo label="Altura (cm)" valor={altura} set={setAltura} num/>
          <Campo label="Peso (kg)" valor={peso} set={setPeso} num/>
          <Campo label="Objetivo" valor={objetivo} set={setObjetivo}/>

          <Btn texto={saving?"Salvando...":"Salvar Alterações"} onPress={salvarPerfil}/>
          <Btn texto="Cancelar" cinza onPress={()=>setEditMode(false)}/>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

//
// COMPONENTES UTILIZADOS
//
function Item({label,valor}) {
  return (
    <>
      <Text style={{color:"#FF7A2F",marginTop:10}}>{label}</Text>
      <Text style={{color:"#FFF",marginBottom:8,fontSize:16}}>{valor || "-"}</Text>
    </>
  );
}

function Campo({label,valor,set,num}) {
  return (
    <>
      <Text style={{color:"#FF7A2F",marginTop:10}}>{label}</Text>
      <TextInput
        value={valor}
        onChangeText={set}
        keyboardType={num?"numeric":"default"}
        placeholderTextColor="#777"
        style={{backgroundColor:"#0E0E14",borderRadius:10,color:"#fff",padding:12,marginBottom:10}}
      />
    </>
  );
}

function Btn({texto,onPress,vermelho,cinza}) {
  return (
    <Pressable onPress={onPress} style={{overflow:"hidden",marginTop:15}}>
      <LinearGradient
        colors={
          vermelho ? ["#B00020","#790000"] :
          cinza ? ["#666","#333"] :
          ["#FF7A2F","#FF4E1A"]
        }
        style={{padding:14,borderRadius:12,alignItems:"center",pointerEvents:"none"}}
      >
        <Text style={{color:"#FFF",fontWeight:"bold",fontSize:16}}>{texto}</Text>
      </LinearGradient>
    </Pressable>
  );
}
