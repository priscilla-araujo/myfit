import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { AuthContext } from "./AuthContext";
import { getSharedStyles } from "./styles";

export default function SignUp({ navigation }) {
  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async () => {
    if (!email || !pass || !confirm) return alert("Preencha todos os campos.");
    if (pass !== confirm) return alert("As senhas não coincidem.");
    try {
      await signUp(email, pass);
      navigation.navigate("index");
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  const styles = getSharedStyles();

  return (
    <View style={{flex:1}}>  {/* BASE, AGORA A IMAGEM PREENDE TUDO */}

      {/* 🔥 CAMADA DE ESCURECIMENTO E CONTEÚDO */}
      <LinearGradient
        colors={["rgba(0,0,0,0.85)", "rgba(0,0,0,0.95)"]}
        style={{flex:1,paddingTop:90,paddingHorizontal:22}}
      >
        <ScrollView contentContainerStyle={{paddingBottom:80}}>
          
          {/* LOGO */}
          <View style={{alignItems:"center",marginBottom:45}}>
            <Text style={{color:"#fff",fontSize:48,fontWeight:"bold"}}>
              my<Text style={{color:"#FF7A2F"}}>Fit</Text>
            </Text>
          </View>

          {/* FORM BOX */}
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
              Criar Conta
            </Text>

            {/* EMAIL */}
            <Field label="Email" icon="mail-outline">
              <TextInput
                style={inputField}
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                placeholderTextColor="#AAA"
              />
            </Field>

            {/* SENHA */}
            <Field label="Senha" icon="lock-closed-outline">
              <TextInput
                style={inputField}
                secureTextEntry
                value={pass}
                onChangeText={setPass}
                placeholder="********"
                placeholderTextColor="#AAA"
              />
            </Field>

            {/* CONFIRMAÇÃO */}
            <Field label="Confirmar Senha" icon="checkmark-circle-outline">
              <TextInput
                style={inputField}
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
                placeholder="Repetir senha..."
                placeholderTextColor="#AAA"
              />
            </Field>

            {/* BOTÃO */}
            <Pressable onPress={handleRegister} style={{marginTop:10}}>
              <LinearGradient
                colors={["#FF7A2F","#FF4E1A"]}
                style={{
                  paddingVertical:14,
                  borderRadius:10,
                  alignItems:"center"
                }}
              >
                <Text style={{color:"#fff",fontSize:17,fontWeight:"bold"}}>
                  Registrar
                </Text>
              </LinearGradient>
            </Pressable>

            <View style={{flexDirection:"row",justifyContent:"center",marginTop:16}}>
              <Text style={{color:"#ccc"}}>Já tem conta? </Text>
              <Pressable onPress={()=>navigation.navigate("index")}>
                <Text style={{color:"#FF7A2F",fontWeight:"bold"}}>Entrar</Text>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}


// 🔥 COMPONENTE PARA CAMPO COM ÍCONE
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
