import { createContext, useState } from "react";
import { Appearance } from "react-native";

export const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
  const systemTheme = Appearance.getColorScheme();

  const [theme, setTheme] = useState(systemTheme ?? "dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
