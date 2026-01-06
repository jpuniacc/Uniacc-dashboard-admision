import { ref } from 'vue'

// Usar URL relativa si está en HTTPS, o la variable de entorno
const API_URL = import.meta.env.VITE_API_URL || (window.location.protocol === 'https:' ? '' : 'http://172.16.0.206:3001')

export function useDesistimiento() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function marcarDesistido(codint: string): Promise<boolean> {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_URL}/api/postulantes/${codint}/desistir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        error.value = errorData.error || 'Error al marcar como desistido'
        return false
      }

      return true
    } catch (err) {
      console.error('Error al marcar desistido:', err)
      error.value = 'Error de conexión al marcar como desistido'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function desmarcarDesistido(codint: string): Promise<boolean> {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_URL}/api/postulantes/${codint}/desistir`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        error.value = errorData.error || 'Error al reactivar postulante'
        return false
      }

      return true
    } catch (err) {
      console.error('Error al desmarcar desistido:', err)
      error.value = 'Error de conexión al reactivar postulante'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function actualizarEstadoSeguimiento(codint: string, estado: string | null): Promise<boolean> {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_URL}/api/postulantes/${codint}/estado-seguimiento`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        error.value = errorData.error || 'Error al actualizar estado de seguimiento'
        return false
      }

      return true
    } catch (err) {
      console.error('Error al actualizar estado de seguimiento:', err)
      error.value = 'Error de conexión al actualizar estado de seguimiento'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function obtenerHistorialEstados(codint: string): Promise<Array<{
    id: number
    estado_anterior: string | null
    estado_nuevo: string | null
    fecha_cambio: string
  }> | null> {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_URL}/api/postulantes/${codint}/historial-estados`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        error.value = errorData.error || 'Error al obtener historial de estados'
        return null
      }

      const data = await response.json()
      return data.historial || []
    } catch (err) {
      console.error('Error al obtener historial de estados:', err)
      error.value = 'Error de conexión al obtener historial de estados'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    marcarDesistido,
    desmarcarDesistido,
    actualizarEstadoSeguimiento,
    obtenerHistorialEstados,
    isLoading,
    error,
  }
}

