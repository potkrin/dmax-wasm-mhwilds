// 開発環境において SharedArrayBuffer を有効化するためのカスタムヘッダーを追加するため利用
// (本番環境では利用しない)

const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // ミドルウェアを使用してカスタムヘッダーを追加
  server.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // localhost ではなく 127.0.0.1 を利用
  // (DNSに依存せずにホスト名部分を固定できることにより Cookie の同一ホスト制限問題を解決できる)
  server.listen(3000, "127.0.0.1", (err) => {
    if (err) throw err;
    console.log("> Ready on http://127.0.0.1:3000");
  });
});
