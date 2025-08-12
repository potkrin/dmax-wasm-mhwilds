import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Snackbar, Typography, Card, Box } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import AddIcon from "@mui/icons-material/Add";

import { CharmTable } from "./CharmTable";
import { CharmInput } from "./CharmInput";
import { commonStyles } from "./DmaxMain";
import ConfirmDialog from "./ConfirmDialog";
import CopyToClipboardButton from "./CopyToClipboardButton";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// 列要素対応表
//        0,1,                 2,3,4,5,6
// 火事場力,3,              渾身,2,3,1,1
// 超会心  ,2,              体術,3,3,1,1
// 体術    ,3,通常弾・連射矢強化,2,3,1,1

export function CharmManager() {
  // 護石データを一元管理するデータ
  // このデータを起点に localstorage への保存, csv からの読み込み, csv への書き出し, テーブルへの表示 の処理を行う
  const [userCharmData, setUserCharmData] = useState([]);

  // useEffectを使用して、コンポーネントがマウントされた後にlocalStorageからデータを読み込む
  useEffect(() => {
    console.log("useEffect called on CharmManager mount.");
    const localStorageUserInputData = localStorage.getItem("userCharmData");
    if (localStorageUserInputData !== null) {
      setUserCharmData(JSON.parse(localStorageUserInputData));
    }
  }, []);

  // userCharmData が変更されたら localstorage に保存する
  useEffect(() => {
    if (userCharmData.length === 0) return;
    localStorage.setItem("userCharmData", JSON.stringify(userCharmData));
    console.log("userCharmData has been changed, and saved to localstorage");
  }, [userCharmData]);

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
        setUserCharmData(parsedData);
      } else {
        setUserCharmData([...userCharmData, ...parsedData]);
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
  //   setUserCharmData(newCharmData);
  // };

  // エラー出力用 Snackbar 管理
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

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

  // テーブルで複数選択された護石を userCharmData から削除 (引数は削除対象インデックス)
  const deleteUserCharms = (deleteTargetIndexes) => {
    const newCharmData = userCharmData.filter((_, index) => !deleteTargetIndexes.includes(index));
    setUserCharmData(newCharmData);
  };

  // JSONテキストボックスのコピーボタン用
  const [textToCopy, setTextToCopy] = useState("");
  useEffect(() => {
    setTextToCopy(jsonData);
  }, [jsonData]);

  return (
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

      {/* 削除・上書き確認ダイアログ */}
      <ConfirmDialog
        openConfirmDialog={openConfirmDialog}
        handleCloseConfirmDialog={handleCloseConfirmDialog}
        handleConfirmDelete={handleConfirmDelete}
        handleConfirmOverwrite={handleConfirmOverwrite}
        dialogMode={dialogMode}
        dataType={"護石"}
      />

      <Grid container spacing={3}>
        {/* データ表示 */}
        {/* データ入力欄 */}
        <Grid item xs={12} md={6}>
          <CharmInput userCharmData={userCharmData} setUserCharmData={setUserCharmData} />
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

        <Grid item xs={12}>
          <CharmTable
            userCharmData={userCharmData}
            deleteUserCharms={deleteUserCharms}
            handleOpenDeleteConfirmDialog={handleOpenDeleteConfirmDialog}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default CharmManager;
