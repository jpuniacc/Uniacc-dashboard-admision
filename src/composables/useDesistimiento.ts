import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://172.16.0.206:3001'

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

  return {
    marcarDesistido,
    desmarcarDesistido,
    isLoading,
    error,
  }
}

