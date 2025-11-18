// pages/styles.js
import { StatusBar, StyleSheet } from "react-native";

export const getSharedStyles = () =>
  StyleSheet.create({
    root: { flex: 1 },
    scrollContent: {
      paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 32,
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    heroRow: { marginBottom: 24 },
    welcome: { color: "#FFF", fontSize: 26, fontWeight: "700" },
    subtitle: { color: "#9C9CAF", fontSize: 14, marginTop: 4 },
    heroAvatarWrapper: { alignItems: "center", marginVertical: 12 },
    heroAvatarBg: {
      width: 72,
      height: 72,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
    },
    heroAvatar: { width: 52, height: 52, borderRadius: 26 },
    card: {
      backgroundColor: "#181924",
      borderRadius: 28,
      padding: 20,
      shadowColor: "#000",
      shadowOpacity: 0.35,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 14 },
      elevation: 8,
    },
    cardTitle: {
      color: "#FFF",
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 10,
    },
    label: { color: "#C7C7D8", fontSize: 13, marginTop: 12, marginBottom: 6 },
    inputWrapper: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.10)",
      backgroundColor: "rgba(14,15,24,0.9)",
      paddingHorizontal: 14,
      paddingVertical: 4,
    },
    input: { height: 44, color: "#FFF", fontSize: 14 },
    primaryBtn: { borderRadius: 18, overflow: "hidden", marginTop: 20 },
    primaryBtnGradient: {
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryBtnLabel: { color: "#FFF", fontSize: 16, fontWeight: "600" },
    bottomRow: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    bottomText: { color: "#8F8FA0", fontSize: 13 },
    bottomLink: {
      marginLeft: 4,
      color: "#FF7A2F",
      fontSize: 13,
      fontWeight: "600",
    },
    linkText: { color: "#FF7A2F", fontSize: 12, fontWeight: "600" },
    backBtn: { marginTop: 18, alignItems: "center" },
  });
