<template>
  <q-page class="kiosk-page kiosk-page--welcome flex flex-center q-pa-lg">
    <div class="welcome-card text-center">
      <q-avatar size="120px" class="welcome-card__avatar">
        <div class="welcome-card__mark">
          <div class="text-h4 text-weight-bold">TC</div>
        </div>
      </q-avatar>

      <div class="text-overline text-grey-7 q-mt-lg">{{ brand.restaurant }}</div>
      <div class="text-h3 text-weight-bold q-mt-sm">¡Bienvenido a {{ brand.name }}!</div>
      <div class="text-body1 text-grey-7 q-mt-md">
        Sabor mexicano, flujo rápido y experiencia táctil para kiosco o mesa.
      </div>

      <q-btn
        v-ripple
        class="welcome-card__cta q-mt-xl"
        color="positive"
        unelevated
        rounded
        size="lg"
        label="Comenzar"
        @click="goToMenu"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import catalog from '../mocks/menu.json'

const router = useRouter()
const brand = catalog.brand

function goToMenu() {
  router.push({ name: 'menu' })
}
</script>