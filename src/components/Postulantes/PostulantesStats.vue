<script setup lang="ts">
import { Users, TrendingUp, Calendar, Award, GraduationCap, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { PostulanteStats } from '@/types/postulante'

defineProps<{
  stats: PostulanteStats | null
  isLoading?: boolean
}>()
</script>

<template>
  <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-5 relative z-0">
    <!-- Total de postulantes -->
    <Card class="overflow-hidden border-l-4 border-l-blue-500">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3">
        <CardTitle class="text-xs font-medium">Total Postulantes</CardTitle>
        <div class="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900">
          <Users class="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
        </div>
      </CardHeader>
      <CardContent class="pb-3">
        <div v-if="isLoading" class="h-7 w-16 animate-pulse rounded bg-muted"></div>
        <div v-else class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats?.total || 0 }}</div>
        <p class="text-[10px] text-muted-foreground mt-0.5">Año 2026</p>
      </CardContent>
    </Card>

    <!-- Nuevos hoy -->
    <Card class="overflow-hidden border-l-4 border-l-green-500">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3">
        <CardTitle class="text-xs font-medium">Nuevos Hoy</CardTitle>
        <div class="rounded-full bg-green-100 p-1.5 dark:bg-green-900">
          <TrendingUp class="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
        </div>
      </CardHeader>
      <CardContent class="pb-3">
        <div v-if="isLoading" class="h-7 w-16 animate-pulse rounded bg-muted"></div>
        <div v-else class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats?.nuevosHoy || 0 }}</div>
        <p class="text-[10px] text-muted-foreground mt-0.5">Registros de hoy</p>
      </CardContent>
    </Card>

    <!-- Nuevos esta semana -->
    <Card class="overflow-hidden border-l-4 border-l-purple-500">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3">
        <CardTitle class="text-xs font-medium">Esta Semana</CardTitle>
        <div class="rounded-full bg-purple-100 p-1.5 dark:bg-purple-900">
          <Calendar class="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
        </div>
      </CardHeader>
      <CardContent class="pb-3">
        <div v-if="isLoading" class="h-7 w-16 animate-pulse rounded bg-muted"></div>
        <div v-else class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats?.nuevosEstaSemana || 0 }}</div>
        <p class="text-[10px] text-muted-foreground mt-0.5">Últimos 7 días</p>
      </CardContent>
    </Card>

    <!-- Carrera más popular -->
    <Card class="overflow-hidden border-l-4 border-l-orange-500">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3">
        <CardTitle class="text-xs font-medium">Carrera Top</CardTitle>
        <div class="rounded-full bg-orange-100 p-1.5 dark:bg-orange-900">
          <Award class="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
        </div>
      </CardHeader>
      <CardContent class="pb-3">
        <div v-if="isLoading" class="h-7 w-16 animate-pulse rounded bg-muted"></div>
        <template v-else-if="stats && stats.porCarrera.length > 0">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ stats.porCarrera[0].count }}</div>
          <p class="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{{ stats.porCarrera[0].carrera }}</p>
        </template>
        <div v-else class="text-2xl font-bold text-orange-600">0</div>
      </CardContent>
    </Card>

    <!-- Matriculados -->
    <Card class="overflow-hidden border-l-4 border-l-teal-500">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3">
        <CardTitle class="text-xs font-medium">Matriculados</CardTitle>
        <div class="rounded-full bg-teal-100 p-1.5 dark:bg-teal-900">
          <GraduationCap class="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
        </div>
      </CardHeader>
      <CardContent class="pb-3">
        <div v-if="isLoading" class="h-7 w-16 animate-pulse rounded bg-muted"></div>
        <div v-else>
          <div class="text-2xl font-bold text-teal-600 dark:text-teal-400">{{ stats?.matriculados || 0 }}</div>
          <div class="flex flex-col gap-0.5 mt-1">
            <p class="text-[10px] text-muted-foreground">
              <span class="font-semibold text-teal-600">{{ stats?.matriculadosPrimeraOpcion || 0 }}</span> en 1ª opción
            </p>
            <p class="text-[10px] text-muted-foreground">
              <span class="font-semibold text-orange-600">{{ stats?.matriculadosOtrasOpciones || 0 }}</span> en otras
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Tarjetas de Estados -->
  <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mt-3 relative z-0">
    <!-- Pendientes -->
    <Card class="overflow-hidden border-l-4 border-l-yellow-500">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3">
        <CardTitle class="text-xs font-medium">Pendientes</CardTitle>
        <div class="rounded-full bg-yellow-100 p-1.5 dark:bg-yellow-900">
          <Clock class="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
        </div>
      </CardHeader>
      <CardContent class="pb-3">
        <div v-if="isLoading" class="h-7 w-16 animate-pulse rounded bg-muted"></div>
        <div v-else class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats?.pendientes || 0 }}</div>
        <p class="text-[10px] text-muted-foreground mt-0.5">Sin estado asignado</p>
      </CardContent>
    </Card>

    <!-- En Espera -->
    <Card class="overflow-hidden border-l-4 border-l-indigo-500">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3">
        <CardTitle class="text-xs font-medium">En Espera</CardTitle>
        <div class="rounded-full bg-indigo-100 p-1.5 dark:bg-indigo-900">
          <AlertCircle class="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        </div>
      </CardHeader>
      <CardContent class="pb-3">
        <div v-if="isLoading" class="h-7 w-16 animate-pulse rounded bg-muted"></div>
        <div v-else class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ stats?.enEspera || 0 }}</div>
        <p class="text-[10px] text-muted-foreground mt-0.5">Estado: En Espera</p>
      </CardContent>
    </Card>

    <!-- Aprobados -->
    <Card class="overflow-hidden border-l-4 border-l-emerald-500">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3">
        <CardTitle class="text-xs font-medium">Aprobados</CardTitle>
        <div class="rounded-full bg-emerald-100 p-1.5 dark:bg-emerald-900">
          <CheckCircle class="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        </div>
      </CardHeader>
      <CardContent class="pb-3">
        <div v-if="isLoading" class="h-7 w-16 animate-pulse rounded bg-muted"></div>
        <div v-else class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ stats?.aprobados || 0 }}</div>
        <p class="text-[10px] text-muted-foreground mt-0.5">Estado: Aprobado</p>
      </CardContent>
    </Card>

    <!-- Desistidos -->
    <Card class="overflow-hidden border-l-4 border-l-red-500">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3">
        <CardTitle class="text-xs font-medium">Desistidos</CardTitle>
        <div class="rounded-full bg-red-100 p-1.5 dark:bg-red-900">
          <XCircle class="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
        </div>
      </CardHeader>
      <CardContent class="pb-3">
        <div v-if="isLoading" class="h-7 w-16 animate-pulse rounded bg-muted"></div>
        <div v-else class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats?.desistidos || 0 }}</div>
        <p class="text-[10px] text-muted-foreground mt-0.5">Postulantes desistidos</p>
      </CardContent>
    </Card>
  </div>

  <!-- Gráfico de carreras más populares -->
  <Card v-if="stats && stats.porCarrera.length > 0" class="mt-3 relative z-0" style="isolation: isolate;">
    <CardHeader class="pb-3">
      <CardTitle class="text-base">Carreras Más Populares</CardTitle>
      <CardDescription class="text-xs">Top 10 carreras con más postulaciones</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-2.5">
        <div
          v-for="(carrera, index) in stats.porCarrera.slice(0, 10)"
          :key="index"
          class="group"
        >
          <!-- Ranking y nombre de carrera -->
          <div class="mb-0.5 flex items-start justify-between gap-2">
            <div class="flex items-start gap-1.5 flex-1 min-w-0">
              <span class="text-[10px] font-semibold text-muted-foreground shrink-0">
                #{{ index + 1 }}
              </span>
              <span class="text-xs font-medium leading-tight break-words">
                {{ carrera.carrera }}
              </span>
            </div>
            <span class="text-xs font-bold text-primary shrink-0">
              {{ carrera.count }}
            </span>
          </div>
          
          <!-- Barra de progreso -->
          <div class="relative">
            <div class="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
                :style="{
                  width: `${(carrera.count / stats.porCarrera[0].count) * 100}%`,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      <div class="mt-3 border-t pt-3">
        <p class="text-xs text-muted-foreground">
          <span class="font-semibold">Total:</span>
          {{ stats.porCarrera.reduce((sum, c) => sum + c.count, 0) }} en top 10
        </p>
      </div>
    </CardContent>
  </Card>
</template>

