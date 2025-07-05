import React from "react";
import {
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { staticData } from "../data/StaticData";
import { GridItemInput, commonStyles } from "./DmaxMain";
import { theme } from "../src/theme";
import _, { isEqual } from "lodash";

export const FoodSkillSetting = React.memo(
  ({ userInputDataFoodSkill, updateUserInputData }) => {
    console.log("[fs] userInputDataFoodSkill = ", userInputDataFoodSkill);

    const boolValue = Object.keys(staticData["食事"]).filter(
      ([_, value]) => typeof value === "boolean"
    );
    console.log(`[fs] boolValue = ${boolValue} length = ${boolValue.length}`);

    // debug output type
    for (const key in staticData["食事"]) {
      console.log(
        `[fs] key = ${key}, type = ${typeof staticData["食事"][
          key
        ]} type of value === "boolean" = ${typeof staticData["食事"][key] === "boolean"}`
      );
    }

    const handleChangeUserInputData = (key, event, value) => {
      if (key === "食事タイプ") {
        value = event.target.value;
      } else {
        value = event.target.checked;
      }
      console.log(`key = ${key}, value = ${value}`);
      updateUserInputData("食事", { ...userInputDataFoodSkill, [key]: value });
    };

    return (
      <>
        {Object.entries(staticData["食事"])
          .filter(([_, value]) => typeof value === "boolean")
          .map(([key, _]) => (
            <GridItemInput item key={key}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={userInputDataFoodSkill[key]}
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

        {Object.entries(staticData["食事"])
          .filter(([_, value]) => typeof value === "object")
          .map(([key, _]) => (
            <GridItemInput item key={key}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{key}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small"
                  value={userInputDataFoodSkill[key]}
                  label={key}
                  onChange={(e) => handleChangeUserInputData(key, e)}
                >
                  {Object.entries(staticData["食事"][key]).map(([_, value]) => (
                    <MenuItem key={key} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </GridItemInput>
          ))}
      </>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.userInputDataFoodSkill, nextProps.userInputDataFoodSkill);
  }
);

export default FoodSkillSetting;
