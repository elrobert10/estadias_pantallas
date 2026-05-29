<template>
  <div class="kds-page q-pa-md q-pa-lg-lg">
    <div class="kds-console">
      <aside class="kds-sidebar card-elevated">
        <div class="kds-sidebar__brand">
          <div class="kds-sidebar__mark">{{ brand.logo }}</div>
          <div>
            <div class="text-h6 text-weight-bold">{{ brand.restaurant }}</div>
            <div class="text-caption text-grey-6">Kitchen Display System</div>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <div class="kds-sidebar__status">
          <div class="text-caption text-grey-6">Actualizado</div>
          <div class="text-subtitle1 text-weight-bold">{{ currentTimeLabel }}</div>
        </div>

        <div class="kds-sidebar__metrics q-mt-md">
          <div class="kds-sidebar__metric">
            <div class="text-caption text-grey-6">Activos</div>
            <div class="text-h5 text-weight-bold">{{ totalActive }}</div>
          </div>
          <div class="kds-sidebar__metric">
            <div class="text-caption text-grey-6">Listos</div>
            <div class="text-h5 text-weight-bold text-positive">{{ readyCount }}</div>
          </div>
        </div>

        <div class="q-mt-md">
          <div class="text-caption text-grey-6 q-mb-sm">Áreas</div>
          <div class="kds-sidebar__areas">
            <div v-for="category in categorySummary" :key="category.id" class="kds-sidebar__area">
              <div>
                <div class="text-weight-bold">{{ category.label }}</div>
                <div class="text-caption text-grey-6">{{ categoryCountLabel(category.count) }}</div>
              </div>
              <q-badge color="grey-3" text-color="grey-8" rounded>{{ category.count }}</q-badge>
            </div>
          </div>
        </div>

        <div class="q-mt-md">
          <div class="text-caption text-grey-6 q-mb-sm">Estados</div>
          <div class="kds-sidebar__states">
            <div class="kds-sidebar__state">
              <span class="kds-dot kds-dot--new"></span>
              Nuevos
              <strong>{{ newCount }}</strong>
            </div>
            <div class="kds-sidebar__state">
              <span class="kds-dot kds-dot--prep"></span>
              Preparación
              <strong>{{ prepCount }}</strong>
            </div>
            <div class="kds-sidebar__state">
              <span class="kds-dot kds-dot--ready"></span>
              Pase
              <strong>{{ readyCount }}</strong>
            </div>
          </div>
        </div>

        <div class="kds-sidebar__footer q-mt-auto">
          <div class="text-caption text-grey-6">Último ticket</div>
          <div class="text-subtitle1 text-weight-bold">{{ latestOrderLabel }}</div>
          <div class="text-caption text-grey-6">{{ incomingHint }}</div>
        </div>
      </aside>

      <main class="kds-main">
        <section class="kds-board q-mt-lg">
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-subtitle1 text-weight-bold">Pedidos activos</div>
              <div class="text-caption text-grey-7">Tickets en tarjetitas, como en el ejemplo de referencia.</div>
            </div>
            <q-badge color="primary" rounded>{{ totalActive }} visibles</q-badge>
          </div>

          <transition-group tag="div" name="ticket-list" class="kds-ticket-grid">
            <q-card
              v-for="order in boardOrders"
              :key="order.id"
              flat
              bordered
              class="kds-ticket"
              :class="[
                `kds-ticket--${order.stage}`,
                selectedOrderIds.includes(order.id) ? 'kds-ticket--selected' : ''
              ]"
              role="button"
              tabindex="0"
              @click="toggleOrderSelection(order.id)"
            >
              <q-card-section class="kds-ticket__header q-py-sm q-px-md row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-6">{{ order.createdAtLabel }}</div>
                  <div class="text-subtitle2 text-weight-bold">{{ order.id }}</div>
                </div>
                <div class="text-right">
                  <q-chip dense :color="priorityPalette[order.priority].color" text-color="white" rounded>
                    {{ priorityPalette[order.priority].label }}
                  </q-chip>
                </div>
              </q-card-section>

              <q-card-section class="q-pt-sm q-px-md q-pb-md">
                <div class="row items-center justify-between q-gutter-sm text-caption text-grey-7">
                  <span>{{ order.channel }} · {{ order.table }}</span>
                  <span>{{ elapsedLabel(order.createdAt) }}</span>
                </div>

                <q-linear-progress
                  rounded
                  size="8px"
                  :color="stagePalette[order.stage].color"
                  track-color="grey-3"
                  :value="stagePalette[order.stage].progress"
                  class="q-mt-sm"
                />

                <div class="q-mt-md kds-ticket__lines">
                  <div
                    v-for="item in order.items"
                    :key="`${order.id}-${item.name}`"
                    class="kds-ticket__line row items-start justify-between q-gutter-sm"
                  >
                    <div class="kds-ticket__line-main">
                      <div class="kds-ticket__item-name">{{ item.quantity }}x {{ item.name }}</div>
                      <div class="kds-ticket__mod text-caption text-grey-7">{{ item.customization }}</div>
                    </div>
                    <div class="text-caption text-grey-7">{{ currencyFormat(item.price * item.quantity) }}</div>
                  </div>
                </div>

                <div class="row items-center justify-between q-mt-md">
                  <q-chip v-if="order.note" dense color="grey-3" text-color="grey-8" rounded>
                    {{ order.note }}
                  </q-chip>
                  <div class="row items-center q-gutter-sm">
                    <div class="text-caption text-grey-6">{{ order.stageLabel }}</div>
                    <q-btn
                      flat
                      dense
                      no-caps
                      size="sm"
                      color="positive"
                      icon="done"
                      label="Marcar listo"
                      :disable="order.stage === 'ready'"
                      @click.stop="markAsReady(order.id)"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </transition-group>

          <div v-if="!boardOrders.length" class="kds-column__empty text-center text-grey-6 q-pa-lg q-mt-md">
            Esperando nuevos tickets...
          </div>
        </section>

        <section class="kds-history q-mt-lg">
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-subtitle1 text-weight-bold">Cerrados recientemente</div>
              <div class="text-caption text-grey-7">Tickets que ya salieron del tablero principal.</div>
            </div>
            <q-chip color="grey-3" text-color="grey-8" rounded>
              {{ completedOrders.length }} archivados
            </q-chip>
          </div>

          <div class="row q-col-gutter-md kds-history__rail no-wrap">
            <div v-for="order in completedOrders.slice(0, 6)" :key="order.id" class="col-auto kds-history__item">
              <q-card flat bordered class="kds-history-card">
                <q-card-section class="q-pa-md">
                  <div class="row items-center justify-between q-gutter-sm">
                    <div class="text-weight-bold">{{ order.id }}</div>
                    <q-chip dense color="grey-3" text-color="grey-8" rounded>
                      {{ closedElapsedLabel(order) }}
                    </q-chip>
                  </div>
                  <div class="text-caption text-grey-7 q-mt-xs">{{ order.table }} · {{ order.channel }}</div>
                  <div class="text-body2 q-mt-sm kds-history-card__items">
                    {{ order.items.map((item) => `${item.quantity}x ${item.name}`).join(' · ') }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </section>

        <section class="kds-actions card-elevated q-mt-lg">
          <q-btn
            v-for="action in quickActions"
            :key="action.key"
            unelevated
            no-caps
            :outline="selectedAction !== action.key"
            :color="selectedAction === action.key ? action.color : 'grey-8'"
            :text-color="selectedAction === action.key ? 'white' : 'grey-2'"
            class="kds-actions__button"
            @click="handleQuickAction(action.key)"
          >
            {{ action.label }}
            <q-badge v-if="action.key === 'join' && selectedOrderIds.length" color="white" text-color="dark" class="q-ml-sm">
              {{ selectedOrderIds.length }}
            </q-badge>
          </q-btn>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import catalog from '../mocks/menu.json'

const brand = catalog.brand

const stagePalette = {
  new: { color: 'negative', progress: 0.2 },
  prep: { color: 'amber', progress: 0.55 },
  ready: { color: 'positive', progress: 0.9 }
}

const priorityPalette = {
  normal: { color: 'grey-7', label: 'Normal' },
  alta: { color: 'amber-8', label: 'Alta' }
}

const quickActions = [
  { key: 'bump', label: 'BUMP', color: 'positive' },
  { key: 'cooking', label: 'COCINA', color: 'primary' },
  { key: 'join', label: 'UNIR', color: 'secondary' },
  { key: 'print', label: 'IMPRIMIR', color: 'grey-8' },
  { key: 'info', label: 'INFO', color: 'amber' },
  { key: 'recall', label: 'RECALL', color: 'red-8' },
  { key: 'last', label: 'RECALL LAST', color: 'red-10' }
]

const dishPool = catalog.dishes
const nextSequence = ref(1)
const activeOrders = ref(seedOrders())
const completedOrders = ref([])
const currentTime = ref(Date.now())
nextSequence.value = activeOrders.value.length + 1
const lastSpawnAt = ref(Date.now() - 3000)
const selectedAction = ref('cooking')
const selectedOrderIds = ref([])
let tickerId = null

function currencyFormat(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(value)
}

function formatCreatedAt(timestamp) {
  return new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp))
}

