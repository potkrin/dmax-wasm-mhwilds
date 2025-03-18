import React, { useState, useEffect, useRef, useMemo } from "react";
import { Grid, TextField, Button, Snackbar, Typography, Card, Box } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Cookies from "js-cookie";
import isEqual from "lodash/isEqual";

import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import AddIcon from "@mui/icons-material/Add";
import CopyToClipboardButton from "./CopyToClipboardButton";

import { commonStyles } from "./DmaxMain";

import { armorDict } from "../data/EquipData";
import { staticSkillData } from "../data/StaticData";
import { QuriousArmorTable } from "./QuriousArmorTable";
import QuriousArmorInput from "./QuriousArmorInput";
import { fetchWithRetry } from "../lib/utils";
import { useSnackbar } from "./SnackbarContext";
import { useCharmAndQuriousArmorContext } from "./CharmAndQuriousArmorContext";
import { useLoginContext } from "./LoginContext";
import LoginDialog from "./LoginDialog";
import ConfirmDialog from "./ConfirmDialog";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ServerQuriousArmorManager() {
  // メモリ層で傀異錬成防具データを一元管理するstate (ストレージ層は localstorage or サーバ上のDB)
  const [userQuriousArmorData, setUserQuriousArmorData] = useState([]);
  const [nextUserQuriousArmorData, setNextUserQuriousArmorData] = useState([]);
  const [userQuriousArmorMetaData, setUserQuriousArmorMetaData] = useState(null);

  const { isQuriousArmorDataFetched, setIsQuriousArmorDataFetched, setServerQuriousArmorData } =
    useCharmAndQuriousArmorContext();

  const { isLoggedIn, setIsLoggedIn, isDialogOpen, handleCloseDialog, checkLoginStatus } =
    useLoginContext();

  const fetchUserQuriousArmorData = () => {
    console.log("ServerQuriousArmorManager: fetch qurious-armor-data from server");

    // ログイン状態を確認した後に傀異錬成防具データを取得する処理を一連の Promise で定義 (分離すると非同期に処理されてしまうため)
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
          // ログイン中なので qurious-armor-data を取得する
          fetchWithRetry(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax-api/v1/user-equip-data/?equip_type=quriousarmor`,
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
                console.log("fetch sucess: server_quriousarmor_data" + JSON.stringify(data));
                setUserQuriousArmorData(data[0].equip_data);
                setNextUserQuriousArmorData(data[0].equip_data);
                const { equip_data, ...metaData } = data[0];
                setUserQuriousArmorMetaData(metaData);
              }
              setIsQuriousArmorDataFetched(true);
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
    fetchUserQuriousArmorData();

    // 1分ごとにデータを取得
    const intervalId = setInterval(fetchUserQuriousArmorData, 60000);

    // アンマウント時にタイマーをクリア
    return () => clearInterval(intervalId);
  }, []);

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
        setNextUserQuriousArmorData(quriousArmorData);
      } else {
        // 追加モード
        setNextUserQuriousArmorData([...userQuriousArmorData, ...quriousArmorData]);
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

  // // テーブルで複数選択された護石を userQuriousArmorData から削除 (引数は削除対象インデックス)
  // const deleteUserQuriousArmors = (deleteTargetIndexes) => {
  //   const newQuriousArmorData = userQuriousArmorData.filter(
  //     (_, index) => !deleteTargetIndexes.includes(index)
  //   );
  //   setUserQuriousArmorData(newQuriousArmorData);
  // };

  // ここから追加
  // nextUserQuriousArmorData が変更されたら POST API を呼び出して DB を更新
  useEffect(() => {
    if (!isQuriousArmorDataFetched) {
      console.log("userQuriousArmorData has not been fetched yet. skip POST API");
      return;
    }
    if (isEqual(userQuriousArmorData, nextUserQuriousArmorData)) {
      console.log(
        "no difference between userQuriousArmorData and nextUserQuriousArmorData. skip POST API"
      );
      return;
    }
    console.log("nextUserQuriousArmorData has been changed. call POST API");
    fetchWithRetry(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax-api/v1/user-equip-data/?equip_type=quriousarmor`,
      {
        method: "POST",
        credentials: "include", // クッキーベースの認証に必要
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken"), // CSRFトークンをヘッダーに含める
        },
        body: JSON.stringify({
          equip_type: "quriousarmor",
          equip_data: nextUserQuriousArmorData,
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
        console.log(`Update userQuriousArmorData here!`);
        setUserQuriousArmorData(data.equip_data);
        const { equip_data, ...metaData } = data;
        setUserQuriousArmorMetaData(metaData);
      })
      .catch((error) => {
        console.error("Error:", error);
        console.error("サーバーとの通信でエラーが発生しました\n" + error.stack);
        setError("サーバーに護石データを保存できませんでした\n" + error.stack);
        setOpen(true);
      });
  }, [nextUserQuriousArmorData]);

  // ContextAPI からエラー出力用 Snackbar 管理用の関数を取得
  const { error, setError, open, setOpen, handleClose } = useSnackbar();

  useEffect(() => {
    setServerQuriousArmorData(userQuriousArmorData);
  }, [userQuriousArmorData]);

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

  // CSVテキストボックスのコピーボタン用
  const [textToCopy, setTextToCopy] = useState("");
  useEffect(() => {
    setTextToCopy(csvData);
  }, [csvData]);

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

  const deleteUserQuriousArmors = (deleteTargetIndexes) => {
    const newQuriousArmorData = userQuriousArmorData.filter(
      (_, index) => !deleteTargetIndexes.includes(index)
    );
    setNextUserQuriousArmorData(newQuriousArmorData);
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
          dataType="傀異錬成"
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
          {/* データ入力欄 */}
          <Grid item xs={12} md={6}>
            <QuriousArmorInput
              userQuriousArmorData={userQuriousArmorData}
              setUserQuriousArmorData={setNextUserQuriousArmorData}
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
                  height: "93.5%",
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

          <Grid item xs={12} marginTop={3} onClick={checkLoginStatus}>
            <QuriousArmorTable
              userQuriousArmorData={userQuriousArmorData}
              deleteUserQuriousArmors={deleteUserQuriousArmors}
              fetchUserQuriousArmorData={fetchUserQuriousArmorData}
              handleOpenDeleteConfirmDialog={handleOpenDeleteConfirmDialog}
              userQuriousArmorMetaData={userQuriousArmorMetaData}
            />
          </Grid>
        </Grid>
      </>
    ),
    [
      isQuriousArmorDataFetched,
      setIsQuriousArmorDataFetched,
      setServerQuriousArmorData,
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
    ]
  );
}

export default ServerQuriousArmorManager;
