import React, { useEffect } from "react";
import { Grid, Link, Box } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { NumberTextField } from "./NumberTextField";
import { GridItemInput } from "./DmaxMain";
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
      updateUserInputData("モンスター", { ...userInputDataMonster, [key]: value });
    };

    // 怒り補正が空の場合は1.0を代入
    useEffect(() => {
      if (userInputDataMonster["怒り補正"] === "") {
        updateUserInputData("モンスター", { ...userInputDataMonster, "怒り補正": "1.0" });
      }
    }, [userInputDataMonster, updateUserInputData]);

    return (
      <>
        <GridItemInput item>
          <NumberTextField
            value={userInputDataMonster["物理肉質"]}
            size="small"
            id="outlined-basic"
            label={"物理肉質"}
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
          <NumberTextField
            decimalPoint={true}
            value={userInputDataMonster["怒り補正"]}
            size="small"
            id="outlined-basic"
            label="怒り補正"
            variant="outlined"
            onChange={(e, v) => handleChangeUserInputData("怒り補正", e, v)}
            min={0}
            max={100}
            fullWidth
          />
        </GridItemInput>
        <Grid item xs={12} marginBottom={2}>
          <Box
            color="text.secondary"
            sx={{
              fontSize: "0.8rem",
            }}
          >
            <span>肉質の確認は外部サイトを参考にしてください</span>
          </Box>
          <Box
            color="text.secondary"
            sx={{
              display: "flex",
              justifyContent: "start",
              flexWrap: "wrap",
              columnGap: 1,
              alignItems: "center",
              fontSize: "0.8rem",
            }}
          >
            <Link
              href="https://mhwilds.com/data/4211.html"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.7rem",
              }}
            >
              <span>モンハンワイルズ攻略レシピ</span>
              <OpenInNewIcon sx={{ maxHeight: "16px" }} />
            </Link>
            <Link
              href="https://mhwilds.kiranico.com/ja/data/monsters"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>MHWilds | Kiranico</span>
              <OpenInNewIcon sx={{ maxHeight: "16px" }} />
            </Link>
          </Box>
        </Grid>
      </>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.userInputDataMonster, nextProps.userInputDataMonster);
  }
);

export default MonsterSetting;
