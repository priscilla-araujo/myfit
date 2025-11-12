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
import { AuthContext } from "../components/AuthContext";
import { getSharedStyles } from "./styles";

export default function ForgotPassword() {
  const navigation = useNavigation();
  const { resetPassword } = useContext(AuthContext);
  const [email, setEmail] = useState("");

  const handleReset = () => {
    if (!email) return Alert.alert("Digite seu e-mail");
    resetPassword(email);
  };

  const styles = getSharedStyles();

  return (
    <LinearGradient
      colors={["#050509", "#121219", "#181924"]}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroRow}>
          <Text style={styles.welcome}>Reset Password 🔒</Text>
          <Text style={styles.subtitle}>
            We’ll send you a link to reset your password.
          </Text>
        </View>

        <View style={styles.card}>
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

          <Pressable style={styles.primaryBtn} onPress={handleReset}>
            <LinearGradient
              colors={["#FF7A2F", "#FF4E1A"]}
              style={styles.primaryBtnGradient}
            >
              <Text style={styles.primaryBtnLabel}>Send Reset Link</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("SignIn")}
            style={styles.backBtn}
          >
            <Text style={styles.bottomLink}>Back to Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
