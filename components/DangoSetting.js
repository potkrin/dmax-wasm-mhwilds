import React from "react";
import { Grid, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { staticData } from "../data/StaticData";
import { GridItemInput } from "./DmaxMain";
import { isEqual } from "lodash";

export const DangoSetting = React.memo(
  ({ userInputDataDango, updateUserInputData }) => {
    const handleChangeUserInputData = (key, event, value) => {
      value = event.target.value;
      updateUserInputData("食事", { ...userInputDataDango, [key]: value });
    };

    return (
      <>
        {Object.keys(staticData["食事"]).map((key) => (
          <GridItemInput item key={key}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">{key}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size="small"
                value={userInputDataDango[key]}
                label={key}
                onChange={(e) => handleChangeUserInputData(key, e)}
                sx={{ fontSize: "14px" }}
              >
                {Object.values(staticData["食事"][key]).map((value) => (
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
    return isEqual(prevProps.userInputDataDango, nextProps.userInputDataDango);
  }
);

export default DangoSetting;
