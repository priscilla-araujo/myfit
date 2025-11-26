import { Stack } from "expo-router";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";

export default function RootLayout() {
   return (
    <AuthProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </AuthProvider>
  );
}
