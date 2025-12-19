import sql from 'mssql'
import { getConnection } from '../config/database'
import { Postulante, PostulanteResponse, PostulanteStats, FiltrosPostulante } from '../types/postulante.types'
import { DesistimientoService } from './desistimiento.service'

export class PostulantesService {
  private desistimientoService: DesistimientoService

  constructor() {
    this.desistimientoService = new DesistimientoService()
  }

  async initialize() {
    // Inicializar SQLite al arrancar
    await this.desistimientoService.obtenerTodosDesistidos()
  }

  async getPostulantes(filtros: FiltrosPostulante): Promise<PostulanteResponse> {
    try {
      const pool = await getConnection()
      const request = pool.request()

      // Obtener TODOS los registros sin filtros (excepto ANO y POSTULACION)
      const dataQuery = `
        SELECT 
          INT.*,
          C1.NOMBRE_C as NOMBRE_C,
          C2.NOMBRE_C as NOMBRE_C2,
          C3.NOMBRE_C as NOMBRE_C3,
          C4.NOMBRE_C as NOMBRE_C4,
          C5.NOMBRE_C as NOMBRE_C5,
          (SELECT 
            PC.CODCARR,
            PC.ESTADO,
            PC.FECREG,
            PC.FECMOD,
            PC.PRIORIDAD,
            PC.JORNADA,
            PC.MATRICULADO,
            CARR.NOMBRE_C as NOMBRE_CARRERA
           FROM MT_POSCAR PC
           LEFT JOIN MT_CARRER CARR ON PC.CODCARR = CARR.CODCARR
           WHERE PC.CODPOSTUL = INT.CODINT 
             AND PC.ANO = 2026
           FOR JSON PATH
          ) as estados_json
        FROM MT_INTERE INT
        LEFT JOIN MT_CARRER C1 ON INT.CARRINT1 = C1.CODCARR
        LEFT JOIN MT_CARRER C2 ON INT.CARRINT2 = C2.CODCARR
        LEFT JOIN MT_CARRER C3 ON INT.CARRINT3 = C3.CODCARR
        LEFT JOIN MT_CARRER C4 ON INT.CARRINT4 = C4.CODCARR
        LEFT JOIN MT_CARRER C5 ON INT.CARRINT5 = C5.CODCARR
        WHERE INT.ANO=2026 AND INT.POSTULACION='SI' AND INT.FECREG >= '2025-08-01'
        ORDER BY INT.FECREG DESC
      `

      const dataResult = await request.query(dataQuery)
      
      // Obtener lista de desistidos desde SQLite
      const desistidos = await this.desistimientoService.obtenerTodosDesistidos()
      
      // Parse estados_json for each postulante y agregar campo desistido
      const postulantes = dataResult.recordset.map((postulante: any) => {
        if (postulante.estados_json) {
          try {
            postulante.estados = JSON.parse(postulante.estados_json)
          } catch (e) {
            postulante.estados = []
          }
        } else {
          postulante.estados = []
        }
        delete postulante.estados_json
        
        // Agregar campo desistido (convertir CODINT a string para comparar)
        postulante.desistido = desistidos.includes(String(postulante.CODINT))
        
        return postulante as Postulante
      })

      // Devolver TODOS los registros sin paginación
      const total = postulantes.length

      return {
        data: postulantes,
        total,
        page: 1,
        limit: total,
        totalPages: 1,
      }
    } catch (error) {
      console.error('Error en getPostulantes:', error)
      throw error
    }
  }

  async getPostulanteById(codint: string): Promise<Postulante | null> {
    try {
      const pool = await getConnection()
      const request = pool.request()

      request.input('codint', sql.VarChar, codint)

      const query = `
        SELECT 
          INT.*,
          C1.NOMBRE_C as NOMBRE_C,
          C2.NOMBRE_C as NOMBRE_C2,
          C3.NOMBRE_C as NOMBRE_C3,
          C4.NOMBRE_C as NOMBRE_C4,
          C5.NOMBRE_C as NOMBRE_C5,
          (SELECT 
            PC.CODCARR,
            PC.ESTADO,
            PC.FECREG,
            PC.FECMOD,
            PC.PRIORIDAD,
            PC.JORNADA,
            PC.MATRICULADO,
            CARR.NOMBRE_C as NOMBRE_CARRERA
           FROM MT_POSCAR PC
           LEFT JOIN MT_CARRER CARR ON PC.CODCARR = CARR.CODCARR
           WHERE PC.CODPOSTUL = INT.CODINT 
             AND PC.ANO = 2026
           FOR JSON PATH
          ) as estados_json
        FROM MT_INTERE INT
        LEFT JOIN MT_CARRER C1 ON INT.CARRINT1 = C1.CODCARR
        LEFT JOIN MT_CARRER C2 ON INT.CARRINT2 = C2.CODCARR
        LEFT JOIN MT_CARRER C3 ON INT.CARRINT3 = C3.CODCARR
        LEFT JOIN MT_CARRER C4 ON INT.CARRINT4 = C4.CODCARR
        LEFT JOIN MT_CARRER C5 ON INT.CARRINT5 = C5.CODCARR
        WHERE INT.CODINT = @codint AND INT.ANO=2026 AND INT.POSTULACION='SI' AND INT.FECREG >= '2025-08-01'
      `

      const result = await request.query(query)

      if (result.recordset.length === 0) {
        return null
      }

      const postulante: any = result.recordset[0]
      
      // Parse estados_json
      if (postulante.estados_json) {
        try {
          postulante.estados = JSON.parse(postulante.estados_json)
        } catch (e) {
          postulante.estados = []
        }
      } else {
        postulante.estados = []
      }
      delete postulante.estados_json
      
      // Agregar campo desistido (convertir CODINT a string)
      const estadoDesistimiento = await this.desistimientoService.obtenerEstado(String(postulante.CODINT))
      postulante.desistido = estadoDesistimiento?.desistido || false

      return postulante as Postulante
    } catch (error) {
      console.error('Error en getPostulanteById:', error)
      throw error
    }
  }

