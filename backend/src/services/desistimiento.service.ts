import { getDatabase, saveDatabase } from '../config/sqlite'

export class DesistimientoService {
  // Marcar como desistido
  async marcarDesistido(codint: string): Promise<boolean> {
    try {
      const db = await getDatabase()
      
      db.run(`
        INSERT OR REPLACE INTO postulante_extras (codint, desistido, fecha_desistimiento, updated_at)
        VALUES (?, 1, datetime('now'), datetime('now'))
      `, [codint])
      
      saveDatabase()
      return true
    } catch (error) {
      console.error('Error al marcar desistido:', error)
      return false
    }
  }

  // Desmarcar desistido
  async desmarcarDesistido(codint: string): Promise<boolean> {
    try {
      const db = await getDatabase()
      
      db.run(`
        UPDATE postulante_extras 
        SET desistido = 0, updated_at = datetime('now')
        WHERE codint = ?
      `, [codint])
      
      saveDatabase()
      return true
    } catch (error) {
      console.error('Error al desmarcar desistido:', error)
      return false
    }
  }

  // Obtener estado de desistimiento
  async obtenerEstado(codint: string): Promise<any> {
    try {
      const db = await getDatabase()
      
      const result = db.exec('SELECT * FROM postulante_extras WHERE codint = ?', [codint])
      
      if (result.length > 0 && result[0].values.length > 0) {
        const row = result[0].values[0]
        const columns = result[0].columns
        
        const obj: any = {}
        columns.forEach((col: string, index: number) => {
          obj[col] = row[index]
        })
        
        return obj
      }
      
      return null
    } catch (error) {
      console.error('Error al obtener estado:', error)
      return null
    }
  }

  // Obtener todos los desistidos
  async obtenerTodosDesistidos(): Promise<string[]> {
    try {
      const db = await getDatabase()
      
      const result = db.exec('SELECT codint FROM postulante_extras WHERE desistido = 1')
      
      if (result.length > 0) {
        return result[0].values.map((row: any[]) => String(row[0]))
      }
      
      return []
    } catch (error) {
      console.error('Error al obtener desistidos:', error)
      return []
    }
  }
}