function elapsedLabel(timestamp) {
  const elapsed = Math.max(0, currentTime.value - timestamp)
  const minutes = Math.floor(elapsed / 60000)
  const seconds = Math.floor((elapsed % 60000) / 1000)

  if (minutes === 0) {
    return `${seconds.toString().padStart(2, '0')}s`
  }

  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
}

function closedElapsedLabel(order) {
  const closedAt = order.completedAt || currentTime.value
  const elapsed = Math.max(0, closedAt - order.createdAt)
  const minutes = Math.floor(elapsed / 60000)
  const seconds = Math.floor((elapsed % 60000) / 1000)

  if (minutes === 0) {
    return `${seconds.toString().padStart(2, '0')}s`
  }

  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
}

function stageForOrder(order) {
  const elapsed = currentTime.value - order.createdAt

  if (elapsed < 2 * 60 * 1000) {
    return 'new'
  }

  if (elapsed < 5 * 60 * 1000) {
    return 'prep'
  }

  return 'ready'
}

function buildCustomization(dish, seed) {
  const style = dish.styleOptions?.[seed % (dish.styleOptions.length || 1)] || 'Normal'
  const include = dish.includeOptions?.[seed % (dish.includeOptions.length || 1)]
  const omit = dish.omitOptions?.[seed % (dish.omitOptions.length || 1)]

  if (seed % 3 === 0 && include) {
    return `+ ${include}`
  }

  if (seed % 3 === 1 && omit) {
    return `Sin ${omit}`
  }

  return style
}

