/**
 * Store principal de la aplicación
 * Aquí puedes agregar estado global que necesites
 */
export const useAppStore = defineStore('app-store', () => {
  // Estado de la aplicación
  const appName = ref('UNIACC')
  const isLoading = ref(false)
  const sidebarOpen = ref(true)

  // Acciones
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  return {
    appName,
    isLoading,
    sidebarOpen,
    setLoading,
    toggleSidebar,
  }
})

// HMR support
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}