  async getStats(): Promise<PostulanteStats> {
    try {
      const pool = await getConnection()

      // Total de postulantes
      const totalResult = await pool.request().query(`
        SELECT COUNT(*) as total 
        FROM MT_INTERE 
        WHERE ANO=2026 AND POSTULACION='SI' AND FECREG >= '2025-08-01'
      `)
      const total = totalResult.recordset[0].total

      // Postulantes por carrera (top 10)
      const porCarreraResult = await pool.request().query(`
        SELECT TOP 10 
          ISNULL(MT_CARRER.NOMBRE_C, INT.CARRINT1) as carrera, 
          COUNT(*) as count 
        FROM MT_INTERE INT
        LEFT JOIN MT_CARRER ON INT.CARRINT1 = MT_CARRER.CODCARR
        WHERE INT.ANO=2026 AND INT.POSTULACION='SI' AND INT.FECREG >= '2025-08-01' AND INT.CARRINT1 IS NOT NULL AND INT.CARRINT1 != ''
        GROUP BY ISNULL(MT_CARRER.NOMBRE_C, INT.CARRINT1)
        ORDER BY count DESC
      `)

      // Postulantes por mes
      const porMesResult = await pool.request().query(`
        SELECT 
          FORMAT(FECREG, 'yyyy-MM') as mes,
          COUNT(*) as count
        FROM MT_INTERE 
        WHERE ANO=2026 AND POSTULACION='SI' AND FECREG >= '2025-08-01'
        GROUP BY FORMAT(FECREG, 'yyyy-MM')
        ORDER BY mes DESC
      `)

      // Nuevos hoy
      const hoyResult = await pool.request().query(`
        SELECT COUNT(*) as count
        FROM MT_INTERE 
        WHERE ANO=2026 AND POSTULACION='SI' AND FECREG >= '2025-08-01'
        AND CAST(FECREG AS DATE) = CAST(GETDATE() AS DATE)
      `)

      // Nuevos esta semana
      const semanaResult = await pool.request().query(`
        SELECT COUNT(*) as count
        FROM MT_INTERE 
        WHERE ANO=2026 AND POSTULACION='SI' AND FECREG >= '2025-08-01'
        AND FECREG >= DATEADD(day, -7, GETDATE())
      `)

      // Matriculados en carrera PRINCIPAL (CARRINT1)
      const matriculadosPrimeraOpcionResult = await pool.request().query(`
        SELECT COUNT(DISTINCT INT.CODINT) as count
        FROM MT_INTERE INT
        INNER JOIN MT_POSCAR POS ON INT.CODINT = POS.CODPOSTUL
        WHERE INT.ANO=2026 AND INT.POSTULACION='SI' AND INT.FECREG >= '2025-08-01'
        AND POS.ANO=2026 AND POS.ESTADO='M'
        AND POS.CODCARR = INT.CARRINT1
        AND POS.JORNADA = INT.JORNADACARRER
      `)

      // Matriculados en OTRAS opciones (cualquier carrera que NO sea su 1ª opción)
      const matriculadosOtrasOpcionesResult = await pool.request().query(`
        SELECT COUNT(DISTINCT INT.CODINT) as count
        FROM MT_INTERE INT
        INNER JOIN MT_POSCAR POS ON INT.CODINT = POS.CODPOSTUL
        WHERE INT.ANO=2026 AND INT.POSTULACION='SI' AND INT.FECREG >= '2025-08-01'
          AND POS.ANO=2026 AND POS.ESTADO='M'
          -- La carrera matriculada NO es su primera opción (manejando NULLs correctamente)
          AND NOT (INT.CARRINT1 IS NOT NULL AND POS.CODCARR = INT.CARRINT1 AND POS.JORNADA = INT.JORNADACARRER)
      `)

      const matriculadosPrimeraOpcion = matriculadosPrimeraOpcionResult.recordset[0].count
      const matriculadosOtrasOpciones = matriculadosOtrasOpcionesResult.recordset[0].count

      // Estados de postulación
      // En Espera (ESTADO='E')
      const enEsperaResult = await pool.request().query(`
        SELECT COUNT(DISTINCT INT.CODINT) as count
        FROM MT_INTERE INT
        INNER JOIN MT_POSCAR POS ON INT.CODINT = POS.CODPOSTUL
        WHERE INT.ANO=2026 AND INT.POSTULACION='SI' AND INT.FECREG >= '2025-08-01'
        AND POS.ANO=2026 AND POS.ESTADO='E'
      `)

      // Aprobados (ESTADO='A')
      const aprobadosResult = await pool.request().query(`
        SELECT COUNT(DISTINCT INT.CODINT) as count
        FROM MT_INTERE INT
        INNER JOIN MT_POSCAR POS ON INT.CODINT = POS.CODPOSTUL
        WHERE INT.ANO=2026 AND INT.POSTULACION='SI' AND INT.FECREG >= '2025-08-01'
        AND POS.ANO=2026 AND POS.ESTADO='A'
      `)

      // Pendientes (sin estado en MT_POSCAR o estado NULL)
      const pendientesResult = await pool.request().query(`
        SELECT COUNT(DISTINCT INT.CODINT) as count
        FROM MT_INTERE INT
        LEFT JOIN MT_POSCAR POS ON INT.CODINT = POS.CODPOSTUL AND POS.ANO=2026
        WHERE INT.ANO=2026 AND INT.POSTULACION='SI' AND INT.FECREG >= '2025-08-01'
        AND (POS.CODPOSTUL IS NULL OR POS.ESTADO IS NULL)
      `)

      // Desistidos (desde SQLite)
      const desistidos = await this.desistimientoService.obtenerTodosDesistidos()
      const desistidosCount = desistidos.length

      return {
        total,
        porCarrera: porCarreraResult.recordset,
        porMes: porMesResult.recordset,
        nuevosHoy: hoyResult.recordset[0].count,
        nuevosEstaSemana: semanaResult.recordset[0].count,
        matriculados: matriculadosPrimeraOpcion + matriculadosOtrasOpciones,
        matriculadosPrimeraOpcion,
        matriculadosOtrasOpciones,
        enEspera: enEsperaResult.recordset[0].count,
        aprobados: aprobadosResult.recordset[0].count,
        pendientes: pendientesResult.recordset[0].count,
        desistidos: desistidosCount,
      }
    } catch (error) {
      console.error('Error en getStats:', error)
      throw error
    }
  }

