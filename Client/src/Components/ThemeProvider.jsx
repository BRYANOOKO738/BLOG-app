import React from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme); // Get the theme from Redux state

  // Define inline styles for both light and dark themes
  const lightThemeStyles = {
    backgroundColor: "white",
    color: "black",
    minHeight: "100vh", // To ensure the whole view is styled
  };

  const darkThemeStyles = {
    backgroundColor:" #050819",
    color: "white",
    minHeight: "100vh",
  };

  // Use the correct styles based on the current theme
  const currentThemeStyles =
    theme === "light" ? lightThemeStyles : darkThemeStyles;

  return <div style={currentThemeStyles} className={theme}>{children}</div>;
};

export default ThemeProvider;
