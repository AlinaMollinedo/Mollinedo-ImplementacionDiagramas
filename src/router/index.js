import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/home_page.vue'
import D1 from '../components/diagram1.vue'
import D2 from '../components/diagram2.vue'
import D3 from '../components/diagram3.vue'
import D4 from '../components/diagram4.vue'
import D5 from '../components/diagram5.vue'
import D6 from '../components/diagram6.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
    {
      path: '/diagrama1',
      name: 'Digrama 1',
      component: D1,
    },
    {
      path: '/diagrama2',
      name: 'Digrama 2',
      component: D2,
    },
    {
      path: '/diagrama3',
      name: 'Digrama 3',
      component: D3,
    },
    {
      path: '/diagrama4',
      name: 'Digrama 4',
      component: D4,
    },
    {
      path: '/diagrama5',
      name: 'Digrama 5',
      component: D5,
    },
    {
      path: '/diagrama6',
      name: 'Digrama 6',
      component: D6,
    },
  ],
})

export default router
