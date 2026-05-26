<template>
  <q-page class="kiosk-page q-pa-md q-pa-lg-lg">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-lg-7">
        <q-card class="card-elevated checkout-shell" flat bordered>
          <q-card-section>
            <div class="text-overline text-grey-7">Paso 5 · Checkout</div>
            <div class="text-h5 text-weight-bold">Confirmación del pedido</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="column q-gutter-md">
              <div v-for="item in order.cart" :key="item.id" class="checkout-line row items-center justify-between">
                <div>
                  <div class="text-subtitle2 text-weight-bold">{{ item.name }}</div>
                  <div class="text-caption text-grey-7">{{ customizationText(item) }}</div>
                </div>
                <div class="text-weight-bold">x{{ item.quantity }} · ${{ item.lineTotal.toFixed(2) }} MXN</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-5">
        <q-card class="card-elevated checkout-shell" flat bordered>
          <q-card-section>
            <div class="text-h6 text-weight-bold">Método de pago</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-btn-toggle
              v-model="paymentMethod"
              spread
              no-caps
              rounded
              unelevated
              color="positive"
              toggle-color="positive"
              :options="paymentOptions"
            />

            <q-card class="q-mt-lg payment-summary" flat bordered>
              <q-card-section>
                <div class="row items-center justify-between q-mb-sm">
                  <span>Subtotal</span>
                  <span>${{ order.subtotal.toFixed(2) }} MXN</span>
                </div>
                <div class="row items-center justify-between q-mb-sm text-positive">
                  <span>Descuento</span>
                  <span>-${{ order.discountAmount.toFixed(2) }} MXN</span>
                </div>
                <q-separator class="q-my-md" />
                <div class="row items-center justify-between text-h5 text-weight-bold text-positive">
                  <span>Total</span>
                  <span>${{ order.total.toFixed(2) }} MXN</span>
                </div>
              </q-card-section>
            </q-card>
          </q-card-section>

          <q-card-actions class="q-pa-md" align="center">
            <q-btn
              class="full-width"
              color="positive"
              unelevated
              rounded
              size="lg"
              label="Pagar ahora"
              :disable="!order.cart.length || !paymentMethod"
              @click="confirmPayment"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="successDialog">
      <q-card class="q-pa-md payment-success">
        <q-card-section class="text-center">
          <q-icon name="task_alt" size="64px" color="positive" />
          <div class="text-h5 text-weight-bold q-mt-md">Pedido confirmado</div>
          <div class="text-body1 text-grey-7 q-mt-sm">
            Tu orden fue enviada a cocina con el método de pago {{ paymentMethodLabel }}.
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn color="positive" unelevated rounded label="Volver al inicio" @click="returnHome" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../stores/order'

const router = useRouter()
const order = useOrderStore()

const paymentMethod = ref('Tarjeta')
const successDialog = ref(false)

const paymentOptions = [
  { label: 'Tarjeta', value: 'Tarjeta' },
  { label: 'Efectivo', value: 'Efectivo' },
  { label: 'QR', value: 'QR' }
]

const paymentMethodLabel = computed(() => paymentMethod.value || 'Tarjeta')

function customizationText(item) {
  const parts = []

  if (item.include?.length) {
    parts.push(`Con ${item.include.join(', ')}`)
  }

  if (item.omit?.length) {
    parts.push(`Sin ${item.omit.join(', ')}`)
  }

  if (item.notes) {
    parts.push(item.notes)
  }

  return parts.length ? parts.join(' · ') : 'Sin personalizaciones'
}

function confirmPayment() {
  successDialog.value = true
  order.clearCart()
}

function returnHome() {
  successDialog.value = false
  router.push({ name: 'welcome' })
}
</script>