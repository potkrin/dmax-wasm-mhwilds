import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

export const breakpoints = {
  values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
};

/* lightTheme と darkTheme が持つ要素は対称にする

lightTheme のみ primary.contrastText と background.paper がなかった時、
以下の条件でアプリケーションがクラッシュした
- staging 環境で npm run build; PORT=3001 npm run start;
- ログイン中
- ライトモード

開発環境や staging 環境の未ログイン状態では再現しなかった

エラーメッセージ
framework-10fac88913917d91.js:9 TypeError: Cannot read properties of undefined (reading 'type')
   at i (_app-896c02c779f6212a.js:24:12926)
   at m (_app-896c02c779f6212a.js:24:14884)
   ... 略
*/

export const lightTheme = {
  // palette for light mode
  palette: {
    primary: {
      main: "#3f51b5",
      contrastText: "#ffffff",
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
      default: "#edf2f7",
      paper: "#ffffff",
    },
  },
};

export const darkTheme = {
  // palette for dark mode
  palette: {
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
};

export const theme = extendTheme({
  colorSchemes: {
    light: { ...lightTheme },
    dark: { ...darkTheme },
  },
});

export default theme;
