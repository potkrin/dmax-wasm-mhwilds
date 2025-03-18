import React from "react";
import { Grid, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";

import { staticData } from "../data/StaticData";
import { GridItemInput, commonStyles } from "./DmaxMain";
import { isEqual } from "lodash";

export const MelodySetting = React.memo(
  ({ userInputDataMelody, updateUserInputData }) => {
    const handleChangeUserInputData = (key, event, value) => {
      value = event.target.checked;

      // 攻撃旋律と気炎の旋律は同時に入力できないようにする
      let toggleKey;
      if (key === "攻撃旋律" && value === true && userInputDataMelody["気炎の旋律"] === true)
        toggleKey = "気炎の旋律";

      if (key === "気炎の旋律" && value === true && userInputDataMelody["攻撃旋律"] === true)
        toggleKey = "攻撃旋律";

      updateUserInputData("旋律", { ...userInputDataMelody, [key]: value, [toggleKey]: false });
    };

    return (
      <>
        {staticData["旋律"].map((item) => (
          <GridItemInput item key={item}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userInputDataMelody[item]}
                    onChange={(e, v) => handleChangeUserInputData(item, e, v)}
                    size="small"
                  />
                }
                label={<Typography sx={commonStyles.inputCheckbox}>{item}</Typography>}
              />
            </FormGroup>
          </GridItemInput>
        ))}
      </>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.userInputDataMelody, nextProps.userInputDataMelody);
  }
);

export default MelodySetting;
