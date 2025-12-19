// Configuración PM2 para UNIACC Dashboard
module.exports = {
  apps: [
    {
      name: 'uniacc-backend',
      script: './backend/dist/index.js',
      cwd: '/opt/Uniacc-dashboard-admision',
      instances: 1, // Cambiar a 'max' para usar todos los CPUs
      exec_mode: 'fork', // o 'cluster' para balanceo de carga
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_file: './backend/.env',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      merge_logs: true,
      kill_timeout: 5000
    }
  ]
};
