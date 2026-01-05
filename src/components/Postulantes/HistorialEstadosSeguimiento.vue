<script setup lang="ts">
import { formatearFecha } from '@/types/postulante'

interface HistorialItem {
  id: number
  estado_anterior: string | null
  estado_nuevo: string | null
  fecha_cambio: string
}

const props = defineProps<{
  historial: HistorialItem[]
  isLoading?: boolean
}>()

const estadosLabels: Record<string, string> = {
  'no_contesta': 'No Contesta',
  'pendiente_documentacion': 'Pendiente documentación',
  'evaluando': 'Evaluando',
  'alumno_vigente': 'Alumno Vigente',
}

function obtenerLabelEstado(estado: string | null): string {
  if (!estado) return 'Sin estado'
  return estadosLabels[estado] || estado
}

function obtenerColorEstado(estado: string | null): string {
  if (!estado) return 'gray'
  
  const colores: Record<string, string> = {
    'no_contesta': 'bg-gray-500',
    'pendiente_documentacion': 'bg-yellow-500',
    'evaluando': 'bg-blue-500',
    'alumno_vigente': 'bg-cyan-600',
  }
  
  return colores[estado] || 'bg-gray-500'
}
</script>

<template>
  <div v-if="isLoading" class="py-4">
    <div class="flex items-center gap-2 text-sm text-muted-foreground">
      <div class="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      <span>Cargando historial...</span>
    </div>
  </div>
  
  <div v-else-if="historial.length === 0" class="py-4">
    <p class="text-sm text-muted-foreground text-center">No hay historial de cambios de estado</p>
  </div>
  
  <div v-else class="relative py-4">
    <div class="flex items-start gap-4 overflow-x-auto pb-2">
      <div 
        v-for="(item, index) in historial" 
        :key="item.id"
        class="flex items-start gap-3 min-w-0 flex-shrink-0"
      >
        <!-- Línea conectora horizontal -->
        <div 
          v-if="index < historial.length - 1"
          class="absolute top-[20px] h-0.5 w-4 bg-gray-300 dark:bg-gray-700"
          :style="{ left: `${index * 200 + 16}px` }"
        ></div>
        
        <!-- Nodo circular (estilo GitHub) -->
        <div class="relative z-10 flex-shrink-0">
          <div 
            :class="[
              'w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 transition-all duration-300 shadow-sm flex items-center justify-center',
              item.estado_nuevo ? obtenerColorEstado(item.estado_nuevo) : 'bg-gray-300 dark:bg-gray-600'
            ]"
          >
            <svg 
              v-if="item.estado_nuevo === 'alumno_vigente'" 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-4 w-4 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <svg 
              v-else-if="item.estado_nuevo === 'evaluando'" 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-4 w-4 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <svg 
              v-else-if="item.estado_nuevo === 'pendiente_documentacion'" 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-4 w-4 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <svg 
              v-else-if="item.estado_nuevo === 'no_contesta'" 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-4 w-4 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        </div>
        
        <!-- Información del cambio -->
        <div class="flex-1 min-w-0 pb-4">
          <div class="flex items-center gap-2 flex-wrap">
            <span 
              v-if="item.estado_anterior"
              class="text-xs text-muted-foreground line-through"
            >
              {{ obtenerLabelEstado(item.estado_anterior) }}
            </span>
            <svg 
              v-if="item.estado_anterior && item.estado_nuevo"
              xmlns="http://www.w3.org/2000/svg" 
              class="h-3 w-3 text-muted-foreground" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span 
              v-if="item.estado_nuevo"
              class="text-xs font-medium"
            >
              {{ obtenerLabelEstado(item.estado_nuevo) }}
            </span>
            <span 
              v-else
              class="text-xs font-medium text-muted-foreground"
            >
              Estado eliminado
            </span>
          </div>
          <p class="text-xs text-muted-foreground mt-1">
            {{ formatearFecha(item.fecha_cambio) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

