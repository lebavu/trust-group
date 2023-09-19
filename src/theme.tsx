import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const placehodlerStyle = {
  opacity: 0.7,
  color: "#C8C8C8",
  fontSize: "1.4rem",
};
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
    fontSize: 21,
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
      fontSize: "1.6rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // height: "100px",
          textTransform: "capitalize",
          padding: "0 1.5rem",
          lineHeight: "4.4rem",
          height: "4.4rem",
          whiteSpace: "nowrap",
          minWidth: "8rem",
          borderRadius: ".8rem",
          "&.MuiButton-containedSecondary": {
            color: "#fff"
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "1.4rem",
          fontWeight: 400,
          color: "#000",
          lineHeight: "2.5rem",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: () => ({
          fontSize: "1.4rem",
          "> input": {
            fontSize: "1.4rem",
            height: "4.4rem",
            padding: "0 1.6rem",
            borderRadius: ".8rem!important",
            "&::placeholder": placehodlerStyle,
          },
          "fieldset": {
            borderWidth: "1px !important",
            borderColor: "rgba(145, 158, 171, 0.2)",
            borderRadius: ".8rem"
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          ".MuiOutlinedInput-input.MuiSelect-select":{
            minHeight: "4.4rem",
            paddingBlock: "0",
            lineHeight: "4.4rem"
          }
        },
      },
    },
  },
});

export default theme;
