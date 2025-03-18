import { createTheme, ThemeProvider } from "@mui/material/styles";

export const themeOptions = {
  palette: {
    type: "light",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    error: {
      main: "#f44336",
    },
    text: {
      hint: "#a2a2a2",
    },
  },
};

export const theme = createTheme(themeOptions);
