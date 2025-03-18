import React from "react";
import {
  Typography,
  Grid,
  Box,
  Slider,
  TextField,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { NumberTextField } from "./NumberTextField";
import { staticData } from "../data/StaticData";

export const Skill = ({ staticSkillData, userInputData, updateUserInputData }) => {
  const handleChangeSkillInfo = (key, event, value) => {
    if (key === "activeRate" && !value) {
      // TextField から呼び出された場合
      value = parseInt(event.target.value);
    }
    if (key === "fixLevel") {
      // CheckBox から呼び出された場合
      value = event.target.checked;
    }
    updateUserInputData("スキル", {
      ...userInputData["スキル"],
      [staticSkillData.name]: {
        ...userInputData["スキル"][staticSkillData.name],
        [key]: value,
      },
    });
  };

  const handleChangeOther = (key, event, value) => {
    if ((key === "全属性耐性値" || key === "狂竜症") && !value) {
      // TextField から呼び出された場合
      value = parseInt(event.target.value);
    } else {
      value = event.target.value;
    }

    updateUserInputData("その他", { ...userInputData["その他"], [key]: value });
  };

  const skillInput = userInputData["スキル"][staticSkillData.name];

  return (
    <>
      <Grid item xs={2}>
        <Typography
          variant="body2"
          sx={{
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
          marginLeft={4}
        >
          {staticSkillData.name}
        </Typography>
      </Grid>
      {staticSkillData.type === "Damage" ? (
        <>
          <Grid item xs={1}>
            <Box sx={{ width: 50, display: "flex", alignItems: "center", height: "100%" }}>
              <Slider
                value={skillInput.activeRate}
                size="small"
                aria-label="Temperature"
                valueLabelDisplay="auto"
                min={0}
                max={100}
                onChange={(e, v) => handleChangeSkillInfo("activeRate", e, v)}
              />
            </Box>
          </Grid>
          <Grid item xs={1}>
            <NumberTextField
              value={skillInput.activeRate}
              size="small"
              id="outlined-basic"
              label="%"
              variant="outlined"
              onChange={(e, v) => handleChangeSkillInfo("activeRate", e, v)}
              min={0}
              max={100}
              sx={{ display: "flex", alignItems: "center", height: "100%", marginY: 1 }}
            />
          </Grid>
        </>
      ) : (
        <Grid item xs={2}></Grid>
      )}
      {staticSkillData.type !== "FixedLevelDamage" ? (
        <Grid item xs={1}>
          <Checkbox
            checked={skillInput.fixLevel}
            onChange={(e, v) => handleChangeSkillInfo("fixLevel", e, v)}
            size="small"
            sx={{ display: "flex", alignItems: "center", height: "100%" }}
          />
        </Grid>
      ) : (
        <Grid item xs={1}></Grid>
      )}
      <Grid item xs={4}>
        <Box sx={{ width: 50 * staticSkillData.maxLevel }}>
          <Slider
            aria-label="Temperature"
            value={skillInput.minLevel}
            valueLabelDisplay="auto"
            step={1}
            marks={Array.from({ length: staticSkillData.maxLevel + 1 }, (_, level) => ({
              value: level,
              label: String(level),
            }))}
            min={0}
            max={staticSkillData.maxLevel}
            onChange={(e, v) => handleChangeSkillInfo("minLevel", e, v)}
            size="small"
          />
        </Box>
      </Grid>

      {/* 追加で入力項目が必要なスキルの処理 */}
      {staticSkillData.name === "龍気変換" ? (
        <Grid item xs={1}>
          <NumberTextField
            label="全属性耐性合計"
            size="small"
            value={userInputData["その他"]["全属性耐性値"]}
            onChange={(e, v) => handleChangeOther("全属性耐性値", e, v)}
            min={0}
            max={250}
          />
        </Grid>
      ) : staticSkillData.name === "狂竜症【蝕】" ? (
        <Grid item xs={1}>
          <TextField
            label="狂竜症感染時割合"
            size="small"
            value={userInputData["その他"]["狂竜症【蝕】感染時割合"]}
            onChange={(e, v) => handleChangeOther("狂竜症【蝕】感染時割合", e, v)}
            min={0}
            max={100}
          />
        </Grid>
      ) : staticSkillData.name === "伏魔響命" ? (
        <Grid item xs={1}>
          <FormControl style={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-label">キュリア</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              value={userInputData["その他"]["キュリア"]}
              label={"キュリア"}
              onChange={(e) => handleChangeOther("キュリア", e)}
            >
              {Object.entries(staticData["その他"]["キュリア"]).map(([_, value]) => (
                <MenuItem value={value}>{value}匹</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ) : staticSkillData.name === "血氣覚醒" ? (
        <Grid item xs={1}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">血氣覚醒</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              value={userInputData["その他"]["血氣覚醒"]}
              label={"血氣覚醒"}
              onChange={(e) => handleChangeOther("血氣覚醒", e)}
            >
              {Object.entries(staticData["その他"]["血氣覚醒"]).map(([_, value]) => (
                <MenuItem value={value}>{value}段階目</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ) : (
        <Grid item xs={1}></Grid>
      )}
      <Grid item xs={2}></Grid>
    </>
  );
};

export default Skill;
