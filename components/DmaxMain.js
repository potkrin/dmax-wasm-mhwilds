import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Typography,
  Box,
  Autocomplete,
  TextField,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from "@mui/material/Paper";
import { Skill } from "./Skill";
import { MonsterSetting } from "./MonsterSetting";
import { WeaponSetting } from "./WeaponSetting";
import { HunterSetting } from "./HunterSetting";
import { FoodSkillSetting } from "./FoodSkillSetting";
import { DmaxSolver } from "./DmaxSolver";
import { ValidateData } from "./ValidateData";

// icons
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import TuneIcon from "@mui/icons-material/Tune";
import HelpIcon from "@mui/icons-material/Help";

import { staticSkillData } from "../data/StaticData";
import { userInputData as defaultUserInputData } from "../data/UserInputData";
import SkillCard from "./SkillCard";
import { useTheme } from "@mui/material/styles";
import { SkillAdditionalInput } from "./SkillAdditionalInput";

import { breakpoints } from "@/src/theme";
import isEqual from "lodash/isEqual";
import { katakanaToHiragana } from "@/components/HelperFunction";

import { theme } from "@/src/theme";

export const commonStyles = {
  customHeader: {
    padding: "0.25em 0.5em", // 上下 左右の余白
    // color: "#494949", // 文字色
    // background: "transparent", // 背景透明に
    borderLeft: "solid 3px " + theme.vars.palette.primary.main, // 左線
    // fontWeight: "bold", // 太字
    marginTop: "1em", // 上の余白
    display: "inline-block", // インライン要素に
    // borderBottom: "solid 1px #7db4e6", // 下線
  },
  customHeaderNoMargin: {
    padding: "0.25em 0.5em", // 上下 左右の余白
    // color: "#494949", // 文字色
    // background: "transparent", // 背景透明に
    borderLeft: "solid 3px " + theme.vars.palette.primary.main, // 左線
    // fontWeight: "bold", // 太字
    display: "inline-block", // インライン要素に
    // borderBottom: "solid 1px #7db4e6", // 下線
  },
  customHeaderThin: {
    padding: "0.25em 0.5em", // 上下 左右の余白
    // color: "#494949", // 文字色
    // background: "transparent", // 背景透明に
    borderLeft: "solid 3px " + theme.vars.palette.primary.main, // 左線
    marginTop: "1em", // 上の余白
    display: "inline-block", // インライン要素に
    // borderBottom: "solid 1px #7db4e6", // 下線
  },
  customHeaderThinNoMargin: {
    padding: "0.25em 0.5em", // 上下 左右の余白
    // color: "#494949", // 文字色
    // background: "transparent", // 背景透明に
    borderLeft: "solid 3px " + theme.vars.palette.primary.main, // 左線
    // marginTop: "1em", // 上の余白
    display: "inline-block", // インライン要素に
    // borderBottom: "solid 1px #7db4e6", // 下線
  },
  customFontSize: {
    fontSize: "10px !important",
  },
  inputCheckbox: {
    fontSize: "14px !important",
  },
};

/**
 * xs: 0px 以上
 * sm: 600px 以上
 * md: 960px 以上
 * lg: 1280px 以上
 * xl: 1920px 以上
 */
export function GridItemInput(props) {
  return <Grid item xs={6} sm={4} md={2} {...props} />;
}

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
  { icon: <PrintIcon />, name: "Print" },
  { icon: <ShareIcon />, name: "Share" },
];

