import { createApp } from 'vue'
import { Quasar, Ripple } from 'quasar'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import routes from './router'

import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
import './css/app.css'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {}
})

app.directive('ripple', Ripple)

app.mount('#app')