<script setup lang="ts">
import { computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import EstadoPostulacionTimeline from './EstadoPostulacionTimeline.vue'
import type { Postulante } from '@/types/postulante'
import { getNombreCompleto, getRutCompleto, formatearFecha, obtenerCarreras, obtenerEstadoCarrera } from '@/types/postulante'
import { useDesistimiento } from '@/composables/useDesistimiento'
import { toast } from 'vue-sonner'

const props = defineProps<{
  open: boolean
  postulante: Postulante | null
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'desistimiento-actualizado': []
}>()

const { marcarDesistido, desmarcarDesistido, isLoading: isLoadingDesistimiento } = useDesistimiento()

// Verificar si el postulante está matriculado en alguna carrera
const estaMatriculado = computed(() => {
  if (!props.postulante?.estados) return false
  return props.postulante.estados.some(estado => estado.ESTADO === 'M')
})

// Obtener todas las carreras relevantes (interés + matriculadas extras)
const carrerasParaMostrar = computed(() => {
  if (!props.postulante) return []
  
  const carreras: Array<{numero: number, codigo: string, nombre: string | null}> = []
  
  // 1. Agregar carreras de interés (CARRINT1-5)
  const carrerasInteres = obtenerCarreras(props.postulante)
  carreras.push(...carrerasInteres)
  
  // 2. Agregar carreras matriculadas que NO estén en la lista de interés
  if (props.postulante.estados) {
    const codigosInteres = carrerasInteres.map(c => c.codigo)
    const matriculadas = props.postulante.estados.filter(e => 
      e.ESTADO === 'M' && !codigosInteres.includes(e.CODCARR)
    )
    
    // Agregar cada carrera matriculada extra
    matriculadas.forEach((estado, index) => {
      carreras.push({
        numero: carreras.length + 1,
        codigo: estado.CODCARR,
        nombre: estado.NOMBRE_CARRERA || null
      })
    })
  }
  
  return carreras
})

function handleOpenChange(value: boolean) {
  emit('update:open', value)
}

async function toggleDesistido() {
  if (!props.postulante) return
  
  const exito = props.postulante.desistido 
    ? await desmarcarDesistido(props.postulante.CODINT)
    : await marcarDesistido(props.postulante.CODINT)
    
  if (exito) {
    toast.success(
      props.postulante.desistido ? 'Postulante reactivado' : 'Postulante marcado como desistido',
      {
        description: props.postulante.desistido 
          ? 'El postulante ha sido reactivado exitosamente.'
          : 'El postulante ha sido marcado como desistido.',
      }
    )
    emit('desistimiento-actualizado')
    emit('update:open', false)
  } else {
    toast.error('Error', {
      description: 'No se pudo actualizar el estado del postulante.',
    })
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogContent class="max-h-[90vh] max-w-4xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Detalle del Postulante</DialogTitle>
        <DialogDescription>
          <span v-if="postulante">
            {{ getRutCompleto(postulante) }} - Registrado el {{ formatearFecha(postulante.FECREG) }}
          </span>
          <span v-else>
            Cargando información del postulante...
          </span>
        </DialogDescription>
      </DialogHeader>

      <div v-if="isLoading" class="space-y-4">
        <div class="h-20 animate-pulse rounded-lg bg-muted"></div>
        <div class="h-20 animate-pulse rounded-lg bg-muted"></div>
        <div class="h-20 animate-pulse rounded-lg bg-muted"></div>
      </div>

      <div v-else-if="postulante" class="space-y-4">
        <!-- Carreras de Interés y Estado de Postulación (PRIMERO) -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Carreras de Interés y Estado de Postulación</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="carrerasParaMostrar.length > 0" class="flex flex-col gap-6">
              <div 
                v-for="carrera in carrerasParaMostrar" 
                :key="carrera.numero" 
                :class="[
                  'border rounded-lg p-4',
                  obtenerEstadoCarrera(postulante, carrera.codigo)?.ESTADO === 'M' 
                    ? 'bg-gradient-to-r from-teal-50 to-transparent border-teal-300 dark:from-teal-950 dark:border-teal-700' 
                    : 'bg-gradient-to-r from-primary/5 to-transparent'
                ]"
              >
                <!-- Header de carrera -->
                <div class="flex items-start gap-3 mb-4">
                  <Badge :variant="carrera.numero === 1 ? 'default' : 'secondary'" class="shrink-0">
                    {{ carrera.numero }}
                  </Badge>
                  <div class="flex-1">
                    <div class="flex items-start gap-2 flex-wrap">
                      <p :class="carrera.numero === 1 ? 'text-base font-bold' : 'text-sm font-semibold'">
                        {{ carrera.nombre || carrera.codigo }}
                      </p>
                      <!-- Badge de MATRICULADO -->
                      <Badge 
                        v-if="obtenerEstadoCarrera(postulante, carrera.codigo)?.ESTADO === 'M'"
                        variant="default"
                        class="bg-teal-600 text-white text-xs gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        MATRICULADO
                      </Badge>
                    </div>
                    <p v-if="carrera.nombre" class="text-xs text-muted-foreground mt-0.5">
                      Código: {{ carrera.codigo }}
                    </p>
                    <!-- Fecha de matrícula -->
                    <p 
                      v-if="obtenerEstadoCarrera(postulante, carrera.codigo)?.ESTADO === 'M' && obtenerEstadoCarrera(postulante, carrera.codigo)?.FECMOD"
                      class="text-xs text-teal-700 dark:text-teal-400 mt-1 font-medium flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Matriculado el {{ formatearFecha(obtenerEstadoCarrera(postulante, carrera.codigo)?.FECMOD) }}
                    </p>
                  </div>
                </div>
                
                <!-- Timeline de estados -->
                <EstadoPostulacionTimeline 
                  :estado-actual="obtenerEstadoCarrera(postulante, carrera.codigo)"
                />
              </div>
            </div>
            <p v-else class="text-sm text-muted-foreground">
              No hay información de carreras o matrículas registradas
            </p>
          </CardContent>
        </Card>
        
        <!-- Datos Personales -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Datos Personales</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-4 md:grid-cols-2">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Nombre Completo</p>
              <p class="text-sm">{{ getNombreCompleto(postulante) }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">RUT</p>
              <p class="text-sm">{{ getRutCompleto(postulante) }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Sexo</p>
              <p class="text-sm">{{ postulante.SEXO }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</p>
              <p class="text-sm">{{ formatearFecha(postulante.FECNAC) }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Estado Civil</p>
              <p class="text-sm">{{ postulante.ESTADOCIVIL || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Nacionalidad</p>
              <p class="text-sm">{{ postulante.NACIONALIDAD || '-' }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Datos de Contacto -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Datos de Contacto</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-4 md:grid-cols-2">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Email</p>
              <p class="text-sm">{{ postulante.EMAIL || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Celular</p>
              <p class="text-sm">{{ postulante.CELULAR || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Teléfono</p>
              <p class="text-sm">{{ postulante.TELEFONO || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Dirección</p>
              <p class="text-sm">{{ postulante.DIRECCION || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Comuna</p>
              <p class="text-sm">{{ postulante.COMUNA || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Ciudad</p>
              <p class="text-sm">{{ postulante.CIUDAD || '-' }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Información Académica -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Información Académica</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-4 md:grid-cols-2">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Colegio</p>
              <p class="text-sm">{{ postulante.NOMBRECOL || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Comuna del Colegio</p>
              <p class="text-sm">{{ postulante.COMUNACOLEGIO || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Nota Enseñanza Media</p>
              <p class="text-sm">{{ postulante.NOTAEM || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Año de Egreso</p>
              <p class="text-sm">{{ postulante.ANOEGRESO || '-' }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Información Adicional -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Información Adicional</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-4 md:grid-cols-2">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Sede</p>
              <p class="text-sm">{{ postulante.SEDE || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Jornada</p>
              <p class="text-sm">{{ postulante.JORNADACARRER || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Periodo</p>
              <p class="text-sm">{{ postulante.PERIODO || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Año</p>
              <p class="text-sm">{{ postulante.ANO || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Vía de Consulta</p>
              <p class="text-sm">{{ postulante.VIACONSULTA || '-' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-muted-foreground">Código de Medio</p>
              <p class="text-sm">{{ postulante.CODMEDIO || '-' }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Observaciones -->
        <Card v-if="postulante.OBSERVAC1 || postulante.OBSERVAC2 || postulante.OBSERVAC3">
          <CardHeader>
            <CardTitle class="text-lg">Observaciones</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <p v-if="postulante.OBSERVAC1" class="text-sm">{{ postulante.OBSERVAC1 }}</p>
            <p v-if="postulante.OBSERVAC2" class="text-sm">{{ postulante.OBSERVAC2 }}</p>
            <p v-if="postulante.OBSERVAC3" class="text-sm">{{ postulante.OBSERVAC3 }}</p>
          </CardContent>
        </Card>

        <!-- Acciones de Desistimiento -->
        <div v-if="!estaMatriculado" class="flex justify-between items-center pt-4 border-t">
          <Button
            :variant="postulante.desistido ? 'outline' : 'destructive'"
            :disabled="isLoadingDesistimiento"
            @click="toggleDesistido"
            class="gap-2"
          >
            <svg v-if="postulante.desistido" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {{ postulante.desistido ? 'Reactivar Postulante' : 'Marcar como Desistido' }}
          </Button>
        </div>
        
        <!-- Mensaje cuando está matriculado -->
        <div v-else class="flex items-center gap-2 pt-4 border-t text-sm text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>El postulante está matriculado. No es posible marcarlo como desistido.</span>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

