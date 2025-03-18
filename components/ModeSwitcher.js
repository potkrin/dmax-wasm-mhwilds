import React from "react";
import { useColorScheme } from "@mui/material/styles";
import { Button, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import theme from "../src/theme";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
// ModeSwitcher is an example interface for toggling between modes.
// Material UI does not provide the toggle interface—you have to build it yourself.
export const ModeSwitcher = () => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // for server-side rendering
    // learn more at https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
    return null;
  }

  return (
    <Button
      // variant="outlined"
      color="inherit"
      onClick={() => {
        mode === "light" ? setMode("dark") : setMode("light");
      }}
      startIcon={mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
      sx={{
        //   backgroundColor: theme.vars.palette.primary.main, // var(--mui-palette-primary-main)
        color: theme.vars.palette.primary.contrastText, // var(--mui-palette-primary-contrastText)
        textTransform: "none",
      }}
    >
      {mode === "dark" ? "Dark" : "Light"}
    </Button>
  );
};

// ModeSwitcher is an example interface for toggling between modes.
// Material UI does not provide the toggle interface—you have to build it yourself.
export const ModeSwitcherListItemButton = () => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // for server-side rendering
    // learn more at https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
    return null;
  }

  return (
    <ListItemButton
      onClick={() => {
        mode === "light" ? setMode("dark") : setMode("light");
      }}
    >
      <ListItemIcon>{mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}</ListItemIcon>
      <ListItemText primary={mode === "dark" ? "Dark" : "Light"} />
    </ListItemButton>
  );
};
