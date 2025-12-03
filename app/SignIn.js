import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View
} from "react-native";
import { AuthContext } from "./AuthContext";
import { getSharedStyles } from "./styles";

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = async () => {
    if (!email || !pass) return Alert.alert("Erro", "Preencha todos os campos!");

    try {
      await signIn(email, pass);
      router.replace("/home");
    } catch (error) {
      let msg = "Erro ao fazer login";

      if (error.code === "auth/user-not-found") msg = "Usuário não encontrado!";
      if (error.code === "auth/invalid-email") msg = "E-mail inválido!";
      if (error.code === "auth/wrong-password") msg = "Senha incorreta!";

      Alert.alert("Erro", msg);
    }
  };

  const styles = getSharedStyles();

  return (
    <View style={{flex:1}}>
    
      {/* 🔥 Fundo estilizado igual SignUp */}
      <LinearGradient
        colors={["rgba(0,0,0,0.85)", "rgba(0,0,0,0.95)"]}
        style={{flex:1,paddingTop:90,paddingHorizontal:22}}
      >
        <StatusBar barStyle="light-content" />

        <ScrollView contentContainerStyle={{paddingBottom:70}}>

          {/* LOGO - igual SignUp */}
          <View style={{alignItems:"center",marginBottom:40}}>
            <Text style={{fontSize:48,fontWeight:"bold",color:"#fff"}}>
              my<Text style={{color:"#FF7A2F"}}>Fit</Text>
            </Text>
          </View>

          {/* CARD */}
          <View style={{
            backgroundColor:"rgba(255,255,255,0.08)",
            padding:28,
            borderRadius:18
          }}>
            
            <Text style={{
              textAlign:"center",
              fontSize:22,
              fontWeight:"bold",
              color:"#fff",
              marginBottom:22
            }}>
              Login
            </Text>


            {/* EMAIL */}
            <Field label="Email" icon="mail-outline">
              <TextInput
                placeholder="email@exemplo.com"
                placeholderTextColor="#AAA"
                style={inputField}
                value={email}
                onChangeText={setEmail}
              />
            </Field>


            {/* SENHA */}
            <Field label="Senha" icon="lock-closed-outline">
              <TextInput
                placeholder="********"
                placeholderTextColor="#AAA"
                secureTextEntry
                style={inputField}
                value={pass}
                onChangeText={setPass}
              />
            </Field>

            {/* ESQUECEU SENHA */}
            <Pressable onPress={()=>router.push("/forgot-password")}>
              <Text style={{color:"#FF7A2F",textAlign:"right",marginBottom:14}}>
                Esqueceu a senha?
              </Text>
            </Pressable>

            {/* BOTÃO */}
            <Pressable onPress={handleLogin}>
              <LinearGradient
                colors={["#FF7A2F","#FF4E1A"]}
                style={{
                  paddingVertical:14,
                  borderRadius:10,
                  alignItems:"center",
                  marginBottom:10
                }}
              >
                <Text style={{color:"#fff",fontSize:17,fontWeight:"bold"}}>
                  Entrar
                </Text>
              </LinearGradient>
            </Pressable>


            {/* REGISTRO */}
            <View style={{flexDirection:"row",justifyContent:"center",marginTop:14}}>
              <Text style={{color:"#ccc"}}>Não tem conta? </Text>
              <Pressable onPress={()=>router.push("/sign-up")}>
                <Text style={{color:"#FF7A2F",fontWeight:"bold"}}>
                  Criar conta
                </Text>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}


// 🔥 INPUT PADRÃO COM ÍCONE (mesmo do signup)
function Field({label,icon,children}) {
  return (
    <View style={{marginBottom:18}}>
      <Text style={{color:"#fff",marginBottom:6}}>{label}</Text>

      <View style={inputBox}>
        <Ionicons name={icon} size={20} color="#FF7A2F" />
        {children}
      </View>
    </View>
  );
}

const inputBox = {
  flexDirection:"row",
  alignItems:"center",
  paddingHorizontal:10,
  paddingVertical:8,
  borderRadius:10,
  borderWidth:1,
  borderColor:"#FF7A2F",
  backgroundColor:"rgba(0,0,0,0.65)"
};

const inputField = {
  flex:1,
  marginLeft:8,
  color:"#fff",
  fontSize:15
};