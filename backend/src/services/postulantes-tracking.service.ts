import { getDatabase, saveDatabase } from '../config/sqlite'
import type { Postulante } from '../types/postulante.types'

export class PostulantesTrackingService {
  /**
   * Obtiene la lista de CODINT de postulantes ya notificados
   */
  async obtenerPostulantesNotificados(): Promise<string[]> {
    try {
      const db = await getDatabase()
      const result = db.exec('SELECT codint FROM postulantes_notificados')
      
      if (result.length === 0) {
        return []
      }

      return result[0].values.map((row: any[]) => String(row[0]))
    } catch (error) {
      console.error('Error al obtener postulantes notificados:', error)
      return []
    }
  }

  /**
   * Detecta nuevos postulantes comparando la lista actual con los ya notificados
   */
  async detectarNuevosPostulantes(postulantes: Postulante[]): Promise<Postulante[]> {
    try {
      const notificados = await this.obtenerPostulantesNotificados()
      console.log(`📊 [Tracking] Total postulantes notificados en BD: ${notificados.length}`)
      console.log(`📊 [Tracking] Total postulantes actuales: ${postulantes.length}`)
      
      // Asegurar que todos los CODINT sean strings para la comparación
      const notificadosSet = new Set(notificados.map(c => String(c)))
      
      // Convertir CODINT a string para comparación
      const nuevos = postulantes.filter(p => {
        const codintStr = String(p.CODINT)
        const esNuevo = !notificadosSet.has(codintStr)
        return esNuevo
      })
      
      if (nuevos.length > 0) {
        console.log(`📧 [Tracking] Se detectaron ${nuevos.length} nuevo(s) postulante(s)`)
        console.log(`   CODINTs nuevos: ${nuevos.map(p => String(p.CODINT)).join(', ')}`)
      } else {
        console.log(`✅ [Tracking] No hay nuevos postulantes. Todos ya fueron notificados.`)
      }

      return nuevos
    } catch (error) {
      console.error('Error al detectar nuevos postulantes:', error)
      return []
    }
  }

  /**
   * Marca un postulante como notificado
   */
  async marcarComoNotificado(codint: string): Promise<boolean> {
    try {
      const db = await getDatabase()
      const fechaNotificacion = new Date().toISOString()
      const codintStr = String(codint) // Asegurar que sea string

      db.run(
        'INSERT OR REPLACE INTO postulantes_notificados (codint, fecha_notificacion) VALUES (?, ?)',
        [codintStr, fechaNotificacion]
      )

      saveDatabase()
      console.log(`✅ [Tracking] Postulante ${codintStr} marcado como notificado`)
      return true
    } catch (error) {
      console.error(`Error al marcar postulante ${codint} como notificado:`, error)
      return false
    }
  }

  /**
   * Verifica si un postulante ya fue notificado
   */
  async estaNotificado(codint: string): Promise<boolean> {
    try {
      const db = await getDatabase()
      const result = db.exec(`SELECT codint FROM postulantes_notificados WHERE codint = '${codint.replace(/'/g, "''")}'`)
      return result.length > 0 && result[0].values.length > 0
    } catch (error) {
      console.error(`Error al verificar si postulante ${codint} está notificado:`, error)
      return false
    }
  }

  /**
   * Elimina un postulante de la lista de notificados (útil para reenvío)
   */
  async eliminarNotificacion(codint: string): Promise<boolean> {
    try {
      const db = await getDatabase()
      db.run('DELETE FROM postulantes_notificados WHERE codint = ?', [codint])
      saveDatabase()
      return true
    } catch (error) {
      console.error(`Error al eliminar notificación de postulante ${codint}:`, error)
      return false
    }
  }
}

