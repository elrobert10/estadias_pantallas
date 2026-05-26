<template>
  <q-card class="cart-item card-elevated" flat bordered>
    <q-card-section class="row items-start q-gutter-md no-wrap">
      <q-avatar size="74px" rounded class="cart-item__avatar">
        <div class="cart-item__avatar-inner" :class="toneClass">
          <q-icon name="ramen_dining" size="34px" color="white" />
        </div>
      </q-avatar>

      <div class="col">
        <div class="row items-start justify-between no-wrap">
          <div>
            <div class="text-subtitle1 text-weight-bold">{{ item.name }}</div>
            <div class="text-body2 text-grey-7 q-mt-xs">{{ personalizationText }}</div>
          </div>
          <q-badge color="positive" rounded>Qty {{ item.quantity }}</q-badge>
        </div>

        <div class="row items-center justify-between q-mt-md">
          <div class="text-caption text-grey-6">{{ item.style }}</div>
          <div class="text-subtitle2 text-weight-bold">${{ item.lineTotal.toFixed(2) }} MXN</div>
        </div>

        <div class="row items-center q-mt-md q-gutter-sm">
          <q-btn dense rounded outline icon="remove" @click="$emit('decrease')" />
          <q-btn dense rounded outline icon="add" @click="$emit('increase')" />
          <q-btn dense rounded flat color="negative" icon="delete" label="Eliminar" @click="$emit('remove')" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true }
})

defineEmits(['decrease', 'increase', 'remove'])

const toneClass = computed(() => `cart-item__avatar-inner--${props.item.imageTone || 'green'}`)

const personalizationText = computed(() => {
  const parts = []

  if (props.item.include?.length) {
    parts.push(`Con ${props.item.include.join(', ')}`)
  }

  if (props.item.omit?.length) {
    parts.push(`Sin ${props.item.omit.join(', ')}`)
  }

  if (props.item.notes) {
    parts.push(props.item.notes)
  }

  return parts.length ? parts.join(' · ') : 'Sin personalizaciones'
})
</script>