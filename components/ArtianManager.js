import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Snackbar, Typography, Card, Box } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import AddIcon from "@mui/icons-material/Add";

import { ArtianTable } from "./ArtianTable";
import { ArtianInput } from "./ArtianInput";
import { commonStyles } from "./DmaxMain";
import ConfirmDialog from "./ConfirmDialog";
import CopyToClipboardButton from "./CopyToClipboardButton";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ArtianManager() {
  // 護石データを一元管理するデータ
  // このデータを起点に localstorage への保存, json からの読み込み, json への書き出し, テーブルへの表示 の処理を行う
  const [userArtianData, setUserArtianData] = useState([]);

  // useEffectを使用して、コンポーネントがマウントされた後にlocalStorageからデータを読み込む
  useEffect(() => {
    console.log("useEffect called on ArtianManager mount.");
    const localStorageUserInputData = localStorage.getItem("userArtianData");
    if (localStorageUserInputData !== null) {
      setUserArtianData(JSON.parse(localStorageUserInputData));
    }
  }, []);

  // userArtianData が変更されたら localStorage に保存する
  useEffect(() => {
    if (userArtianData.length === 0) return;
    localStorage.setItem("userArtianData", JSON.stringify(userArtianData));
    console.log("userArtianData has been changed, and saved to localstorage");
  }, [userArtianData]);

  // ユーザが入力した JSON データ
  const [jsonData, setJsonData] = useState("");
  const handleJsonDataChange = (event) => {
    setJsonData(event.target.value);
  };

  // JSON データを処理して、ユーザの護石データを localStorage に登録する関数
  const readFromJsonData = (mode) => {
    try {
      const parsedData = JSON.parse(jsonData);
      if (!Array.isArray(parsedData)) {
        throw new Error("入力された JSON は配列ではありません。");
      }
      // 各オブジェクトのチェック（必要に応じて）を行うことも可能です

      if (mode === "overwrite") {
        // 上書きモード
        setUserArtianData(parsedData);
      } else {
        // 追加モード
        setUserArtianData([...userArtianData, ...parsedData]);
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

  // 現在の userArtianData を JSON 文字列に変換して出力する関数
  const writeToJsonData = () => {
    const json = JSON.stringify(userArtianData, null, 0);
    setJsonData(json);
  };

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
    deleteUserArtians(deleteIndexes);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  // テーブルで複数選択された護石を userArtianData から削除
  const deleteUserArtians = (deleteTargetIndexes) => {
    const newArtianData = userArtianData.filter((_, index) => !deleteTargetIndexes.includes(index));
    setUserArtianData(newArtianData);
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
        dataType={"武器"}
      />

      <Grid container spacing={3}>
        {/* データ入力欄 */}
        <Grid item xs={12} md={6}>
          <ArtianInput userArtianData={userArtianData} setUserArtianData={setUserArtianData} />
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

        <Grid item xs={12}>
          <ArtianTable
            userArtianData={userArtianData}
            deleteUserArtians={deleteUserArtians}
            handleOpenDeleteConfirmDialog={handleOpenDeleteConfirmDialog}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default ArtianManager;
