import React, { useEffect } from "react";
import { Grid, Card, Box, Typography, Divider, useMediaQuery } from "@mui/material";

import { decoArmorList, decoWeaponList, weaponList } from "../data/EquipData";
import { staticSkillData } from "../data/StaticData";
import CopyToClipboardButton from "./CopyToClipboardButton";
import InsightsIcon from "@mui/icons-material/Insights";
import theme from "../src/theme";

// 秒を読みやすい形式に変換
function secondsToHumanReadable(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const daysSeconds = days * 24 * 60 * 60;
  seconds = seconds > daysSeconds ? seconds - daysSeconds : seconds;

  const hours = Math.floor(seconds / (60 * 60));
  const hoursSeconds = hours * 60 * 60;
  seconds = seconds > hoursSeconds ? seconds - hoursSeconds : seconds;

  const minutes = Math.floor(seconds / 60);
  const minutesSeconds = minutes * 60;
  seconds = seconds > minutesSeconds ? seconds - minutesSeconds : seconds;

  let result = "";
  if (days > 0) result += days + "日 ";
  if (hours > 0 || days > 0) result += hours + "時間 ";
  if (minutes > 0 || hours > 0 || days > 0) result += minutes + "分 ";
  result += seconds + "秒";

  return result.trim();
}

// TODO: リファクタリング案
// outputToResult は DmaxSolver に移動して DmaxResult 表示のみにしたほうがいいかも
// スマホ表示用にDmaxResultを消して DmaxHistory に一本化したところ、結果が処理されなくなってしまったため