  async exportPostulantes(filtros: FiltrosPostulante): Promise<Postulante[]> {
    try {
      // Obtener todos los registros sin paginación
      const pool = await getConnection()
      
      let whereConditions = ['ANO=2026', "POSTULACION='SI'", "FECREG >= '2025-08-01'"]
      const request = pool.request()

      // Aplicar los mismos filtros que en getPostulantes
      if (filtros.search) {
        whereConditions.push(
          "(RUT LIKE @search OR NOMBRE LIKE @search OR PATERNO LIKE @search OR MATERNO LIKE @search)"
        )
        request.input('search', sql.VarChar, `%${filtros.search}%`)
      }

      if (filtros.carrera) {
        whereConditions.push("(CARRINT1 LIKE @carrera OR CARRINT2 LIKE @carrera OR CARRINT3 LIKE @carrera)")
        request.input('carrera', sql.VarChar, `%${filtros.carrera}%`)
      }

      if (filtros.fechaDesde) {
        whereConditions.push("FECREG >= @fechaDesde")
        request.input('fechaDesde', sql.DateTime, new Date(filtros.fechaDesde))
      }

      if (filtros.fechaHasta) {
        whereConditions.push("FECREG <= @fechaHasta")
        request.input('fechaHasta', sql.DateTime, new Date(filtros.fechaHasta))
      }

      if (filtros.comuna) {
        whereConditions.push("COMUNA LIKE @comuna")
        request.input('comuna', sql.VarChar, `%${filtros.comuna}%`)
      }

      if (filtros.sexo) {
        whereConditions.push("SEXO = @sexo")
        request.input('sexo', sql.VarChar, filtros.sexo)
      }

      const whereClause = whereConditions.join(' AND ')

      const query = `
        SELECT INT.*, MT_CARRER.NOMBRE_C
        FROM MT_INTERE INT
        LEFT JOIN MT_CARRER ON INT.CARRINT1 = MT_CARRER.CODCARR
        WHERE ${whereClause}
        ORDER BY INT.FECREG DESC
      `

      const result = await request.query(query)
      return result.recordset as Postulante[]
    } catch (error) {
      console.error('Error en exportPostulantes:', error)
      throw error
    }
  }
}

