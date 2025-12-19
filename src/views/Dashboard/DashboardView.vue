<script setup lang="ts">
import DashboardMenu from './DashboardMenu.vue'
import DashboardLogo from './DashboardLogo.vue'
</script>

<template>
  <div class="flex min-h-svh flex-col">
    <!-- Header -->
    <div class="border-b bg-white">
      <header class="mx-auto max-w-7xl">
        <div class="flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
          <!-- Logo y menú -->
          <div class="flex items-center space-x-4 md:space-x-6">
            <DashboardLogo />
            <DashboardMenu />
          </div>

          <!-- Área derecha del header (puedes agregar avatar, notificaciones, etc.) -->
          <div class="flex items-center space-x-4">
            <p class="hidden text-sm text-gray-500 md:block">
              {{
                new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              }}
            </p>
          </div>
        </div>
      </header>
    </div>

    <!-- Contenido principal -->
    <main class="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer class="border-t bg-white py-4">
      <div class="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 md:px-6">
        Sistema de revisión de postulantes &copy; {{ new Date().getFullYear() }}
      </div>
    </footer>
  </div>
</template>

