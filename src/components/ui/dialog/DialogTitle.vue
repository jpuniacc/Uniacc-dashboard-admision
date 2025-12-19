<script setup lang="ts">
import { DialogTitle, type DialogTitleProps } from 'radix-vue'
import { cn } from '@/composables/utils'

const props = defineProps<DialogTitleProps & { class?: string }>()
</script>

<template>
  <DialogTitle
    :class="cn('text-lg font-semibold leading-none tracking-tight', props.class)"
    v-bind="props"
  >
    <slot />
  </DialogTitle>
</template>

