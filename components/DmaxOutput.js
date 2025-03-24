import React, { useEffect, useState, useMemo } from "react";
import {
  Grid,
  Box,
  Card,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  ButtonGroup,
  Tooltip,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import MiddleOutput from "./MiddleOutput";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import CloudIcon from "@mui/icons-material/Cloud";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import DevicesIcon from "@mui/icons-material/Devices";
import CancelIcon from "@mui/icons-material/Cancel";
import MemoryIcon from "@mui/icons-material/Memory";
import { commonStyles, useStyles } from "./DmaxMain";
import { useLoginContext } from "./LoginContext";
import { useCharmAndQuriousArmorContext } from "./CharmAndQuriousArmorContext";
import { useTheme } from "@mui/material/styles";
import { theme, breakpoints } from "../src/theme";
import OptimizationOptionButtons from "./OptimizationOptionButtons";

const defaultMiddleOutputInfo = {
  "launch": {
    "title": "起動",
    "status": "waiting",
    "message": "",
  },
  "load": {
    "title": "ロード",
    "status": "waiting",
    "message": "",
  },
  "preprocess": {
    "title": "前処理",
    "status": "waiting",
    "message": "",
  },
  "solverStart": {
    "title": "並列ソルバ起動",
    "status": "waiting",
    "message": "",
  },
  "solve": {
    "title": "最適化",
    "status": "waiting",
    "message": "",
  },
  "solverEnd": {
    "title": "終了処理",
    "status": "waiting",
    "message": "",
  },
};

function updateMiddleOutputInfo(setMiddleOutputInfo, dmaxOutput, middleOutputInfo) {
  const lines = dmaxOutput.trim().split("\n");

  let launchMessage = "";
  let loadMessage = "";
  let presolveMessage = "";
  let solverStartMessage = "";
  let solveMessage = "";
  let solverEndMessage = "";

  let launchStatus = "waiting";
  let loadStatus = "waiting";
  let presolveStatus = "waiting";
  let solverStartStatus = "waiting";
  let solveStatus = "waiting";
  let solverEndStatus = "waiting";

  let isInterrupted = false;

  for (const line of lines) {
    if (line.startsWith("Nested Web Workers are supported"))
      launchMessage += "Nested WebWorker 有効\n";

    if (line.startsWith("webworker launched")) {
      launchMessage += "WebWorker 起動完了\n";
      launchStatus = "complete";
      loadStatus = "running";
    }

    if (line.startsWith("Nested Web Workers are not supported")) {
      launchMessage += "Nested WebWorker がサポートされていません\n";
      launchStatus = "error";
      loadStatus = "waiting";
    }

    if (line.startsWith("Your browser does not support Web Workers")) {
      launchMessage += "WebWorker がサポートされていません\n";
      launchStatus = "error";
      loadStatus = "waiting";
    }

    if (line.startsWith("Uncaught Error: SharedArrayBuffer is not defined")) {
      launchMessage += "SharedArrayBuffer が定義されていません\n";
      launchStatus = "error";
      loadStatus = "waiting";
    }

    // oom on 1GB webworker
    if (line.startsWith("[oom1GB]")) {
      launchMessage += "予期せぬエラーが発生しました\n" + line;
      launchStatus = "error";
      loadStatus = "waiting";
    }

    if (line.startsWith("original problem has ")) {
      // 正規表現を使って、数字以外の全ての文字を削除
      const variablesCount = line.slice(0, line.indexOf("variables")).replace(/\D/g, "");
      const constraintsCount = line
        .slice(line.indexOf(") and"), line.indexOf("costraints"))
        .replace(/\D/g, "");
      loadMessage = "元問題 変数: " + variablesCount + ", 制約式: " + constraintsCount;
      loadStatus = "complete";
    }

    // 前処理中の中間出力を更新
    // prettier-ignore
    if (line.startsWith('(round')) {
      const roundNumber = line.slice(line.indexOf('('), line.indexOf(')') + 1);
      const deletedVariables = line.slice(line.indexOf(')'), line.indexOf('del vars')).replace(/\D/g, '');
      const deletedConstraints = line.slice(line.indexOf('del vars'), line.indexOf('del conss')).replace(/\D/g, '');
      const addedConstraints = line.slice(line.indexOf('del conss'), line.indexOf('add conss')).replace(/\D/g, '');
      const changedBounds = line.slice(line.indexOf('add conss'), line.indexOf('chg bounds')).replace(/\D/g, '');
      const changedCoefficients = line.slice(line.indexOf('chg bounds'), line.indexOf('chg coeffs')).replace(/\D/g, '');
      const updatedConstraints = line.slice(line.indexOf('chg coeffs'), line.indexOf('upgd conss')).replace(/\D/g, '');
      presolveMessage = `${roundNumber}\n削除変数: ${deletedVariables}, 削除制約式: ${deletedConstraints}, 追加制約式: ${addedConstraints}, 範囲変更: ${changedBounds}, 係数変更: ${changedCoefficients}, 制約改善: ${updatedConstraints} \n`
      presolveStatus = "running";
    }

    // 前処理完了時の出力処理
    // prettier-ignore
    if (line.startsWith("presolved problem has")) {
      const variablesCount = line.slice(0, line.indexOf("variables")).replace(/\D/g, "");
      const constraintsCount = line.slice(line.indexOf(") and ")).replace(/\D/g, "");
      presolveMessage = `変数: ${variablesCount}, 制約式: ${constraintsCount}\n`;
    }

    if (line.startsWith("Presolving Time:")) {
      let presolvingTime = line.match(/\d+\.\d+/)[0];
      presolveMessage += `前処理時間: ${presolvingTime}秒\n`;
      // presolveComplete = true;
      presolveStatus = "complete";
      solverStartStatus = "running";
    }

    // 並列ソルバー起動処理の出力
    if (line.startsWith("starting solve in concurrent solver")) {
      const solverNumber = line.replace(/\D/g, "");
      solverStartMessage += `${solverNumber} `;
      solverStartStatus = "complete";
      solveStatus = "running";

      // setMiddleOutputInfo((prevMiddleOutputInfo) => {
      //   return {
      //     ...prevMiddleOutputInfo,
      //     "solverStart": {
      //       ...prevMiddleOutputInfo["solverStart"],
      //       "message": solverStartMessage,
      //       "status": "complete",
      //     },
      //     "solve": {
      //       ...prevMiddleOutputInfo["solve"],
      //       "status": "running",
      //     },
      //   };
      // });
    }

    // 並列ソルバーの中間出力
    if (line.match(/.*s\|.*M\|.*/)) {
      const variables = line.split("|");
      const time = variables[0].slice(0, variables[0].indexOf(".")).replace(/\D/g, "");
      const memory = variables[1] + "B";

      let dualbound = variables[2];
      if (dualbound.match(/.*\d/)) {
        dualbound = Math.round(parseFloat(dualbound) * 100) / 100;
      }

      let primalbound = variables[3];
      if (primalbound.match(/.*\d/)) {
        primalbound = Math.round(parseFloat(primalbound) * 100) / 100;
      }

      let gap = variables[4];
      gap = gap.slice(0, gap.indexOf("%") + 1);

      solveMessage = `${time}秒, 使用メモリ:${memory}, ダメージ上界: ${dualbound}, ダメージ下界: ${primalbound}, ギャップ: ${gap}`;
      solveStatus = "running";
      solverStartStatus = "complete";
    }

    // SCIP ソルバー実行終了後の状態
    if (line.startsWith("SCIP Status")) {
      // 出力に問題がなければ complete とする
      solverStartStatus = "complete";
      solverEndStatus = "complete";

      let scipStatus, statusReason;
      if (line.includes("interrupted")) {
        scipStatus = "最適化中断";
        solverEndStatus = "interrupted";
      } else if (line.includes("solved")) {
        scipStatus = "最適化完了";
      } else {
        scipStatus = "未定義";
        solverEndStatus = "error";
      }

      if (line.includes("user interrupt")) {
        statusReason = "ユーザーによる中断されました";
        solverEndStatus = "interrupted";
      } else if (line.includes("node limit reached")) {
        statusReason = "ノード限界に到達しました";
        solverEndStatus = "interrupted";
      } else if (line.includes("time limit reached")) {
        statusReason = "制限時間に到達しました";
        solverEndStatus = "interrupted";
      } else if (line.includes("memory limit reached")) {
        statusReason = "メモリ上限に到達しました";
        solverEndStatus = "interrupted";
      } else if (line.includes("gap limit reached")) {
        statusReason = "ギャップの限界に到達しました";
        solverEndStatus = "interrupted";
      } else if (line.includes("optimal solution found")) {
        statusReason = "最適解が見つかりました";
      } else if (line.includes("infeasible")) {
        statusReason = "装備が組めませんでした  条件を緩和してください";
        solverEndStatus = "interrupted";
      } else if (line.includes("unbounded")) {
        statusReason = "問題が非有界です";
        solverEndStatus = "interrupted";
      } else if (line.includes("iteration limit reached")) {
        statusReason = "反復回数の上限に到達しました";
        solverEndStatus = "interrupted";
      }

      solverEndMessage = `${scipStatus}: ${statusReason}\n`;
      if (scipStatus === "最適化完了") solveStatus = "complete";
    }

    // 合計処理時間
    if (line.startsWith("Solving Time")) {
      const solvingTime = line.slice(line.indexOf(":"), line.indexOf("."));
      solverEndMessage += `合計処理時間 ${solvingTime}秒`;
    }

    if (line.startsWith("[Aborted(OOM)]")) {
      solveStatus = "error";
      solveMessage += "\nメモリ不足のため最適化が中断されました";
    }

    if (line.startsWith("[User Interrupt] optimization stopped")) isInterrupted = true;

    // 予期せぬエラーが発生した場合
    if (line.includes("[Unexpected Error]")) {
      solverEndMessage = line;
      solverEndStatus = "unexpected error";

      // running 状態の status があれば error に更新
      // ステータスを格納するオブジェクト
      let statuses = {
        launchStatus,
        loadStatus,
        presolveStatus,
        solverStartStatus,
        solveStatus,
      };

      // 各ステータスをチェックし、"running" 状態のものがあれば "error" に更新
      Object.keys(statuses).forEach((key) => {
        if (statuses[key] === "running") {
          statuses[key] = "error";
        }
      });

      // 更新された値を元の変数に反映
      ({ launchStatus, loadStatus, presolveStatus, solverStartStatus, solveStatus } = statuses);
    }
  }

  const nextMiddleOutputInfo = {
    ...middleOutputInfo,
    "launch": {
      ...middleOutputInfo["launch"],
      "message": launchMessage,
      "status": launchStatus,
    },
    "load": {
      ...middleOutputInfo["load"],
      "status": loadStatus,
      "message": loadMessage,
    },
    "preprocess": {
      ...middleOutputInfo["preprocess"],
      "status": presolveStatus,
      "message": presolveMessage,
    },
    "solverStart": {
      ...middleOutputInfo["solverStart"],
      "status": solverStartStatus,
      "message": solverStartMessage,
    },
    "solve": {
      ...middleOutputInfo["solve"],
      "status": solveStatus,
      "message": solveMessage,
    },
    "solverEnd": {
      ...middleOutputInfo["solverEnd"],
      "title": solverEndStatus === "unexpected error" ? "予期しないエラーが発生" : "終了処理",
      "status": solverEndStatus,
      "message": solverEndMessage,
    },
  };

  if (isInterrupted) {
    for (let key in nextMiddleOutputInfo) {
      if (nextMiddleOutputInfo[key]["status"] === "running") {
        nextMiddleOutputInfo[key]["status"] = "interrupted";
        nextMiddleOutputInfo[key]["message"] = "ユーザー入力によって中断されました";
      }
    }
  }

  // setMiddleOutputInfo((prevMiddleOutputInfo) => {
  //   return nextMiddleOutputInfo;
  // });

  setMiddleOutputInfo(nextMiddleOutputInfo);
  console.log("print middle=" + JSON.stringify(nextMiddleOutputInfo));
}

export const DmaxOutput = React.memo(
  ({ dmaxOutput, resetMiddleOutputInfo, setResetMiddleOutputInfo, memoryLimit }) => {
    // const classes = useStyles();
    const classes = {};

    const initMiddleOutputInfo = JSON.parse(JSON.stringify(defaultMiddleOutputInfo));
    // dmaxOutput : 最適中の全ての出力をリアルタイム更新
    // middleOutputInfo : dmaxOutput を解析してリアルタイムで表示する中間出力
    const [middleOutputInfo, setMiddleOutputInfo] = useState(initMiddleOutputInfo);

    const { checkLoginStatus } = useLoginContext();

    useEffect(() => {
      updateMiddleOutputInfo(setMiddleOutputInfo, dmaxOutput, middleOutputInfo);
    }, [dmaxOutput]);

    useEffect(() => {
      if (resetMiddleOutputInfo) {
        setMiddleOutputInfo(initMiddleOutputInfo);
        setResetMiddleOutputInfo(false);
      }
    }, [resetMiddleOutputInfo]);

    const { handleChangeCharmValue, handleChangeQuriousArmorValue } =
      useCharmAndQuriousArmorContext();

    const matches = useMediaQuery("(max-width: " + breakpoints.values.sm + "px)"); // 'sm' は600pxに設定されていることが多い

    const useServerCharm = () => {
      checkLoginStatus();
      handleChangeCharmValue(null, 1);
    };

    const useServerQuriousArmor = () => {
      checkLoginStatus();
      handleChangeQuriousArmorValue(null, 1);
    };

    return useMemo(
      () => (
        <Grid item xs={12} md={5.9}>
          <Box
            style={{
              minHeight: "400px",
              height: "100%",
              // overflowY: "auto",
              padding: "8px",
              textAlign: "left",
              width: "100%",
            }}
          >
            <Grid container alignItems="center" sx={{ padding: "4px 8px" }}>
              <Grid item>
                <TrendingUpIcon sx={{ marginTop: "4px" }} color="primary" />
              </Grid>
              <Grid item xs>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: "8px" }}>
                  最適化
                </Typography>
              </Grid>
            </Grid>
            <Divider />

            {/* <Grid container marginTop={0}>
            <Grid
              item
              container
              xs
              justifyContent="flex-end"
              alignItems="center"
              sx={{ marginRight: 1 }}
            >
              <Typography
                sx={{
                  color: theme.vars.palette.text.hint,
                  paddingRight: "0.5rem",
                  alignItems: "center",
                }}
              >
                メモリ上限 {memoryLimit}
              </Typography>
              <MemoryIcon sx={{ color: theme.vars.palette.text.hint }} />
            </Grid>
          </Grid> */}

            <Grid container marginTop={0}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    margin: 1.5,
                    marginLeft: 2.0,
                    marginBottom: 4,
                    marginTop: 2,
                    minHeight: matches ? "" : "400px",
                    height: "100%",
                  }}
                >
                  <MiddleOutput middleOutput={middleOutputInfo.launch} memoryLimit={memoryLimit} />
                  <MiddleOutput middleOutput={middleOutputInfo.load} />
                  <MiddleOutput middleOutput={middleOutputInfo.preprocess} />
                  <MiddleOutput middleOutput={middleOutputInfo.solverStart} />
                  <MiddleOutput middleOutput={middleOutputInfo.solve} />
                  <MiddleOutput middleOutput={middleOutputInfo.solverEnd} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      ),
      [
        checkLoginStatus,
        handleChangeCharmValue,
        handleChangeQuriousArmorValue,
        dmaxOutput,
        memoryLimit,
        middleOutputInfo,
      ]
    );
  }
);

export default DmaxOutput;
