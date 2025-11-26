import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { AuthContext } from "./AuthContext";
import { getSharedStyles } from "./styles";

export default function ForgotPassword() {
  const navigation = useNavigation();
  const { resetPassword } = useContext(AuthContext);
  const [email, setEmail] = useState("");

  const handleReset = () => {
    if (!email) return Alert.alert("Digite seu email");
    resetPassword(email);
    Alert.alert("Link enviado!", "Verifique sua caixa de entrada 📩");
  };

  const styles = getSharedStyles();

  return (
    <View style={{ flex:1 }}>
      
      {/* Fundo escuro igual SignIn & SignUp */}
      <LinearGradient
        colors={["rgba(0,0,0,0.85)", "rgba(0,0,0,0.95)"]}
        style={{flex:1,paddingTop:90,paddingHorizontal:22}}
      >
        <StatusBar barStyle="light-content" />

        <ScrollView contentContainerStyle={{paddingBottom:60}}>


          {/* Logo igual SignIn e SignUp */}
          <View style={{alignItems:"center",marginBottom:40}}>
            <Text style={{fontSize:48,fontWeight:"bold",color:"#fff"}}>
              my<Text style={{color:"#FF7A2F"}}>Fit</Text>
            </Text>
          </View>

          {/* Card com efeito vidro */}
          <View style={{
            backgroundColor:"rgba(255,255,255,0.08)",
            padding:28,
            borderRadius:18
          }}>

            <Text style={{
              fontSize:22,
              textAlign:"center",
              fontWeight:"bold",
              color:"#fff",
              marginBottom:22
            }}>
              Recuperar Senha
            </Text>

            {/* EMAIL */}
            <Field label="Email" icon="mail-outline">
              <TextInput
                style={inputField}
                placeholder="email@exemplo.com"
                placeholderTextColor="#AAA"
                value={email}
                onChangeText={setEmail}
              />
            </Field>

            {/* BOTÃO ENVIAR */}
            <Pressable onPress={handleReset} style={{marginTop:10}}>
              <LinearGradient
                colors={["#FF7A2F","#FF4E1A"]}
                style={{
                  paddingVertical:14,
                  borderRadius:10,
                  alignItems:"center"
                }}
              >
                <Text style={{color:"#fff",fontSize:17,fontWeight:"bold"}}>
                  Enviar Link
                </Text>
              </LinearGradient>
            </Pressable>


            {/* VOLTAR */}
            <Pressable
              onPress={() => navigation.navigate("index")}
              style={{marginTop:18,alignItems:"center"}}
            >
              <Text style={{color:"#FF7A2F",fontWeight:"bold",fontSize:15}}>
                Voltar ao Login
              </Text>
            </Pressable>

          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}


/* 🔥 Mesmos inputs com ícones do login/cadastro */
function Field({label,icon,children}) {
  return (
    <View style={{marginBottom:18}}>
      <Text style={{color:"#fff",marginBottom:6,fontSize:14}}>{label}</Text>
      <View style={inputBox}>
        <Ionicons name={icon} size={20} color="#FF7A2F"/>
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