export const DmaxMain = React.memo(({ fabRight, setFabRight, setValue }) => {
  const matches = useMediaQuery("(max-width: " + breakpoints.values.sm + "px)"); // 'sm' は600pxに設定されていることが多い

  const [userInputData, setUserInputData] = useState(defaultUserInputData);
  const [additionalSkills, setAdditionalSkills] = useState([]);

  // SSG対応: クライアントサイトでマウントされた後に localstorage から読み込む
  useEffect(() => {
    // 静的に埋め込むバージョン。ここを更新することで localStorage の UserInputData をリセットする。
    const staticVersion = "2025-10-26";

    const storedVersion = localStorage.getItem("userInputDataVersion");
    console.log("[dbg reset] storedVersion", storedVersion);

    if (!storedVersion) {
      console.log("[dbg reset] userInputDataVersion not found. Removing userInputData.");
      // userInputDataVersion キーが存在しない場合、userInputData を削除
      localStorage.removeItem("userInputData");
      // 静的バージョンを保存
      localStorage.setItem("userInputDataVersion", staticVersion);
    } else {
      console.log("[dbg reset] userInputDataVersion found. Comparing versions.");
      // userInputDataVersion キーが存在する場合、保存されている日付と静的バージョンを比較
      if (storedVersion !== staticVersion) {
        console.log("[dbg reset] Versions do not match. Removing userInputData.");
        // 一致していなければ userInputData を削除し、最新バージョンに更新
        localStorage.removeItem("userInputData");
        localStorage.setItem("userInputDataVersion", staticVersion);
      }
      // 一致していれば削除不要
    }

    const localStorageUserInputData = localStorage.getItem("userInputData");
    if (localStorageUserInputData !== null) {
      setUserInputData(JSON.parse(localStorageUserInputData));
    }
    const localStorageAdditionalSkills = localStorage.getItem("additionalSkills");
    if (localStorageAdditionalSkills !== null) {
      setAdditionalSkills(JSON.parse(localStorageAdditionalSkills));
    }
  }, []);

  const updateUserInputData = useCallback((key, value) => {
    setUserInputData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  });

  // ユーザが入力するたびに入力データを localstorage に書き込み
  useEffect(() => {
    console.log("[dbg] userInputData has been updated");
    if (isEqual(userInputData, defaultUserInputData)) return;
    localStorage.setItem("userInputData", JSON.stringify(userInputData));
    console.log("[dbg] userInputData has been written to localstorage");
  }, [userInputData]);

  // SpeedDial 用
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [skillSuggestions, setSkillSuggestions] = useState(
    Object.keys(staticSkillData).filter((key) => staticSkillData[key].type === "NonDamage")
  );

  const handleSkillSelect = (event, newValue) => {
    setCurrentSkill(newValue);
    if (newValue === null) return;

    if (!additionalSkills.some((skill) => skill.name === newValue)) {
      setAdditionalSkills((prev) => [...prev, { name: newValue, level: 0 }]);
      // localstorage に追加されたスキルを保存
      localStorage.setItem(
        "additionalSkills",
        JSON.stringify([...additionalSkills, { name: newValue, level: 0 }])
      );
    }
  };

  // Autoselect のテキストボックスに入力されている値 (onFocus でリセットするために定義)
  const [currentSkill, setCurrentSkill] = useState(null);

  const handleSkillRemove = useCallback(
    (indexToRemove) => {
      const skillName = additionalSkills[indexToRemove].name;
      updateUserInputData("スキル", {
        ...userInputData["スキル"],
        [skillName]: {
          ...userInputData["スキル"][skillName],
          minLevel: 0,
          fixLevel: false,
          activeRate: 100,
        },
      });

      setAdditionalSkills((prev) => prev.filter((_, index) => index !== indexToRemove));
      // save to localstorage
      localStorage.setItem(
        "additionalSkills",
        JSON.stringify(additionalSkills.filter((_, index) => index !== indexToRemove))
      );
    },
    [additionalSkills, userInputData, updateUserInputData]
  );

  return (
    <div className="DmaxMain">
      {/* 読み込みデータの検証 */}
      <ValidateData />

      {/* Dmax API呼び出し, wasm-dmax-solver の呼び出し, 出力表示を行うコンポーネント*/}
      <DmaxSolver userInputData={userInputData} fabRight={fabRight} />

      <Box marginTop={1}>
        <Paper variant="outlined" sx={{ borderRadius: 1, padding: 2 }}>
          <Grid container alignItems="center">
            <Grid item>
              <TuneIcon sx={{ marginTop: "4px", marginLeft: "4px" }} color="primary" />
            </Grid>
            <Grid item ml={1}>
              <Typography variant="h6">
                条件設定
                <Tooltip title="ヘルプ" placement="top">
                  <IconButton aria-label="help" color="primary" onClick={() => setValue(3)}>
                    <HelpIcon />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ marginTop: "8px" }}>
            <Divider xs={{ marginTop: "8px" }} />
          </Box>

          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={2}
            marginBottom={1}
            marginLeft={1}
            sx={commonStyles.customHeader}
          >
            モンスター
          </Typography>
          <Grid container rowSpacing={2} columnSpacing={2} paddingX={3}>
            <MonsterSetting
              userInputDataMonster={userInputData["モンスター"]}
              updateUserInputData={updateUserInputData}
            />
          </Grid>
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={4}
            marginBottom={1}
            marginLeft={1}
            sx={commonStyles.customHeader}
          >
            武器
          </Typography>
          <Grid container>
            <WeaponSetting
              userInputDataWeapon={userInputData["武器"]}
              updateUserInputData={updateUserInputData}
              // fabRight={fabRight}
              // setFabRight={setFabRight}
            />
          </Grid>
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={4}
            marginBottom={1}
            marginLeft={1}
            sx={commonStyles.customHeader}
          >
            ハンター
          </Typography>

          <Grid container rowSpacing={2} columnSpacing={2} paddingX={3}>
            <HunterSetting
              userInputDataHunter={userInputData["ハンター"]}
              updateUserInputData={updateUserInputData}
            />
          </Grid>

          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={4}
            marginBottom={1}
            marginLeft={1}
            sx={commonStyles.customHeader}
          >
            食事
          </Typography>
          <Grid container rowSpacing={2} columnSpacing={2} paddingX={3}>
            <FoodSkillSetting
              userInputDataFoodSkill={userInputData["食事"]}
              updateUserInputData={updateUserInputData}
            />
          </Grid>

          {/* スライダーありのスキル */}
          <Box
            sx={{ display: "flex", alignItems: "baseline", gap: 1, marginTop: 4, marginBottom: 1 }}
          >
            <Typography
              variant="subtitle2"
              align="left"
              marginLeft={1}
              sx={commonStyles.customHeader}
            >
              ダメージスキル
            </Typography>
            <Tooltip title="スキル設定の詳細説明を見る" placement="top">
              <IconButton
                aria-label="help"
                color="primary"
                onClick={() => {
                  setValue(2);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                sx={{ padding: 0.5 }}
              >
                <HelpIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="caption"
                color="primary"
                sx={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  "&:hover": {
                    color: theme.vars.palette.primary.dark,
                  },
                }}
                onClick={() => {
                  setValue(2);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                スキルの各パラメータの設定方法
              </Typography>
            </Tooltip>
          </Box>

          <Grid container marginBottom={2}>
            {/* スキル一覧のカラムヘッダー */}
            {!matches && (
              <Grid
                container
                mt={0.5}
                paddingX={1}
                marginBottom={1}
                sx={{
                  borderBottom: "1px solid",
                  borderBottomColor: theme.vars.palette.divider,
                  paddingBottom: 0.5,
                }}
              >
                <Grid
                  item
                  xs={1}
                  md={0.5}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRight: "1px solid",
                    borderRightColor: theme.vars.palette.divider,
                    paddingY: 0.5,
                  }}
                >
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: "0.7rem" }}>
                    Lv固定
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={3.5}
                  md={3.5}
                  lg={3}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRight: "1px solid",
                    borderRightColor: theme.vars.palette.divider,
                    paddingY: 0.5,
                    paddingX: 1,
                  }}
                >
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: "0.7rem" }}>
                    下限スキルLv (必要な場合以外は0を指定)
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sm={2}
                  md={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRight: "1px solid",
                    borderRightColor: theme.vars.palette.divider,
                    paddingY: 0.5,
                  }}
                >
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: "0.7rem" }}>
                    スキル発動率 (%)
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={2.5}
                  md={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "left",
                    borderRight: "1px solid",
                    borderRightColor: theme.vars.palette.divider,
                    paddingY: 0.5,
                    paddingLeft: 1,
                  }}
                >
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: "0.7rem" }}>
                    追加設定
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "left",
                    paddingY: 0.5,
                    paddingLeft: 1,
                  }}
                >
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: "0.7rem" }}>
                    説明
                  </Typography>
                </Grid>
              </Grid>
            )}

            {/* モバイル用のスキル説明テキスト */}
            {matches && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    mt: 0.5,
                    mb: 1,
                    ml: 1,
                    mr: 1,
                    paddingX: 0.5,
                    paddingY: 0.5,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: theme.vars.palette.divider,
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{
                      fontSize: "0.80rem",
                      fontWeight: "bold",
                      marginBottom: 0.2,
                      marginLeft: 1,
                      display: "block",
                    }}
                  >
                    各スキルの設定項目
                  </Typography>
                  <Box component="table" sx={{ width: "100%", fontSize: "0.65rem" }}>
                    <Box component="tbody">
                      <Box component="tr" sx={{ display: "table-row" }}>
                        <Box
                          component="td"
                          sx={{
                            padding: "4px 8px",
                            borderBottom: "1px solid",
                            borderBottomColor: theme.vars.palette.divider,
                            fontWeight: "bold",
                            width: "25%",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "0.65rem", fontWeight: "bold" }}
                          >
                            Lv固定
                          </Typography>
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            padding: "4px 8px",
                            borderBottom: "1px solid",
                            borderBottomColor: theme.vars.palette.divider,
                            width: "75%",
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{ fontSize: "0.65rem" }}
                          >
                            スキルレベルを固定する場合にチェック
                          </Typography>
                        </Box>
                      </Box>
                      <Box component="tr" sx={{ display: "table-row" }}>
                        <Box
                          component="td"
                          sx={{
                            padding: "4px 8px",
                            borderBottom: "1px solid",
                            borderBottomColor: theme.vars.palette.divider,
                            fontWeight: "bold",
                            width: "25%",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "0.65rem", fontWeight: "bold" }}
                          >
                            スキル発動率
                          </Typography>
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            padding: "4px 8px",
                            borderBottom: "1px solid",
                            borderBottomColor: theme.vars.palette.divider,
                            width: "75%",
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{ fontSize: "0.65rem" }}
                          >
                            スキルが発動する確率を%で指定
                          </Typography>
                        </Box>
                      </Box>
                      <Box component="tr" sx={{ display: "table-row" }}>
                        <Box
                          component="td"
                          sx={{
                            padding: "4px 8px",
                            borderBottom: "1px solid",
                            borderBottomColor: theme.vars.palette.divider,
                            fontWeight: "bold",
                            width: "25%",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "0.65rem", fontWeight: "bold" }}
                          >
                            － / ＋
                          </Typography>
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            padding: "4px 8px",
                            borderBottom: "1px solid",
                            borderBottomColor: theme.vars.palette.divider,
                            width: "75%",
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{ fontSize: "0.65rem" }}
                          >
                            下限スキルLvの増減 (必要な場合以外は0を指定)
                          </Typography>
                        </Box>
                      </Box>
                      <Box component="tr" sx={{ display: "table-row" }}>
                        <Box
                          component="td"
                          sx={{
                            padding: "4px 8px",
                            fontWeight: "bold",
                            width: "25%",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "0.65rem", fontWeight: "bold" }}
                          >
                            追加設定
                          </Typography>
                        </Box>
                        <Box
                          component="td"
                          sx={{
                            padding: "4px 8px",
                            width: "75%",
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{ fontSize: "0.65rem" }}
                          >
                            スキル固有の詳細設定
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            )}

            {Object.keys(staticSkillData)
              .filter((key) => staticSkillData[key].type === "Damage")
              .map((key) => (
                <Skill
                  key={key}
                  staticSkillData={staticSkillData[key]}
                  setUserInputData={setUserInputData}
                  userInputDataSkill={userInputData["スキル"][key]}
                  userInputDataOther={
                    key === "濡れ刃紋" ||
                    key === "黒蝕竜の力" ||
                    key === "弱点特効" ||
                    key === "フォースショット" ||
                    key === "龍気変換" ||
                    key === "狂竜症【蝕】" ||
                    key === "伏魔響命" ||
                    key === "血氣覚醒" ||
                    key === "耐性変換【雷】" ||
                    key === "無我の境地"
                      ? userInputData["その他"]
                      : null
                  }
                />
              ))}
          </Grid>

          {matches && (
            <>
              <Typography
                variant="subtitle2"
                gutterBottom
                align="left"
                marginTop={4}
                marginBottom={1}
                marginLeft={2}
              >
                スキルの追加設定
              </Typography>
              <SkillAdditionalInput
                setUserInputData={setUserInputData}
                userInputDataOther={userInputData["その他"]}
              />
            </>
          )}

          <Grid container paddingTop={3}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                gutterBottom
                align="left"
                marginTop={4}
                marginBottom={1}
                marginLeft={1}
                sx={commonStyles.customHeader}
              >
                非ダメージスキル
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} md={4} marginX={3}>
              <Autocomplete
                options={skillSuggestions}
                onChange={handleSkillSelect}
                filterOptions={(options, state) =>
                  options.filter((option) =>
                    katakanaToHiragana(option).includes(katakanaToHiragana(state.inputValue))
                  )
                }
                renderInput={(params) => (
                  <TextField {...params} label="スキル名" variant="outlined" />
                )}
                sx={{ marginY: 2 }}
                size="small"
                value={currentSkill}
                onFocus={() => {
                  // 同じスキルを選択肢した場合に追加できない問題を回避するために, 選択肢をリセットする
                  // [[Autocomplete] onChange not fired for same item consecutively #29159](https://github.com/mui/material-ui/issues/29159)
                  setCurrentSkill("");
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {additionalSkills.map((skill, index) => (
                <Skill
                  key={index}
                  staticSkillData={staticSkillData[skill.name]}
                  setUserInputData={setUserInputData}
                  userInputDataSkill={userInputData["スキル"][skill.name]}
                  userInputDataOther={null}
                  allowRemove={true}
                  onRemove={() => handleSkillRemove(index)}
                />
              ))}
            </Grid>

            <Box
              sx={{
                height: "360px",
              }}
            />
          </Grid>
        </Paper>
      </Box>

      {/* <Backdrop open={open} /> */}
      {/* <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{
          position: "fixed",
          bottom: "128px",
          right: `${fabRight}`,
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClose}
          />
        ))}
      </SpeedDial> */}
    </div>
  );
});

export default DmaxMain;
