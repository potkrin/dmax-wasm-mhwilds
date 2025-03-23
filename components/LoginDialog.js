import React, { use, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

function LoginDialog({ open, onClose }) {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/login/?next=/dmax`;
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ zIndex: 2000 }}>
      <DialogTitle>ログインが必要です</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div>武器データをサーバで管理するためにはログインが必要です。</div>
          <div>
            ローカル管理ではデータがブラウザによって消される可能性があるため、サーバでの管理を推奨します。
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleLogin} color="primary" variant="contained">
          ログイン
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginDialog;
