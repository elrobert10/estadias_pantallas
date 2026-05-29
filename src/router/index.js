export default [
  {
    path: '/',
    name: 'kds',
    component: () => import('../pages/KdsPage.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]