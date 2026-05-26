<template>
  <q-page class="kiosk-page q-pa-md q-pa-lg-lg">
    <q-card class="menu-shell card-elevated" flat bordered>
      <q-card-section class="menu-shell__header row items-center justify-between q-gutter-md">
        <div class="row items-center q-gutter-md no-wrap">
          <q-avatar size="44px" class="menu-shell__logo">
            <div class="text-weight-bold">TC</div>
          </q-avatar>
          <div>
            <div class="text-subtitle1 text-weight-bold">{{ brand.name }}</div>
            <div class="text-caption text-grey-7">{{ brand.restaurant }}</div>
          </div>
        </div>

        <q-btn round flat icon="shopping_cart" @click="goToCart">
          <q-badge v-if="order.cartCount" color="negative" floating>{{ order.cartCount }}</q-badge>
        </q-btn>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pb-none">
        <q-tabs
          v-model="activeCategory"
          dense
          no-caps
          align="left"
          active-color="positive"
          indicator-color="positive"
          class="menu-tabs"
        >
          <q-tab
            v-for="category in categories"
            :key="category.id"
            :name="category.id"
            :label="category.label"
          />
        </q-tabs>
      </q-card-section>

      <q-card-section class="q-pt-sm q-pb-none">
        <div class="row items-center justify-between q-mb-sm">
          <div>
            <div class="text-subtitle2 text-weight-bold">Elige una subcategoría</div>
            <div class="text-caption text-grey-7">Tacos, pizzas, hamburguesas y más según la sección activa.</div>
          </div>
        </div>

        <div class="menu-subcategories-scroll" aria-label="Subcategorías del menú">
          <div class="row no-wrap q-gutter-sm q-pb-sm">
            <q-btn
              v-for="subcategory in visibleSubcategories"
              :key="subcategory.id"
              :outline="subcategory.id !== activeSubcategory"
              :flat="subcategory.id !== activeSubcategory"
              :color="subcategory.id === activeSubcategory ? 'positive' : 'grey-8'"
              rounded
              no-caps
              class="menu-subcategories__pill"
              @click="selectSubcategory(subcategory.id)"
            >
              <q-icon :name="subcategory.icon" size="18px" class="q-mr-sm" />
              {{ subcategory.label }}
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="menu-content">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="text-subtitle1 text-weight-bold">Promociones de {{ activeSubcategoryLabel }}</div>
            <div class="text-body2 text-grey-7">Van primero para que se vean al abrir la pantalla.</div>
          </div>
          <q-chip color="positive" text-color="white" rounded>{{ activeSubcategoryLabel }}</q-chip>
        </div>

        <div class="menu-promo-scroll q-mb-lg" aria-label="Promociones del menú">
          <div class="row no-wrap q-gutter-md q-pb-sm">
            <div v-for="promo in visiblePromotions" :key="promo.id" class="menu-promo-scroll__item">
              <PromoCard
                class="menu-promo-card"
                :title="promo.title"
                :subtitle="promo.subtitle"
                :tone="promo.tone"
                :tag="promo.tag"
                :footnote="promo.footnote"
                @select="openDish(promo.dishId)"
              />
            </div>
          </div>
        </div>

        <div class="row items-center justify-between q-mb-md q-mt-sm">
          <div>
            <div class="text-subtitle1 text-weight-bold">Platillos de {{ activeSubcategoryLabel }}</div>
            <div class="text-body2 text-grey-7">Toca una tarjeta para personalizar el platillo.</div>
          </div>
        </div>

        <div class="menu-dishes-scroll q-mb-xl" aria-label="Platillos del menú">
          <div class="row no-wrap q-gutter-md q-pb-sm">
            <div v-for="dish in visibleDishes" :key="dish.id" class="menu-dishes-scroll__item">
              <q-card class="dish-card card-elevated" flat bordered>
                <DishArt :title="dish.name" :subtitle="dish.description" :tone="dish.heroTone" />

                <q-card-section class="q-pb-sm">
                  <div class="row items-start justify-between q-gutter-sm no-wrap">
                    <div class="col">
                      <div class="text-subtitle1 text-weight-bold">{{ dish.name }}</div>
                      <div class="text-body2 text-grey-7 q-mt-xs">{{ dish.description }}</div>
                    </div>
                    <q-badge color="positive" rounded>${{ dish.price.toFixed(2) }}</q-badge>
                  </div>
                </q-card-section>

                <q-card-actions align="between" class="q-pt-none q-px-md q-pb-md">
                  <div class="text-caption text-grey-6">{{ dish.featuredNote }}</div>
                  <q-btn color="positive" unelevated rounded label="Elegir" @click="openDish(dish.id)" />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn
        color="positive"
        size="lg"
        unelevated
        rounded
        icon-right="chevron_right"
        label="Ver Carrito"
        @click="goToCart"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/order'
import catalog from '../mocks/menu.json'
import DishArt from '../components/DishArt.vue'
import PromoCard from '../components/PromoCard.vue'

const router = useRouter()
const order = useOrderStore()
const brand = catalog.brand

const categories = catalog.categories
const subcategories = catalog.subcategories
const promotions = catalog.promotions
const dishes = catalog.dishes

const activeCategory = computed({
  get: () => order.selectedCategoryId,
  set: (value) => {
    order.setCategory(value)
    const firstSubcategory = visibleSubcategories.value[0]
    if (firstSubcategory) {
      order.setSubcategory(firstSubcategory.id)
    }
  }
})

const visibleSubcategories = computed(() =>
  subcategories.filter((subcategory) => subcategory.categoryId === order.selectedCategoryId)
)

const activeSubcategory = computed({
  get: () => order.selectedSubcategoryId,
  set: (value) => order.setSubcategory(value)
})

const activeSubcategoryLabel = computed(() => {
  return visibleSubcategories.value.find((subcategory) => subcategory.id === order.selectedSubcategoryId)?.label || 'Todos'
})

const visiblePromotions = computed(() => {
  const matched = promotions.filter((promotion) => {
    return (
      promotion.categoryId === order.selectedCategoryId &&
      promotion.subcategoryId === order.selectedSubcategoryId
    )
  })

  if (matched.length) return matched

  return dishes
    .filter(
      (dish) =>
        dish.categoryId === order.selectedCategoryId &&
        dish.subcategoryId === order.selectedSubcategoryId
    )
    .slice(0, 3)
    .map((dish) => ({
      id: dish.id,
      title: dish.name,
      subtitle: dish.description,
      tone: dish.heroTone,
      tag: `Desde $${dish.price.toFixed(2)}`,
      footnote: dish.featuredNote,
      dishId: dish.id
    }))
})

const visibleDishes = computed(() =>
  dishes.filter(
    (dish) =>
      dish.categoryId === order.selectedCategoryId &&
      dish.subcategoryId === order.selectedSubcategoryId
  )
)

function selectSubcategory(subcategoryId) {
  activeSubcategory.value = subcategoryId
}

function openDish(dishId) {
  router.push({ name: 'customize', params: { dishId } })
}

function goToCart() {
  router.push({ name: 'cart' })
}

watch(
  () => order.selectedCategoryId,
  () => {
    if (!visibleSubcategories.value.some((subcategory) => subcategory.id === order.selectedSubcategoryId)) {
      const firstSubcategory = visibleSubcategories.value[0]
      if (firstSubcategory) {
        order.setSubcategory(firstSubcategory.id)
      }
    }
  },
  { immediate: true }
)
</script>