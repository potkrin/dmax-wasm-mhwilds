import React from "react";
import { Grid, Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export const NonDamageSkill = ({ staticSkillData, userInputData, updateUserInputData }) => {
  const handleChangeNonDamageSkillInfo = (key, event, value) => {
    updateUserInputData("スキル", {
      ...userInputData["スキル"],
      [staticSkillData.name]: {
        ...userInputData["スキル"][staticSkillData.name],
        [key]: event.target.value,
      },
    });
  };

  return (
    <>
      <Grid item xs style={{ maxWidth: "150px", minWidth: "150px" }}>
        <Box margin={1}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{staticSkillData.name}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={userInputData["スキル"][staticSkillData.name].minLevel}
              label={staticSkillData.name}
              onChange={(e, v) => handleChangeNonDamageSkillInfo("minLevel", e, v)}
            >
              {Array.from({ length: staticSkillData.maxLevel + 1 }, (_, i) => (
                <MenuItem value={i}>Lv{i}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Grid>
    </>
  );
};

export default NonDamageSkill;
