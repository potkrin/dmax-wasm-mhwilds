import React from "react";
import { Button, Grid, ButtonGroup } from "@mui/material";
import DiamondIcon from "@mui/icons-material/Diamond";
import { useTheme } from "@mui/material/styles";
import theme from "../src/theme";

export function SlotLevels({ slotLevel, setSlotLevel }) {
  const slotLevels = [0, 1, 2, 3, 4];

  return (
    <>
      <Grid container alignItems="center">
        <Grid item xs={1.3}>
          <DiamondIcon color="primary" />
        </Grid>
        <Grid item>
          <ButtonGroup color="primary" variant="outlined" aria-label="radio button group">
            {slotLevels.map((level) => (
              <Button
                key={level}
                onClick={() => setSlotLevel(level)}
                sx={{
                  backgroundColor: slotLevel === level ? theme.vars.palette.primary.main : "",
                  borderRight: "1px solid " + theme.vars.palette.primary.main + "!important",
                  color: slotLevel === level ? theme.vars.palette.primary.contrastText : "",

                  "&:hover": {
                    backgroundColor:
                      slotLevel === level
                        ? theme.vars.palette.primary.dark
                        : theme.vars.palette.action.hover,
                    borderRight: "1px solid " + theme.vars.palette.primary.main + "!important",
                  },
                }}
              >
                {level}
              </Button>
            ))}
          </ButtonGroup>
        </Grid>
      </Grid>
    </>
  );
}

export default SlotLevels;
