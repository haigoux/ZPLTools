import { createRouter, createWebHistory } from 'vue-router'
import xref from '@/views/xref.vue'
import labels from '@/views/labels.vue'
import zpl from '@/views/zpl.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'xref',
      component: xref
    },
    {
      path: '/labels',
      name: 'labels',
      component: labels
    },
    {
      path: '/zpledit',
      name: 'zpl',
      component: zpl
    }
  ],
})

export default router
