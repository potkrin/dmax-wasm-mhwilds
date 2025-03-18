import React, { useEffect } from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Tab,
  Tabs,
  Icon,
  IconButton,
  Divider,
  useMediaQuery,
  Card,
} from "@mui/material";

import { theme, breakpoints } from "../src/theme";

// import { armors, decos } from "../data/EquipData";
// import { staticSkillData } from "../data/StaticData";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import HistoryIcon from "@mui/icons-material/History";
import PropTypes from "prop-types";
import CopyToClipboardButton from "./CopyToClipboardButton";
import { useTheme } from "@mui/material/styles";

function NewlineText({ text }) {
  const newText = text
    .split("\n")
    .map((str, index, array) => (index === array.length - 1 ? str : `${str}<br/>`))
    .join("");

  return <span dangerouslySetInnerHTML={{ __html: newText }} />;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography sx={{ fontSize: "14px" }}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

// allDmaxOutput : 最適化が完了したときのすべての中間出力 (DmaxResult と DmaxHistory で使用)
export const DmaxHistory = React.memo(({ allDmaxOutput }) => {
  const [historyList, setHistoryLists] = React.useState([]);
  const matches = useMediaQuery("(max-width: " + breakpoints.values.sm + "px)"); // 'sm' は600pxに設定されていることが多い

  React.useEffect(() => {
    console.log("HistoryMenu useEffect called");
    const resultHistory = localStorage.getItem("resultHistory");
    if (resultHistory) {
      let resultHistoryArray = JSON.parse(resultHistory);
      if (resultHistoryArray.length > 0) {
        if (allDmaxOutput !== "" && !matches) {
          resultHistoryArray = resultHistoryArray.slice(1);
        }
        setHistoryLists(resultHistoryArray);
      }
    }
  }, [allDmaxOutput, matches]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [textToCopy, setTextToCopy] = React.useState("");
  useEffect(() => {
    if (historyList.length === 0) return;
    setTextToCopy(historyList[value].result);
  }, [value, historyList]);

  return (
    <Grid item xs={12} md={5.9} sx={{ minHeight: "400px" }}>
      <Grid container alignItems="center" sx={{ padding: "4px 8px" }}>
        <Grid item>
          <HistoryIcon sx={{ marginTop: "4px", marginLeft: "8px" }} color="primary" />
        </Grid>
        <Grid item xs>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, paddingLeft: "4px" }}>
            履歴
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
          minHeight: matches ? "200px" : "400px",
          // overflowY: "auto",
          paddingLeft: "8px",
          textAlign: "left",
          display: "flex", // Flexboxを使用
          flexDirection: "row-reverse", // 水平方向にコンポーネントを配置
        }}
      >
        <Box
          sx={{
            flexGrow: 0,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            mr: 0,
            border: 0,
            maxHeight: "600px",
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Vertical tabs example"
            sx={{
              borderRight: 1,
              borderColor: "divider",
              width: "80px",
              ...(matches ? { minHeight: "200px" } : { height: "100%" }),
              // インジケータのスタイルをオーバーライドする
              "& .MuiTabs-indicator": {
                left: 0, // インジケータを左側に配置
                right: "auto", // right プロパティの自動設定を解除（デフォルトのスタイルを上書き）
              },
            }}
          >
            {historyList.map((option) => (
              <Tab
                key={option.timeStamp}
                sx={{ alignItems: "start" }}
                label={
                  <>
                    <Typography
                      sx={{ fontSize: "14px", color: theme.vars.palette.primary.light }}
                      align="left"
                    >
                      {option.physicalHitzone} / {option.elementalHitzone}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "14px", color: theme.vars.palette.primary.light }}
                      align="left"
                    >
                      {option.element} {option.maxDamage.split(".")[0]}
                    </Typography>

                    <Typography
                      sx={{ fontSize: "10px", color: theme.vars.palette.text.primary }}
                      align="left"
                    >
                      {new Date(option.timeStamp).toLocaleDateString(undefined, {
                        year: undefined,
                        month: "2-digit",
                        day: "2-digit",
                      })}{" "}
                      {new Date(option.timeStamp).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </Typography>
                  </>
                }
              />
            ))}
          </Tabs>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box
          sx={{
            flexGrow: 1, // コンテナの残りのスペースを埋める
            // overflowY: "auto", // 縦方向のスクロールを許可
            height: "100%",
            padding: "16px",

            "&::-webkit-scrollbar": {
              display: "none", // Webkitブラウザ用のスクロールバーを非表示にする
            },
            // MSIEやEdge用の設定
            "msOverflowStyle": "none", // IE 10+ スクロールバーを非表示
            "scrollbarWidth": "none", // Firefox スクロールバーを非表示
          }}
        >
          {historyList.map((option, index) => (
            <TabPanel key={index} value={value} index={index} sx={{ height: "100%" }}>
              <NewlineText text={option.result} sx={{ height: "100%" }} />
            </TabPanel>
          ))}
        </Box>
      </Box>
    </Grid>
  );
});

export default DmaxHistory;
