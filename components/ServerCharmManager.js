import React, { useState, useEffect, useRef, useMemo } from "react";
import { Grid, TextField, Button, Snackbar, Typography, Card, Box } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Cookies from "js-cookie";
import isEqual from "lodash/isEqual";

import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import AddIcon from "@mui/icons-material/Add";
import CopyToClipboardButton from "./CopyToClipboardButton";

import { CharmTable } from "./CharmTable";
import { CharmInput } from "./CharmInput";
import { commonStyles } from "./DmaxMain";
import { fetchWithRetry } from "../lib/utils";
import { useSnackbar } from "./SnackbarContext";
import { useCharmAndQuriousArmorContext } from "./CharmAndQuriousArmorContext";
import { useLoginContext } from "./LoginContext";
import LoginDialog from "./LoginDialog";
import ConfirmDialog from "./ConfirmDialog";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// 列要素対応表
//        0,1,                 2,3,4,5,6
// 火事場力,3,              渾身,2,3,1,1
// 超会心  ,2,              体術,3,3,1,1
// 体術    ,3,通常弾・連射矢強化,2,3,1,1

export function ServerCharmManager() {
  // メモリ層で護石データを一元管理するstate (ストレージ層は localstorage or サーバ上のDB)
  const [userCharmData, setUserCharmData] = useState([]);
  const [nextUserCharmData, setNextUserCharmData] = useState([]);
  const [userCharmMetaData, setUserCharmMetaData] = useState(null);

  const { isCharmDataFetched, setIsCharmDataFetched, setServerCharmData } =
    useCharmAndQuriousArmorContext();

  const { isLoggedIn, setIsLoggedIn, isDialogOpen, handleCloseDialog, checkLoginStatus } =
    useLoginContext();

  const fetchUserCharmData = () => {
    console.log("ServerCharmManager: fetch charmdata from server");

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
        } else if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if ("is_logged_in" in data && data["is_logged_in"] === true) {
          setIsLoggedIn(true);
          // ログイン中なので charmdata を取得する
          fetchWithRetry(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax-api/v1/user-equip-data-mhwilds/?equip_type=charm`,
            {
              method: "GET",
              credentials: "include", // クッキーベースの認証に必要
            },
            3,
            5000
          )
            .then((response) => {
              console.log(`Response Status Code: ${response.status}`); // ステータスコードを表示
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              return response.json();
            })
            .then((data) => {
              if (!Array.isArray(data)) {
                throw new Error(`response data is invalid! data: ${data}`);
              } else if (data.length === 0) {
                console.log("no record found in server DB");
              } else {
                console.log("fetch sucess: server_charmdata" + JSON.stringify(data));
                console.log("local_charmdata: " + JSON.stringify(userCharmData));
                setUserCharmData(data[0].equip_data);
                setNextUserCharmData(data[0].equip_data);
                const { equip_data, ...metaData } = data[0];
                setUserCharmMetaData(metaData);
              }
              setIsCharmDataFetched(true);
            })
            .catch((error) => {
              console.error("Error:", error);
              console.error("サーバーとの通信でエラーが発生しました\n" + error.stack);
              setError("サーバーから護石データを取得できませんでした");
              setOpen(true);
            });
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
    fetchUserCharmData();

    // 1分ごとにデータを取得
    const intervalId = setInterval(fetchUserCharmData, 60000);

    // アンマウント時にタイマーをクリア
    return () => clearInterval(intervalId);
  }, []);

  // ユーザが入力した JSON データ
  const [jsonData, setJsonData] = useState("");
  const handleJsonDataChange = (event) => {
    setJsonData(event.target.value);
  };

  // JSON データをパースして、護石データを更新する関数
  const readFromJsonData = (mode) => {
    try {
      const parsedData = JSON.parse(jsonData);
      if (!Array.isArray(parsedData)) {
        throw new Error("入力された JSON は配列ではありません。");
      }
      if (mode === "overwrite") {
        setNextUserCharmData(parsedData);
      } else {
        setNextUserCharmData([...userCharmData, ...parsedData]);
      }
    } catch (err) {
      setError(err.message);
      setOpen(true);
    }
  };

  const handleOpenOverwriteConfirmDialog = () => {
    setDialogMode("overwrite");
    setOpenConfirmDialog(true);
  };

  const handleConfirmOverwrite = () => {
    readFromJsonData("overwrite");
    setOpenConfirmDialog(false);
  };

  // 現在の護石データを JSON 文字列に変換して出力する関数
  const writeToJsonData = () => {
    const json = JSON.stringify(userCharmData, null, 0);
    setJsonData(json);
  };

  // // テーブルで複数選択された護石を userCharmData から削除 (引数は削除対象インデックス)
  // const deleteUserCharms = (deleteTargetIndexes) => {
  //   const newCharmData = userCharmData.filter((_, index) => !deleteTargetIndexes.includes(index));
  //   setNextUserCharmData(newCharmData);
  // };

  // nextUserCharmData が変更されたら POST API を呼び出して DB を更新
  useEffect(() => {
    if (!isCharmDataFetched) {
      console.log("userCharmData has not been fetched yet. skip POST API");
      return;
    }
    if (isEqual(userCharmData, nextUserCharmData)) {
      console.log("no difference between userCharmData and nextUserCharmData. skip POST API");
      return;
    }
    console.log("nextUserCharmData has been changed. call POST API");
    fetchWithRetry(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax-api/v1/user-equip-data-mhwilds/?equip_type=charm`,
      {
        method: "POST",
        credentials: "include", // クッキーベースの認証に必要
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"), // CSRFトークンをヘッダーに含める
        },
        body: JSON.stringify({
          equip_type: "charm",
          equip_data: nextUserCharmData,
        }),
      },
      3,
      5000
    )
      .then((response) => {
        console.log(`Response Status Code: ${response.status}`); // ステータスコードを表示
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log(`Response Data: ` + JSON.stringify(data));
        console.log(`Update userCharmData here!`);
        setUserCharmData(data.equip_data);
        const { equip_data, ...metaData } = data;
        setUserCharmMetaData(metaData);
      })
      .catch((error) => {
        console.error("Error:", error);
        console.error("サーバーとの通信でエラーが発生しました\n" + error.stack);
        setError("サーバーに護石データを保存できませんでした\n" + error.stack);
        setOpen(true);
      });
  }, [nextUserCharmData]);

  // ContextAPI からエラー出力用 Snackbar 管理用の関数を取得
  const { error, setError, open, setOpen, handleClose } = useSnackbar();

  useEffect(() => {
    setServerCharmData(userCharmData);
  }, [userCharmData]);

  // const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const handleCloseDialog = () => {
  //   console.log("close dialog");
  //   setIsDialogOpen(false);
  // };

  // // ログイン状態を確認して未ログインならログインダイアログを開く or ログイン画面へ自動遷移
  // const checkLoginStatus = () => {
  //   // ログイン状態を確認した後に charmdata の取得する処理を一連の Promise で定義 (分離すると非同期に処理されてしまうため)
  //   fetchWithRetry(
  //     "http://127.0.0.1:8000/dmax-api/v1/check-login/",
  //     {
  //       method: "GET",
  //       credentials: "include", // クッキーベースの認証に必要
  //     },
  //     3,
  //     5000
  //   )
  //     .then((response) => {
  //       console.log(`Response Status Code: ${response.status}`); // ステータスコードを表示
  //       if (response.status === 403) {
  //         setIsLoggedIn(false);
  //         // 未ログインなのでログインダイアログを開く
  //         if (localStorage.getItem("loginAutoRedirect") === "true") {
  //           window.location.href = "http://127.0.0.1:8000/accounts/login/";
  //         } else {
  //           setIsDialogOpen(true);
  //         }
  //       } else if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  //       return response.json();
  //     })
  //     .then((data) => {
  //       if ("is_logged_in" in data && data["is_logged_in"] === true) {
  //         setIsLoggedIn(true);
  //         // ログイン済みなのでログインダイアログ不要
  //       } else {
  //         setIsLoggedIn(false);
  //         // 未ログインなのでログインダイアログを開く
  //         if (localStorage.getItem("loginAutoRedirect") === "true") {
  //           window.location.href = "http://127.0.0.1:8000/accounts/login/";
  //         } else {
  //           setIsDialogOpen(true);
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       console.error("サーバーとの通信でエラーが発生しました\n" + error.stack);
  //       setError("ログイン状態の確認に失敗しました");
  //       setIsLoggedIn(false);
  //       setOpen(true);
  //       // 通信失敗時にログインダイアログを開くべきかわからない
  //     });
  // };

  // viewport に入ったらダイアログを開く
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // entriesは監視している要素の配列
      if (entries[0].isIntersecting && !isLoggedIn) {
        // Grid要素がビューポートに入った
        checkLoginStatus();
      }
    });

    if (gridRef.current) {
      observer.observe(gridRef.current); // Grid要素を監視
    }

    return () => {
      observer.disconnect(); // コンポーネントのアンマウント時に監視を停止
    };
  }, []);

  // JSONテキストボックスのコピーボタン用
  const [textToCopy, setTextToCopy] = useState("");
  useEffect(() => {
    setTextToCopy(jsonData);
  }, [jsonData]);

  // 削除時に確認ダイアログを表示する
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("delete");
  const [deleteIndexes, setDeleteIndexes] = useState([]);

  const handleOpenDeleteConfirmDialog = (indexes) => {
    setDeleteIndexes(indexes);
    setDialogMode("delete");
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteUserCharms(deleteIndexes);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const deleteUserCharms = (deleteTargetIndexes) => {
    const newCharmData = userCharmData.filter((_, index) => !deleteTargetIndexes.includes(index));
    setNextUserCharmData(newCharmData);
  };

  return useMemo(
    () => (
      <>
        {/* エラー出力 */}
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

        {/* ログインダイアログ */}
        <LoginDialog open={isDialogOpen} onClose={handleCloseDialog} />

        {/* 削除・上書き確認ダイアログ */}
        <ConfirmDialog
          openConfirmDialog={openConfirmDialog}
          handleCloseConfirmDialog={handleCloseConfirmDialog}
          handleConfirmDelete={handleConfirmDelete}
          handleConfirmOverwrite={handleConfirmOverwrite}
          dialogMode={dialogMode}
          dataType={"護石"}
        />

        <Grid
          container
          columnSpacing={3}
          onClick={checkLoginStatus}
          sx={{
            opacity: isLoggedIn ? 1 : 0.5,
          }}
          ref={gridRef}
        >
          {/* データ表示 */}
          {/* データ入力欄 */}
          <Grid item xs={12} md={6}>
            <CharmInput
              userCharmData={userCharmData}
              setUserCharmData={setNextUserCharmData}
              onClick={checkLoginStatus}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 1,
                height: "100%",
              }}
            >
              <Box
                sx={{
                  margin: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-between",
                  height: "90%",
                }}
              >
                <Grid container alignItems="flex-start">
                  <Grid item xs>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      align="left"
                      marginBottom={2}
                      sx={commonStyles.customHeaderNoMargin}
                    >
                      JSON 入出力
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <CopyToClipboardButton textToCopy={textToCopy} />
                  </Grid>
                </Grid>

                {/* <Typography
                variant="subtitle2"
                gutterBottom
                align="left"
                marginBottom={2}
                sx={commonStyles.customHeaderNoMargin}
              >
                CSV 入出力
              </Typography> */}
                <Box sx={{ height: "100%" }}>
                  <TextField
                    label="JSON"
                    multiline
                    variant="outlined"
                    minRows={8}
                    maxRows={8}
                    value={jsonData}
                    onChange={handleJsonDataChange}
                    InputProps={{
                      onClick: (event) => {
                        event.target.select();
                      },
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Box>
                <div style={{ marginTop: "10px" }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={writeToJsonData}
                      disabled={userCharmData.length === 0}
                      startIcon={<KeyboardDoubleArrowUpIcon />}
                    >
                      書き出し
                    </Button>
                    <div style={{ flex: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={jsonData === ""}
                          onClick={handleOpenOverwriteConfirmDialog}
                          sx={{ mr: 1 }}
                          startIcon={<KeyboardDoubleArrowDownIcon />}
                        >
                          上書き
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={jsonData === ""}
                          onClick={() => readFromJsonData("append")}
                          startIcon={<AddIcon />}
                        >
                          追加
                        </Button>
                      </Box>
                    </div>
                  </Box>
                </div>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} marginTop={3} onClick={checkLoginStatus}>
            <CharmTable
              userCharmData={userCharmData}
              deleteUserCharms={deleteUserCharms}
              fetchUserCharmData={fetchUserCharmData}
              handleOpenDeleteConfirmDialog={handleOpenDeleteConfirmDialog}
              userCharmMetaData={userCharmMetaData}
            />
          </Grid>
        </Grid>
      </>
    ),
    [
      isCharmDataFetched,
      setIsCharmDataFetched,
      isLoggedIn,
      setIsLoggedIn,
      isDialogOpen,
      handleCloseDialog,
      checkLoginStatus,
      error,
      setError,
      open,
      setOpen,
      handleClose,
      setServerCharmData,
      userCharmData,
      nextUserCharmData,
      jsonData,
      openConfirmDialog,
      dialogMode,
      deleteIndexes,
      textToCopy,
      userCharmMetaData,
    ]
  );
}

export default ServerCharmManager;
