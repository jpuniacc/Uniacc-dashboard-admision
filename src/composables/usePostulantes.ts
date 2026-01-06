import { ref } from 'vue'
import type {
  Postulante,
  PostulanteResponse,
  PostulanteStats,
  FiltrosPostulante,
} from '@/types/postulante'
import { useErrorStore } from '@/stores/error'

// Usar URL relativa si está en HTTPS, o la variable de entorno
const API_URL = import.meta.env.VITE_API_URL || (window.location.protocol === 'https:' ? '' : 'http://172.16.0.206:3001')

export function usePostulantes() {
  const errorStore = useErrorStore()
  const loading = ref(false)

  /**
   * Obtener lista de postulantes (TODOS los registros)
   * El filtrado se realiza en el frontend
   */
  async function fetchPostulantes(): Promise<PostulanteResponse | null> {
    loading.value = true
    try {
      // Ya NO enviamos filtros al backend, devuelve todos los registros
      const response = await fetch(`${API_URL}/api/postulantes`)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: PostulanteResponse = await response.json()
      return data
    } catch (error) {
      console.error('Error al obtener postulantes:', error)
      errorStore.setError({
        error: error instanceof Error ? error : new Error('Error al obtener postulantes'),
      })
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener lista de postulantes con filtros adicionales (comparación)
   * Excluye matriculados pagados y valida que al menos una carrera no esté oculta
   * El filtrado se realiza en el frontend
   */
  async function fetchPostulantesComparacion(): Promise<PostulanteResponse | null> {
    loading.value = true
    try {
      const response = await fetch(`${API_URL}/api/postulantes/comparacion`)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: PostulanteResponse = await response.json()
      return data
    } catch (error) {
      console.error('Error al obtener postulantes de comparación:', error)
      errorStore.setError({
        error: error instanceof Error ? error : new Error('Error al obtener postulantes de comparación'),
      })
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener detalle de un postulante por ID
   */
  async function fetchPostulanteById(codint: string): Promise<Postulante | null> {
    loading.value = true
    try {
      const response = await fetch(`${API_URL}/api/postulantes/${codint}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Postulante no encontrado')
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: Postulante = await response.json()
      return data
    } catch (error) {
      console.error('Error al obtener detalle del postulante:', error)
      errorStore.setError({
        error: error instanceof Error ? error : new Error('Error al obtener detalle del postulante'),
      })
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener estadísticas generales
   */
  async function fetchStats(): Promise<PostulanteStats | null> {
    loading.value = true
    try {
      const response = await fetch(`${API_URL}/api/postulantes/stats`)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: PostulanteStats = await response.json()
      return data
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      errorStore.setError({
        error: error instanceof Error ? error : new Error('Error al obtener estadísticas'),
      })
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Exportar postulantes con filtros aplicados
   */
  async function exportPostulantes(
    filtros: FiltrosPostulante = {},
    format: 'csv' | 'json' = 'csv',
  ): Promise<void> {
    loading.value = true
    try {
      // Construir query string
      const params = new URLSearchParams()
      params.append('format', format)
      if (filtros.search) params.append('search', filtros.search)
      if (filtros.carrera) params.append('carrera', filtros.carrera)
      if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde)
      if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta)
      if (filtros.comuna) params.append('comuna', filtros.comuna)
      if (filtros.sexo) params.append('sexo', filtros.sexo)

      const response = await fetch(`${API_URL}/api/postulantes/export?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Obtener el nombre del archivo del header
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `postulantes_${new Date().toISOString().split('T')[0]}.${format}`
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Descargar el archivo
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al exportar postulantes:', error)
      errorStore.setError({
        error: error instanceof Error ? error : new Error('Error al exportar postulantes'),
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * Ejecutar actualización manual de datos
   */
  async function fetchRefresh(): Promise<boolean> {
    loading.value = true
    try {
      const response = await fetch(`${API_URL}/api/postulantes/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.success === true
    } catch (error) {
      console.error('Error al actualizar datos:', error)
      errorStore.setError({
        error: error instanceof Error ? error : new Error('Error al actualizar datos'),
      })
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Enviar notificación por correo para un postulante
   */
  async function fetchNotificar(codint: string): Promise<boolean> {
    loading.value = true
    try {
      const response = await fetch(`${API_URL}/api/postulantes/${codint}/notificar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data.success === true
    } catch (error) {
      console.error('Error al enviar notificación:', error)
      errorStore.setError({
        error: error instanceof Error ? error : new Error('Error al enviar notificación'),
      })
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    fetchPostulantes,
    fetchPostulantesComparacion,
    fetchPostulanteById,
    fetchStats,
    exportPostulantes,
    fetchRefresh,
    fetchNotificar,
  }
}

