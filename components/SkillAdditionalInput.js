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
  IconButton,
  InputAdornment,
  Divider,
  Paper,
  Tooltip,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { NumberTextField } from "./NumberTextField";
import { staticData } from "../data/StaticData";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AddIcon from "@mui/icons-material/Add";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import { useTheme } from "@mui/material/styles";

export const SkillAdditionalInput = ({ setUserInputData, userInputDataOther }) => {
  const handleChangeOther = (key, event, value) => {
    if (
      (key === "全属性耐性値" ||
        key === "狂竜症" ||
        key === "狂竜症克服率" ||
        key === "傷あり率" ||
        key === "撃ち切るビン数" ||
        key === "濡れ刃紋 泡状態率" ||
        key === "濡れ刃紋 濡れ状態率" ||
        key === "濡れ刃紋 発動なし率") &&
      !value
    ) {
      // TextField から呼び出された場合
      value = parseInt(event.target.value);
    } else {
      value = event.target.value;
    }

    setUserInputData((prevData) => ({
      ...prevData,
      その他: { ...prevData["その他"], [key]: value },
    }));
  };

  return (
    <>
      {/* 追加で入力項目が必要なスキルの処理 */}
      <Grid container rowSpacing={2} columnSpacing={2} paddingX={3} paddingTop={2} paddingBlock={2}>
        <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "start" }}>
              <Typography variant="caption" color="textSecondary">
                狂竜症を克服している時間の割合
              </Typography>
            </Grid>
            <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "center" }}>
              <NumberTextField
                label="狂竜症克服率"
                size="small"
                value={userInputDataOther["狂竜症克服率"]}
                onChange={(e, v) => handleChangeOther("狂竜症克服率", e, v)}
                min={0}
                max={100}
                sx={{ minWidth: "100px" }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "start" }}>
              <Typography variant="caption" color="textSecondary">
                弱点特効で傷あり状態を攻撃する割合
              </Typography>
            </Grid>
            <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "center" }}>
              <NumberTextField
                label="傷あり率"
                size="small"
                value={userInputDataOther["傷あり率"]}
                onChange={(e, v) => handleChangeOther("傷あり率", e, v)}
                min={0}
                max={100}
                sx={{ minWidth: "100px" }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "start" }}>
              <Typography variant="caption" color="textSecondary">
                フォースショットで何本目まで撃つか
              </Typography>
            </Grid>
            <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "center" }}>
              <NumberTextField
                label="撃ち切るビン数"
                size="small"
                value={userInputDataOther["撃ち切るビン数"]}
                onChange={(e, v) => handleChangeOther("撃ち切るビン数", e, v)}
                min={0}
                max={100}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "start" }}>
              <Typography variant="caption" color="textSecondary">
                濡れ刃紋で泡状態になる割合
              </Typography>
            </Grid>
            <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "center" }}>
              <NumberTextField
                label="濡れ刃紋 泡状態率"
                size="small"
                value={userInputDataOther["濡れ刃紋 泡状態率"]}
                onChange={(e, v) => handleChangeOther("濡れ刃紋 泡状態率", e, v)}
                min={0}
                max={100}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "start" }}>
              <Typography variant="caption" color="textSecondary">
                濡れ刃紋で水に濡れた状態になる割合
              </Typography>
            </Grid>
            <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "center" }}>
              <NumberTextField
                label="濡れ刃紋 濡れ状態率"
                size="small"
                value={userInputDataOther["濡れ刃紋 濡れ状態率"]}
                onChange={(e, v) => handleChangeOther("濡れ刃紋 濡れ状態率", e, v)}
                min={0}
                max={100}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "start" }}>
              <Typography variant="caption" color="textSecondary">
                濡れ刃紋が発動しない割合
              </Typography>
            </Grid>
            <Grid item xs={6} md={2} sx={{ display: "flex", justifyContent: "center" }}>
              <NumberTextField
                label="濡れ刃紋 発動なし率"
                size="small"
                value={userInputDataOther["濡れ刃紋 発動なし率"]}
                onChange={(e, v) => handleChangeOther("濡れ刃紋 発動なし率", e, v)}
                min={0}
                max={100}
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default SkillAdditionalInput;
