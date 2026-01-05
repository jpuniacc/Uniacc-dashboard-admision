import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'
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
      estado_seguimiento TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Migración: agregar columna estado_seguimiento si no existe (para bases de datos existentes)
  try {
    const tableInfo = db.exec("PRAGMA table_info(postulante_extras)")
    const columns = tableInfo.length > 0 ? tableInfo[0].values.map((row: any[]) => row[1]) : []
    
    if (!columns.includes('estado_seguimiento')) {
      db.run(`ALTER TABLE postulante_extras ADD COLUMN estado_seguimiento TEXT`)
      console.log('✅ Migración: columna estado_seguimiento agregada')
    }
  } catch (error) {
    // Si falla, la columna probablemente ya existe
    console.log('ℹ️  Columna estado_seguimiento ya existe o no se pudo verificar')
  }

  // Crear tabla para tracking de notificaciones
  db.run(`
    CREATE TABLE IF NOT EXISTS postulantes_notificados (
      codint TEXT PRIMARY KEY,
      fecha_notificacion TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Crear tabla para historial de estados de seguimiento
  db.run(`
    CREATE TABLE IF NOT EXISTS historial_estados_seguimiento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codint TEXT NOT NULL,
      estado_anterior TEXT,
      estado_nuevo TEXT,
      fecha_cambio TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (codint) REFERENCES postulante_extras(codint)
    )
  `)

  // Crear índice para búsquedas rápidas
  try {
    db.run(`CREATE INDEX IF NOT EXISTS idx_historial_codint ON historial_estados_seguimiento(codint)`)
  } catch (error) {
    // El índice puede ya existir
  }

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
