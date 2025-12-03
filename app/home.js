import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { auth, db } from "./firebase";
import { getSharedStyles } from "./styles"; // 💥 Importar estilos compartilhados!
import { ThemeContext } from "./ThemeContext";

export default function Home() {

  const router = useRouter();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const dark = theme === "dark";

  // 💥 CHAVE: Obter estilos dinâmicos
  const styles = getSharedStyles(theme); 

  const user = auth.currentUser;
  if (!user) return null;

  const uid = user.uid;
  const email = user.email;

  const [totalTreinos, setTotalTreinos] = useState(0);
  const [caloriasConsumidas, setCaloriasConsumidas] = useState(0);

  // 🔥 TREINOS (realtime)
  useEffect(() => {
    // 💥 CORREÇÃO: Adicionar uid como dependência
    return onSnapshot(collection(db,"users",uid,"treinos"),snap=>{
      setTotalTreinos(snap.size);
    });
  },[uid]);

  // 🔥 CALORIAS (realtime)
  useEffect(() => {
    // 💥 CORREÇÃO: Adicionar uid como dependência
    return onSnapshot(collection(db,"users",uid,"alimentos"),snap=>{
      let total=0;
      snap.forEach(d=>total+=d.data().calorias||0)
      setCaloriasConsumidas(total);
    });
  },[uid]);

  const logout = async ()=>{
    await signOut(auth);
    router.replace("/");
  };

  // Cores do Gradiente de Fundo
  const gradientColors = dark 
    ? ["#050509","#121219","#181924"] 
    : ["#FFFFFF","#FFFFFF","#FFFFFF"];


  return (
    <LinearGradient
      key={theme}
      colors={gradientColors}
      style={styles.root} 
    >

      {/* Ajuste Status Bar conforme o tema */}
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={[styles.scrollContent, {paddingTop: 30}]}>

        {/* HEADER ======================================================== */}
        <View style={{flexDirection:"row",justifyContent:"space-between",marginBottom:35, alignItems: 'center'}}>
          <View>
            {/* USAR styles.welcome */}
            <Text style={[styles.welcome, {fontSize:26}]}>
              Bem-vindo
            </Text>

            <Text style={{color:"#FF7A2F",fontWeight:"600", marginTop: 4}}>{email}</Text>
          </View>

          <Pressable onPress={toggleTheme} style={{padding:6}}>
            <Ionicons name={dark ? "sunny" : "moon"} size={30} color="#FF7A2F"/>
          </Pressable>
        </View>



        {/* RESUMO GERAL (CARD COESO) ======================================= */}
        {/* USAR styles.card para coesão visual (borderRadius: 28) */}
        <View style={[styles.card, {
          padding:22,
          marginBottom:30,
          borderWidth:1.2,
          borderColor:dark?"rgba(255,255,255,0.10)":"#E2E2E2",
          elevation:4, 
        }]}>

          {/* USAR styles.cardTitle */}
          <Text style={[styles.cardTitle, {
              color:"#FF7A2F",
              textAlign:"center",
              marginBottom:14,
              fontSize: 20
          }]}
          >
            <Ionicons name="checkmark-done-circle-outline" size={22} color="#FF7A2F"/> RESUMO GERAL
          </Text>

          {/* 💥 PROPAGAR STYLES DINÂMICOS */}
          <Item label="Treinos" value={totalTreinos} theme={theme} styles={styles}/>
          <Item label="Calorias gastas" value={`${totalTreinos*300} kcal`} theme={theme} styles={styles}/>
          <Item label="Calorias consumidas" value={`${caloriasConsumidas} kcal`} theme={theme} styles={styles}/>
        </View>



        {/* MENU EM GRADE (COESO) ========================================== */}
        <View style={{gap:18}}>
          <Row>
            {/* 💥 PROPAGAR STYLES DINÂMICOS */}
            <Menu icon="fitness-outline" name="Treinos" onPress={()=>router.push("/treinos")} theme={theme} styles={styles}/>
            <Menu icon="restaurant-outline" name="Alimentos" onPress={()=>router.push("/alimentos")} theme={theme} styles={styles}/>
          </Row>

          <Row>
            <Menu icon="stats-chart-outline" name="Estatísticas" onPress={()=>router.push("/estatisticas")} theme={theme} styles={styles}/>
            <Menu icon="settings-outline" name="Definições" onPress={()=>router.push("/definicoes")} theme={theme} styles={styles}/>
          </Row>

          <Row>
            <Menu icon="person-circle-outline" name="Perfil" onPress={()=>router.push("/perfil")} theme={theme} styles={styles}/>
            <Menu icon="exit-outline" name="Sair" color="#FF3B30" onPress={logout} theme={theme} styles={styles}/>
          </Row>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}


/* COMPONENTES AUXILIARES CORRIGIDOS ================================= */

function Row({children}) {
  return <View style={{flexDirection:"row",gap:18}}>{children}</View>;
}

// 💥 CORRIGIDO: Recebe 'styles' como prop para acessar estilos globais
function Menu({icon,name,onPress,color="#FF7A2F",theme,styles}) {
  const dark = theme === "dark";

  return(
    <Pressable 
      onPress={onPress}
      style={{
        flex:1,
        paddingVertical:22,
        alignItems:"center",
        borderRadius: styles.card.borderRadius, // Coesão
        backgroundColor: dark ? "rgba(255,255,255,0.08)" : "#FFFFFF",
        elevation:4,
        borderWidth: dark ? 1 : 0,
        borderColor: dark ? "rgba(255,255,255,0.08)" : "#E2E2E2"
      }}
    >
      <Ionicons name={icon} size={30} color={color}/>
      <Text style={{
        marginTop:8,
        fontSize:15,
        fontWeight:"600",
        color: styles.welcome.color // Cor adaptável
      }}>{name}</Text>
    </Pressable>
  );
}

// 💥 CORRIGIDO: Recebe 'styles' como prop
function Item({label,value,theme,styles}) {
    const dark = theme === "dark";
    
    return(
        <Text style={[styles.subtitle, {
            fontSize:15,
            marginBottom:6,
            color: styles.subtitle.color // Cor adaptável
        }]}>
            {label}: <Text style={{color:dark ? "#FFF" : "#000",fontWeight:"700"}}>{value}</Text>
        </Text>
    );
}