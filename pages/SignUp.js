// import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View
} from "react-native";
import { AuthContext } from "../components/AuthContext";
import { getSharedStyles } from "./styles";

export default function SignUp({ navigation }) {
  // const navigation = useNavigation();
  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = () => {
    if (!email || !pass || !confirm) return alert("Preencha todos os campos.");
    if (pass !== confirm) return alert("Senhas não coincidem.");
    signUp(email, pass);
  };

  const styles = getSharedStyles();

  return (
    <LinearGradient
      colors={["#050509", "#121219", "#181924"]}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign Up</Text>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="your@email.com"
              placeholderTextColor="#72727D"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Create password"
              placeholderTextColor="#72727D"
              secureTextEntry
              style={styles.input}
              value={pass}
              onChangeText={setPass}
            />
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Repeat password"
              placeholderTextColor="#72727D"
              secureTextEntry
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
            />
          </View>

          <Pressable style={styles.primaryBtn} onPress={handleRegister}>
            <LinearGradient
              colors={["#FF7A2F", "#FF4E1A"]}
              style={styles.primaryBtnGradient}
            >
              <Text style={styles.primaryBtnLabel}>Register</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Already have an account?</Text>
            <Pressable onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.bottomLink}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
