// src/providers/ThemeProvider.jsx

document.documentElement.setAttribute("data-theme", "neon-soft");
document.documentElement.setAttribute("data-mode", "light"); // optionnel


// Import React + Context // 
import React, { createContext, useContext, useEffect, useMemo, useState } from "react"; // 

// Créer le context // 
const ThemeContext = createContext(null); // 

// Helper : appliquer attributs sur <html> // 
const applyHtmlAttributes = ({ theme, mode }) => { // 
  // Récup html // 
  const html = document.documentElement; // 

  // Appliquer data-theme // 
  if (theme) html.setAttribute("data-theme", theme); // 
  else html.removeAttribute("data-theme"); // 

  // Appliquer data-mode // 
  if (mode === "light") html.setAttribute("data-mode", "light"); // 
  else html.removeAttribute("data-mode"); // 
}; // 

// Provider // 
export const ThemeProvider = ({ children }) => { // 
  // State theme (par défaut : valeur HTML ou fallback) // 
  const [theme, setTheme] = useState(() => { // 
    // Lire depuis <html> // 
    const current = document.documentElement.getAttribute("data-theme"); // 
    return current || "neon-festival"; // 
  }); // 

  // State mode (dark par défaut) // 
  const [mode, setMode] = useState(() => { // 
    // Lire depuis <html> // 
    const current = document.documentElement.getAttribute("data-mode"); // 
    return current || "dark"; // 
  }); // 

  // Effet : appliquer au DOM à chaque changement // 
  useEffect(() => { // 
    applyHtmlAttributes({ theme, mode }); // 
  }, [theme, mode]); // 

  // Toggle thème (festival <-> soft) // 
  const toggleTheme = () => { // 
    setTheme((prev) => (prev === "neon-soft" ? "neon-festival" : "neon-soft")); // 
  }; // 

  // Toggle mode (dark <-> light) // 
  const toggleMode = () => { // 
    setMode((prev) => (prev === "light" ? "dark" : "light")); // 
  }; // 

  // Value memo // 
  const value = useMemo( // 
    () => ({ theme, mode, setTheme, setMode, toggleTheme, toggleMode }), // 
    [theme, mode] // 
  ); // 

  // Render provider // 
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>; // 
}; // 

// Hook // 
export const useTheme = () => { // 
  const ctx = useContext(ThemeContext); // 
  if (!ctx) throw new Error("useTheme doit être utilisé dans <ThemeProvider>."); // 
  return ctx; // 
}; // 
