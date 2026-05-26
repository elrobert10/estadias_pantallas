<template>
  <q-page class="kiosk-page q-pa-md q-pa-lg-lg">
    <q-card class="customize-shell card-elevated" flat bordered>
      <q-card-section class="row items-center justify-between q-gutter-md">
        <div>
          <div class="text-overline text-grey-7">Paso 3 · Personalización</div>
          <div class="text-h5 text-weight-bold">{{ dish.name }}</div>
          <div class="text-body2 text-grey-7 q-mt-xs">{{ dish.description }}</div>
        </div>

        <q-btn flat round icon="arrow_back" @click="goBack" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-lg-5">
            <q-card class="customize-shell__visual card-elevated" flat bordered>
              <DishArt :title="dish.name" :subtitle="dish.description" :tone="dish.heroTone" />
              <q-card-section class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-6">Precio base</div>
                  <div class="text-h5 text-weight-bold">${{ dish.price.toFixed(2) }} MXN</div>
                </div>
                <q-chip color="positive" text-color="white" rounded>{{ dish.subcategoryLabel }}</q-chip>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-lg-7">
            <q-card flat bordered class="customize-shell__options">
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold">Nivel de preparación</div>
                <q-btn-toggle
                  v-model="styleSelection"
                  class="q-mt-sm"
                  no-caps
                  spread
                  rounded
                  unelevated
                  color="positive"
                  toggle-color="positive"
                  :options="styleOptions"
                />
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-subtitle1 text-weight-bold">Incluir (Con)</div>
                <div class="row q-col-gutter-sm q-mt-sm">
                  <div v-for="option in dish.includeOptions" :key="option" class="col-6 col-sm-4">
                    <q-checkbox v-model="includeSelection" :val="option" :label="option" />
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-subtitle1 text-weight-bold">Omitir (Sin)</div>
                <div class="row q-col-gutter-sm q-mt-sm">
                  <div v-for="option in dish.omitOptions" :key="option" class="col-6 col-sm-4">
                    <q-checkbox v-model="omitSelection" :val="option" :label="option" />
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-subtitle1 text-weight-bold">Comentarios Adicionales</div>
                <q-input
                  v-model="notes"
                  type="textarea"
                  autogrow
                  outlined
                  class="q-mt-sm"
                  placeholder="Ej. Tortilla bien dorada"
                />
              </q-card-section>

              <q-separator />

              <q-card-section class="row items-center justify-between q-gutter-md">
                <div>
                  <div class="text-caption text-grey-6">Cantidad</div>
                  <QuantityStepper :model-value="quantity" @decrease="decreaseQuantity" @increase="increaseQuantity" />
                </div>

                <q-btn
                  color="positive"
                  unelevated
                  rounded
                  size="lg"
                  class="customize-shell__add"
                  :label="addLabel"
                  @click="addToCart"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '../stores/order'
import catalog from '../mocks/menu.json'
import DishArt from '../components/DishArt.vue'
import QuantityStepper from '../components/QuantityStepper.vue'

const route = useRoute()
const router = useRouter()
const order = useOrderStore()

const dish = ref(null)
const quantity = ref(1)
const includeSelection = ref([])
const omitSelection = ref([])
const notes = ref('')
const styleSelection = ref('Normal')

const styleOptions = [
  { label: 'Normal', value: 'Normal' },
  { label: 'Bien dorado', value: 'Bien dorado' },
  { label: 'Extra crujiente', value: 'Extra crujiente' }
]

const addLabel = computed(() => {
  if (!dish.value) return 'Añadir al Carrito'
  return `Añadir al Carrito ($${linePrice.value.toFixed(2)} MXN)`
})

const linePrice = computed(() => {
  if (!dish.value) return 0

  const extras = includeSelection.value.length * 4
  const styleExtra = styleSelection.value === 'Bien dorado' ? 3 : styleSelection.value === 'Extra crujiente' ? 5 : 0
  return Number(((dish.value.price + extras + styleExtra) * quantity.value).toFixed(2))
})

function loadDish(dishId) {
  const found = catalog.dishes.find((item) => item.id === dishId)
  if (!found) {
    router.replace({ name: 'menu' })
    return
  }

  dish.value = {
    ...found,
    subcategoryLabel:
      catalog.subcategories.find((subcategory) => subcategory.id === found.subcategoryId)?.label || ''
  }
}

function increaseQuantity() {
  quantity.value += 1
}

function decreaseQuantity() {
  quantity.value = Math.max(1, quantity.value - 1)
}

function addToCart() {
  if (!dish.value) return

  const extras = includeSelection.value.length * 4
  const styleExtra = styleSelection.value === 'Bien dorado' ? 3 : styleSelection.value === 'Extra crujiente' ? 5 : 0
  const unitPrice = Number((dish.value.price + extras + styleExtra).toFixed(2))

  order.addItem({
    dishId: dish.value.id,
    name: dish.value.name,
    imageTone: dish.value.heroTone,
    priceLabel: dish.value.price,
    unitPrice,
    quantity: quantity.value,
    include: includeSelection.value,
    omit: omitSelection.value,
    style: styleSelection.value,
    notes: notes.value.trim()
  })

  router.push({ name: 'cart' })
}

function goBack() {
  router.push({ name: 'menu' })
}

watch(
  () => route.params.dishId,
  (dishId) => {
    loadDish(String(dishId || ''))
  },
  { immediate: true }
)
</script>