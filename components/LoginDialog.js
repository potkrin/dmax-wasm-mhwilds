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
  const [autoRedirect, setAutoRedirect] = useState(false);

  // SSG対応: クライアントサイドでマウントされたときにフラグを true に設定
  useEffect(() => {
    const localStorageLoginAutoRedirect = localStorage.getItem("loginAutoRedirect");
    if (localStorageLoginAutoRedirect === "true") setAutoRedirect(true);
    else setAutoRedirect(false);
  }, []);

  const handleAutoRedirectChange = (event) => {
    setAutoRedirect(event.target.checked);
    localStorage.setItem("loginAutoRedirect", event.target.checked);
  };

  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/login/?next=/dmax`;
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ zIndex: 2000 }}>
      <DialogTitle>ログインが必要です</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div>サーバーにデータを保存するためにはログインが必要です。</div>
          <div>ログインする、もしくはローカルのデータ を利用してください。</div>
        </DialogContentText>
        <FormControlLabel
          control={<Checkbox checked={autoRedirect} onChange={handleAutoRedirectChange} />}
          label="次回から自動遷移する"
        />
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
