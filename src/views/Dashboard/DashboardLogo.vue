<script setup lang="ts">
// Logo de la aplicación UNIACC
</script>

<template>
  <RouterLink to="/dashboard" class="inline-block transition-opacity hover:opacity-80">
    <div class="flex flex-col items-start gap-1">
      <!-- Texto UNIACC -->
      <div class="font-bold text-3xl tracking-tight leading-none" 
           style="font-family: 'Dosis-cursive', sans-serif; font-weight: 400; color: #2d2d2d; letter-spacing: -0.01em;">
        UNIACC
      </div>
      
      <!-- SVG con barras de colores y speech bubble -->
      <svg width="165" height="18" viewBox="0 0 165 18" class="-mt-0.5">
        <!-- Barra naranja debajo de U - Paleta oficial: #FF5B00 -->
        <rect x="0" y="0" width="23" height="8" fill="#FF5B00" />
        
        <!-- Barra azul debajo de N (continua, sin espacio) - Paleta oficial: #4D98C5 -->
        <rect x="23" y="0" width="23" height="8" fill="#4D98C5" />
        
        <!-- Barra rosa debajo de I (continua, sin espacio) - Paleta oficial: #EE2183 -->
        <rect x="46" y="0" width="23" height="8" fill="#EE2183" />
        
        <!-- Speech bubble debajo de ACC (pegado al elemento fucsia) -->
        <g transform="translate(69, 0)">
          <!-- Cuerpo principal del speech bubble sin espacios en blanco -->
          <path 
            d="M 0 0 L 69 0 L 45 8 L 38 8 L 35 14 L 34 8 L 0 8 Z" 
            fill="#2d2d2d"
          />
        </g>
      </svg>
      
      <!-- Tagline "BIENVENIDO A CREAR" (opcional, comentado por defecto) -->
      <!-- <p class="text-[9px] font-bold tracking-widest -mt-0.5" style="color: #2d2d2d; letter-spacing: 0.15em;">
        BIENVENIDO A CREAR
      </p> -->
    </div>
  </RouterLink>
</template>

