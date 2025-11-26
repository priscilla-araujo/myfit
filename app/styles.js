import { StatusBar, StyleSheet } from "react-native";

export const getSharedStyles = (theme = "dark") =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#050509" : "#F0F0F5",
    },
    scrollContent: {
      paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 32,
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    heroRow: { marginBottom: 24 },

    welcome: {
      color: theme === "dark" ? "#FFF" : "#000",
      fontSize: 26,
      fontWeight: "700",
    },

    subtitle: {
      color: theme === "dark" ? "#9C9CAF" : "#333",
      fontSize: 14,
      marginTop: 4,
    },

    card: {
      backgroundColor: theme === "dark" ? "#181924" : "#FFF",
      borderRadius: 28,
      padding: 20,
      shadowColor: "#000",
      shadowOpacity: theme === "dark" ? 0.25 : 0.15,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 14 },
      elevation: 8,
    },

    cardTitle: {
      color: theme === "dark" ? "#FFF" : "#000",
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 10,
    },

    label: {
      color: theme === "dark" ? "#C7C7D8" : "#333",
      fontSize: 13,
      marginTop: 12,
      marginBottom: 6,
    },

    inputWrapper: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.10)",
      backgroundColor: theme === "dark" ? "rgba(14,15,24,0.9)" : "#f0f0f0",
      paddingHorizontal: 14,
      paddingVertical: 4,
    },

    input: {
      height: 44,
      color: theme === "dark" ? "#FFF" : "#000",
      fontSize: 14,
    },

    primaryBtn: { borderRadius: 18, overflow: "hidden", marginTop: 20 },
    primaryBtnGradient: {
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryBtnLabel: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  });
