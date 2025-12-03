import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { signOut } from "firebase/auth"; // 🔥 CORREÇÃO
import { auth } from "./firebase"; // 🔥 CORREÇÃO

import { getSharedStyles } from "./styles";
import { ThemeContext } from "./ThemeContext";


// =======================================================================
// COMPONENTE AUXILIAR PARA CADA LINHA DE DEFINIÇÃO
// =======================================================================
const SettingItem = ({
  styles,
  label,
  iconName,
  value,
  onPress,
  isSwitch,
  switchValue,
  onSwitchChange,
  isDestructive,
}) => {
  const iconColor = isDestructive ? "#DC3545" : "#FF7A2F";
  const labelColor = isDestructive
    ? "#DC3545"
    : styles.settingItemLabel?.color || styles.welcome.color;

  return (
    <Pressable
      onPress={onPress || (isSwitch ? onSwitchChange : null)}
      disabled={isSwitch && !onPress}
      style={styles.settingItemRow}
    >
      <Ionicons
        name={iconName}
        size={22}
        color={iconColor}
        style={styles.settingItemIcon}
      />

      <View style={styles.settingItemTextContainer}>
        <Text style={[styles.settingItemLabel, { color: labelColor }]}>
          {label}
        </Text>
        {value && <Text style={styles.settingItemValue}>{value}</Text>}
      </View>

      {isSwitch ? (
        <Switch
          trackColor={{
            false: styles.switchTrackFalse.color,
            true: "#FF7A2F",
          }}
          thumbColor={styles.switchThumb.color}
          onValueChange={onSwitchChange}
          value={switchValue}
        />
      ) : (
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={styles.chevron.color}
        />
      )}
    </Pressable>
  );
};

// =======================================================================
// TELA DE DEFINIÇÕES COMPLETA
// =======================================================================
export default function Definicoes() {
  const router = useRouter();
  const { toggleTheme, theme } = useContext(ThemeContext);

  const stylesShared = getSharedStyles(theme);
  const stylesLocal = getLocalStyles(theme);

  const styles = { ...stylesShared, ...stylesLocal };

  // 🔥 CORREÇÃO ABSOLUTA — Logout 100% funcional
  const handleLogout = async () => {
    try {
      await signOut(auth); // 👉 Igual ao Home
      Alert.alert("Sessão terminada!", "Você saiu da conta.");
      router.replace("/SignIn");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível sair.");
      console.log("Erro ao sair:", e);
    }
  };

  const handleGoToAbout = () => {
    Alert.alert("Ação", "Abrir tela Sobre o App (implementar rota)");
  };

  const gradientColors =
    theme === "dark"
      ? ["#050509", "#121219", "#181924"]
      : ["#F9F9F9", "#FFFFFF", "#FFFFFF"];

  const statusBarStyle = theme === "dark" ? "light-content" : "dark-content";

  return (
    <LinearGradient colors={gradientColors} style={stylesShared.root}>
      <StatusBar barStyle={statusBarStyle} />

      <ScrollView contentContainerStyle={stylesShared.scrollContent}>
        {/* HEADER */}
        <View style={stylesLocal.headerContainer}>
          <Ionicons name="settings-outline" size={30} color="#FF7A2F" />
          <Text
            style={[stylesShared.welcome, { marginTop: 8, fontSize: 28 }]}
          >
            Definições
          </Text>
          <Text style={stylesShared.subtitle}>Gerencie suas preferências.</Text>
        </View>

        {/* APARÊNCIA */}
        <View style={stylesShared.card}>
          <Text style={[stylesShared.cardTitle, stylesLocal.cardHeaderTitle]}>
            APARÊNCIA
          </Text>

          <SettingItem
            styles={styles}
            label={`Tema Atual: ${theme === "dark" ? "Escuro" : "Claro"}`}
            iconName="color-palette-outline"
            isSwitch={true}
            switchValue={theme === "dark"}
            onSwitchChange={toggleTheme}
          />
        </View>

        {/* CONTA */}
        <View style={[stylesShared.card, { marginTop: 20 }]}>
          <Text style={[stylesShared.cardTitle, stylesLocal.cardHeaderTitle]}>
            CONTA E GERAL
          </Text>

          <SettingItem
            styles={styles}
            label="Notificações"
            iconName="notifications-outline"
            onPress={() => Alert.alert("Ação", "Tela de notificações")}
          />

          <SettingItem
            styles={styles}
            label="Sobre o App"
            iconName="information-circle-outline"
            onPress={handleGoToAbout}
            value="Versão 1.0.0"
          />

          {/* 🔥 SAIR DA CONTA — AGORA FUNCIONA */}
          <SettingItem
            styles={styles}
            label="Sair da Conta"
            iconName="log-out-outline"
            onPress={handleLogout}  // 🔥 AQUI ESTÁ A CORREÇÃO
            isDestructive={true}
          />
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </LinearGradient>
  );
}

// =======================================================================
// ESTILOS ESPECÍFICOS
// =======================================================================
const getLocalStyles = (theme) =>
  StyleSheet.create({
    headerContainer: {
      alignItems: "center",
      marginBottom: 25,
    },

    cardHeaderTitle: {
      color: "#FF7A2F",
      textAlign: "center",
      marginBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor:
        theme === "dark" ? "rgba(255,255,255,0.1)" : "#E0E0E0",
      paddingBottom: 8,
    },

    settingItemRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor:
        theme === "dark" ? "rgba(255,255,255,0.05)" : "#F0F0F0",
    },

    settingItemIcon: {
      marginRight: 15,
    },

    settingItemTextContainer: {
      flex: 1,
      justifyContent: "center",
    },

    settingItemLabel: {
      color: theme === "dark" ? "#FFF" : "#000",
      fontSize: 16,
      fontWeight: "500",
    },

    settingItemValue: {
      color: theme === "dark" ? "#9C9CAF" : "#555",
      fontSize: 12,
    },

    chevron: {
      color: theme === "dark" ? "#9C9CAF" : "#555",
    },

    switchTrackFalse: {
      color: theme === "dark" ? "#767577" : "#E0E0E0",
    },

    switchThumb: {
      color: "#F4F3F4",
    },
  });
