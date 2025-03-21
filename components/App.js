import React, { useState, useRef, useEffect, useCallback } from "react";
// import "./App.css";
import {
  Tabs,
  Tab,
  Container,
  Box,
  Typography,
  AppBar,
  Fab,
  ThemeProvider,
  createTheme,
  ListItemIcon,
  Snackbar,
  useMediaQuery,
  Paper,
  CssBaseline,
} from "@mui/material";
import { DmaxMain } from "./DmaxMain";
import { ThemeContext, useTheme } from "@emotion/react";
import PropTypes from "prop-types";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { styled } from "@mui/system";

import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import CloudIcon from "@mui/icons-material/Cloud";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import DevicesIcon from "@mui/icons-material/Devices";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HelpIcon from "@mui/icons-material/Help";
import CancelIcon from "@mui/icons-material/Cancel";

import MuiAlert from "@mui/material/Alert";

import { lightTheme, darkTheme } from "./LDTheme";
import { SnackbarContext } from "./SnackbarContext";
import Usage from "./Usage";
import ServerArtianManager from "./ServerArtianManager";
import ArtianTab from "./ArtianTab";
import { CharmAndQuriousArmorContext } from "./CharmAndQuriousArmorContext";
import { ArtianContext } from "./ArtianContext";
import { HideOnScrollContext } from "./HideOnScrollContext";
import { LoginContext } from "./LoginContext";
import { fetchWithRetry } from "../lib/utils";
import QuriousArmorTab from "./QuriousArmorTab";
import { theme, breakpoints } from "../src/theme";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { ModeSwitcher, ModeSwitcherListItemButton } from "./ModeSwitcher";
import { CharmIcon } from "./icons/CharmIcon";
import { ArmorIcon } from "./icons/ArmorIcon";

/**
 * TODO:
 *   - スキルの検索ボックス。文字列がヒットしたもののみ残る
 */