function pickRandomDishes(count) {
  const selected = []
  const usedIds = new Set()

  while (selected.length < count) {
    const candidate = dishPool[Math.floor(Math.random() * dishPool.length)]

    if (usedIds.has(candidate.id)) {
      continue
    }

    usedIds.add(candidate.id)
    selected.push(candidate)
  }

  return selected
}

function createOrder(createdAt = Date.now()) {
  const sequence = nextSequence.value
  const tableOptions = ['Mesa 2', 'Mesa 4', 'Mesa 7', 'Mesa 10', 'Para llevar', 'Delivery app']
  const noteOptions = ['Sin cebolla', 'Más salsa', 'Muy picoso', 'Cobrar en caja', 'Sin queso']
  const priorityOptions = ['normal', 'normal', 'alta', 'normal', 'alta']
  const itemCount = sequence % 3 === 0 ? 3 : 2
  const selectedDishes = pickRandomDishes(itemCount)

  nextSequence.value += 1

  return {
    id: `KDS-${String(sequence).padStart(3, '0')}`,
    channel: sequence % 4 === 0 ? 'App' : sequence % 3 === 0 ? 'Mostrador' : 'Mesa',
    table: tableOptions[sequence % tableOptions.length],
    priority: priorityOptions[sequence % priorityOptions.length],
    note: noteOptions[sequence % noteOptions.length],
    createdAt,
    items: selectedDishes.map((dish, index) => ({
      dishId: dish.id,
      categoryId: dish.categoryId,
      name: dish.name,
      quantity: index === 0 ? 2 : 1,
      price: dish.price,
      customization: buildCustomization(dish, sequence + index)
    }))
  }
}

