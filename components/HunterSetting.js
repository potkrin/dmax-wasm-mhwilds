import React from "react";
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";

import { NumberTextField } from "./NumberTextField";
import { staticData } from "../data/StaticData";
import { GridItemInput, commonStyles } from "./DmaxMain";
import { theme } from "../src/theme";
import { isEqual } from "lodash";

export const HunterSetting = React.memo(
  ({ userInputDataHunter, updateUserInputData }) => {
    const handleChangeUserInputData = (key, event, value) => {
      // TODO: リファクタリング案
      // - value から type を判定して条件分岐するようにする
      // - handle 関数を分ける
      if (key === "怪力の種枠" || key === "鬼人薬枠" || key === "装衣") {
        value = event.target.value;
      } else {
        value = event.target.checked;
      }
      console.log(`key = ${key}, value = ${value}`);
      updateUserInputData("ハンター", { ...userInputDataHunter, [key]: value });
    };

    return (
      <>
        {Object.entries(staticData["ハンター"])
          .filter(([_, value]) => typeof value === "boolean")
          .map(([key, _]) => (
            <GridItemInput item key={key}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={userInputDataHunter[key]}
                      onChange={(e, v) => handleChangeUserInputData(key, e, v)}
                      size="small"
                    />
                  }
                  label={<Typography sx={commonStyles.inputCheckbox}>{key}</Typography>}
                  sx={{
                    margin: 0,
                    padding: "4px 8px",
                    borderRadius: 1,
                    cursor: "pointer",
                    userSelect: "none",
                    "&:hover": {
                      backgroundColor: theme.vars.palette.action.hover,
                    },
                    "& .MuiFormControlLabel-label": {
                      userSelect: "none",
                    },
                  }}
                />
              </FormGroup>
            </GridItemInput>
          ))}
        {Object.entries(staticData["ハンター"])
          .filter(([_, value]) => typeof value === "object")
          .map(([key, _]) => (
            <GridItemInput item key={key}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{key}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small"
                  value={userInputDataHunter[key]}
                  label={key}
                  onChange={(e) => handleChangeUserInputData(key, e)}
                >
                  {Object.entries(staticData["ハンター"][key]).map(([_, value]) => (
                    <MenuItem key={key} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </GridItemInput>
          ))}

        {Object.entries(staticData["ハンター"])
          .filter(([_, value]) => typeof value === "number")
          .map(([key, _]) => (
            <GridItemInput item key={key}>
              <NumberTextField
                value={userInputDataHunter[key]}
                size="small"
                id="outlined-basic"
                label={key}
                variant="outlined"
                onChange={(e, v) => handleChangeUserInputData(key, e, v)}
                min={key === "ヒトダマドリ" ? 0 : 0}
                max={key === "ヒトダマドリ" ? 20 : 20}
                fullWidth
              />
            </GridItemInput>
          ))}
      </>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.userInputDataHunter, nextProps.userInputDataHunter);
  }
);

export default HunterSetting;
