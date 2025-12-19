import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/dashboard/postulantes',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard/DashboardView.vue'),
    redirect: '/dashboard/postulantes',
    children: [
      // {
      //   path: '/dashboard/home',
      //   name: 'dashboard-home',
      //   component: () => import('../views/Dashboard/HomeView.vue'),
      // },
      {
        path: '/dashboard/postulantes',
        name: 'postulantes',
        component: () => import('../views/Dashboard/PostulantesView.vue'),
      },
      // Agrega más rutas aquí según necesites
      // {
      //   path: '/dashboard/analytics',
      //   name: 'analytics',
      //   component: () => import('../views/Dashboard/AnalyticsView.vue'),
      // },
    ],
  },
  // Error 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

