module.exports = {
  apps: [{
    name: "destiny-calc-bot",
    script: "./index.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      NODE_NO_WARNINGS: "1"
    },
    node_args: "--no-deprecation --no-warnings"
  }]
}; 