import React from "react";
import { styled } from "@mui/system";
import {
  Box,
  Card,
  CardMedia,
  Dialog,
  List,
  ListItem,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@mui/material/styles";

import Image from "next/image";
import skillLevelPcDark from "../public/images/dmax-usage-skill-level-pc-dark.png";
import skillLevelPcLight from "../public/images/dmax-usage-skill-level-pc-light.png";
import fixLevelPcDark from "../public/images/dmax-usage-fix-level-pc-dark.png";
import fixLevelPcLight from "../public/images/dmax-usage-fix-level-pc-light.png";
import activeRatePcDark from "../public/images/dmax-usage-active-rate-pc-dark.png";
import activeRatePcLight from "../public/images/dmax-usage-active-rate-pc-light.png";
import localServerPcDark from "../public/images/dmax-usage-local-server-pc-dark.png";
import localServerPcLight from "../public/images/dmax-usage-local-server-pc-light.png";
import graphPcDark from "../public/images/dmax-usage-graph-pc-dark.png";
import graphPcLight from "../public/images/dmax-usage-graph-pc-light.png";

import { theme, breakpoints } from "../src/theme";
import { useColorScheme } from "@mui/material/styles";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const CustomH1 = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  paddingTop: "3.0em",
  marginBottom: "0.6em",
  fontWeight: "bold",
  fontSize: "1.6em",
  borderBottom: "1px solid " + theme.palette.text.hint,
}));

const CustomH2 = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  paddingTop: "0.6em",
  fontWeight: "bold",
  fontSize: "1.0em",
  // 他のスタイル規則もここに追加できます
}));

// height: 画像の高さを指定するとアスペクト比に合わせて調整してくれる
function UsageImage({ srcDark, srcLight, alt, matches, height }) {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // for server-side rendering
    // learn more at https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
    return null;
  }

  return (
    <Box
      sx={{
        boxShadow:
          "0 4px 8px 0 " +
          (mode === "dark" ? theme.vars.palette.background.default : theme.vars.palette.text.hint), // ここで影のスタイルを指定
        backgroundColor: theme.vars.palette.background.paper,
        borderRadius: 2, // 角丸の指定
        overflow: "hidden", // Box内のコンテンツが角丸に合わせて切り取られるように設定
        maxWidth: "600px",
        margin: matches ? "1em 0em" : "1em",
        height: height + "px",
        position: "relative",
      }}
    >
      <Image
        src={mode === "dark" ? srcDark : srcLight}
        alt={alt}
        fill={true}
        style={{ objectFit: "contain" }}
        // objectFit="contain" // または他の object-fit の値
      />
    </Box>
  );
}

