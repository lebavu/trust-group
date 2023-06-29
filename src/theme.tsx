import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#1e2f8d",
    },
    secondary: {
      main: "#5bb460",
    },
    error: {
      main: red.A400,
    },
    color: {
      blue: "#007FFF",
      greyF6: "#f6f6f7",
      greyEd: "#ededed",
      grey999: "#999",
      greyFb: "#FBFBFB",
      grey18: "#18181B",
      green: "#12B76A",
    },
  },
  typography: {
    fontSize: 19.6, // Set the base font size
    fontFamily: "Roboto, sans-serif",
    h2: {
      fontSize: "2.8rem", // Customize heading level 1
      fontWeight: 700,
      color: "#000",
      lineHeight: "calc(48/28)",
    },
    h3: {
      fontSize: "2.4rem", // Customize heading level 2
      lineHeight: "calc(28 / 24)",
      color: "#000",
      fontWeight: 700,
    },
    h4: {
      fontSize: "2.1rem",
      lineHeight: "calc(28 / 21)",
      fontWeight: "700",
    },
    h5: {
      fontSize: "2rem", // Customize heading level 2
      fontWeight: 500,
    },
    h6: {
      fontSize: "1.8rem", // Customize heading level 2
      fontWeight: 500,
    },
    // Add more heading levels and customize as needed
    // ...
  },
});

export default theme;
