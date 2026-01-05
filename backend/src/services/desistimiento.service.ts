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

  // Actualizar estado de seguimiento
  async actualizarEstadoSeguimiento(codint: string, estado: string | null): Promise<boolean> {
    try {
      const db = await getDatabase()
      
      // Obtener estado actual antes de cambiarlo
      const estadoActual = await this.obtenerEstadoSeguimiento(codint)
      
      // Si estado es null, eliminar el estado
      if (estado === null) {
        // Guardar en historial antes de eliminar
        if (estadoActual) {
          db.run(`
            INSERT INTO historial_estados_seguimiento (codint, estado_anterior, estado_nuevo, fecha_cambio)
            VALUES (?, ?, NULL, datetime('now'))
          `, [codint, estadoActual])
        }
        
        db.run(`
          UPDATE postulante_extras 
          SET estado_seguimiento = NULL, updated_at = datetime('now')
          WHERE codint = ?
        `, [codint])
        saveDatabase()
        return true
      }
      
      // Validar que el estado sea uno de los permitidos
      const estadosPermitidos = ['no_contesta', 'pendiente_documentacion', 'evaluando', 'alumno_vigente']
      if (!estadosPermitidos.includes(estado)) {
        console.error('Estado no permitido:', estado)
        return false
      }
      
      // Solo guardar en historial si el estado cambió
      if (estadoActual !== estado) {
        db.run(`
          INSERT INTO historial_estados_seguimiento (codint, estado_anterior, estado_nuevo, fecha_cambio)
          VALUES (?, ?, ?, datetime('now'))
        `, [codint, estadoActual || null, estado])
      }
      
      db.run(`
        INSERT OR REPLACE INTO postulante_extras (codint, estado_seguimiento, updated_at)
        VALUES (?, ?, datetime('now'))
      `, [codint, estado])
      
      saveDatabase()
      return true
    } catch (error) {
      console.error('Error al actualizar estado de seguimiento:', error)
      return false
    }
  }

  // Obtener estado de seguimiento
  async obtenerEstadoSeguimiento(codint: string): Promise<string | null> {
    try {
      const db = await getDatabase()
      
      const result = db.exec('SELECT estado_seguimiento FROM postulante_extras WHERE codint = ?', [codint])
      
      if (result.length > 0 && result[0].values.length > 0) {
        const estado = result[0].values[0][0]
        return estado ? String(estado) : null
      }
      
      return null
    } catch (error) {
      console.error('Error al obtener estado de seguimiento:', error)
      return null
    }
  }

  // Obtener todos los estados de seguimiento (para incluir en respuestas)
  async obtenerTodosEstadosSeguimiento(): Promise<Record<string, string>> {
    try {
      const db = await getDatabase()
      
      const result = db.exec('SELECT codint, estado_seguimiento FROM postulante_extras WHERE estado_seguimiento IS NOT NULL')
      
      const estados: Record<string, string> = {}
      
      if (result.length > 0) {
        result[0].values.forEach((row: any[]) => {
          const codint = String(row[0])
          const estado = row[1] ? String(row[1]) : null
          if (estado) {
            estados[codint] = estado
          }
        })
      }
      
      return estados
    } catch (error) {
      console.error('Error al obtener estados de seguimiento:', error)
      return {}
    }
  }

  // Obtener historial de estados de seguimiento
  async obtenerHistorialEstados(codint: string): Promise<Array<{
    id: number
    estado_anterior: string | null
    estado_nuevo: string | null
    fecha_cambio: string
  }>> {
    try {
      const db = await getDatabase()
      
      const result = db.exec(`
        SELECT id, estado_anterior, estado_nuevo, fecha_cambio 
        FROM historial_estados_seguimiento 
        WHERE codint = ? 
        ORDER BY fecha_cambio DESC
      `, [codint])
      
      if (result.length > 0) {
        const historial: Array<{
          id: number
          estado_anterior: string | null
          estado_nuevo: string | null
          fecha_cambio: string
        }> = []
        
        result[0].values.forEach((row: any[]) => {
          historial.push({
            id: row[0],
            estado_anterior: row[1] ? String(row[1]) : null,
            estado_nuevo: row[2] ? String(row[2]) : null,
            fecha_cambio: String(row[3])
          })
        })
        
        return historial
      }
      
      return []
    } catch (error) {
      console.error('Error al obtener historial de estados:', error)
      return []
    }
  }
}
