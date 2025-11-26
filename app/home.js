import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { auth, db } from "./firebase";
import { ThemeContext } from "./ThemeContext";

export default function Home() {

  const router = useRouter();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const dark = theme === "dark";

  const user = auth.currentUser;
  if (!user) return null;

  const uid = user.uid;
  const email = user.email;

  const [totalTreinos, setTotalTreinos] = useState(0);
  const [caloriasConsumidas, setCaloriasConsumidas] = useState(0);

  // 🔥 TREINOS (realtime)
  useEffect(() => {
    return onSnapshot(collection(db,"users",uid,"treinos"),snap=>{
      setTotalTreinos(snap.size);
    });
  },[]);

  // 🔥 CALORIAS (realtime)
  useEffect(() => {
    return onSnapshot(collection(db,"users",uid,"alimentos"),snap=>{
      let total=0;
      snap.forEach(d=>total+=d.data().calorias||0)
      setCaloriasConsumidas(total);
    });
  },[]);

  const logout = async ()=>{
    await signOut(auth);
    router.replace("/");
  };

  return (
    <LinearGradient
      key={theme}
      colors={ dark ? ["#050509","#121219","#181924"] : ["#FFFFFF","#FFFFFF","#FFFFFF"] }
      style={{flex:1,paddingTop:60,paddingHorizontal:22}}
    >

      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={{paddingBottom:100}}>

        {/* HEADER ======================================================== */}
        <View style={{flexDirection:"row",justifyContent:"space-between",marginBottom:35}}>
          <View>
            <Text style={{
              fontSize:26,
              fontWeight:"bold",
              color:dark ? "#FFF" : "#000"
            }}>
              Bem-vindo
            </Text>

            <Text style={{color:"#FF7A2F",fontWeight:"600"}}>{email}</Text>
          </View>

          <Pressable onPress={toggleTheme} style={{padding:6}}>
            <Ionicons name={dark ? "sunny" : "moon"} size={30} color="#FF7A2F"/>
          </Pressable>
        </View>



        {/* RESUMO GERAL (AGORA LARANJA + SEM ÍCONE) ======================= */}
        <View style={{
          backgroundColor: dark ? "rgba(255,255,255,0.08)" : "#F5F5F5",
          borderRadius:18,
          padding:22,
          marginBottom:30,
          borderWidth:1.2,
          borderColor:dark?"rgba(255,255,255,0.10)":"#E2E2E2",
          elevation:4
        }}>

          <Text
  style={{
    fontSize:20,
    fontWeight:"800",
    color:"#FF7A2F",
    textAlign:"center",
    marginBottom:14
  }}
>
  <Ionicons name="checkmark-done-circle-outline" size={22} color="#FF7A2F"/> RESUMO GERAL
</Text>


          <Item label="Treinos" value={totalTreinos} theme={theme}/>
          <Item label="Calorias gastas" value={`${totalTreinos*300} kcal`} theme={theme}/>
          <Item label="Calorias consumidas" value={`${caloriasConsumidas} kcal`} theme={theme}/>
        </View>



        {/* MENU EM GRADE ================================================== */}
        <View style={{gap:18}}>
          <Row>
            <Menu icon="fitness-outline" name="Treinos" onPress={()=>router.push("/treinos")} theme={theme}/>
            <Menu icon="restaurant-outline" name="Alimentos" onPress={()=>router.push("/alimentos")} theme={theme}/>
          </Row>

          <Row>
            <Menu icon="stats-chart-outline" name="Estatísticas" onPress={()=>router.push("/estatisticas")} theme={theme}/>
            <Menu icon="settings-outline" name="Definições" onPress={()=>router.push("/definicoes")} theme={theme}/>
          </Row>

          <Row>
            <Menu icon="person-circle-outline" name="Perfil" onPress={()=>router.push("/perfil")} theme={theme}/>
            <Menu icon="exit-outline" name="Sair" color="#FF3B30" onPress={logout} theme={theme}/>
          </Row>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}


/* COMPONENTES ======================================================= */

function Row({children}) {
  return <View style={{flexDirection:"row",gap:18}}>{children}</View>;
}

function Menu({icon,name,onPress,color="#FF7A2F",theme}) {
  return(
    <Pressable 
      onPress={onPress}
      style={{
        flex:1,
        paddingVertical:22,
        alignItems:"center",
        borderRadius:14,
        backgroundColor: theme==="dark" ? "rgba(255,255,255,0.08)" : "#FFFFFF",
        elevation:4
      }}
    >
      <Ionicons name={icon} size={30} color={color}/>
      <Text style={{
        marginTop:8,
        fontSize:15,
        fontWeight:"600",
        color: theme==="dark" ? "#fff" : "#000"
      }}>{name}</Text>
    </Pressable>
  );
}

function Item({label,value,theme}) {
  return(
    <Text style={{
      fontSize:15,
      marginBottom:6,
      color: theme==="dark"? "#CCC" : "#444"
    }}>
      {label}: <Text style={{color:theme==="dark" ? "#FFF" : "#000",fontWeight:"700"}}>{value}</Text>
    </Text>
  );
}
