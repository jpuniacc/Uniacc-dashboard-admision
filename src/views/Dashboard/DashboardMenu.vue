<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const route = useRoute()

// Estado para controlar el menú móvil
const menuMobileOpen = ref(false)

// Menú de navegación - configura aquí tus rutas
const menuItems = [
  { routeName: 'postulantes', text: 'Postulantes' },
  // Agrega más items según necesites:
  // { routeName: 'analytics', text: 'Analytics' },
  // { routeName: 'settings', text: 'Configuración' },
]

// Verificar si un link está activo
const esUnLinkActivo = (routeName: string) => {
  return route.name === routeName
}

// Cerrar menú móvil al navegar
const cerrarMenuMobile = () => {
  menuMobileOpen.value = false
}

// Watch para cerrar el menú cuando cambia la ruta
watch(
  () => route.name,
  () => {
    cerrarMenuMobile()
  },
)
</script>

<template>
  <!-- Desktop: Menú horizontal -->
  <nav class="hidden items-baseline md:flex">
    <RouterLink
      v-for="item in menuItems"
      :key="item.routeName"
      :to="{ name: item.routeName }"
      class="px-3 py-2"
      :class="[esUnLinkActivo(item.routeName) ? 'cursor-default' : 'hover:bg-muted hover:text-primary']"
    >
      <p
        class="text-sm font-medium"
        :class="[esUnLinkActivo(item.routeName) ? 'border-b-2 border-primary font-semibold' : '']"
      >
        {{ item.text }}
      </p>
    </RouterLink>
  </nav>

  <!-- Mobile: Botón hamburguesa y Sheet drawer -->
  <Sheet v-model:open="menuMobileOpen">
    <SheetTrigger as-child class="md:hidden">
      <Button variant="ghost" size="icon" class="h-9 w-9">
        <Menu class="h-5 w-5" />
        <span class="sr-only">Abrir menú</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" class="w-[280px] p-0">
      <SheetHeader class="border-b px-4 py-4">
        <SheetTitle class="text-left">Menú de Navegación</SheetTitle>
      </SheetHeader>
      <nav class="flex flex-col py-4">
        <RouterLink
          v-for="item in menuItems"
          :key="item.routeName"
          :to="{ name: item.routeName }"
          class="px-4 py-3 text-sm font-medium transition-colors"
          :class="[
            esUnLinkActivo(item.routeName)
              ? 'border-l-4 border-primary bg-primary/5 font-semibold text-primary'
              : 'hover:bg-muted hover:text-primary',
          ]"
          @click="cerrarMenuMobile"
        >
          {{ item.text }}
        </RouterLink>
      </nav>
    </SheetContent>
  </Sheet>
</template>

