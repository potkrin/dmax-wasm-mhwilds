import React from "react";
import { IconButton, Tooltip } from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

// クリップボードにテキストをコピーする関数
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

export const CopyToClipboardButton = ({ textToCopy }) => {
  // const handleCopyClick = async () => {
  //   await copyToClipboard(textToCopy);
  // };

  const [tooltipTitle, setTooltipTitle] = useState("コピー");

  const handleCopyClick = async () => {
    await copyToClipboard(textToCopy);
    setTooltipTitle("コピー完了");
    // 一定時間後にツールチップのテキストを元に戻す
    setTimeout(() => setTooltipTitle("コピー"), 2000);
  };

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton onClick={handleCopyClick} aria-label="copy">
        <ContentCopyIcon color="primary" />
      </IconButton>
    </Tooltip>
  );
};

export default CopyToClipboardButton;
