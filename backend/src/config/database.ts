import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const config: sql.config = {
  server: process.env.DB_SERVER || '',
  database: process.env.DB_DATABASE || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

let pool: sql.ConnectionPool | null = null

export async function getConnection(): Promise<sql.ConnectionPool> {
  try {
    if (pool && pool.connected) {
      return pool
    }

    pool = await sql.connect(config)
    console.log('✅ Conectado a SQL Server')
    return pool
  } catch (error) {
    console.error('❌ Error conectando a SQL Server:', error)
    throw error
  }
}

export async function closeConnection(): Promise<void> {
  try {
    if (pool) {
      await pool.close()
      pool = null
      console.log('✅ Conexión a SQL Server cerrada')
    }
  } catch (error) {
    console.error('❌ Error cerrando conexión:', error)
    throw error
  }
}

// Manejar cierre de la aplicación
process.on('SIGINT', async () => {
  await closeConnection()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await closeConnection()
  process.exit(0)
})

export default { getConnection, closeConnection }

