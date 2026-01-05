import { defineStore, acceptHMRUpdate } from 'pinia'
import type {
  Postulante,
  PostulanteStats,
  FiltrosPostulante,
} from '@/types/postulante'
import { usePostulantes } from '@/composables/usePostulantes'

export const usePostulantesStore = defineStore('postulantes-store', () => {
  const { fetchPostulantes, fetchPostulanteById, fetchStats, exportPostulantes, fetchRefresh } = usePostulantes()

  // Estado
  const todosLosPostulantes = ref<Postulante[]>([]) // Cache completo de todos los registros
  const postulanteSeleccionado = ref<Postulante | null>(null)
  const stats = ref<PostulanteStats | null>(null)
  const filtros = ref<FiltrosPostulante>({
    page: 1,
    limit: 20,
    search: '',
    carrera: '',
    estado: '',
    estado_seguimiento: '',
    ano: '',
    sexo: '',
  })
  const isLoading = ref(false)

    // Computed: Aplicar TODOS los filtros
    const postulantesFiltrados = computed(() => {
      let filtered = todosLosPostulantes.value

      // Filtro por estado (pendiente, en_espera, aprobado, matriculado, desistido)
      if (filtros.value.estado) {
        filtered = filtered.filter(p => {
          // Filtro por desistido
          if (filtros.value.estado === 'desistido') {
            return p.desistido === true
          }
          
          // Los demás filtros excluyen desistidos
          if (p.desistido) {
            return false
          }
          
          // Filtro especial para MATRICULADO: buscar en CUALQUIER carrera
          if (filtros.value.estado === 'matriculado') {
            return p.estados?.some(e => e.ESTADO === 'M') || false
          }
          
          // Para los demás estados (pendiente, en_espera, aprobado):
          // Primero excluir a los matriculados en CUALQUIER carrera
          const tieneMatricula = p.estados?.some(e => e.ESTADO === 'M') || false
          if (tieneMatricula) {
            return false // Los matriculados solo aparecen en el filtro "Matriculado"
          }
          
          // Ahora buscar en carrera principal (solo para no matriculados)
          const estadoCarreraPrincipal = p.estados?.find(
            e => e.CODCARR === p.CARRINT1 && e.JORNADA === p.JORNADACARRER
          )
          
          if (filtros.value.estado === 'pendiente') {
            return !estadoCarreraPrincipal
          }
          
          if (!estadoCarreraPrincipal) {
            return false
          }
          
          // Mapear el estado
          if (filtros.value.estado === 'en_espera') return estadoCarreraPrincipal.ESTADO === 'E'
          if (filtros.value.estado === 'aprobado') return estadoCarreraPrincipal.ESTADO === 'A'
          
          return false
        })
      } else {
        // Sin filtro: ocultar desistidos por defecto
        filtered = filtered.filter(p => !p.desistido)
      }

    // Filtro por estado de seguimiento (no_contesta, pendiente_documentacion, evaluando, alumno_vigente)
    // Se combina con el filtro de estado de postulación (AND lógico)
    if (filtros.value.estado_seguimiento) {
      filtered = filtered.filter(p => {
        // Verificar que el postulante tenga el estado de seguimiento seleccionado
        return p.estado_seguimiento === filtros.value.estado_seguimiento
      })
    }

    // Filtro por búsqueda (RUT, nombre, apellidos)
    if (filtros.value.search) {
      const searchLower = filtros.value.search.toLowerCase()
      filtered = filtered.filter(p => 
        p.RUT.includes(filtros.value.search) ||
        p.NOMBRE.toLowerCase().includes(searchLower) ||
        p.PATERNO.toLowerCase().includes(searchLower) ||
        p.MATERNO.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por carrera
    if (filtros.value.carrera) {
      const carreraLower = filtros.value.carrera.toLowerCase()
      filtered = filtered.filter(p =>
        p.NOMBRE_C?.toLowerCase().includes(carreraLower) ||
        p.NOMBRE_C2?.toLowerCase().includes(carreraLower) ||
        p.NOMBRE_C3?.toLowerCase().includes(carreraLower)
      )
    }

    // Filtro por año de postulación
    if (filtros.value.ano) {
      filtered = filtered.filter(p => p.ANO?.toString() === filtros.value.ano)
    }

    // Filtro por sexo
    if (filtros.value.sexo) {
      filtered = filtered.filter(p => p.SEXO === filtros.value.sexo)
    }

    return filtered
  })

  // Computed: Paginación sobre datos filtrados
  const postulantesPaginados = computed(() => {
    const start = (filtros.value.page - 1) * filtros.value.limit
    const end = start + filtros.value.limit
    return postulantesFiltrados.value.slice(start, end)
  })

  // Computed: Datos de paginación
  const paginacion = computed(() => ({
    total: postulantesFiltrados.value.length,
    page: filtros.value.page,
    limit: filtros.value.limit,
    totalPages: Math.ceil(postulantesFiltrados.value.length / filtros.value.limit),
  }))

  // Computed: Postulantes para mostrar (alias para compatibilidad)
  const postulantes = computed(() => postulantesPaginados.value)

  // Acciones
  async function cargarPostulantes() {
    isLoading.value = true
    try {
      const response = await fetchPostulantes()
      if (response) {
        // Cachear TODOS los datos
        todosLosPostulantes.value = response.data
        // Los computed properties se actualizarán automáticamente
      }
    } finally {
      isLoading.value = false
    }
  }

  async function cargarPostulante(codint: string) {
    isLoading.value = true
    try {
      const postulante = await fetchPostulanteById(codint)
      if (postulante) {
        postulanteSeleccionado.value = postulante
      }
    } finally {
      isLoading.value = false
    }
  }

  async function cargarStats() {
    isLoading.value = true
    try {
      const estadisticas = await fetchStats()
      if (estadisticas) {
        stats.value = estadisticas
      }
    } finally {
      isLoading.value = false
    }
  }

  async function exportar(format: 'csv' | 'json' = 'csv') {
    await exportPostulantes(filtros.value, format)
  }

  function actualizarFiltros(nuevosFiltros: Partial<FiltrosPostulante>) {
    filtros.value = { ...filtros.value, ...nuevosFiltros }
    // Resetear a la primera página cuando cambian los filtros
    if (nuevosFiltros.search !== undefined || 
        nuevosFiltros.carrera !== undefined || 
        nuevosFiltros.estado !== undefined ||
        nuevosFiltros.ano !== undefined ||
        nuevosFiltros.sexo !== undefined) {
      filtros.value.page = 1
    }
    // Ya NO necesitamos recargar desde el backend, los computed se actualizan automáticamente
  }

  function limpiarFiltros() {
    filtros.value = {
      page: 1,
      limit: 20,
      search: '',
      carrera: '',
      estado: '',
      estado_seguimiento: '',
      ano: '',
      sexo: '',
    }
  }

  function cambiarPagina(page: number) {
    filtros.value.page = page
    // Ya NO necesitamos recargar, el computed se actualiza automáticamente
  }

  function cambiarLimitePorPagina(limit: number) {
    filtros.value.limit = limit
    filtros.value.page = 1 // Volver a la primera página
    // Ya NO necesitamos recargar, el computed se actualiza automáticamente
  }

  function limpiarPostulanteSeleccionado() {
    postulanteSeleccionado.value = null
  }

  /**
   * Actualizar datos manualmente
   * Llama al endpoint de refresh y luego recarga los datos
   */
  async function refreshData() {
    isLoading.value = true
    try {
      // Primero ejecutar el refresh en el backend
      const success = await fetchRefresh()
      if (success) {
        // Luego recargar los datos
        await Promise.all([
          cargarPostulantes(),
          cargarStats(),
        ])
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Estado
    postulantes,
    postulanteSeleccionado,
    stats,
    filtros,
    paginacion,
    isLoading,
    // Acciones
    cargarPostulantes,
    cargarPostulante,
    cargarStats,
    exportar,
    actualizarFiltros,
    limpiarFiltros,
    cambiarPagina,
    cambiarLimitePorPagina,
    limpiarPostulanteSeleccionado,
    refreshData,
  }
})

// HMR support
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostulantesStore, import.meta.hot))
}

