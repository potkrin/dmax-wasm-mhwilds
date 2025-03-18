import React from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";

// クリップボードにテキストをコピーする関数
const manualSync = async (text) => {
  // try {
  //   await navigator.clipboard.writeText(text);
  //   console.log("Text copied to clipboard");
  // } catch (err) {
  //   console.error("Failed to copy: ", err);
  // }
};

export const ManualSyncButton = ({ fetchUserEquipData }) => {
  const [tooltipTitle, setTooltipTitle] = useState("サーバーから同期");

  const handleCopyClick = async () => {
    fetchUserEquipData();
    setTooltipTitle("同期完了");
    // 一定時間後にツールチップのテキストを元に戻す
    setTimeout(() => setTooltipTitle("サーバーから同期"), 2000);
  };

  return (
    <Tooltip title={tooltipTitle} placement="top">
      <Button
        variant="contained"
        color="primary"
        onClick={handleCopyClick}
        // disabled={userCharmData.length === 0}
        startIcon={<SyncIcon />}
      >
        同期
      </Button>
    </Tooltip>
  );
};

export default ManualSyncButton;
