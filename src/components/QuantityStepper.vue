<template>
  <div class="quantity-stepper">
    <q-btn round unelevated color="grey-3" text-color="dark" icon="remove" @click="$emit('decrease')" />
    <q-input
      class="quantity-stepper__input"
      :model-value="modelValue"
      dense
      outlined
      type="number"
      readonly
      input-class="text-center text-weight-bold"
    />
    <q-btn round unelevated color="positive" icon="add" @click="$emit('increase')" />
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Number, required: true }
})

defineEmits(['decrease', 'increase'])
</script>