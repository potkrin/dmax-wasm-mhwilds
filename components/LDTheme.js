import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
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
    background: {
      default: "#f3f6f9",
    },
  },
  typography: {
    h1: {
      fontSize: "1.5rem",
    },
    h2: {
      fontSize: "1.0rem",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    type: "dark",
    primary: {
      main: "#8798ef",
      contrastText: "#ffffff",
    },
    secondary: {
      // main: "#f50057",
      // main: "#ff549d",
      // main: "#fb589e",
      main: "#ff3990",
    },
    error: {
      main: "#f44336",
    },
    text: {
      hint: "#a2a2a2",
    },
    background: {
      default: "#303030",
      paper: "#424242",
    },
  },
  typography: {
    h1: {
      fontSize: "1.5rem",
    },
    h2: {
      fontSize: "1.0rem",
    },
  },
});
