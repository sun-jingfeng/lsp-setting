import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/components/Layout/Layout.vue'
import { CONFIG } from '@/common/const'
import { loginPath } from '@/views/login/const'

declare module 'vue-router' {
  interface RouteMeta {
    usePathKey1?: boolean
    usePathKey2?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: loginPath,
    name: 'login',
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/station',
    children: [
      {
        path: 'station',
        name: 'station',
        component: () => import('@/views/station/station.vue')
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/views/history/history.vue')
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/role/role.vue')
      },
      {
        path: 'manage',
        name: 'manage',
        component: () => import('@/views/manage/manage.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/not-found/not-found.vue')
  }
]

const router = createRouter({
  history: createWebHistory(CONFIG.basePath),
  routes
})

export default router
