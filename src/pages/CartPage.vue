<template>
  <q-page class="kiosk-page q-pa-md q-pa-lg-lg">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-lg-8">
        <q-card class="card-elevated cart-shell" flat bordered>
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-overline text-grey-7">Paso 4 · Revisar pedido</div>
              <div class="text-h5 text-weight-bold">Carrito de compras</div>
            </div>
            <q-btn flat rounded color="grey-8" label="Seguir explorando" @click="goToMenu" />
          </q-card-section>

          <q-separator />

          <q-card-section class="cart-shell__list">
            <div v-if="!order.cart.length" class="text-center q-pa-xl">
              <q-icon name="shopping_cart_checkout" size="48px" color="grey-5" />
              <div class="text-subtitle1 text-weight-bold q-mt-md">Tu carrito está vacío</div>
              <div class="text-body2 text-grey-7 q-mt-xs">Selecciona un platillo para continuar.</div>
            </div>

            <div v-else class="column q-gutter-md">
              <CartItemCard
                v-for="item in order.cart"
                :key="item.id"
                :item="item"
                @increase="increaseItem(item.id, item.quantity)"
                @decrease="decreaseItem(item.id, item.quantity)"
                @remove="removeItem(item.id)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-4">
        <q-card class="card-elevated cart-billing" flat bordered>
          <q-card-section>
            <div class="text-h6 text-weight-bold">Facturación</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="column q-gutter-md">
            <div class="row items-center justify-between text-body1">
              <span>Subtotal</span>
              <span class="text-weight-medium">${{ order.subtotal.toFixed(2) }} MXN</span>
            </div>

            <div class="coupon-box">
              <q-input
                :model-value="order.couponCode"
                outlined
                dense
                label="Cupón"
                placeholder="TACO10 o MESA20"
                @update:model-value="order.setCouponCode"
              >
                <template #append>
                  <q-btn flat color="positive" label="Aplicar" @click="applyCoupon" />
                </template>
              </q-input>
            </div>

            <div class="row items-center justify-between text-body1">
              <span>Descuento</span>
              <span class="text-positive text-weight-medium">- ${{ order.discountAmount.toFixed(2) }} MXN</span>
            </div>

            <q-separator />

            <div class="row items-center justify-between">
              <span class="text-subtitle1 text-weight-bold">Total a Pagar</span>
              <span class="text-h5 text-weight-bold text-positive">${{ order.total.toFixed(2) }} MXN</span>
            </div>
          </q-card-section>

          <q-card-actions class="q-pa-md" align="center">
            <q-btn
              class="full-width"
              color="positive"
              unelevated
              rounded
              size="lg"
              label="Confirmar y Pagar"
              :disable="!order.cart.length"
              @click="goToCheckout"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/order'
import CartItemCard from '../components/CartItemCard.vue'

const router = useRouter()
const order = useOrderStore()

function increaseItem(id, quantity) {
  order.updateQuantity(id, quantity + 1)
}

function decreaseItem(id, quantity) {
  order.updateQuantity(id, quantity - 1)
}

function removeItem(id) {
  order.removeItem(id)
}

function applyCoupon() {
  order.applyCoupon()
}

function goToCheckout() {
  router.push({ name: 'checkout' })
}

function goToMenu() {
  router.push({ name: 'menu' })
}
</script>