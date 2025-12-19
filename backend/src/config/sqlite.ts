import initSqlJs, { Database } from 'sql.js'
import path from 'path'
import fs from 'fs'

// Asegurar que el directorio data existe
const dataDir = path.join(__dirname, '../../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'admision.db')

let db: Database | null = null

export async function getDatabase(): Promise<Database> {
  if (db) return db

  const SQL = await initSqlJs()
  
  // Cargar base de datos existente o crear nueva
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  // Crear tabla si no existe
  db.run(`
    CREATE TABLE IF NOT EXISTS postulante_extras (
      codint TEXT PRIMARY KEY,
      desistido INTEGER DEFAULT 0,
      fecha_desistimiento TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Crear tabla para tracking de notificaciones
  db.run(`
    CREATE TABLE IF NOT EXISTS postulantes_notificados (
      codint TEXT PRIMARY KEY,
      fecha_notificacion TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Guardar cambios
  saveDatabase()

  console.log('✅ SQLite database initialized at:', dbPath)
  
  return db
}

export function saveDatabase() {
  if (!db) return
  
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(dbPath, buffer)
}

// Cerrar base de datos al salir
process.on('exit', () => {
  if (db) {
    saveDatabase()
    db.close()
  }
})

process.on('SIGINT', () => {
  if (db) {
    saveDatabase()
    db.close()
  }
  process.exit(0)
})
