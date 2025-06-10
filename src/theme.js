import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      main: "#6896fc"
    },
    secondary: {
      main: "#42a5f5"
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

export default theme;