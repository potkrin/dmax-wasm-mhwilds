import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Typography,
  Box,
  Card,
  Backdrop,
  SpeedDial,
  SpeedDialAction,
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

export const commonStyles = {
  customHeader: {
    padding: "0.25em 0.5em", // 上下 左右の余白
    // color: "#494949", // 文字色
    // background: "transparent", // 背景透明に
    borderLeft: "solid 3px #8798ef", // 左線
    // fontWeight: "bold", // 太字
    marginTop: "1em", // 上の余白
    display: "inline-block", // インライン要素に
    // borderBottom: "solid 1px #7db4e6", // 下線
  },
  customHeaderNoMargin: {
    padding: "0.25em 0.5em", // 上下 左右の余白
    // color: "#494949", // 文字色
    // background: "transparent", // 背景透明に
    borderLeft: "solid 3px #8798ef", // 左線
    // fontWeight: "bold", // 太字
    display: "inline-block", // インライン要素に
    // borderBottom: "solid 1px #7db4e6", // 下線
  },
  customHeaderThin: {
    padding: "0.25em 0.5em", // 上下 左右の余白
    // color: "#494949", // 文字色
    // background: "transparent", // 背景透明に
    borderLeft: "solid 3px #8798ef", // 左線
    marginTop: "1em", // 上の余白
    display: "inline-block", // インライン要素に
    // borderBottom: "solid 1px #7db4e6", // 下線
  },
  customHeaderThinNoMargin: {
    padding: "0.25em 0.5em", // 上下 左右の余白
    // color: "#494949", // 文字色
    // background: "transparent", // 背景透明に
    borderLeft: "solid 3px #8798ef", // 左線
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
      setAdditionalSkills((prev) => [...prev, { name: newValue, level: 1 }]);
    }
  };

  // additionalSkills が変更されたら userInputData に反映する
  useEffect(() => {
    for (const skill of additionalSkills) {
      updateUserInputData("スキル", {
        ...userInputData["スキル"],
        [skill.name]: {
          ...userInputData["スキル"][skill.name],
          minLevel: skill.level,
        },
      });
    }
    localStorage.setItem("additionalSkills", JSON.stringify(additionalSkills));
  }, [additionalSkills]);

  // Autoselect のテキストボックスに入力されている値 (onFocus でリセットするために定義)
  const [currentSkill, setCurrentSkill] = useState(null);

  const handleSkillRemove = useCallback((indexToRemove) => {
    const skillName = additionalSkills[indexToRemove].name;
    updateUserInputData("スキル", {
      ...userInputData["スキル"],
      [skillName]: {
        ...userInputData["スキル"][skillName],
        minLevel: 0,
      },
    });

    setAdditionalSkills((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

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
          <Grid container rowSpacing={2} columnSpacing={2} paddingX={3}>
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
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginTop={4}
            marginBottom={1}
            marginLeft={1}
            sx={commonStyles.customHeader}
          >
            ダメージスキル
            <Tooltip title="ヘルプ" placement="top">
              <IconButton aria-label="help" color="primary" onClick={() => setValue(3)}>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Typography>

          <Grid container marginBottom={2}>
            {Object.keys(staticSkillData)
              .filter((key) => staticSkillData[key].type === "FixedLevelDamage")
              .map((key) => (
                <Skill
                  key={key}
                  staticSkillData={staticSkillData[key]}
                  setUserInputData={setUserInputData}
                  userInputDataSkill={userInputData["スキル"][key]}
                  userInputDataOther={
                    key === "龍気変換" ||
                    key === "狂竜症【蝕】" ||
                    key === "伏魔響命" ||
                    key === "血氣覚醒"
                      ? userInputData["その他"]
                      : null
                  }
                />
              ))}
            {Object.keys(staticSkillData)
              .filter((key) => staticSkillData[key].type === "Damage")
              .map((key) => (
                <Skill
                  key={key}
                  staticSkillData={staticSkillData[key]}
                  setUserInputData={setUserInputData}
                  userInputDataSkill={userInputData["スキル"][key]}
                  userInputDataOther={
                    key === "龍気変換" ||
                    key === "狂竜症【蝕】" ||
                    key === "伏魔響命" ||
                    key === "血氣覚醒"
                      ? userInputData["その他"]
                      : null
                  }
                />
              ))}
          </Grid>

          {matches && (
            <SkillAdditionalInput
              setUserInputData={setUserInputData}
              userInputDataOther={userInputData["その他"]}
            />
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
                よく使うスキル
              </Typography>
            </Grid>
            {Object.keys(staticSkillData)
              .filter((key) => staticSkillData[key].type === "FreqNonDamage")
              .map((key) => (
                <Skill
                  key={key}
                  staticSkillData={staticSkillData[key]}
                  setUserInputData={setUserInputData}
                  userInputDataSkill={userInputData["スキル"][key]}
                  userInputDataOther={
                    key === "龍気変換" ||
                    key === "狂竜症【蝕】" ||
                    key === "伏魔響命" ||
                    key === "血氣覚醒"
                      ? userInputData["その他"]
                      : null
                  }
                />
              ))}
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
            その他スキル
          </Typography>
          <Grid container paddingX={1} paddingBottom={6}>
            <Grid item xs={12} md={6} minHeight={"200px"}>
              <Autocomplete
                options={skillSuggestions}
                onChange={handleSkillSelect}
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

              {additionalSkills.map((skill, index) => (
                <SkillCard
                  key={index}
                  skill={skill}
                  setSelectedSkills={setAdditionalSkills}
                  onRemove={() => handleSkillRemove(index)}
                  allowRemove={true}
                />
              ))}
            </Grid>
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