function Usage() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const matches = useMediaQuery("(max-width: " + breakpoints.values.sm + "px)"); // 'sm' は600pxに設定されていることが多い

  return (
    <Paper sx={{ paddingBottom: "10em" }}>
      <Box sx={{ maxWidth: "800px", padding: 3 }}>
        <CustomH1 variant="h1" gutterBottom sx={{ paddingTop: "0em" }} theme={theme.vars}>
          # DMAX MHWilds
        </CustomH1>
        <Typography variant="body1" gutterBottom>
          DMAX MHWilds は「モンスターハンターワイルズ」の自動ダメージ最大化シミュレーターです。
        </Typography>
        <Typography variant="body1" gutterBottom>
          モンスターの肉質・武器・必須スキル等を指定すると、指定した条件の中で最大ダメージを実現する装備構成を自動で見つけます。
        </Typography>

        <div style={{ width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    fontSize: "0.9rem",
                    fontWeight: "normal",
                    color: theme.vars.palette.text.secondary,
                    minWidth: "80px",
                  }}
                >
                  対応武器種
                </th>
                <td style={{ padding: "8px" }}>弓</td>
              </tr>

              {/* 攻撃力 */}
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    fontSize: "0.9rem",
                    fontWeight: "normal",
                    color: theme.vars.palette.text.secondary,
                  }}
                >
                  動作環境
                </th>
                <td style={{ padding: "8px" }}>
                  <div>ブラウザ</div>
                  <div style={{ fontSize: "0.8rem", color: theme.vars.palette.text.secondary }}>
                    WebAssembly に対応したブラウザであればOSやハードを問わず動作します
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <CustomH1 variant="h1" gutterBottom theme={theme.vars}>
          # 注意点
        </CustomH1>
        <CustomH2
          variant="h2"
          gutterBottom
          sx={{
            paddingTop: "0em",
          }}
          theme={theme.vars}
        >
          1. 護石と傀異錬成データの保存場所
        </CustomH2>
        <Typography variant="body1" gutterBottom>
          アーティア武器の保存場所にはローカルとサーバーの2種類あります。
          <br />
          <span style={{ color: theme.vars.palette.secondary.main }}>
            確実に保存したい場合はサーバーに保存
          </span>
          してください。
        </Typography>
        <Typography variant="body1" gutterBottom>
          <span style={{ color: theme.vars.palette.secondary.main }}>
            特に Safari や iOS (iPhone, iPad) ではサーバーへの保存を推奨します。
          </span>
        </Typography>

        <UsageImage
          srcDark={localServerPcDark}
          srcLight={localServerPcLight}
          alt="アーティア武器管理画面の画像"
          matches={matches}
          height={matches ? 124 : 218}
        />
        <Accordion
          sx={{
            boxShadow: "none", // 影を削除
            border: "none", // 縁取りを削除
            "&:not(:last-child)": {
              borderBottom: 0, // 最後の要素以外の下縁を削除
            },
            "&:before": {
              display: "none", // デフォルトの縁取りを削除
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              flexDirection: "row-reverse", // アイコンとタイトルの順序を逆にする
              "& .MuiAccordionSummary-expandIconWrapper": {
                marginRight: "auto", // アイコンを左に寄せる
              },
              padding: 0,
            }}
          >
            <Typography sx={{ color: theme.vars.palette.text.secondary }}>
              ローカルとサーバーの違い
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ color: theme.vars.palette.text.secondary }}
            >
              ローカルに保存する場合は簡単に利用できますが、Safari や iOS
              上の全てのブラウザではブラウザにより自動的にデータが削除される可能性があります。
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ color: theme.vars.palette.text.secondary }}
            >
              サーバーに保存する場合はログインが必要ですが、ブラウザによってデータが削除されるリスクはありません。
              さらに複数の端末やブラウザから閲覧したときに同じデータを利用できます。
            </Typography>

            <Typography variant="body1" gutterBottom>
              <a
                href="https://webkit.org/tracking-prevention/#:~:text=to%2024%20hours.-,7%2DDay%20Cap%20on%20All%20Script%2DWriteable%20Storage,-Trackers%20executing%20script"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: theme.vars.palette.text.hint,
                }}
              >
                WebKit: 7-Day Cap on All Script-Writeable Storage
              </a>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={{
            boxShadow: "none", // 影を削除
            border: "none", // 縁取りを削除
            "&:not(:last-child)": {
              borderBottom: 0, // 最後の要素以外の下縁を削除
            },
            "&:before": {
              display: "none", // デフォルトの縁取りを削除
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              flexDirection: "row-reverse", // アイコンとタイトルの順序を逆にする
              "& .MuiAccordionSummary-expandIconWrapper": {
                marginRight: "auto", // アイコンを左に寄せる
              },
              padding: 0,
            }}
          >
            <Typography sx={{ color: theme.vars.palette.text.secondary }}>
              ローカルとサーバーの実体は何か？
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ color: theme.vars.palette.text.secondary }}
            >
              「ローカル」ではブラウザの Local storage にデータが保存されます。Local storage
              に保存されたデータは基本的に無期限に保存されますが、WebKit を利用したブラウザ (Safari,
              iOS 上の全てのブラウザ) ではブラウザにより自動的にデータが削除されます。
              またブラウザ間でデータが同期されないため、別の端末やブラウザから閲覧するときには手動でデータをコピーする必要があります。
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ color: theme.vars.palette.text.secondary }}
            >
              「サーバー」では当サイトを提供しているサーバー上にデータが保存されます。
              そのため、ブラウザによりデータが自動的に削除されることはありません。
              また、別の端末やブラウザから閲覧した際にも同じデータを利用できます。
            </Typography>
          </AccordionDetails>
        </Accordion>

        <CustomH2 variant="h2" gutterBottom theme={theme.vars}>
          2. バックグラウンドでの実行時の注意
        </CustomH2>
        <Typography variant="body1">
          <span style={{ color: theme.vars.palette.secondary.main }}>
            モバイル端末 (iOS, Android) では DMAX をバックグラウンドで実行することは非推奨です。
          </span>
        </Typography>
        <Typography variant="body1" gutterBottom>
          モバイル端末で DMAX を実行している画面をバックグラウンドに移動すると、OS によって DMAX
          の最適化処理が強制終了される可能性があります。
        </Typography>
        <Typography variant="body1" gutterBottom>
          デスクトップ端末ではバックグラウンドでの実行に問題はありません。
        </Typography>

        <CustomH2 variant="h2" gutterBottom theme={theme.vars}>
          3. 実行速度
        </CustomH2>
        <Typography variant="body1" gutterBottom>
          <span style={{ color: theme.vars.palette.secondary.main }}>
            モバイル端末ではCPUの性能不足により最適化に時間がかかるかもしれません。(Android, iOS等)
          </span>
        </Typography>
        <Typography variant="body1" gutterBottom>
          Windows, macOS
          等のデスクトップ・ラップトップ端末ではネイティブアプリに匹敵する速度で実行できます。
        </Typography>

        <CustomH2 variant="h2" gutterBottom theme={theme.vars}>
          4. メモリ制限
        </CustomH2>
        <Typography variant="body1" gutterBottom>
          最適化実行中に
          <span style={{ color: theme.vars.palette.secondary.main }}>
            メモリ使用量の上限に到達すると最適化が強制終了されてしまいます。
          </span>
        </Typography>
        <Typography variant="body1" gutterBottom>
          メモリ上限は環境によって異なりますが、 iOS では約1GB、Android や Windows、macOS
          では約4GBがメモリ上限です。
        </Typography>

        <CustomH1 variant="h1" gutterBottom theme={theme.vars}>
          # 使い方
        </CustomH1>

        <CustomH2
          variant="h2"
          gutterBottom
          sx={{
            paddingTop: "0em",
          }}
          theme={theme.vars}
        >
          1. 前提条件を入力
        </CustomH2>
        <Typography variant="body1" gutterBottom>
          最大ダメージ構成を求める上で前提条件として以下の項目を入力します。これらは最大ダメージ構成を求める上で固定される値となります。
        </Typography>
        <ul>
          <li>モンスター</li>
          <li>武器</li>
          <li>ハンター</li>
          <li>食事</li>
        </ul>
        <CustomH2 variant="h2" gutterBottom theme={theme.vars}>
          2. スキルの下限レベルを入力
        </CustomH2>
        <Typography variant="body1">
          スキルの項目では各スキルが最低限満たしてほしいレベルを入力します。
        </Typography>
        <Typography variant="body1" gutterBottom>
          <span style={{ color: theme.vars.palette.secondary.main }}>
            どうしても必要なスキル以外は全てLv0を指定してください。
          </span>
        </Typography>

        <Typography variant="body1" gutterBottom>
          下限レベルを可能な限り低く設定することによってより広い範囲から最大ダメージ構成を求めることが出来るので、より高いダメージの構成が見つかる可能性が上がります。
        </Typography>
        <UsageImage
          srcDark={skillLevelPcDark}
          srcLight={skillLevelPcLight}
          alt="スキル下限レベルの設定の画像"
          matches={matches}
          height={matches ? 122 : 212}
        />
        <Typography variant="body1" gutterBottom sx={{ color: theme.vars.palette.text.secondary }}>
          例えば、「狂竜症を発動するために『黒蝕竜の力』が最低でもLv2は欲しいが、ほかのスキル構成は何でも良い」という場合、黒蝕竜の力のみLv2を入力し、その他のスキルはすべてLv0を入力します。
          すると最適化結果は「黒蝕竜の力Lv2」を満たす構成のなかで最大ダメージとなる構成になります。
        </Typography>

        <CustomH2 variant="h2" gutterBottom theme={theme.vars}>
          3. レベルを固定したいスキルを入力
        </CustomH2>
        <Typography variant="body1" gutterBottom>
          DMAXのレベル選択は基本的に下限を指定しますが、レベルを固定したくなるスキルもあります。
          <br />
          <span style={{ color: theme.vars.palette.secondary.main }}>
            レベルを固定したいスキルはチェックボックスをON
          </span>
          にしてください。
        </Typography>
        <UsageImage
          srcDark={fixLevelPcDark}
          srcLight={fixLevelPcLight}
          alt="スキルレベルを固定をする設定の画像"
          matches={matches}
          height={matches ? 118 : 207}
        />
        <Typography variant="body1" gutterBottom sx={{ color: theme.vars.palette.text.secondary }}>
          例えば、最適化の結果「回避距離」が発動してしまうと、張り付いて攻撃する上では回避距離は邪魔になります。
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: theme.vars.palette.text.secondary }}>
          このような場合は、「回避距離」のレベル固定チェックボックスをONにした上でLv0を選択してください。
          すると「回避距離Lv0」のなかで最大ダメージとなる構成を探してくれます。
        </Typography>

        <CustomH2 variant="h2" gutterBottom theme={theme.vars}>
          4. ダメージ寄与スキルのスキル発動率を入力
        </CustomH2>
        <Typography variant="body1" gutterBottom>
          ダメージ計算式に寄与するスキルのうち、
          <span style={{ color: theme.vars.palette.secondary.main }}>
            発動に条件が厳しいスキルはスキル発動率を設定してください。
          </span>
          スキル発動率は「攻撃時間中にスキルが発動している割合」を想定して入力してください。
        </Typography>
        <UsageImage
          srcDark={activeRatePcDark}
          srcLight={activeRatePcLight}
          alt="スキル発動率を設定する画像"
          matches={matches}
          height={matches ? 118 : 206}
        />

        <Typography variant="body1" gutterBottom sx={{ color: theme.vars.palette.text.secondary }}>
          例えば、モンスターの怒り時のみ効果が発動する「挑戦者」の場合、攻撃時間に占める怒り状態の割合を想定してスキル発動率を入力します。
          するとダメージ計算式における「挑戦者」の効果を発動率をもとに期待値として計算してくれます。
        </Typography>

        <CustomH2 variant="h2" gutterBottom theme={theme.vars}>
          5. 最適化実行とグラフ
        </CustomH2>
        <Typography variant="body1" gutterBottom>
          最適化実行ボタンを押すと最適化が実行され、しばらくするとグラフが表示されます。
        </Typography>
        <Typography variant="body1" gutterBottom>
          下の線は最大ダメージの下界を示しています。その時点でこのダメージまで出せる装備が見つかっていることを意味します。
          上の線は最大ダメージの上界を示しています。その時点でこのダメージより高いダメージを出せる装備は無いことがわかっていることを意味します。
        </Typography>
        <Typography variant="body1" gutterBottom>
          上下の線が一致したら最適化完了です。
        </Typography>
        <UsageImage
          srcDark={graphPcDark}
          srcLight={graphPcLight}
          alt="グラフの画像"
          matches={matches}
          height={matches ? 300 : 520}
        />

        <CustomH1 variant="h1" gutterBottom theme={theme.vars}>
          # 仕様など
        </CustomH1>

        <CustomH2 variant="h2" gutterBottom theme={theme.vars}>
          狂竜症と無我の境地について
        </CustomH2>
        <Typography variant="body1" gutterBottom>
          ver3.0.0 までは黒蝕竜の力のレベルによらず無我の境地が発動してしまっていました。 ver4.0.0
          では以下のように変更しました。
          <br />
          <span
            style={{
              color: theme.vars.palette.text.secondary,
              fontSize: "0.9rem",
              marginTop: "0.5em",
            }}
          >
            ※黒蝕一体なしの狂竜症発動:
            ゴア・マガラや狂竜化モンスターの攻撃を受けることで狂竜症を発動させること
          </span>
        </Typography>
        <Typography component="ul" variant="body1" gutterBottom>
          <li>
            黒蝕一体なしの狂竜症発動=ON の場合
            <ul>
              <li>無我の境地は常に発動します</li>
              <li>狂竜症克服による会心率15%UPも発動します</li>
            </ul>
          </li>
          <li>
            黒蝕一体なしの狂竜症発動=OFF の場合
            <ul>
              <li>
                黒蝕竜の力Lv2以上の場合
                <ul>
                  <li>無我の境地が発動します</li>
                  <li>狂竜症克服による会心率15%UPも発動します</li>
                </ul>
              </li>
              <li>
                黒蝕竜の力Lv1以下の場合
                <ul>
                  <li>無我の境地は発動しません</li>
                  <li>狂竜症克服による会心率15%UPも発動しません</li>
                </ul>
              </li>
            </ul>
          </li>
        </Typography>

        <CustomH2 variant="h2" gutterBottom theme={theme.vars}>
          刃鱗増装
        </CustomH2>
        <Typography component="ul" variant="body1" gutterBottom>
          <li>刃鱗増装で増えたビンには既存のビン乗算の部分に更に 1.25 倍の倍率がかかります</li>
          <li>刃鱗増装で増えたビンにはフォースショットの効果は乗りません (攻撃力, 会心率ともに)</li>
        </Typography>

        <CustomH2 variant="h2" gutterBottom theme={theme.vars}>
          海竜の渦雷 (蒼雷一閃)
        </CustomH2>
        <Typography component="ul" variant="body1" gutterBottom>
          <li>
            攻撃を蓄積すると一定時間会心率が15%UPします (蒼雷一閃Ⅰは20秒間, 蒼雷一閃Ⅱは30秒間)
          </li>
          <li>クールタイムが30秒あるため発動率50%以上で運用するのは難しいと思います</li>
          <li>貫通ビンでは発動に必要な蓄積ができません</li>
        </Typography>

        <CustomH2 variant="h2" gutterBottom theme={theme.vars}>
          耐性変換【雷】
        </CustomH2>
        <Typography component="ul" variant="body1" gutterBottom>
          <li>雷耐性1につき武器の雷属性が+4されます</li>
          <li>食事効果なども含めた最終的な雷耐性を想定して入力してください</li>
        </Typography>

        <CustomH2 variant="h2" gutterBottom theme={theme.vars}>
          千刃竜の闘志 (千刃の身躱し)
        </CustomH2>
        <Typography component="ul" variant="body1" gutterBottom>
          <li>千刃の身躱しⅠは巧撃の効果時間を15秒延長します</li>
          <li>千刃の身躱しⅡはさらに巧撃による攻撃力UP効果が+10されます</li>
        </Typography>

        <CustomH1 variant="h1" gutterBottom theme={theme.vars}>
          # 更新履歴
        </CustomH1>
        <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
          <Typography variant="body1" marginLeft={1.5}>
            ver. 6.0.0
          </Typography>
          <Typography
            variant="body1"
            marginLeft={2.0}
            color="text.secondary"
            fontSize={"0.8rem"}
            sx={{ display: "flex", alignItems: "start" }}
          >
            <CalendarMonthIcon
              sx={{
                fontSize: "1.0rem",
                marginRight: 0.3,
                color: theme.vars.palette.text.secondary,
              }}
            />
            2025-10-06
          </Typography>
        </Box>

        <Typography component="ul" color="text.secondary" fontSize={"0.9rem"}>
          <li>
            防具追加
            <br />
            ベイルアーマーα, オメガコスチュームα
          </li>
          <li>
            護石追加
            <br />
            攻勢の護石Ⅲ, 連撃の護石Ⅲ
          </li>
          <li>
            スキル追加（以下のスキルはダメージ計算式にまだ反映されていませんのでご注意下さい
            <br />
            暗黒騎士の証, オメガレゾナンス
          </li>
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
          <Typography variant="body1" marginLeft={1.5}>
            ver. 5.0.0
          </Typography>
          <Typography
            variant="body1"
            marginLeft={2.0}
            color="text.secondary"
            fontSize={"0.8rem"}
            sx={{ display: "flex", alignItems: "start" }}
          >
            <CalendarMonthIcon
              sx={{
                fontSize: "1.0rem",
                marginRight: 0.3,
                color: theme.vars.palette.text.secondary,
              }}
            />
            2025-08-13
          </Typography>
        </Box>

        <Typography component="ul" color="text.secondary" fontSize={"0.9rem"}>
          <li>ゲームの Ver.1.021.00 (2025-08-13) に対応</li>
          <li>鑑定護石に対応</li>
          <li>ヌシの魂を4部位以上装備した際に効果が発動していなかった不具合を修正</li>
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
          <Typography variant="body1" marginLeft={1.5}>
            ver. 4.1.0
          </Typography>
          <Typography
            variant="body1"
            marginLeft={2.0}
            color="text.secondary"
            fontSize={"0.8rem"}
            sx={{ display: "flex", alignItems: "start" }}
          >
            <CalendarMonthIcon
              sx={{
                fontSize: "1.0rem",
                marginRight: 0.3,
                color: theme.vars.palette.text.secondary,
              }}
            />
            2025-07-23
          </Typography>
        </Box>

        <Typography component="ul" color="text.secondary" fontSize={"0.9rem"}>
          <li>
            スキル追加
            <br />
            踊火の祈り
          </li>
          <li>
            防具追加
            <br />
            トゥナムルγシリーズ, ダイバーα​シリーズ, アーフィαシリーズ
          </li>
          <li>
            護石追加
            <br />
            無傷の護石Ⅲ, 整備の護石Ⅳ
          </li>
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
          <Typography variant="body1" marginLeft={1.5}>
            ver. 4.0.0
          </Typography>
          <Typography
            variant="body1"
            marginLeft={2.0}
            color="text.secondary"
            fontSize={"0.8rem"}
            sx={{ display: "flex", alignItems: "start" }}
          >
            <CalendarMonthIcon
              sx={{
                fontSize: "1.0rem",
                marginRight: 0.3,
                color: theme.vars.palette.text.secondary,
              }}
            />
            2025-07-05
          </Typography>
        </Box>

        <Typography component="ul" color="text.secondary" fontSize={"0.9rem"}>
          <li>黒蝕一体なしの狂竜症発動に対応</li>
          <li>
            スキル追加
            <br />
            耐性変換【雷】, 刃鱗増装, 海竜の渦雷, 千刃竜の闘志
          </li>
          <li>
            武器追加
            <br />
            ボルトアローⅠ, ハイボルトアロー, シャルラアルナスルⅠ, 叛弓アルナスル
          </li>
          <li>
            防具追加
            <br />
            ラギアα/βシリーズ, レギオスα/βシリーズ, 旅立ちのホークハートα
          </li>
          <li>
            護石追加
            <br />
            渾身の護石Ⅲ, 反攻の護石Ⅲ, 底力の護石Ⅳ, 属吸の護石Ⅱ, 友愛の護石Ⅴ
          </li>
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
          <Typography variant="body1" marginLeft={1.5}>
            ver. 3.0.0
          </Typography>
          <Typography
            variant="body1"
            marginLeft={2.0}
            color="text.secondary"
            fontSize={"0.8rem"}
            sx={{ display: "flex", alignItems: "start" }}
          >
            <CalendarMonthIcon
              sx={{
                fontSize: "1.0rem",
                marginRight: 0.3,
                color: theme.vars.palette.text.secondary,
              }}
            />
            2025-05-31
          </Typography>
        </Box>

        <Typography component="ul" color="text.secondary" fontSize={"0.9rem"}>
          <li>ゲームの Ver.1.011.00 (2025-05-28) に対応</li>
          <li>ヌシの魂Lv.3 により発動するスキル 根性【果敢】 をダメージ計算式に反映</li>
          <li>
            スキル追加
            <br />
            ヌシの魂, 祝祭の巡り, 花舞の祈り
          </li>
          <li>
            防具追加
            <br />
            桜波シリーズ, ブロッサムシリーズ, レダゼルトγシリーズ, アワウタイズクα, 封印の龍骸布α,
            封印の眼帯α, シャドウアイα, ラウンドアイα
          </li>
          <li>
            護石追加
            <br />
            全開の護石Ⅲ, 防御の護石Ⅴ
          </li>
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
          <Typography variant="body1" marginLeft={1.5}>
            ver. 2.0.0
          </Typography>
          <Typography
            variant="body1"
            marginLeft={2.0}
            color="text.secondary"
            fontSize={"0.8rem"}
            sx={{ display: "flex", alignItems: "start" }}
          >
            <CalendarMonthIcon
              sx={{
                fontSize: "1.0rem",
                marginRight: 0.3,
                color: theme.vars.palette.text.secondary,
              }}
            />
            2025-04-06
          </Typography>
        </Box>

        <Typography component="ul" color="text.secondary" fontSize={"0.9rem"}>
          <li>ゲームの Ver.1.010.00 (2025-04-03) に対応</li>
          <li>剛連射の属性補正上昇に対応</li>
          <li>蝕攻の装衣の効果減少に対応</li>
          <li>チャージマスターが剛射・剛連射に乗る新仕様に対応</li>
          <li>
            スキル追加
            <br /> 濡れ刃紋, 白熾の奔流, 栄光の誉れ, 泡狐竜の力, 白熾龍の脈動
          </li>
          <li>
            防具追加
            <br />
            ギルドクロスシリーズ, クリークシリーズ, 健啖家の耳飾りα, ミツネシリーズ,
            無垢ナルシリーズ, スクエアグラスα, 知略の眼鏡α, 献身のピアスα
          </li>
          <li>
            武器追加
            <br />
            ゾ・サミーラⅠ, 熾光たるサミーラ, 狐弓ツユノタマノヲⅠ, なぐるやの遠弓の真弦
          </li>
          <li>
            護石追加
            <br />
            体術の護石Ⅴ, 耳栓の護石Ⅱ, 回避の護石Ⅳ, 属変の護石Ⅱ
          </li>
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
          <Typography variant="body1" marginLeft={1.5}>
            ver. 1.0.0
          </Typography>
          <Typography
            variant="body1"
            marginLeft={2.0}
            color="text.secondary"
            fontSize={"0.8rem"}
            sx={{ display: "flex", alignItems: "start" }}
          >
            <CalendarMonthIcon
              sx={{
                fontSize: "1.0rem",
                marginRight: 0.3,
                color: theme.vars.palette.text.secondary,
              }}
            />
            2025-03-26
          </Typography>
        </Box>

        <Typography component="ul" color="text.secondary" fontSize={"0.9rem"}>
          <li>DMAX MHWilds を公開</li>
        </Typography>
      </Box>
    </Paper>
  );
}

export default Usage;
