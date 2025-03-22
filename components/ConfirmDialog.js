import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

function ConfirmDialog({
  openConfirmDialog,
  handleCloseConfirmDialog,
  handleConfirmDelete,
  handleConfirmOverwrite,
  dialogMode,
  dataType,
}) {
  return (
    <Dialog
      open={openConfirmDialog}
      onClose={handleCloseConfirmDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{dataType + "データの削除"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogMode === "delete"
            ? "選択された" + dataType + "データを削除してもよろしいですか？"
            : "既存の" + dataType + "データを上書きしてよろしいですか？"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={dialogMode === "delete" ? handleConfirmDelete : handleConfirmOverwrite}
          color="primary"
          autoFocus
        >
          はい
        </Button>
        <Button onClick={handleCloseConfirmDialog} color="primary">
          いいえ
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
