import { createTheme } from "@mui/material/styles";
const logbookTheme = createTheme({
  palette: {
    primary: {
      main: "#047fe1"
    },
    secondary: {
      main: "#4fb0fc"
    }
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 300,
      md: 660,
      lg: 980,
      xl: 1620,
    },
  },
});

export default logbookTheme;