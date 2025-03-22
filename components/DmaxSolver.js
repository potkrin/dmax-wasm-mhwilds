/* Dmax API呼び出し, wasm-dmax-solver の呼び出し, 出力表示を行うコンポーネント*/

import React from "react";
import { useState, useRef, useEffect, forwardRef, useMemo } from "react";
import { Grid, Card, Fab, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CancelIcon from "@mui/icons-material/Cancel";
import Cookies from "js-cookie";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import useMediaQuery from "@mui/material/useMediaQuery";

import { DmaxOutput } from "./DmaxOutput";
import { DmaxGraph } from "./DmaxGraph";
import { DmaxResult } from "./DmaxResult";
import { armors, decoArmorList, decoWeaponList, weaponList } from "../data/EquipData";
import { staticData } from "../data/StaticData";
import { DmaxHistory } from "./DmaxHistory";
import { applyWaterBlight } from "./HelperFunction";
import { useArtianContext } from "./ArtianContext";
import { useCharmAndQuriousArmorContext } from "./CharmAndQuriousArmorContext";
import { useTheme } from "@mui/material/styles";
import { HideOnScroll } from "./App";
import { useHideOnScroll } from "./HideOnScrollContext";

// dmax-core を呼び出すための処理
let startWasmWorker;

function supportsNestedWebWorkers(updateDmaxOutput) {
  try {
    var blob = new Blob(
      [
        "var worker = new Worker(URL.createObjectURL(new Blob(['self.postMessage(1);'], {type: 'text/javascript'}))); worker.onmessage = function(e) { self.postMessage(e.data); }",
      ],
      { type: "text/javascript" }
    );

    var url = URL.createObjectURL(blob);
    var worker = new Worker(url);

    worker.onmessage = function (e) {
      worker.terminate();
      URL.revokeObjectURL(url);
      if (e.data === 1) {
        console.log("Nested Web Workers are supported");
        updateDmaxOutput("Nested Web Workers are supported");
      } else {
        console.log("Nested Web Workers are not supported");
        updateDmaxOutput("Nested Web Workers are not supported");
      }
    };

    worker.onerror = function () {
      worker.terminate();
      URL.revokeObjectURL(url);
      updateDmaxOutput("Nested Web Workers are not supported");
    };
  } catch (e) {
    updateDmaxOutput("Nested Web Workers are not supported");
  }
}

// limitMemory: true ならメモリ 1GB 制限の wasm バイナリを起動する worker を呼び出す
function call_worker_wasm_main(
  problem_data,
  updateDmaxOutput,
  updateChartData,
  setIsOptimizing,
  limitMemory,
  setMemoryLimit
) {
  supportsNestedWebWorkers(updateDmaxOutput);

  // gonextbench = false;
  if (window.Worker) {
    console.log("webworker enable");

    if (startWasmWorker) {
      startWasmWorker.terminate();
    }

    // メモリ制限を行うかどうか切り替える
    let workerPath = "/dmax-core/worker3.js";
    if (limitMemory) {
      workerPath = "/dmax-core/worker1GB.js";
      setMemoryLimit("1GB");
      localStorage.setItem("wasmWorkerStatus", "memory limit 1GB");
    } else {
      setMemoryLimit("4GB");
      localStorage.setItem("wasmWorkerStatus", "memory limit 4GB");

      // 過去1週間以内に oom 発生記録があれば 1GB 制限の wasm バイナリを起動する
      const data = localStorage.getItem("OutOfMemoryOn4GB");
      if (data) {
        const oomInfo = JSON.parse(data);
        if (oomInfo.oom) {
          const oomTime = new Date(oomInfo.time);
          const now = new Date();
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

          if (oneWeekAgo < oomTime) {
            workerPath = "/dmax-core/worker1GB.js";
            setMemoryLimit("1GB");
            localStorage.setItem("wasmWorkerStatus", "memory limit 1GB");
          }
        }
      }
    }

    console.log("Solve Start TimeStamp: " + new Date().toISOString());
    updateDmaxOutput("Solve Start TimeStamp: " + new Date().toISOString());
    startWasmWorker = new Worker(workerPath, {
      name: "startWasmWorker",
    });

    startWasmWorker.onmessage = function (e) {
      const worker_response = e.data;
      console.log("[DEBUG] message received from worker: " + worker_response);
      updateDmaxOutput(worker_response);

      const lines = worker_response.trim().split("\n");

      for (const line of lines) {
        if (line.includes("s|")) {
          const [time, usedMemory, upperLimit, lowerLimit, gap] = line
            .split("|")
            .map((item) => item.trim());
          console.log({
            time: parseFloat(time.replace("$", "").replace("s", "")),
            usedMemory: usedMemory.replace("M", ""),
            upperLimit: parseFloat(upperLimit),
            lowerLimit: parseFloat(lowerLimit),
            gap: parseFloat(gap),
          });
          updateChartData({
            time: parseFloat(time.replace("$", "").replace("s", "")),
            usedMemory: parseInt(usedMemory.replace("M", "")),
            upperLimit: parseFloat(upperLimit),
            lowerLimit: parseFloat(lowerLimit),
          });
        }
      }
    };

    startWasmWorker.onerror = function (e) {
      const workerError = e.message;
      console.log("error message received from worker: " + workerError);
      console.error("error message received from worker: " + workerError);
      updateDmaxOutput(workerError);
      setIsOptimizing(false);
      // 終了が早すぎると postmessage の受信が中断されてしまうので保留
      // startWasmWorker.terminate();

      // 特定のエラーメッセージに基づいて処理を行う
      if (workerError.includes("RangeError: Out of memory")) {
        // Out of Memory が発生した際の処理
        console.error("RangeError: Out of memory occured on webworker - commonly occurs on iOS");
        console.error("RangeError: Out of memory occured on webworker - throw new Error");

        if (!limitMemory) {
          const oomInfo = { oom: true, time: new Date().toISOString() };
          localStorage.setItem("OutOfMemoryOn4GB", JSON.stringify(oomInfo));
          setMemoryLimit("1GB");
          localStorage.setItem("wasmWorkerStatus", "memory limit 1GB");

          startWasmWorker.terminate();
          // limitMemory が false の場合、limitMemory を true にして再度 wasm-worker を呼び出す
          call_worker_wasm_main(
            problem_data,
            updateDmaxOutput,
            updateChartData,
            setIsOptimizing,
            true,
            setMemoryLimit
          );
        } else {
          // 1GB 制限で Out of Memory が発生した場合、現状はエラーを表示するのみ
          setMemoryLimit("?GB");
          localStorage.setItem("wasmWorkerStatus", "Out of Memory on 1GB wasm-worker");
          updateDmaxOutput("[oom1GB] Out of Memory on 1GB wasm-worker");
        }
      } else if (workerError.includes("Uncaught RuntimeError: Aborted(OOM)")) {
        // worker の起動には成功したが、最適化処理中にメモリが枯渇して処理が中断された場合
        console.log("[Aborted(OOM)]" + workerError);
        updateDmaxOutput("[Aborted(OOM)]" + workerError);
      } else {
        console.error("Unexpected Error Occured: " + workerError);
        updateDmaxOutput("[Unexpected Error] " + workerError);
      }
    };

    // onmessage と onerror のセットが完了したので worker でメインジョブを開始するメッセージを送信
    updateDmaxOutput("webworker launched");
    startWasmWorker.postMessage(["file.nl", 4, 3072, problem_data]);
  } else {
    console.log("Your browser doesn't support web workers.");
    updateDmaxOutput("Your browser doesn't support web workers.");
    updateDmaxOutput("Nested Web Workers are not supported");
  }
}

// worker の非同期処理ではコンテキストが違うためエラーを投げても catch できないので廃止予定

// // リトライ処理付き wasm-worker 呼び出し: Out of Memory が発生した場合、1GBメモリ制限ありで再び wasm-worker を呼び出す
// function wasm_worker_with_retry(
//   problem_data,
//   updateDmaxOutput,
//   updateChartData,
//   setIsOptimizing,
//   setMemoryLimit
// ) {
//   console.log("wasm_worker_with_retry: test with 1GB memory limit wasm-worker");
//   try {
//     // メモリ制限なしで wasm-worker を呼び出す
//     localStorage.setItem("wasmWorkerStatus", "memory limit 4GB");
//     call_worker_wasm_main(
//       problem_data,
//       updateDmaxOutput,
//       updateChartData,
//       setIsOptimizing,
//       false,
//       setMemoryLimit
//     );
//   } catch (e) {
//     console.log("catched error: " + e);
//     if (e.message === "RangeError: Out of memory occured on webworker - commonly occurs on iOS") {
//       // Out of Memory が発生した場合、メモリ制限ありで再び wasm-worker を呼び出す
//       console.log(
//         "RangeError: Out of memory occured on webworker - commonly occurs on iOS occured. try 1GB limited memory wasm-worker"
//       );
//       localStorage.setItem("wasmWorkerStatus", "memory limit 1GB");
//       call_worker_wasm_main(
//         problem_data,
//         updateDmaxOutput,
//         updateChartData,
//         setIsOptimizing,
//         true,
//         setMemoryLimit
//       );
//     } else {
//       localStorage.setItem("wasmWorkerStatus", "unexpected error");
//       setMemoryLimit("unexpected error");
//       console.error("An unexpected error occured: " + e);
//     }
//   }
// }

// CSRFトークンを取得するためのヘルパー関数
// Django 本番環境で必要
function getCsrfToken() {
  // js-cookieを使用する場合は以下の通り
  return Cookies.get("csrftoken");
}

// API送信 Snackbar の表示用
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const DmaxSolver = React.memo(({ userInputData, fabRight }) => {
  // debug: user input data
  useEffect(() => {
    console.log("[dbg] userInputData.武器 = " + JSON.stringify(userInputData["武器"]));
  }, [userInputData]);

  // useTheme() を使用して、テーマのブレークポイントにアクセス
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm")); // 'sm' は600pxに設定されていることが多い

  // dmaxOutput : 最適中の全ての出力
  // middleOutputInfo : dmaxOutput を解析して, 途中経過の出力を抽出したもの
  const [dmaxOutput, setDmaxOutput] = useState("");
  const updateDmaxOutput = (newString) => {
    setDmaxOutput((prevString) => prevString + "\n" + newString);
  };

  const eraseDmaxOutput = (newString) => {
    setDmaxOutput("");
  };

  // 常に最終行を表示
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [dmaxOutput]);

  // dmaxOutput : 最適中の全ての出力
  // allDmaxOutput : 最適化が完了したときのすべての中間出力 (DmaxResult と DmaxHistory で使用)
  const [allDmaxOutput, setAllDmaxOutput] = useState("");
  const updateAllDmaxOutput = (newString) => {
    setAllDmaxOutput(newString);
  };

  useEffect(() => {
    // dmax 最適化が完了したら allDmaxOutput に全ての中間結果を渡す (出力整形は DmaxResult と DmaxHistory コンポーネントで行う)
    if (dmaxOutput.includes("SCIP Status")) {
      updateAllDmaxOutput(dmaxOutput);
      // 最適化完了をボタンに反映
      setIsOptimizing(false);
      // 終了が早すぎると postmessage の受信が中断されてしまうので保留
      // startWasmWorker.terminate();
    }
  }, [dmaxOutput]);

  // 1つ前の dmax 最適化の最終結果を管理
  const [prevMiddleOutput, setPrevMiddleOutput] = useState("");
  const updatePrevMiddleOutput = (newString) => {
    setPrevMiddleOutput(newString);
  };

  // dmax からの中間出力データを管理
  const [chartData, setChartData] = useState([]);
  const updateChartData = (newData) => {
    setChartData((prevData) => {
      console.log(
        "prevData = " + JSON.stringify(prevData) + " newData = " + JSON.stringify(newData)
      );
      // 高すぎる値と低すぎる値を除外
      if (newData.lowerLimit < 0 || newData.upperLimit > 1000) {
        return [...prevData];
      } else {
        return [...prevData, newData];
      }
    });
  };

  const eraseChartData = () => {
    setChartData([]);
  };

  // 最適化ボタンを押した時点の入力データを保存する変数
  const [processingUserInputData, setProcessingUserInputData] = useState({});
  const updateProcessingUserInputData = (newData) => {
    setProcessingUserInputData(newData);
  };

  // 最適化ボタンを押した時点の入力データを保存する変数
  const [processingUserArmorsData, setProcessingUserArmorsData] = useState([]);
  const updateProcessingUserArmorsData = (newData) => {
    setProcessingUserArmorsData(newData);
  };

  // DmaxOutput のリアルタイム中間出力をリセットする state
  const [resetMiddleOutputInfo, setResetMiddleOutputInfo] = useState(false);

  const { serverArtianData } = useArtianContext();

  // DmaxSolverコンポーネントへの参照を作成 (自動スクロールに利用)
  const dmaxSolverRef = useRef(null);

  const [memoryLimit, setMemoryLimit] = useState("?GB");
  const { appBarRef } = useHideOnScroll();
  const { useServerData } = useArtianContext();
  const appBarHeight = appBarRef.current ? appBarRef.current.clientHeight : 0;

  // 最適化の開始
  const startOptimization = () => {
    setResetMiddleOutputInfo(true);

    // 最適化中間結果表示のコンポーネントまで自動でスクロールする
    if (dmaxSolverRef.current) {
      const offset = appBarHeight; // AppBarの高さに相当するオフセット。実際の値に応じて調整してください。
      const elementPosition = dmaxSolverRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset - 64;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    // ローカルサーバーの endpoint (dmax-core)
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax-api/v1/dmax-problem-mhwilds/`;

    // // ローカルサーバーの endpoint (cms)
    // const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/en/cms/dmaxapi/`;

    // // 本番サーバーの endpoint
    // const apiUrl = "https://www.mhrspeedrun.com/en/cms/dmaxapi/"; // en/ja を含めないとリダイレクトレスポンスがCORSポリシーで弾かれる

    // 最適化に含める防具データ定義 (オプションに応じて 護石, 傀異錬成防具を追加)
    const userArmors = JSON.parse(JSON.stringify(armors));

    if (!excludeCharm) {
      // ユーザの護石を全防具データに追加
      // let userCharmData = null;
      let userArtianData = null;
      if (useServerData) {
        // サーバー上の護石データを取得
        // userCharmData = JSON.parse(JSON.stringify(serverCharmData));
        userArtianData = JSON.parse(JSON.stringify(serverArtianData));
      } else {
        // localsotrage から護石データを取得
        // userCharmData = JSON.parse(localStorage.getItem("userCharmData"));
        userArtianData = JSON.parse(localStorage.getItem("userArtianData"));
      }
      // if (userCharmData !== null) userArmors.push(...userCharmData);
      // if (userArtianData !== null) userArmors.push(...userArtianData);
    }

    const tempUserInputData = JSON.parse(JSON.stringify(userInputData));

    // CSRFトークンを取得
    const csrfToken = getCsrfToken();

    setApiError(false);

    // ダメージ検証用のデータを出力
    const problemAPIBody = JSON.stringify({
      userInputData: tempUserInputData,
      armors: userArmors,
      decoArmorList: decoArmorList,
      decoWeaponList: decoWeaponList,
      // weaponList: weaponList,
      staticData: staticData,
    });

    console.log("[damage verification result]: api body\n" + problemAPIBody);

    fetch(apiUrl, {
      method: "POST",
      credentials: "include", // クッキーベースの認証に必要
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        userInputData: tempUserInputData,
        armors: userArmors,
        decoArmorList: decoArmorList,
        decoWeaponList: decoWeaponList,
        // weaponList: weaponList,
        staticData: staticData,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // 前回の最終結果用データを隣に移動
        // updatePrevMiddleOutput(allDmaxOutput);
        updateAllDmaxOutput("");

        // 前回の中間出力データを消去
        eraseDmaxOutput();
        eraseChartData();

        call_worker_wasm_main(
          data,
          updateDmaxOutput,
          updateChartData,
          setIsOptimizing,
          false,
          setMemoryLimit
        );
        // wasm_worker_with_retry(
        //   data,
        //   updateDmaxOutput,
        //   updateChartData,
        //   setIsOptimizing,
        //   setMemoryLimit
        // );
      })
      .catch((error) => {
        setOpenStart(false);
        setOpenError(true);
        console.log(`Fetching from ${apiUrl} failed: ${error.message}`);
        updateAllDmaxOutput(`Fetching from ${apiUrl} failed: ${error.message}`);
      });

    // ボタンを押した時点の入力データを保存する
    // = 代入や Object.assign() では浅いコピーしか行われないので JSON を経由して深いコピーを行う
    // 同期処理のためデータが大きい場合、メインスレッドがハングする可能性がある

    updateProcessingUserInputData(JSON.parse(JSON.stringify(userInputData)));
    updateProcessingUserArmorsData(JSON.parse(JSON.stringify(userArmors)));
  };

  // 最適化の中断
  const stopOptimization = () => {
    if (startWasmWorker) {
      startWasmWorker.terminate();
    }
  };

  // 最適化ボタンをトグルする
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleToggle = () => {
    if (isOptimizing) {
      // ユーザ入力による中断の場合メッセージを追加(表示への反映に利用)
      updateDmaxOutput("[User Interrupt] optimization stopped");
      stopOptimization();
    } else {
      startOptimization();
    }

    // state の更新は非同期に行われる点に注意 (setIsOptimizing 直後に if (isOptimizing) 等としても反映されない)
    setIsOptimizing(!isOptimizing);
  };

  useEffect(() => {
    console.log("fabRight = " + fabRight + "typeof(fabRight) = " + typeof fabRight);
  }, [fabRight]);

  // 傀異錬成防具と護石を最適化から除外するオプション
  const { excludeCharm, setExcludeCharm, excludeQuriousArmor, setExcludeQuriousArmor } =
    useCharmAndQuriousArmorContext();
  const handleExcludeQuriousArmor = (e, v) => {
    setExcludeQuriousArmor(e.target.checked);
  };
  const handleExcludeCharm = (e, v) => {
    setExcludeCharm(e.target.checked);
  };

  // API Snackbar 表示用
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [apiError, setApiError] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [openError, setOpenError] = useState(false);

  const mounted = useRef(false);

  useEffect(() => {
    // マウント時は何もしない
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (isOptimizing) {
      setSnackbarMessage("最適化を開始しました");
      setOpenStart(true);
    }
  }, [isOptimizing]);

  const handleCloseStart = () => {
    setOpenStart(false);
  };

  const handleCloseError = () => {
    setOpenError(false);
  };

  // Fab コンポーネントの表示状態を制御するための状態
  const [showFab, setShowFab] = useState(false);

  // コンポーネントのマウント後に遅延して Fab を表示する
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFab(true);
    }, 500); // 500ミリ秒後に実行

    const wasmWorkerStatus = localStorage.getItem("wasmWorkerStatus");
    if (wasmWorkerStatus === "memory limit 4GB") {
      setMemoryLimit("4GB");
    } else if (wasmWorkerStatus === "memory limit 1GB") {
      setMemoryLimit("1GB");
    } else {
      setMemoryLimit("?GB");
    }

    // コンポーネントのアンマウント時にタイマーをクリアする
    return () => clearTimeout(timer);
  }, []); // 空の依存配列でマウント時のみ実行

  return useMemo(
    () => (
      <>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 1,
            minHeight: "400px",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "8px",
            marginBottom: 1,
          }}
        >
          <Grid ref={dmaxSolverRef} container spacing={0} marginY={1} sx={{ minHeight: "400px" }}>
            <DmaxOutput
              dmaxOutput={dmaxOutput}
              resetMiddleOutputInfo={resetMiddleOutputInfo}
              setResetMiddleOutputInfo={setResetMiddleOutputInfo}
              memoryLimit={memoryLimit}
            />
            <DmaxGraph chartData={chartData} memoryLimit={memoryLimit} />
          </Grid>
        </Card>
        {/* 
          PC表示 では DmaxResult と DmaxHistory のうちより高い方に高さを合わせる (スマホは縦列なので関係なし)
          <Grid minHeight: "800px">
              <DmaxResult height: "100%" >
                <Paper height: "100%">
                  <Box height: "100%">
                    <高さが変わるコンテンツ>
              
              <DmaxHistory height: "100%">
                <Paper height: "100%">
                  <Box height: "100%">
                    <高さが変わるコンテンツ>
      */}
        <Card variant="outlined" sx={{ borderRadius: 1, height: "100%", width: "100%" }}>
          <Grid container spacing={1} marginY={0} sx={{ minHeight: "600px" }}>
            <DmaxResult
              allDmaxOutput={allDmaxOutput}
              processingUserInputData={processingUserInputData}
              processingUserArmorsData={processingUserArmorsData}
            />
            <DmaxHistory allDmaxOutput={allDmaxOutput} />
          </Grid>
        </Card>

        <Snackbar
          open={openError}
          autoHideDuration={6000}
          onClose={handleCloseError}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
            APIの送受信に失敗しました
          </Alert>
        </Snackbar>

        {showFab && matches && (
          <HideOnScroll direction="up">
            <Fab
              variant={"extended"}
              sx={{
                position: "fixed",
                bottom: "96px",
                // right: "48px",
                right: "24px",
                animation: "fadeIn 0.5s ease-in-out",
              }}
              color="primary"
              size="medium"
              onClick={handleToggle}
            >
              {isOptimizing ? (
                <>
                  <CancelIcon />
                  {<Box sx={{ ml: 1 }}>中止</Box>}
                </>
              ) : (
                <>
                  <TrendingUpIcon />
                  {<Box sx={{ ml: 1 }}>最適化</Box>}
                </>
              )}
            </Fab>
          </HideOnScroll>
        )}
        {showFab && !matches && (
          <Fab
            variant={"extended"}
            sx={{
              position: "fixed",
              bottom: "48px",
              // right: "48px",
              right: `${fabRight}px`,
              animation: "fadeIn 0.5s ease-in-out",
            }}
            color="primary"
            size="large"
            onClick={handleToggle}
          >
            {isOptimizing ? (
              <>
                <CancelIcon />
                {<Box sx={{ ml: 1 }}>中止</Box>}
              </>
            ) : (
              <>
                <TrendingUpIcon />
                {<Box sx={{ ml: 1 }}>最適化</Box>}
              </>
            )}
          </Fab>
        )}
      </>
    ),
    [
      useServerData,
      excludeCharm,
      setExcludeCharm,
      excludeQuriousArmor,
      setExcludeQuriousArmor,
      dmaxOutput,
      memoryLimit,
      isOptimizing,
      showFab,
      snackbarMessage,
      openError,
      allDmaxOutput,
      userInputData,
      fabRight,
    ]
  );
});

export default DmaxSolver;