function seedOrders() {
  return [
    createOrder(Date.now() - 4 * 60 * 1000),
    createOrder(Date.now() - 3 * 60 * 1000),
    createOrder(Date.now() - 2 * 60 * 1000),
    createOrder(Date.now() - 90 * 1000),
    createOrder(Date.now() - 75 * 1000),
    createOrder(Date.now() - 45 * 1000)
  ]
}

function categoryCountLabel(count) {
  return count === 1 ? '1 ticket' : `${count} tickets`
}

function spawnOrder() {
  activeOrders.value.push(createOrder(Date.now()))
  lastSpawnAt.value = Date.now()
}

function handleQuickAction(actionKey) {
  selectedAction.value = actionKey

  if (actionKey === 'bump') {
    bumpSelectedOrders()
  }

  if (actionKey === 'join') {
    joinSelectedOrders()
  }

  if (actionKey !== 'join') {
    selectedOrderIds.value = []
  }
}

function markAsReady(orderId) {
  moveOrderToClosed(orderId)
}

function bumpSelectedOrders() {
  const selectedOrders = activeOrders.value.filter((order) => selectedOrderIds.value.includes(order.id))

  if (!selectedOrders.length) {
    return
  }

  for (const order of selectedOrders) {
    moveOrderToClosed(order.id)
  }
}

function moveOrderToClosed(orderId) {
  const orderIndex = activeOrders.value.findIndex((order) => order.id === orderId)

  if (orderIndex < 0) {
    return
  }

  const [order] = activeOrders.value.splice(orderIndex, 1)

  completedOrders.value.unshift({
    ...order,
    completedAt: Date.now(),
    stage: 'done'
  })

  completedOrders.value = completedOrders.value.slice(0, 10)
}

function toggleOrderSelection(orderId) {
  if (selectedAction.value !== 'join') {
    selectedAction.value = 'join'
  }

  const current = new Set(selectedOrderIds.value)

  if (current.has(orderId)) {
    current.delete(orderId)
  } else {
    current.add(orderId)
  }

  selectedOrderIds.value = [...current]
}

function joinSelectedOrders() {
  const candidateOrders = selectedOrderIds.value.length >= 2
    ? activeOrders.value.filter((order) => selectedOrderIds.value.includes(order.id))
    : activeOrders.value.slice(0, 2)

  if (candidateOrders.length < 2) {
    return
  }

  const [firstOrder, secondOrder] = candidateOrders.sort((left, right) => left.createdAt - right.createdAt)
  const joinedId = `JOIN-${String(Date.now()).slice(-4)}`
  const selectedIndexes = activeOrders.value
    .map((order, index) => (selectedOrderIds.value.includes(order.id) ? index : -1))
    .filter((index) => index >= 0)
  const insertAt = selectedIndexes.length ? Math.min(...selectedIndexes) : 0

  const mergedItems = [...firstOrder.items, ...secondOrder.items]
  const priorityRank = { normal: 0, alta: 1 }
  const mergedOrder = {
    id: joinedId,
    channel: [firstOrder.channel, secondOrder.channel].filter(Boolean).filter((value, index, self) => self.indexOf(value) === index).join(' + '),
    table: [firstOrder.table, secondOrder.table].filter(Boolean).filter((value, index, self) => self.indexOf(value) === index).join(' + '),
    priority: priorityRank[firstOrder.priority] >= priorityRank[secondOrder.priority] ? firstOrder.priority : secondOrder.priority,
    note: [firstOrder.note, secondOrder.note].filter(Boolean).join(' · ') || 'JOINED',
    createdAt: firstOrder.createdAt,
    items: mergedItems,
    stage: 'new'
  }

  const remainingOrders = activeOrders.value.filter((order) => !selectedOrderIds.value.includes(order.id))
  remainingOrders.splice(insertAt, 0, mergedOrder)
  activeOrders.value = remainingOrders

  selectedOrderIds.value = []
}

