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

  // ユーザが入力した csv データ
  const [csvData, setCsvData] = useState("");
  const handleCsvDataChange = (event) => {
    setCsvData(event.target.value);
  };

  // csv データを処理して, ユーザの護石データを localstorage に登録する関数
  const readFromCsvData = (mode) => {
    const csvRows = csvData.split("\n").filter((row) => row.trim().replace(/　/g, "") !== "");
    const csvArray = csvRows.map((row) => row.split(","));

    const charmData = [];
    try {
      // csv データの列数が 7 でない列を集めておく
      const errorRows = [];
      for (const [index, row] of csvArray.entries()) {
        if (row.length !== 7) {
          errorRows.push({ lineNumber: index + 1, row: row });
          continue;
        }

        const tempCharm = {
          "rare": 0,
          "type": "charm",
          "deffence": 0,
          "fire": "0",
          "water": "0",
          "ice": "0",
          "thunder": "0",
          "dragon": "0",
          "skills": {},
          "slots": [parseInt(row[4]), parseInt(row[5]), parseInt(row[6])],
          // 護石【攻撃2, 連撃2】4-1-1 形式で名前を作成
          "name":
            "護石【" +
            row[0] +
            row[1] +
            "，" +
            row[2] +
            row[3] +
            "】" +
            row[4] +
            "-" +
            row[5] +
            "-" +
            row[6],
        };

        if (row[0] !== "") tempCharm.skills[row[0]] = parseInt(row[1]);
        if (row[2] !== "") tempCharm.skills[row[2]] = parseInt(row[3]);
        charmData.push(tempCharm);
      }

      // csv データの列数が 7 でない列があった場合はエラーを出力
      if (errorRows.length > 0) {
        let errorMessage = "CSV データの列数が不正です。\n";
        for (const errorRow of errorRows) {
          errorMessage += `${errorRow["lineNumber"]}: ${errorRow["row"]}\n`;
        }
        throw new Error(errorMessage);
      }

      // エラーがなければ更新
      if (mode === "overwrite") {
        // 上書きモード
        setUserCharmData(charmData);
      } else {
        // 追加モード
        setUserCharmData([...userCharmData, ...charmData]);
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
    readFromCsvData("overwrite");
    setOpenConfirmDialog(false);
  };

  const writeToCsvData = () => {
    let csv = "";
    for (const charm of userCharmData) {
      // 護石【攻撃2, 連撃2】4-1-1 形式で名前を作成
      const skillList = Object.entries(charm.skills);
      let firstSkillName = "";
      let firstSkillLevel = "0";
      let secondSkillName = "";
      let secondSkillLevel = "0";
      if (skillList.length > 0) {
        firstSkillName = skillList[0][0];
        firstSkillLevel = skillList[0][1];
      }

      if (skillList.length > 1) {
        secondSkillName = skillList[1][0];
        secondSkillLevel = skillList[1][1];
      }
      const slots = charm.slots;
      csv += `${firstSkillName},${firstSkillLevel},${secondSkillName},${secondSkillLevel},${slots[0]},${slots[1]},${slots[2]}\n`;
    }
    setCsvData(csv);
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

  // CSVテキストボックスのコピーボタン用
  const [textToCopy, setTextToCopy] = useState("");
  useEffect(() => {
    setTextToCopy(csvData);
  }, [csvData]);

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
                    CSV 入出力
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <CopyToClipboardButton textToCopy={textToCopy} />
                </Grid>
              </Grid>

              <Box sx={{ height: "100%" }}>
                <TextField
                  label="CSV"
                  multiline
                  variant="outlined"
                  minRows={8}
                  maxRows={8}
                  value={csvData}
                  onChange={handleCsvDataChange}
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
                    onClick={writeToCsvData}
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
                        disabled={csvData === ""}
                        onClick={handleOpenOverwriteConfirmDialog}
                        sx={{ mr: 1 }}
                        startIcon={<KeyboardDoubleArrowDownIcon />}
                      >
                        上書き
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={csvData === ""}
                        onClick={() => readFromCsvData("append")}
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
