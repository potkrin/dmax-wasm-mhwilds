import React from "react";
import { Grid, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material";

import { staticData } from "../data/StaticData";
import { useStyles, GridItemInput, commonStyles } from "./DmaxMain";
import { isEqual } from "lodash";

// リファクタリング: updateUserInputData を setUserInputData に直せると思う (他のDmaxMainのコンポーネントも)
export const RampageDecoSetting = React.memo(
  ({ userInputDataRampageDeco, updateUserInputData }) => {
    // const classes = useStyles();
    const classes = {};

    const handleChangeUserInputData = (key, event, value) => {
      value = event.target.checked;

      // 劫血活性Lv1 と Lv2 は同時に入力できないようにする
      let toggleKey;
      if (
        key === "劫血活性Lv1" &&
        value === true &&
        userInputDataRampageDeco["劫血活性Lv2"] === true
      )
        toggleKey = "劫血活性Lv2";

      if (
        key === "劫血活性Lv2" &&
        value === true &&
        userInputDataRampageDeco["劫血活性Lv1"] === true
      )
        toggleKey = "劫血活性Lv1";

      updateUserInputData("百竜装飾品", {
        ...userInputDataRampageDeco,
        [key]: value,
        [toggleKey]: false,
      });
    };

    return (
      <>
        {staticData["百竜装飾品"].map((item) => (
          <GridItemInput item key={item}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={userInputDataRampageDeco[item]}
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
    return isEqual(prevProps.userInputDataRampageDeco, nextProps.userInputDataRampageDeco);
  }
);

export default RampageDecoSetting;
