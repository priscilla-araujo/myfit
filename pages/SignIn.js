import { useNavigation } from "@react-navigation/native";
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

export default function SignIn() {
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    if (!email || !pass) return alert("Preencha os campos");
    signIn(email, pass);
  };

  const navegar = () => {
    console.log("entrei")
    navigation.navigate("SignUp")
    console.log(navigation)
  }

  const styles = getSharedStyles();

  return (
    <LinearGradient
      colors={["#050509", "#121219", "#181924"]}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroRow}>
          <View style={styles.heroTextBlock}>
            <Text style={styles.welcome}>Welcome back 👋</Text>
            <Text style={styles.subtitle}>
              Continue training, tracking, and growing!
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>

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
              placeholder="Enter password"
              placeholderTextColor="#72727D"
              secureTextEntry
              style={styles.input}
              value={pass}
              onChangeText={setPass}
            />
          </View>

          <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.linkText}>Forgot password?</Text>
          </Pressable>

          <Pressable style={styles.primaryBtn} onPress={handleLogin}>
            <LinearGradient
              colors={["#FF7A2F", "#FF4E1A"]}
              style={styles.primaryBtnGradient}
            >
              <Text style={styles.primaryBtnLabel}>Continue</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Don’t have an account?</Text>
            {/* <Pressable onPress={() => navigation.navigate("SignUp")}> */}
            <Pressable onPress={navegar}>
              <Text style={styles.bottomLink}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
