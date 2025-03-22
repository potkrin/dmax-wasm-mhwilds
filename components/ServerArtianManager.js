import React, { useState, useEffect, useRef, useMemo } from "react";
import { Grid, TextField, Button, Snackbar, Typography, Card, Box } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Cookies from "js-cookie";
import isEqual from "lodash/isEqual";

import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import AddIcon from "@mui/icons-material/Add";
import CopyToClipboardButton from "./CopyToClipboardButton";

import { ArtianTable } from "./ArtianTable";
import { ArtianInput } from "./ArtianInput";
import { commonStyles } from "./DmaxMain";
import { fetchWithRetry } from "../lib/utils";
import { useSnackbar } from "./SnackbarContext";
import { useArtianContext } from "./ArtianContext";
import { useLoginContext } from "./LoginContext";
import LoginDialog from "./LoginDialog";
import ConfirmDialog from "./ConfirmDialog";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ServerArtianManager() {
  // メモリ層で護石データを一元管理するstate (ストレージ層はサーバ上のDB)
  const [userArtianData, setUserArtianData] = useState([]);
  const [nextUserArtianData, setNextUserArtianData] = useState([]);
  const [userArtianMetaData, setUserArtianMetaData] = useState(null);

  const { isArtianDataFetched, setIsArtianDataFetched, setServerArtianData } = useArtianContext();

  const { isLoggedIn, setIsLoggedIn, isDialogOpen, handleCloseDialog, checkLoginStatus } =
    useLoginContext();

  const { error, setError, open, setOpen, handleClose } = useSnackbar();

  // サーバーから護石データを取得する処理
  const fetchUserArtianData = () => {
    console.log("ServerArtianManager: fetch artiandata from server");

    // ログイン状態を確認した後に artiandata の取得する処理を一連の Promise で定義 (分離すると非同期に処理されてしまうため)
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
          // ログイン中なので artiandata を取得する
          fetchWithRetry(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax-api/v1/user-equip-data-mhwilds/?equip_type=artianweapon`,
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
                console.log("fetch sucess: server_artiandata" + JSON.stringify(data));
                console.log("local_artiandata: " + JSON.stringify(userArtianData));
                setUserArtianData(data[0].equip_data);
                setNextUserArtianData(data[0].equip_data);
                const { equip_data, ...metaData } = data[0];
                setUserArtianMetaData(metaData);
              }
              setIsArtianDataFetched(true);
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
    fetchUserArtianData();

    // 1分ごとにデータを取得
    const intervalId = setInterval(fetchUserArtianData, 60000);

    // アンマウント時にタイマーをクリア
    return () => clearInterval(intervalId);
  }, []);

  // JSON 入出力用の state とハンドラ
  const [jsonData, setJsonData] = useState("");
  const handleJsonDataChange = (event) => {
    console.log("[handleJsonDataChange] event.target.value: " + event.target.value);
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
        setNextUserArtianData(parsedData);
      } else {
        setNextUserArtianData([...userArtianData, ...parsedData]);
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
    const json = JSON.stringify(userArtianData, null, 0);
    setJsonData(json);
  };

  // nextUserArtianData が変更されたら POST API を呼び出して DB を更新
  useEffect(() => {
    if (!isArtianDataFetched) {
      console.log("userArtianData has not been fetched yet. skip POST API");
      return;
    }
    if (isEqual(userArtianData, nextUserArtianData)) {
      console.log("no difference between userArtianData and nextUserArtianData. skip POST API");
      return;
    }
    console.log("nextUserArtianData has been changed. call POST API");
    fetchWithRetry(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax-api/v1/user-equip-data-mhwilds/?equip_type=artianweapon`,
      {
        method: "POST",
        credentials: "include", // クッキーベースの認証に必要
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"), // CSRFトークンをヘッダーに含める
        },
        body: JSON.stringify({
          equip_type: "artianweapon",
          equip_data: nextUserArtianData,
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
        console.log(`Update userArtianData here!`);
        setUserArtianData(data.equip_data);
        const { equip_data, ...metaData } = data;
        setUserArtianMetaData(metaData);
      })
      .catch((error) => {
        console.error("Error:", error);
        console.error("サーバーとの通信でエラーが発生しました\n" + error.stack);
        setError("サーバーに護石データを保存できませんでした\n" + error.stack);
        setOpen(true);
      });
  }, [nextUserArtianData]);

  useEffect(() => {
    setServerArtianData(userArtianData);
  }, [userArtianData]);

  // viewport に入ったらログイン状態を確認するための処理
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

  // JSON テキストボックスのコピーボタン用
  const [textToCopy, setTextToCopy] = useState("");
  useEffect(() => {
    setTextToCopy(jsonData);
  }, [jsonData]);

  // 削除時に確認ダイアログを表示するための state
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("delete");
  const [deleteIndexes, setDeleteIndexes] = useState([]);

  const handleOpenDeleteConfirmDialog = (indexes) => {
    setDeleteIndexes(indexes);
    setDialogMode("delete");
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteUserArtians(deleteIndexes);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const deleteUserArtians = (deleteTargetIndexes) => {
    const newArtianData = userArtianData.filter((_, index) => !deleteTargetIndexes.includes(index));
    setNextUserArtianData(newArtianData);
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
          dataType={"武器"}
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
          {/* データ入力 */}
          <Grid item xs={12} md={6}>
            <ArtianInput
              userArtianData={userArtianData}
              setUserArtianData={setNextUserArtianData}
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
                      disabled={userArtianData.length === 0}
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
            <ArtianTable
              userArtianData={userArtianData}
              deleteUserArtians={deleteUserArtians}
              fetchUserArtianData={fetchUserArtianData}
              handleOpenDeleteConfirmDialog={handleOpenDeleteConfirmDialog}
              userArtianMetaData={userArtianMetaData}
            />
          </Grid>
        </Grid>
      </>
    ),
    [
      isArtianDataFetched,
      setIsArtianDataFetched,
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
      setServerArtianData,
      userArtianData,
      nextUserArtianData,
      jsonData,
      openConfirmDialog,
      dialogMode,
      deleteIndexes,
      textToCopy,
    ]
  );
}

export default ServerArtianManager;