function tick() {
  currentTime.value = Date.now()

  const remainingOrders = []

  for (const order of activeOrders.value) {
    const elapsed = currentTime.value - order.createdAt

    if (elapsed >= 9 * 60 * 1000) {
      completedOrders.value.unshift({ ...order, stage: 'done' })
      continue
    }

    remainingOrders.push(order)
  }

  activeOrders.value = remainingOrders
  completedOrders.value = completedOrders.value.slice(0, 10)

  if (currentTime.value - lastSpawnAt.value >= 6500 && activeOrders.value.length < 8) {
    activeOrders.value.push(createOrder(currentTime.value))
    lastSpawnAt.value = currentTime.value
  }
}

const ordersWithStage = computed(() =>
  activeOrders.value.map((order) => ({
    ...order,
    stage: stageForOrder(order)
  }))
)

const totalActive = computed(() => ordersWithStage.value.length)
const prepCount = computed(() => ordersWithStage.value.filter((order) => order.stage === 'prep').length)
const newCount = computed(() => ordersWithStage.value.filter((order) => order.stage === 'new').length)
const readyCount = computed(() => ordersWithStage.value.filter((order) => order.stage === 'ready').length)

const averageWait = computed(() => {
  if (!ordersWithStage.value.length) {
    return '0m'
  }

  const average =
    ordersWithStage.value.reduce((sum, order) => sum + (currentTime.value - order.createdAt), 0) /
    ordersWithStage.value.length

  return `${Math.max(0, Math.round(average / 60000))}m`
})

const loadFactor = computed(() => Math.min(1, totalActive.value / 10))
const currentTimeLabel = computed(() =>
  new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(currentTime.value))
)

const activePulseLabel = computed(() => {
  if (readyCount.value >= 3) {
    return 'Pase saturado'
  }

  if (prepCount.value >= 3) {
    return 'Cocina cargada'
  }

  return 'Flujo estable'
})

const incomingHint = computed(() => {
  const active = totalActive.value

  if (active >= 8) {
    return 'Recibiendo sin pausa'
  }

  if (active >= 5) {
    return 'Llegadas constantes'
  }

  return 'Nuevo ticket en breve'
})

const latestOrderLabel = computed(() => activeOrders.value[activeOrders.value.length - 1]?.id || 'Sin tickets')

const boardOrders = computed(() =>
  ordersWithStage.value
    .map((order) => ({
      ...order,
      createdAtLabel: formatCreatedAt(order.createdAt),
      stageLabel:
        order.stage === 'new'
          ? 'Nuevo'
          : order.stage === 'prep'
            ? 'En proceso'
            : 'Listo'
    }))
)

const categorySummary = computed(() =>
  catalog.categories.map((category) => ({
    ...category,
    count: ordersWithStage.value.reduce(
      (sum, order) =>
        sum + order.items.reduce((itemSum, item) => itemSum + (item.categoryId === category.id ? item.quantity : 0), 0),
      0
    )
  }))
)

onMounted(() => {
  tick()
  tickerId = window.setInterval(tick, 1000)
})

onBeforeUnmount(() => {
  if (tickerId) {
    window.clearInterval(tickerId)
  }
})
</script>