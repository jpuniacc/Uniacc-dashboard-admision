<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Database, Settings, BarChart3 } from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-6">
    <!-- Título de la página -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
      <p class="text-muted-foreground">Bienvenido al template de dashboard. Personaliza según tus necesidades.</p>
    </div>

    <!-- Cards de ejemplo -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Registros</CardTitle>
          <Database class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">1,234</div>
          <p class="text-xs text-muted-foreground">+20% desde el mes pasado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Usuarios Activos</CardTitle>
          <LayoutDashboard class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">573</div>
          <p class="text-xs text-muted-foreground">+12% desde la semana pasada</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Operaciones</CardTitle>
          <BarChart3 class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">2,350</div>
          <p class="text-xs text-muted-foreground">+7% desde ayer</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Configuraciones</CardTitle>
          <Settings class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">12</div>
          <p class="text-xs text-muted-foreground">Módulos activos</p>
        </CardContent>
      </Card>
    </div>

    <!-- Sección de contenido principal -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="col-span-full lg:col-span-4">
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
          <CardDescription>Aquí puedes agregar gráficos, tablas o cualquier contenido.</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
            <p class="text-sm text-muted-foreground">Área de contenido principal</p>
          </div>
        </CardContent>
      </Card>

      <Card class="col-span-full lg:col-span-3">
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas acciones del sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="h-2 w-2 rounded-full bg-green-500"></div>
              <div class="flex-1">
                <p class="text-sm font-medium">Registro creado</p>
                <p class="text-xs text-muted-foreground">Hace 5 minutos</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="h-2 w-2 rounded-full bg-blue-500"></div>
              <div class="flex-1">
                <p class="text-sm font-medium">Datos actualizados</p>
                <p class="text-xs text-muted-foreground">Hace 15 minutos</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="h-2 w-2 rounded-full bg-yellow-500"></div>
              <div class="flex-1">
                <p class="text-sm font-medium">Consulta ejecutada</p>
                <p class="text-xs text-muted-foreground">Hace 1 hora</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Botones de acción de ejemplo -->
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>Operaciones frecuentes del sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap gap-2">
          <Button>Nueva Consulta</Button>
          <Button variant="outline">Ver Reportes</Button>
          <Button variant="secondary">Exportar Datos</Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

