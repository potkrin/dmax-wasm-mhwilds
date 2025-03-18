import React, { useMemo } from "react";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { ArmorIcon, ArmorExcludeIcon } from "./icons/ArmorIcon";
import { CharmIcon, CharmExcludeIcon } from "./icons/CharmIcon";
import DevicesIcon from "@mui/icons-material/Devices";
import CloudIcon from "@mui/icons-material/Cloud";
import { useCharmAndQuriousArmorContext } from "./CharmAndQuriousArmorContext";
import { Tooltip } from "@mui/material";
import isEqual from "lodash/isEqual";

// ToggleButtonGroup ではなく個々の state と Button のほうが良いかも
// ToggleButton の state(array) を分割して state に入れてしまっているので
export default function OptimizationOptionButtons() {
  const [formats, setFormats] = React.useState(null);
  // クライアントサイドでのみ実行しローカルストレージからデータを取得する
  React.useEffect(() => {
    console.log(
      "[dbgf] OptimizationOptionButtons:useEffect:ローカルストレージからデータを取得する"
    );
    let initFormats = JSON.parse(localStorage.getItem("formats"));
    if (initFormats === null) {
      initFormats = [];
    }
    setFormats(initFormats);
  }, []);

  const {
    useServerData,
    setUseServerData,
    excludeCharm,
    setExcludeCharm,
    excludeQuriousArmor,
    setExcludeQuriousArmor,
    isCharmDataFetched,
    isQuriousArmorDataFetched,
  } = useCharmAndQuriousArmorContext();
  console.log(
    "[dbg] isCharmDataFetched: " +
      isCharmDataFetched +
      ", isQuriousArmorDataFetched: " +
      isQuriousArmorDataFetched
  );

  const handleFormat = (event, newFormats) => {
    console.log("[dbg] newFormats: " + newFormats);
    setFormats(newFormats);
  };

  React.useEffect(() => {
    console.log("formats: " + formats);

    if (formats === null) return;
    if (formats.includes("useServerData")) {
      setUseServerData(true);
    } else {
      setUseServerData(false);
    }
    if (formats.includes("excludeCharm")) {
      setExcludeCharm(true);
    } else {
      setExcludeCharm(false);
    }
    if (formats.includes("excludeArmor")) {
      setExcludeQuriousArmor(true);
    } else {
      setExcludeQuriousArmor(false);
    }

    localStorage.setItem("formats", JSON.stringify(formats));
  }, [formats]);

  return useMemo(
    () => (
      <ToggleButtonGroup
        value={formats}
        onChange={handleFormat}
        aria-label="text formatting"
        color="primary"
        size="small"
      >
        <ToggleButton value="excludeCharm" aria-label="excludeCharm" sx={{ padding: 0 }}>
          <Tooltip title="護石を除外" placement="top" sx={{ zIndex: 1000 }}>
            {/* Tooltip を出すための span */}
            <span style={{ lineHeight: "0", padding: "7px" }}>
              {excludeCharm ? <CharmExcludeIcon /> : <CharmIcon />}
            </span>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="excludeArmor" aria-label="excludeArmor" sx={{ padding: 0 }}>
          <Tooltip title="傀異錬成を除外" placement="top" sx={{ zIndex: 1000 }}>
            {/* Tooltip を出すための span */}
            <span style={{ lineHeight: "0", padding: "7px" }}>
              {excludeQuriousArmor ? <ArmorExcludeIcon /> : <ArmorIcon />}
            </span>
          </Tooltip>
        </ToggleButton>

        <ToggleButton value="useServerData" aria-label="useServerData" sx={{ padding: 0 }}>
          <Tooltip
            title={
              isCharmDataFetched && isQuriousArmorDataFetched ? "" : "データが同期されていません"
            }
            open={useServerData && !(isCharmDataFetched && isQuriousArmorDataFetched)}
            sx={{ zIndex: 1000 }}
            placement="top"
          >
            <div style={{ lineHeight: "0", padding: "7px" }}>
              {useServerData ? (
                <Tooltip title="サーバーのデータを利用" placement="top" sx={{ zIndex: 1000 }}>
                  {/* Tooltip を出すための span */}
                  <span>
                    <CloudIcon />
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title="ローカルのデータを利用" placement="top" sx={{ zIndex: 1000 }}>
                  {/* Tooltip を出すための span */}
                  <span>
                    <DevicesIcon />
                  </span>
                </Tooltip>
              )}
            </div>
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    ),
    [
      useServerData,
      setUseServerData,
      excludeCharm,
      setExcludeCharm,
      excludeQuriousArmor,
      setExcludeQuriousArmor,
      isCharmDataFetched,
      isQuriousArmorDataFetched,
    ]
  );
}
