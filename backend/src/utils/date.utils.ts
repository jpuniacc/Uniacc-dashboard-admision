/**
 * Utilidades para formatear fechas en hora de Chile (America/Santiago)
 */

/**
 * Formatea una fecha a hora de Chile con formato legible
 * @param date Fecha a formatear (por defecto: ahora)
 * @returns String con formato: "2025-12-19 10:17:23 CLT"
 */
export function formatChileTime(date: Date = new Date()): string {
  // Usar Intl.DateTimeFormat para obtener la fecha en hora de Chile
  const formatter = new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  
  const parts = formatter.formatToParts(date)
  const year = parts.find(p => p.type === 'year')?.value || '0000'
  const month = parts.find(p => p.type === 'month')?.value || '00'
  const day = parts.find(p => p.type === 'day')?.value || '00'
  const hour = parts.find(p => p.type === 'hour')?.value || '00'
  const minute = parts.find(p => p.type === 'minute')?.value || '00'
  const second = parts.find(p => p.type === 'second')?.value || '00'
  
  // Chile desde 2015 no cambia de horario, siempre está en UTC-3 (CLT)
  // Pero verificamos el offset real para ser precisos
  const chileTime = new Date(date.toLocaleString('en-US', { timeZone: 'America/Santiago' }))
  const utcTime = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  const offsetHours = (chileTime.getTime() - utcTime.getTime()) / (1000 * 60 * 60)
  
  // Chile está en UTC-3 (CLT) o UTC-4 (CLST en horario de verano histórico)
  // Desde 2015, Chile mantiene UTC-3 todo el año
  const timezone = offsetHours === -3 ? 'CLT' : 'CLST'
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second} ${timezone}`
}

