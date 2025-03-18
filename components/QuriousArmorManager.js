import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Snackbar, Typography, Card, Box } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import AddIcon from "@mui/icons-material/Add";

import { commonStyles } from "./DmaxMain";

import { armorDict } from "../data/EquipData";
import { staticSkillData } from "../data/StaticData";
import { QuriousArmorTable } from "./QuriousArmorTable";
import QuriousArmorInput from "./QuriousArmorInput";
import ConfirmDialog from "./ConfirmDialog";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function QuriousArmorManager() {
  // localstorage に保存されるユーザの傀異錬成防具データ
  const [userQuriousArmorData, setUserQuriousArmorData] = useState([]);

  // SSG対応: クライアントサイドでマウントされたとき localstorage からデータを読み込む
  useEffect(() => {
    const localStorageUserQuriousArmorData = localStorage.getItem("userQuriousArmorData");
    if (localStorageUserQuriousArmorData !== null)
      setUserQuriousArmorData(JSON.parse(localStorageUserQuriousArmorData));
  }, []);

  useEffect(() => {
    if (userQuriousArmorData.length === 0) return;
    localStorage.setItem("userQuriousArmorData", JSON.stringify(userQuriousArmorData));
  }, [userQuriousArmorData]);

  // ユーザが入力した csv データ
  const [csvData, setCsvData] = useState("");
  const handleCsvDataChange = (event) => {
    setCsvData(event.target.value);
  };

  // csv データを処理して, ユーザの護石データを localstorage に登録する関数
  const readFromCsvData = (mode) => {
    // csv データを行ごとに分割し, 余分な空白行は削除する
    const csvRows = csvData.split("\n").filter((row) => row.trim().replace(/　/g, "") !== "");
    const csvArray = csvRows.map((row) => row.split(","));

    const quriousArmorData = [];
    try {
      const errorRows = [];
      for (const [index, row] of csvArray.entries()) {
        console.log("process array = " + row);
        if (10 < row.length && row.length <= 20) {
          row.push(...Array(20 - row.length).fill(""));
        } else {
          errorRows.push({ lineNumber: index + 1, row: row });
          continue;
        }

        // 列要素対応表
        //     0           ,  1,2,3,4, 5,6,7,8,9,  10,11,      12,13,14,15,16,17,18,19
        //     ゼクスヘルム,-11,0,0,0,-3,0,0,0,0,攻撃, 2,気絶耐性,-1,  ,  ,  ,  ,  ,

        // 元防具のデータをコピー
        const tempArmor = JSON.parse(JSON.stringify(armorDict[row[0]]));
        console.log("tempArmor = " + JSON.stringify(tempArmor, null, 4));
        tempArmor["deffence"] += parseInt(row[1]);
        tempArmor["fire"] = parseInt(tempArmor["fire"]) + parseInt(row[2]);
        tempArmor["water"] = parseInt(tempArmor["water"]) + parseInt(row[3]);
        tempArmor["ice"] = parseInt(tempArmor["ice"]) + parseInt(row[4]);
        tempArmor["thunder"] = parseInt(tempArmor["thunder"]) + parseInt(row[5]);
        tempArmor["dragon"] = parseInt(tempArmor["dragon"]) + parseInt(row[6]);
        tempArmor["originalArmorName"] = row[0];

        // スロット差分処理
        for (let i = 0; i < 3; i++) {
          if (tempArmor["slots"][0 + i]) {
            tempArmor["slots"][0 + i] += parseInt(row[7 + i]);
          } else {
            tempArmor["slots"][0 + i] = parseInt(row[7 + i]);
          }
        }
        // スキル差分処理
        for (let i = 0; i < 5; i++) {
          console.log(
            "row[10 + 2 * i] = " +
              row[10 + 2 * i] +
              " is in staticSkillData = " +
              (row[10 + 2 * i] in staticSkillData)
          );
          const skillName = row[10 + 2 * i];
          const skillLevel = parseInt(row[11 + 2 * i]);

          if (!(skillName in staticSkillData)) {
            console.log("continue");
            continue;
          }

          if (skillName in tempArmor["skills"]) tempArmor["skills"][skillName] += skillLevel;
          else tempArmor["skills"][skillName] = skillLevel;
        }

        // 名前作成 防具名(スキルA+N, スキルB-N, スロット+M))
        let armorName = row[0] + " (";
        for (let i = 0; i < 5; i++) {
          const skillName = row[10 + 2 * i];
          if (!(skillName in staticSkillData)) continue;

          armorName += skillName;

          const skillLevel = parseInt(row[11 + 2 * i]);
          armorName += (parseInt(skillLevel) > 0 ? "+" + skillLevel : skillLevel) + ",";
        }

        let slotSum = 0;
        for (let i = 0; i < 3; i++) {
          slotSum += parseInt(row[7 + i]);
        }
        armorName += "スロット" + (slotSum > 0 ? "+" + slotSum : slotSum) + ")";

        tempArmor["name"] = armorName;

        quriousArmorData.push(tempArmor);
      }

      // csv データの列数が 20 でない列があった場合はエラーを出力
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
        setUserQuriousArmorData(quriousArmorData);
      } else {
        // 追加モード
        setUserQuriousArmorData([...userQuriousArmorData, ...quriousArmorData]);
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
    for (const quriousArmor of userQuriousArmorData) {
      // 元防具のデータをコピー
      const originalArmorName = quriousArmor.originalArmorName;
      const originalArmor = armorDict[originalArmorName];

      const row = Array(20).fill("");
      row[0] = originalArmorName;
      row[1] = quriousArmor.deffence - originalArmor.deffence;
      row[2] = quriousArmor.fire - originalArmor.fire;
      row[3] = quriousArmor.water - originalArmor.water;
      row[4] = quriousArmor.ice - originalArmor.ice;
      row[5] = quriousArmor.thunder - originalArmor.thunder;
      row[6] = quriousArmor.dragon - originalArmor.dragon;
      row[7] = quriousArmor.slots[0] - originalArmor.slots[0];
      row[8] = quriousArmor.slots[1] - originalArmor.slots[1];
      row[9] = quriousArmor.slots[2] - originalArmor.slots[2];

      // スロット差分処理
      for (let i = 0; i < 3; i++) {
        if (originalArmor["slots"][i]) {
          row[7 + i] = quriousArmor["slots"][i] - originalArmor["slots"][0 + i];
        } else {
          row[7 + i] = quriousArmor["slots"][i];
        }
      }

      // スキル処理を追加
      let index = 0;
      Object.entries(quriousArmor.skills).forEach(([skillName, skillLevel]) => {
        console.log("skillName = " + skillName);
        if (skillName in originalArmor.skills) {
          const levelDiff = parseInt(skillLevel) - parseInt(originalArmor.skills[skillName]);
          console.log("IF levelDiff = " + levelDiff);

          if (levelDiff !== 0) {
            row[10 + 2 * index] = skillName;
            row[11 + 2 * index] = skillLevel - originalArmor.skills[skillName];
            index++;
          }
        } else {
          console.log("ELSE skillName = " + skillName);
          row[10 + 2 * index] = skillName;
          row[11 + 2 * index] = skillLevel;
          index++;
        }
      });

      csv += row.join(",") + "\n";

      // const skillList = Object.entries(quriousArmor.skills);
      // let firstSkillName = "";
      // let firstSkillLevel = "0";
      // let secondSkillName = "";
      // let secondSkillLevel = "0";
      // if (skillList.length > 0) {
      //   firstSkillName = skillList[0][0];
      //   firstSkillLevel = skillList[0][1];
      // }

      // if (skillList.length > 1) {
      //   secondSkillName = skillList[1][0];
      //   secondSkillLevel = skillList[1][1];
      // }
      // const slots = quriousArmor.slots;
      // csv += `${firstSkillName},${firstSkillLevel},${secondSkillName},${secondSkillLevel},${slots[0]},${slots[1]},${slots[2]}\n`;
    }

    setCsvData(csv);
  };

  // テーブルで複数選択された護石を userQuriousArmorData から削除 (引数は削除対象インデックス)
  const deleteUserQuriousArmors = (deleteTargetIndexes) => {
    const newQuriousArmorData = userQuriousArmorData.filter(
      (_, index) => !deleteTargetIndexes.includes(index)
    );
    setUserQuriousArmorData(newQuriousArmorData);
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
    deleteUserQuriousArmors(deleteIndexes);
    setOpenConfirmDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

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
        dataType={"傀異錬成"}
      />

      <Grid container spacing={3}>
        {/* データ入力欄 */}
        <Grid item xs={12} md={6}>
          <QuriousArmorInput
            userQuriousArmorData={userQuriousArmorData}
            setUserQuriousArmorData={setUserQuriousArmorData}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 1, height: "100%" }}>
            <Box
              sx={{
                margin: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-between",
                height: "93.5%",
              }}
            >
              <Typography
                variant="subtitle2"
                gutterBottom
                align="left"
                marginBottom={2}
                sx={commonStyles.customHeaderNoMargin}
              >
                CSV 入出力
              </Typography>
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
                      if (typeof event.target.select === "function") event.target.select();
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
                    disabled={userQuriousArmorData.length === 0}
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
          <QuriousArmorTable
            userQuriousArmorData={userQuriousArmorData}
            deleteUserQuriousArmors={deleteUserQuriousArmors}
            handleOpenDeleteConfirmDialog={handleOpenDeleteConfirmDialog}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default QuriousArmorManager;
