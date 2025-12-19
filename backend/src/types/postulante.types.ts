export interface EstadoPostulacion {
  CODCARR: string
  ESTADO: string // 'E' | 'A' | 'M' | null
  FECREG: string
  FECMOD: string
  PRIORIDAD: number
  JORNADA: string
  MATRICULADO: string
  NOMBRE_CARRERA?: string
}

export interface Postulante {
  // Identificación
  CODINT: string
  RUT: string
  DIGITO: string
  
  // Datos personales
  NOMBRE: string
  PATERNO: string
  MATERNO: string
  SEXO: string
  FECNAC: string
  ESTADOCIVIL: string
  NACIONALIDAD: string
  PAISORIGEN: string
  
  // Contacto
  DIRECCION: string
  CIUDAD: string
  COMUNA: string
  TELEFONO: string
  CELULAR: string
  EMAIL: string
  
  // Datos académicos
  CODCOL: string
  NOMBRECOL: string
  COMUNACOLEGIO: string
  NOTAEM: string
  ANOEGRESO: string
  
  // Carreras de interés
  CARRINT1: string
  CARRINT2: string
  CARRINT3: string
  CARRINT4: string
  CARRINT5: string
  NOMBRE_C?: string // Nombre de la carrera 1 (JOIN con MT_CARRER)
  NOMBRE_C2?: string // Nombre de la carrera 2
  NOMBRE_C3?: string // Nombre de la carrera 3
  NOMBRE_C4?: string // Nombre de la carrera 4
  NOMBRE_C5?: string // Nombre de la carrera 5
  
  // Registro
  ANO: string
  PERIODO: string
  FECREG: string
  FECMOD: string
  USUARIO: string
  
  // Otros datos relevantes
  OBSERVAC1: string
  OBSERVAC2: string
  OBSERVAC3: string
  OBSERVAC4: string
  OBSERVAC5: string
  CODMEDIO: string
  VIACONSULTA: string
  SEDE: string
  JORNADACARRER: string
  PASSAPORTE: string
  FECEMISIONPA: string
  FECVENPA: string
  TIPOVISA: string
  COLDEPE: string
  POST_FUAS: string
  POST_GRATUIDAD: string
  DISCAPACIDAD: string
  ETNIA_INDIGENA: string
  TIPODOCUMENTO: string
  CODMOTIVO: string
  PAISEXTRANJERO: string
  ES_EXTRANJERO: string
  ESTABLECIMIENTO: string
  ESPECIALIDAD: string
  
  // Estados de postulación
  estados?: EstadoPostulacion[]
  
  // Estado de desistimiento (desde SQLite)
  desistido?: boolean
}

export interface PostulanteResponse {
  data: Postulante[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PostulanteStats {
  total: number
  porCarrera: Array<{ carrera: string; count: number }>
  porMes: Array<{ mes: string; count: number }>
  nuevosHoy: number
  nuevosEstaSemana: number
  matriculados: number
  matriculadosPrimeraOpcion: number
  matriculadosOtrasOpciones: number
  enEspera: number
  aprobados: number
  pendientes: number
  desistidos: number
}

export interface FiltrosPostulante {
  page?: number
  limit?: number
  search?: string
  carrera?: string
  estado?: string
  fechaDesde?: string
  fechaHasta?: string
  comuna?: string
  sexo?: string
}

