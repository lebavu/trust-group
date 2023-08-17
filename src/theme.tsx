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
  },
  typography: {
    fontSize: 19.6,
    h2: {
      fontSize: "2.8rem",
      fontWeight: 700,
      color: "#000",
      lineHeight: "calc(48/28)",
    },
    h3: {
      fontSize: "2.4rem",
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
      fontSize: "2rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1.8rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-containedSecondary": {
            color: "#fff"
          },
        },
      },
    },
  },
});

export default theme;
