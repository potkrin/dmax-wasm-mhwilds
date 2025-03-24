// pm2 によるプロセス起動時に利用
// pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: "dmax-wasm-mhwilds-production",
      script: "npx",
      args: "next start -p 3010",
      watch: false,
      env_production: {
        NODE_ENV: "production",
        NEXT_PUBLIC_API_BASE_URL: "https://www.mhrspeedrun.com",
      },
    },
  ],
};