// 全ての中間結果を含む文字列を処理し、最終結果を出力する
export function outputToResult(output, processingUserInputData, processingUserArmorsData) {
  let result = "";
  let timeStamp = "";
  if (output.includes("SCIP Status") && output.includes("nlobjvar")) {
    // ダメージ検証のために出力を追加
    let damageVerificationLines = output.split("\n");
    let damageVerificationResult = "";
    for (let line of damageVerificationLines) {
      if (
        line.startsWith("x[") ||
        line.startsWith("q[") ||
        line.startsWith("afr") ||
        line.startsWith("nlobjvar")
      ) {
        damageVerificationResult += line + "\n";
      }
    }
    console.log("[damage verification result]:\n" + damageVerificationResult);
    // ダメージ検証のために出力を追加 ここまで

    let lines = output.split("\n");

    const list_q_result = [];
    const dict_other_result = {};

    lines.forEach((line) => {
      if (line.startsWith("Solve Start TimeStamp:")) {
        timeStamp = line.slice(line.indexOf(":") + 2);
        console.log("extracted time stamp is: " + timeStamp);
      }
      if (line.startsWith("SCIP Status")) {
        let scip_status = "";
        let status_reason = "";

        if (line.includes("interrupted")) {
          scip_status = "最適化中断";
        } else if (line.includes("solved")) {
          scip_status = "最適化完了";
        } else {
          scip_status = "未定義";
        }

        if (line.includes("user interrupt")) {
          status_reason = "ユーザーによる中断されました";
        } else if (line.includes("node limit reached")) {
          status_reason = "ノード限界に到達しました";
        } else if (line.includes("time limit reached")) {
          status_reason = "制限時間に到達しました";
        } else if (line.includes("memory limit reached")) {
          status_reason = "メモリ上限に到達しました";
        } else if (line.includes("gap limit reached")) {
          status_reason = "ギャップの限界に到達しました";
        } else if (line.includes("optimal solution found")) {
          status_reason = "最適解が見つかりました";
        } else if (line.includes("infeasible")) {
          status_reason = "装備が組めませんでした  条件を緩和してください";
        } else if (line.includes("unbounded")) {
          status_reason = "問題が非有界です";
        } else if (line.includes("iteration limit reached")) {
          status_reason = "反復回数の上限に到達しました";
        }

        result = `[最適化終了]\n${scip_status}: ${status_reason}\n`;
      }

      if (line.startsWith("Solving Time")) {
        let solving_time = line.substring(line.indexOf(":") + 1, line.indexOf("."));
        solving_time = secondsToHumanReadable(parseInt(solving_time));
        result += `合計処理時間: ${solving_time}\n\n\n`;
      }

      // 最終結果の出力を処理
      // q[ で開始される行 = 最大ダメージを実現する 装備の名称と個数
      if (line.startsWith("q[")) {
        list_q_result.push(line);
      }

      // 最大ダメージ
      if (line.startsWith("objective value:")) {
        const max_damage_result = line.slice(line.indexOf(":") + 1, line.indexOf("("));
        dict_other_result["最大ダメージ"] = parseFloat(max_damage_result).toFixed(3).toString();
      }

      // 疾替えの書
      if (line.startsWith("ss[")) {
        const swap_scroll_result = line.slice(3, line.indexOf("]"));
        dict_other_result["疾替えの書"] = swap_scroll_result;
      }

      // 会心率
      if (line.startsWith("afr")) {
        const affinity_rate_result = parseFloat(line.slice(3, line.indexOf("(")));
        dict_other_result["会心率"] = affinity_rate_result.toString() + "%";
      }
    });

    // 全装備データ(防具･護石･装飾品) を名前で引ける辞書を作成
    const dictEquipAll = {};

    for (let eq of processingUserArmorsData) {
      dictEquipAll[eq.name] = eq;
    }

    for (let deco of decoArmorList) {
      dictEquipAll[deco.name] = deco;
    }

    for (let deco of decoWeaponList) {
      dictEquipAll[deco.name] = deco;
    }

    for (let weapon of weaponList) {
      dictEquipAll[weapon.name] = weapon;
    }

    const userArtianData = JSON.parse(localStorage.getItem("userArtianData"));
    if (userArtianData) {
      for (let artian of userArtianData) {
        dictEquipAll[artian.name] = artian;
      }
    }

    // 出力結果の装備(防具･護石･装飾品)とその数を保持する辞書
    const dictResultEquipment = {};

    // 防具や装飾品の数が反映できていない
    for (let q of list_q_result) {
      let qEquipName = q.slice(2, q.indexOf("]"));
      qEquipName = qEquipName.replace(/'/g, "");
      let qEquipCount = q.slice(q.indexOf("]") + 1, q.indexOf("(obj"));
      qEquipCount = Math.round(parseFloat(qEquipCount));

      // 数が0 の装備は除外
      if (qEquipCount === 0) {
        console.log("!! count == 0 found. skip !!");
        continue;
      }

      // 名前が見つからない装備は除外
      let qEquipInfo = {};
      if (!(qEquipName in dictEquipAll)) {
        if (qEquipName !== "WeaponSlot")
          console.log(`!! armor name ${qEquipName} NOT found. skip !!`);
        continue;
      } else {
        qEquipInfo = dictEquipAll[qEquipName];
      }

      const slotLevel =
        qEquipInfo.type === "decoArmor" || qEquipInfo.type === "decoWeapon" ? qEquipInfo.size : -1;

      dictResultEquipment[qEquipName] = {
        count: Math.round(parseFloat(qEquipCount)),
        eqDict: qEquipInfo,
        decoSlotLevel: slotLevel,
      };
    }

    // 最大ダメージ, 会心率などの出力
    for (const key in dict_other_result) {
      result += key + ": " + dict_other_result[key] + "\n";
    }

    // 部位の出力
    result += "\n[装備構成]\n";
    const eqtypeDict = {
      weapon: "武器",
      head: "頭",
      torso: "胴",
      arms: "腕",
      waist: "腰",
      legs: "脚",
      charm: "護石",
    };
    for (const eqtype in eqtypeDict) {
      for (const req in dictResultEquipment) {
        const slot_str = dictResultEquipment[req].eqDict.slots?.join("-");
        if (eqtype === dictResultEquipment[req].eqDict.type) {
          result += eqtypeDict[eqtype] + ": " + req + " (" + slot_str + ")" + "\n";
        }
      }
    }

    result += "\n[装飾品 武器]\n";
    // 装飾品の出力 (スロレベル順)
    const slotLevels = [4, 3, 2, 1];
    for (const level of slotLevels) {
      for (const req in dictResultEquipment) {
        if (dictResultEquipment[req].deco_slotlevel === -1) continue;

        if (dictResultEquipment[req].eqDict.type !== "decoWeapon") continue;

        if (level === dictResultEquipment[req].decoSlotLevel) {
          result += req + ": " + dictResultEquipment[req].count + "\n";
        }
      }
    }

    result += "\n[装飾品 防具]\n";
    // 装飾品の出力 (スロレベル順)
    for (const level of slotLevels) {
      for (const req in dictResultEquipment) {
        if (dictResultEquipment[req].deco_slotlevel === -1) continue;

        if (dictResultEquipment[req].eqDict.type !== "decoArmor") continue;

        if (level === dictResultEquipment[req].decoSlotLevel) {
          result += req + ": " + dictResultEquipment[req].count + "\n";
        }
      }
    }

    // 出力結果の装備構成で発動するスキルとそのレベルを保持するオブジェクト
    const dictResultSkill = {};

    // 出力結果の装備オブジェクトから発動スキルとそのレベルを取り出す
    for (const req in dictResultEquipment) {
      if (dictResultEquipment[req].count === 0) {
        continue;
      }

      for (const skill in dictEquipAll[req].skills) {
        if (skill in dictResultSkill) {
          dictResultSkill[skill] +=
            dictEquipAll[req].skills[skill] * dictResultEquipment[req].count;
        } else {
          dictResultSkill[skill] = dictEquipAll[req].skills[skill] * dictResultEquipment[req].count;
        }
      }
    }

    // 最大レベルを超えているスキルのレベルを修正
    for (const skill in dictResultSkill) {
      dictResultSkill[skill] = Math.min(staticSkillData[skill]["maxLevel"], dictResultSkill[skill]);
    }

    console.log("result skills:");
    result += "\n[スキル構成]\n";

    const skillLevels = Array.from({ length: 7 }, (_, i) => i + 1).reverse();

    for (const level of skillLevels) {
      for (const req in dictResultSkill) {
        if (level === dictResultSkill[req]) {
          result += req + ": " + dictResultSkill[req] + "\n";
        }
      }
    }

    // localstorage に結果の履歴を保存
    const historyItem = {
      timeStamp: timeStamp,
      result: result,
      processingUserInputData: processingUserInputData,
      maxDamage: dict_other_result["最大ダメージ"],
      element:
        processingUserInputData["武器"]["属性"] === "無属性"
          ? "無"
          : processingUserInputData["武器"]["属性"],
      heroic: processingUserInputData["食事"]["火事場"],
      physicalHitzone: processingUserInputData["モンスター"]["物理肉質"],
      elementalHitzone: processingUserInputData["モンスター"]["属性肉質"],
    };

    const resultHistory = localStorage.getItem("resultHistory");
    if (resultHistory) {
      const resultHistoryArray = JSON.parse(resultHistory);
      if (!resultHistoryArray.some((item) => item.timeStamp === historyItem.timeStamp)) {
        if (resultHistoryArray.length >= 50) resultHistoryArray.pop();
        resultHistoryArray.unshift(historyItem);
        localStorage.setItem("resultHistory", JSON.stringify(resultHistoryArray));
      }
    } else {
      localStorage.setItem("resultHistory", JSON.stringify([historyItem]));
    }
  } else if (result === "") {
    result = "";
  } else {
    result = "Unknow Error: 'SCIP Status' not found in dmax output.";
  }
  return result;
}

function NewlineText({ text }) {
  const newText = text
    .split("\n")
    .map((str, index, array) => (index === array.length - 1 ? str : `${str}<br/>`))
    .join("");

  return <span dangerouslySetInnerHTML={{ __html: newText }} />;
}

export const DmaxResult = React.memo(
  ({ allDmaxOutput, processingUserInputData, processingUserArmorsData }) => {
    const dmaxResult = outputToResult(
      allDmaxOutput,
      processingUserInputData,
      processingUserArmorsData
    );

    const [textToCopy, setTextToCopy] = React.useState("");
    useEffect(() => {
      setTextToCopy(dmaxResult);
    }, [dmaxResult]);

    const matches = useMediaQuery(theme.breakpoints.down("md")); // 'sm' は600pxに設定されていることが多い

    return (
      <>
        <Grid
          item
          md={5.9}
          sx={{
            "@media (max-width: 960px)": {
              display: "none",
            },
          }}
        >
          <Grid container alignItems="center" sx={{ padding: "4px 8px" }}>
            <Grid item>
              <InsightsIcon sx={{ marginTop: "4px", marginLeft: "8px" }} color="primary" />
            </Grid>
            <Grid item xs>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, paddingLeft: "6px" }}>
                結果
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <CopyToClipboardButton textToCopy={textToCopy} />
            </Grid>
          </Grid>

          <Box sx={{ marginX: "8px" }}>
            <Divider xs={{ margin: "8px" }} />
          </Box>
          <Box
            style={{
              // height: "900px",
              ...(matches ? { minHeight: "200px" } : { height: "100%" }),
              overflowY: "auto",
              paddingLeft: "24px",
              textAlign: "left",
              fontSize: "14px",
            }}
            sx={{
              flexGrow: 1, // コンテナの残りのスペースを埋める
              overflowY: "auto", // 縦方向のスクロールを許可
              padding: "16px",

              "&::-webkit-scrollbar": {
                display: "none", // Webkitブラウザ用のスクロールバーを非表示にする
              },
              // MSIEやEdge用の設定
              msOverflowStyle: "none", // IE 10+ スクロールバーを非表示
              scrollbarWidth: "none", // Firefox スクロールバーを非表示
            }}
          >
            <NewlineText text={dmaxResult} />
          </Box>
        </Grid>

        <Grid
          item
          md={0.2}
          sx={{
            "@media (max-width: 960px)": {
              display: "none",
            },
          }}
        >
          <Divider
            orientation="vertical"
            sx={{
              height: "98%", // Dividerの高さをコンテナの80%に設定
              my: "auto", // 上下マージンを自動で設定し、中央に配置
            }}
          />
        </Grid>
      </>
    );
  }
);

export default DmaxResult;
