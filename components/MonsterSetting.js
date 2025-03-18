import React from "react";
import {
  Grid,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";

import { staticData } from "../data/StaticData";
import { NumberTextField } from "./NumberTextField";
import { commonStyles, GridItemInput } from "./DmaxMain";
import { applyWaterBlight } from "./HelperFunction";
import { isEqual } from "lodash";

export const MonsterSetting = React.memo(
  ({ userInputDataMonster, updateUserInputData }) => {
    const handleChangeUserInputData = (key, event, value) => {
      if (key === "物理肉質" || key === "属性肉質") {
        value = parseInt(event.target.value);
      }
      if (key === "怒り補正") {
        value = event.target.value;
      }
      if (key === "水やられ") {
        // CheckBox から呼び出された場合
        value = event.target.checked;
      }

      console.log("MonsterSetting: handleChangeUserInputData: key, value", key, value);

      updateUserInputData("モンスター", { ...userInputDataMonster, [key]: value });
    };

    return (
      <>
        <GridItemInput item>
          <NumberTextField
            value={userInputDataMonster["物理肉質"]}
            size="small"
            id="outlined-basic"
            label={
              "物理肉質" +
              (userInputDataMonster["水やられ"]
                ? " (" + applyWaterBlight(userInputDataMonster["物理肉質"], true) + ")"
                : "")
            }
            variant="outlined"
            onChange={(e, v) => handleChangeUserInputData("物理肉質", e, v)}
            min={0}
            max={100}
            fullWidth
          />
        </GridItemInput>
        <GridItemInput item>
          <NumberTextField
            value={userInputDataMonster["属性肉質"]}
            size="small"
            id="outlined-basic"
            label="属性肉質"
            variant="outlined"
            onChange={(e, v) => handleChangeUserInputData("属性肉質", e, v)}
            min={0}
            max={100}
            fullWidth
          />
        </GridItemInput>
        <GridItemInput item>
          <FormControl fullWidth style={{ height: "100%" }}>
            <InputLabel id="demo-simple-select-label">
              {"怒り補正 (" + staticData["怒り補正"][userInputDataMonster["怒り補正"]] + ")"}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              value={userInputDataMonster["怒り補正"]}
              label={"怒り補正 (" + staticData["怒り補正"][userInputDataMonster["怒り補正"]] + ")"}
              onChange={(e, v) => handleChangeUserInputData("怒り補正", e, v)}
              style={{ height: "100%", textAlign: "left" }}
            >
              {Object.entries(staticData["怒り補正"]).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </GridItemInput>
        <GridItemInput item>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={userInputDataMonster["水やられ"]}
                  onChange={(e, v) => handleChangeUserInputData("水やられ", e, v)}
                />
              }
              label={
                <Typography sx={commonStyles.inputCheckbox}>
                  水やられ{" "}
                  {userInputDataMonster["水やられ"]
                    ? userInputDataMonster["物理肉質"] +
                      " → " +
                      applyWaterBlight(userInputDataMonster["物理肉質"], true)
                    : ""}
                </Typography>
              }
            />
          </FormGroup>
        </GridItemInput>
      </>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.userInputDataMonster, nextProps.userInputDataMonster);
  }
);

export default MonsterSetting;
