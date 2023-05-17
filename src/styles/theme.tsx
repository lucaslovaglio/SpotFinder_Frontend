import { createTheme } from "@mui/material/styles";

const primaryColor = "rgb(0, 255, 149)";
const secondaryColor = "rgb(32, 32, 32)";
const warningColor = "#F2C335"; //#F2CB05
const errorColor = "#A60F0F";
const secondaryLight = "rgb(62, 62, 62)";
const terciaryColor = "#76A5AF";
const terciaryLight = "#A7C8F2";

const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
      light: secondaryLight,
    },
    warning: {
        main: warningColor
    },
    success: {
        main: primaryColor
    },
    error: {
        main: errorColor
    },
    info: {
      main: terciaryColor,
      light: terciaryLight,
    }
  },
});

export default theme;
