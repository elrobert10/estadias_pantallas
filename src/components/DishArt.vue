<template>
  <div class="dish-art" :class="toneClass">
    <div class="dish-art__glow dish-art__glow--one"></div>
    <div class="dish-art__glow dish-art__glow--two"></div>
    <div class="dish-art__plate">
      <q-icon name="restaurant_menu" size="40px" />
      <div class="text-h6 text-weight-bold q-mt-sm">{{ title }}</div>
      <div class="text-body2 text-white-7 q-mt-xs">{{ subtitle }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  tone: { type: String, default: 'green' }
})

const toneClass = computed(() => `dish-art--${props.tone}`)
</script>