export function TabPanel(props) {
  const { children, value, index, allowUnmount, ...other } = props;

  if (allowUnmount) {
    return (
      <div
        role="tabpanel"
        // タブ切替時にアンマウントされないように display: none で非表示
        style={{ display: value === index ? "block" : "none" }}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {/* タブ切り替えを条件分岐によるレンダーON/OFFで実現すると OFF でアンマウントされ、state がリセットされてしまうので避ける */}
        {value === index && children}
      </div>
    );
  } else {
    return (
      <div
        role="tabpanel"
        // タブ切替時にアンマウントされないように display: none で非表示
        style={{ display: value === index ? "block" : "none" }}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {/* タブ切り替えを条件分岐によるレンダーON/OFFで実現すると OFF でアンマウントされ、state がリセットされてしまうので避ける */}
        {children}
      </div>
    );
  }
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// スクロール時に AppBar を隠す
export function HideOnScroll(props) {
  const { children, window, direction = "down" } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger();
  // 上方向へスクロールしたときに表示
  return (
    <Slide appear={false} direction={direction} in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const drawerWidth = 240;
const navItems = ["Home", "About", "Contact"];

const MainTabs = ({ sx, value, handleChange, iconPosition }) => {
  const customSX = {
    minHeight: "0px",
    fontSize: "0.7rem",
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      indicatorColor="secondary"
      textColor="inherit"
      variant="fullWidth"
      aria-label="tabs example"
      sx={{
        ...sx,
        minHeight: "0px",
      }}
    >
      <Tab
        label="最適化"
        sx={{ ...customSX }}
        {...a11yProps(0)}
        icon={<TrendingUpIcon />}
        iconPosition={iconPosition}
      />
      <Tab
        label="アーティア武器"
        sx={{ ...customSX }}
        {...a11yProps(1)}
        icon={
          <CharmIcon
            sx={{
              [`@media (max-width: ${breakpoints.values.sm}px)`]: {
                marginBottom: "8px",
              },
              [`@media (min-width: ${breakpoints.values.sm + 1}px)`]: {
                marginRight: "0px",
              },
            }}
          />
        }
        iconPosition={iconPosition}
      />
      <Tab
        label="傀異錬成"
        sx={{ ...customSX }}
        {...a11yProps(2)}
        icon={
          <ArmorIcon
            sx={{
              [`@media (max-width: ${breakpoints.values.sm}px)`]: {
                marginBottom: "8px",
              },
              [`@media (min-width: ${breakpoints.values.sm + 1}px)`]: {
                marginRight: "0px",
              },
            }}
          />
        }
        iconPosition={iconPosition}
      />
      <Tab
        label="使い方"
        sx={{ ...customSX }}
        {...a11yProps(3)}
        icon={<HelpIcon />}
        iconPosition={iconPosition}
      />
    </Tabs>
  );
};

function App() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    window.scrollTo(0, 0);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  // コンテナ幅を起点にFABの位置を決める. 画面幅がコンテナ幅より小さい場合は画面幅を起点にする
  const [containerWidth, setContainerWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const containerRef = useRef(null);
  const [fabRight, setFabRight] = useState(`64px`);

  useEffect(() => {
    // クライアントサイドでのみ window オブジェクトを使用
    setWindowWidth(window.innerWidth);

    // window のリサイズ時に呼び出す関数
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // イベントリスナーを設定
    window.addEventListener("resize", handleResize);

    // クリーンアップ関数でイベントリスナーを削除
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    // window のリサイズ時に呼び出したい関数を定義
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // window のリサイズ時に呼び出したい関数を登録
    window.addEventListener("resize", handleResize);

    if (windowWidth > containerWidth) {
      let rightPx = windowWidth / 2 - containerWidth / 2 + 64;
      // setFabRight(`${rightPx}px`);
      setFabRight(rightPx);

      // setFabRight("74px");

      console.log(
        "windowWidth > containerWidth. windowWidth = " +
          windowWidth +
          ", containerWidth = " +
          containerWidth +
          ", fabRight =" +
          fabRight
      );
    } else {
      setFabRight(50);
      console.log(
        "windowWidth <= containerWidth. windowWidth = " +
          windowWidth +
          ", containerWidth = " +
          containerWidth +
          ", fabRight =" +
          fabRight
      );
    }

    // アンマウント時に実行されるクリーンアップ関数
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth, containerWidth]);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const [artianValue, setArtianValue] = useState(0);
  const [charmValue, setCharmValue] = useState(0);
  const [quriousArmorValue, setQuriousArmorValue] = useState(0);
  const [useServerData, setUseServerData] = useState(false);
  const [excludeArtian, setExcludeArtian] = useState(false);
  const [excludeCharm, setExcludeCharm] = useState(false);
  const [excludeQuriousArmor, setExcludeQuriousArmor] = useState(false);

  useEffect(() => {
    if (useServerData) checkLoginStatus();
  }, [useServerData]);

  const handleChangeArtianValue = useCallback((event, newValue) => {
    setArtianValue(newValue);
    localStorage.setItem("artianValue", newValue);
  }, []);

  const handleChangeCharmValue = useCallback((event, newValue) => {
    setCharmValue(newValue);
    localStorage.setItem("charmValue", newValue);
  }, []);

  const handleChangeQuriousArmorValue = useCallback((event, newValue) => {
    setQuriousArmorValue(newValue);
    localStorage.setItem("quriousArmorValue", newValue);
  }, []);

  // コンポーネントがマウントされた後にlocalStorageからデータを読み込む
  useEffect(() => {
    let initArtianValue = localStorage.getItem("artianValue");
    if (initArtianValue === "1") initArtianValue = 1;
    else initArtianValue = 0;
    setArtianValue(initArtianValue);

    let initQuriousArmorValue = localStorage.getItem("quriousArmorValue");
    if (initQuriousArmorValue === "1") initQuriousArmorValue = 1;
    else initQuriousArmorValue = 0;
    setQuriousArmorValue(initQuriousArmorValue);

    let initUseServerData = localStorage.getItem("useServerData");
    console.log("[dbgusd] initUseServerData: " + initUseServerData);
    if (initUseServerData === "true") initUseServerData = true;
    else initUseServerData = false;
    setUseServerData(initUseServerData);

    let initExcludeArtian = localStorage.getItem("excludeArtian");
    if (initExcludeArtian === "true") initExcludeArtian = true;
    else initExcludeArtian = false;
    setExcludeArtian(initExcludeArtian);

    let initExcludeQuriousArmor = localStorage.getItem("excludeQuriousArmor");
    if (initExcludeQuriousArmor === "true") initExcludeQuriousArmor = true;
    else initExcludeQuriousArmor = false;
    setExcludeQuriousArmor(initExcludeQuriousArmor);
  }, []);

  // エラー出力用 Snackbar 管理
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // ServerArtianData 共有用 state
  const [serverArtianData, setServerArtianData] = useState([]);
  const [serverCharmData, setServerCharmData] = useState([]);
  const [serverQuriousArmorData, setServerQuriousArmorData] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "left" }}>
      <Typography variant="h6" sx={{ my: 2, ml: 2 }}>
        DMAX
      </Typography>
      <Divider />
      <List>
        {/* {navItems.map((item) => (
          <ListItem key={item} disablePadding> */}
        {/* <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton> */}
        <ListItem key={"themeToggle"} disablePadding>
          <ModeSwitcherListItemButton />
        </ListItem>

        <ListItem key={"loginLogout"} disablePadding>
          <ListItemButton>
            <ListItemIcon>{isLoggedIn ? <LogoutIcon /> : <LoginIcon />}</ListItemIcon>
            {isLoggedIn ? (
              <a
                href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/logout/?next=/dmax`}
                style={{
                  color: theme.vars.palette.text.primary,
                  textDecoration: "none",
                }}
              >
                ログアウト
              </a>
            ) : (
              <a
                href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/login/?next=/dmax`}
                // target="_blank"
                // rel="noopener noreferrer"
                style={{
                  color: theme.vars.palette.text.primary,
                  textDecoration: "none",
                }}
              >
                ログイン
              </a>
            )}
          </ListItemButton>
        </ListItem>

        <ListItem key={"leaderboardLink"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <OpenInNewIcon />
            </ListItemIcon>
            <a
              href="https://www.mhrspeedrun.com/cms/quest/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: theme.vars.palette.text.primary,
                textDecoration: "none",
              }}
            >
              TA集計
            </a>
          </ListItemButton>
        </ListItem>
        {/* ))} */}
      </List>
    </Box>
  );

  const fetchLoginStatus = () => {
    console.log("fetchLoginStatus");
    fetchWithRetry(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax-api/v1/check-login/`,
      {
        method: "GET",
        credentials: "include", // クッキーベースの認証に必要
      },
      3,
      5000
    )
      .then((response) => {
        console.log(`Response Status Code: ${response.status}`); // ステータスコードを表示
        if (response.status === 401) {
          setIsLoggedIn(false);
        } else if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if ("is_logged_in" in data && data["is_logged_in"] === true) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        console.error("サーバーとの通信でエラーが発生しました\n" + error.stack);
        setError("ログイン状態の確認に失敗しました");
        setIsLoggedIn(false);
        setOpen(true);
      });
  };

  useEffect(() => {
    // マウント時に一度データを取得
    fetchLoginStatus();

    // 1分ごとにデータを取得
    const intervalId = setInterval(fetchLoginStatus, 60000);

    // アンマウント時にタイマーをクリア
    return () => clearInterval(intervalId);
  }, []);

  // ログインダイアログの開閉管理
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDialog = useCallback(() => {
    console.log("close dialog");
    setIsDialogOpen(false);
  }, []);

  // ログイン状態を確認して未ログインならログインダイアログを開く or ログイン画面へ自動遷移
  const checkLoginStatus = useCallback(() => {
    // ログイン状態を確認した後に charmdata の取得する処理を一連の Promise で定義 (分離すると非同期に処理されてしまうため)
    fetchWithRetry(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax-api/v1/check-login/`,
      {
        method: "GET",
        credentials: "include", // クッキーベースの認証に必要
      },
      3,
      5000
    )
      .then((response) => {
        console.log(`Response Status Code: ${response.status}`); // ステータスコードを表示
        if (response.status === 401) {
          setIsLoggedIn(false);
          // 未ログインなのでログインダイアログを開く
          if (localStorage.getItem("loginAutoRedirect") === "true") {
            window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/login/?next=/dmax`;
          } else {
            setIsDialogOpen(true);
          }
        } else if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if ("is_logged_in" in data && data["is_logged_in"] === true) {
          setIsLoggedIn(true);
          // ログイン済みなのでログインダイアログ不要
        } else {
          setIsLoggedIn(false);
          // 未ログインなのでログインダイアログを開く
          if (localStorage.getItem("loginAutoRedirect") === "true") {
            window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/login/?next=/dmax`;
          } else {
            setIsDialogOpen(true);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        console.error("サーバーとの通信でエラーが発生しました\n" + error.stack);
        setError("ログイン状態の確認に失敗しました");
        setIsLoggedIn(false);
        setOpen(true);
        // 通信失敗時にログインダイアログを開くべきかわからない
      });
  }, []);

  const [isCharmDataFetched, setIsCharmDataFetched] = useState(false);
  const [isQuriousArmorDataFetched, setIsQuriousArmorDataFetched] = useState(false);
  const [isArtianDataFetched, setIsArtianDataFetched] = useState(false);

  // // アンマウント-stateリセット問題を引き起こすので使用しない
  // // <div className="App"></div> の背景色を変更するために styled-components を使用
  // const AppDiv = styled("div")(({ theme }) => ({
  //   backgroundColor: theme.palette.background.default,
  // }));

  // 自動スクロール時に AppBar の高さを Offset に指定するために利用
  const appBarRef = useRef(null);

  return (
    <SnackbarContext.Provider value={{ error, setError, open, setOpen, handleClose }}>
      <ArtianContext.Provider
        value={{
          serverArtianData,
          setServerArtianData,
          artianValue,
          handleChangeArtianValue,
          isArtianDataFetched,
          setIsArtianDataFetched,

          value,

          useServerData,
          setUseServerData,
        }}
      >
        <CharmAndQuriousArmorContext.Provider
          value={{
            serverCharmData,
            setServerCharmData,
            charmValue,
            handleChangeCharmValue,
            isCharmDataFetched,
            setIsCharmDataFetched,

            value,

            serverQuriousArmorData,
            setServerQuriousArmorData,
            quriousArmorValue,
            handleChangeQuriousArmorValue,
            isQuriousArmorDataFetched,
            setIsQuriousArmorDataFetched,

            useServerData,
            setUseServerData,
            excludeCharm,
            setExcludeCharm,
            excludeQuriousArmor,
            setExcludeQuriousArmor,
          }}
        >
          <LoginContext.Provider
            value={{
              isLoggedIn,
              setIsLoggedIn,
              fetchLoginStatus,
              isDialogOpen,
              setIsDialogOpen,
              handleCloseDialog,
              checkLoginStatus,
            }}
          >
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              message={error}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%", whiteSpace: "pre-line", textAlign: "left" }}
              >
                {error}
              </Alert>
            </Snackbar>

            {/* 最適化ボタン押下時のみ非表示を維持するために利用*/}
            <HideOnScrollContext.Provider value={{ appBarRef }}>
              <div className="App">
                {/* <div> のかわりにこちらの <AppDiv> を利用するとタブ切替時にDmaxMain がアンマウントされる謎挙動が発生する */}
                {/* <AppDiv> */}
                {/* <AppBar component="nav">
                 </AppBar> */}

                <HideOnScroll direction="down">
                  <AppBar ref={appBarRef} component="nav" position="sticky">
                    {/* <Toolbar variant="dense" sx={{ backgroundColor: theme.palette.primary.main }}> */}
                    <Toolbar variant="dense">
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                      >
                        <MenuIcon />
                      </IconButton>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
                      >
                        DMAX
                      </Typography>
                      {/* <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map((item) => (
                <Button key={item} sx={{ color: "#fff" }}>
                  {item}
                </Button>
              ))}
            </Box> */}
                      <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        <ModeSwitcher />
                        <Button
                          color="inherit"
                          startIcon={isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
                          style={{ textTransform: "none" }}
                        >
                          {isLoggedIn ? (
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/logout/?next=/dmax`}
                              // target="_blank"
                              // rel="noopener noreferrer"
                              style={{
                                color: theme.vars.palette.primary.contrastText,
                                textDecoration: "none",
                              }}
                            >
                              ログアウト
                            </a>
                          ) : (
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/login/?next=/dmax`}
                              style={{
                                color: theme.vars.palette.primary.contrastText,
                                textDecoration: "none",
                              }}
                            >
                              ログイン
                            </a>
                          )}
                        </Button>

                        <Button
                          sx={{ color: theme.vars.palette.primary.contrastText }}
                          startIcon={<OpenInNewIcon />}
                        >
                          <a
                            href="https://www.mhrspeedrun.com/cms/quest/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: theme.vars.palette.primary.contrastText,
                              textDecoration: "none",
                            }}
                          >
                            TA集計
                          </a>
                        </Button>
                      </Box>
                    </Toolbar>
                    <MainTabs
                      value={value}
                      handleChange={handleChange}
                      iconPosition="start"
                      sx={{
                        [`@media (max-width: ${breakpoints.values.sm}px)`]: {
                          display: "none",
                        },
                        [`@media (min-width: ${breakpoints.values.sm + 1}px)`]: {
                          display: "flex",
                        },
                      }}
                    />
                  </AppBar>
                </HideOnScroll>
                <HideOnScroll direction="up">
                  <Paper
                    sx={{
                      position: "fixed",
                      bottom: 0,
                      width: "100%",
                      zIndex: 1000,
                    }}
                  >
                    <MainTabs
                      value={value}
                      handleChange={handleChange}
                      iconPosition={"top"}
                      sx={{
                        [`@media (max-width: ${breakpoints.values.sm}px)`]: {
                          boxShadow: "0px -1px 16px -3px rgba(0,0,0,0.2)",
                          display: "flex",
                        },
                        [`@media (min-width: ${breakpoints.values.sm + 1}px)`]: {
                          boxShadow: "none",
                          display: "none",
                        },
                      }}
                    />
                  </Paper>
                </HideOnScroll>
                <nav>
                  <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                      display: { xs: "block", sm: "none" },
                      "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}
                  >
                    {drawer}
                  </Drawer>
                </nav>

                <Container
                  ref={containerRef}
                  sx={{
                    paddingLeft: "0px !important",
                    paddingRight: "0px !important",
                    marginBottom: "0px !important", // 追加
                    paddingBottom: "0px !important", // 追加
                  }}
                >
                  <TabPanel value={value} index={0} dir={theme.direction} allowUnmount={false}>
                    <DmaxMain fabRight={fabRight} setFabRight={setFabRight} setValue={setValue} />
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction} allowUnmount={false}>
                    <ArtianTab />
                  </TabPanel>
                  <TabPanel value={value} index={2} dir={theme.direction} allowUnmount={false}>
                    <QuriousArmorTab />
                  </TabPanel>
                  <TabPanel value={value} index={3} dir={theme.direction} allowUnmount={false}>
                    <Usage />
                  </TabPanel>
                </Container>
              </div>
            </HideOnScrollContext.Provider>
            {/* </AppDiv> */}
            {/* <div> のかわりにこちらの <AppDiv> を利用するとタブ切替時にDmaxMain がアンマウントされる謎挙動が発生する */}
            {/* </ThemeProvider> */}
          </LoginContext.Provider>
        </CharmAndQuriousArmorContext.Provider>
      </ArtianContext.Provider>
    </SnackbarContext.Provider>
  );
}

export default App;
