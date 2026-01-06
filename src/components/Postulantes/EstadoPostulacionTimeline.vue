<script setup lang="ts">
import type { EstadoPostulacion } from '@/types/postulante'
import { formatearFecha } from '@/types/postulante'

const props = defineProps<{
  estadoActual: EstadoPostulacion | null
  esAlumnoVigente?: boolean
}>()

const pasos = [
  { id: null, texto: 'Pendiente', color: 'gray', bgColor: 'bg-gray-500', borderColor: 'border-gray-500', lineColor: 'bg-gray-400' },
  { id: 'E', texto: 'En Espera', color: 'yellow', bgColor: 'bg-yellow-500', borderColor: 'border-yellow-500', lineColor: 'bg-yellow-400' },
  { id: 'A', texto: 'Aprobado', color: 'green', bgColor: 'bg-green-500', borderColor: 'border-green-500', lineColor: 'bg-green-400' },
  { id: 'M', texto: 'Matriculado', color: 'blue', bgColor: 'bg-blue-600', borderColor: 'border-blue-600', lineColor: 'bg-blue-500' },
  { id: 'VIGENTE', texto: 'Alumno Vigente', color: 'cyan', bgColor: 'bg-cyan-600', borderColor: 'border-cyan-600', lineColor: 'bg-cyan-500' }
]

function esPasoActual(pasoId: string | null): boolean {
  // Si es alumno vigente, mostrar "Alumno Vigente" como estado actual
  if (props.esAlumnoVigente) {
    return pasoId === 'VIGENTE'
  }
  
  return props.estadoActual?.ESTADO === pasoId || 
         (!props.estadoActual && pasoId === null)
}

function esPasoCompletado(pasoId: string | null): boolean {
  const orden: Record<string, number> = { 'null': 0, 'E': 1, 'A': 2, 'M': 3, 'VIGENTE': 4 }
  
  // Si es alumno vigente, todos los pasos anteriores están completados
  if (props.esAlumnoVigente) {
    const ordenPaso = orden[pasoId || 'null']
    return ordenPaso < orden['VIGENTE']
  }
  
  const estadoEfectivo = props.estadoActual?.ESTADO || 'null'
  const ordenActual = orden[estadoEfectivo]
  const ordenPaso = orden[pasoId || 'null']
  return ordenActual > ordenPaso
}

function esPasoActivo(pasoId: string | null): boolean {
  return esPasoActual(pasoId) || esPasoCompletado(pasoId)
}
</script>

<template>
  <div class="relative py-6 px-2">
    <div class="flex justify-between items-start relative">
      <div 
        v-for="(paso, index) in pasos" 
        :key="paso.id || 'pendiente'"
        class="flex flex-col items-center relative flex-1"
      >
        <!-- Línea conectora horizontal -->
        <div 
          v-if="index < pasos.length - 1"
          class="absolute top-[8px] h-1 transition-all duration-300 rounded-full"
          :class="[
            esPasoActivo(pasos[index + 1].id) ? pasos[index + 1].lineColor : 'bg-gray-200 dark:bg-gray-700'
          ]"
          :style="{
            left: '50%',
            right: '-50%',
            zIndex: 0
          }"
        ></div>
        
        <!-- Nodo circular (estilo GitHub commit) -->
        <div class="relative z-10">
          <div 
            :class="[
              'w-4 h-4 rounded-full border-4 border-white dark:border-gray-900 transition-all duration-300 shadow-sm',
              esPasoActivo(paso.id) ? paso.bgColor : 'bg-gray-300 dark:bg-gray-600',
              esPasoActual(paso.id) ? 'scale-150 shadow-lg' : ''
            ]"
            :style="esPasoActual(paso.id) ? `box-shadow: 0 0 0 4px ${paso.color === 'yellow' ? 'rgb(234 179 8 / 0.3)' : paso.color === 'green' ? 'rgb(34 197 94 / 0.3)' : paso.color === 'blue' ? 'rgb(37 99 235 / 0.3)' : paso.color === 'cyan' ? 'rgb(8 145 178 / 0.3)' : 'rgb(107 114 128 / 0.3)'}` : ''"
          ></div>
        </div>
        
        <!-- Label del estado -->
        <div class="mt-4 text-center">
          <p 
            :class="[
              'text-xs font-medium whitespace-nowrap',
              esPasoActivo(paso.id) ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
            ]"
          >
            {{ paso.texto }}
          </p>
          
          <!-- Fecha (solo si es estado actual) -->
          <p 
            v-if="esPasoActual(paso.id) && estadoActual?.FECREG" 
            class="text-xs text-gray-500 dark:text-gray-400 mt-1"
          >
            {{ formatearFecha(estadoActual.FECREG) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

