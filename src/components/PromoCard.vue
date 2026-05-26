<template>
  <q-card class="promo-card card-elevated" flat bordered>
    <DishArt :title="title" :subtitle="subtitle" :tone="tone" />
    <q-card-section class="q-pb-sm">
      <div class="row items-start justify-between q-gutter-sm no-wrap">
        <div class="col">
          <div class="text-subtitle1 text-weight-bold">{{ title }}</div>
          <div class="text-body2 text-grey-7 q-mt-xs">{{ subtitle }}</div>
        </div>
        <q-badge color="positive" rounded>{{ tag }}</q-badge>
      </div>
    </q-card-section>

    <q-card-actions align="between" class="q-pt-none q-px-md q-pb-md">
      <div class="text-caption text-grey-6">{{ footnote }}</div>
      <q-btn color="positive" unelevated rounded label="Personalizar" @click="$emit('select')" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import DishArt from './DishArt.vue'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  tone: { type: String, default: 'green' },
  tag: { type: String, default: 'Nuevo' },
  footnote: { type: String, default: 'Ideal para kiosco o mesa' }
})

defineEmits(['select'])
</script>