import React from "react";
import { Grid, Button, Typography, Divider, IconButton } from "@mui/material";
import { staticSkillData } from "../data/StaticData";
import Add from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ClearIcon from "@mui/icons-material/Clear";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";

export const SkillCard = React.memo(
  ({ skill, setSelectedSkills, handleInnateSkill, onRemove, allowRemove, noDivider = false }) => {
    const updateSkillLevel = (level) => {
      if (allowRemove) {
        setSelectedSkills((prev) => {
          const newSkills = [...prev];
          newSkills[prev.indexOf(skill)] = { ...skill, level: level };
          return newSkills;
        });
      } else {
        handleInnateSkill(skill.name, level);
      }
    };

    return (
      <>
        {staticSkillData[skill.name] && (
          <>
            <Grid container alignItems="center" sx={{ marginY: 1 }}>
              <Grid item xs={1}>
                <LabelImportantIcon color="primary" />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ textAlign: "left" }}>
                  {skill.name} Lv.{skill.level}
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <IconButton
                  color="primary"
                  disabled={skill.level < 1}
                  onClick={() => updateSkillLevel(skill.level - 1)}
                >
                  <IndeterminateCheckBoxOutlinedIcon sx={{ width: "28px", height: "28px" }} />
                </IconButton>

                {/* <Button
                disabled={skill.level < 1}
                onClick={() => updateSkillLevel(skill.level - 1)}
                variant="outlined"
              >
                <RemoveIcon />
              </Button> */}
              </Grid>
              <Grid item xs={1.5}>
                <IconButton
                  color="primary"
                  disabled={staticSkillData[skill.name]["maxLevel"] <= skill.level}
                  onClick={() => updateSkillLevel(skill.level + 1)}
                >
                  <AddBoxOutlinedIcon sx={{ width: "28px", height: "28px" }} />
                </IconButton>

                {/* <Button
                disabled={staticSkillData[skill.name]["maxLevel"] <= skill.level}
                onClick={() => updateSkillLevel(skill.level + 1)}
                variant="outlined"
              >
                <Add />
              </Button> */}
              </Grid>
              {allowRemove && (
                <Grid item xs={2}>
                  <Button onClick={onRemove}>
                    <ClearIcon />
                  </Button>
                </Grid>
              )}
            </Grid>
            {!noDivider && <Divider />}
          </>
        )}
      </>
    );
  }
);

export default SkillCard;
