<script setup lang="ts">
import { DialogTrigger, type DialogTriggerProps } from 'radix-vue'
import { cn } from '@/composables/utils'

const props = defineProps<DialogTriggerProps & { class?: string }>()
</script>

<template>
  <DialogTrigger v-bind="props" :class="cn(props.class)">
    <slot />
  </DialogTrigger>
</template>

