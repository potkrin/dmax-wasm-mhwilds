// pm2 によるプロセス起動時に利用
// pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "dmax-wasm-staging",
      script: "npx",
      args: "next start -p 3001",
      watch: false,
    },
  ],
};
