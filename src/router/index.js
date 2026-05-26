import KioskLayout from '../layouts/KioskLayout.vue'

export default [
  {
    path: '/',
    component: KioskLayout,
    children: [
      {
        path: '',
        name: 'welcome',
        component: () => import('../pages/WelcomePage.vue')
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('../pages/MenuPage.vue')
      },
      {
        path: 'customize/:dishId',
        name: 'customize',
        component: () => import('../pages/CustomizePage.vue'),
        props: true
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('../pages/CartPage.vue')
      },
      {
        path: 'checkout',
        name: 'checkout',
        component: () => import('../pages/CheckoutPage.vue')
      }
    ]
  }
]