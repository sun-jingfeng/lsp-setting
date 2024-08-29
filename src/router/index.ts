import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '@/components/Layout/Layout.vue'
import { CONFIG } from '@/common/const'
import { loginPath } from '@/views/login/const'
import path from 'path-browserify'
import type { IAuthorityTree } from '@/apis/role.const'

declare module 'vue-router' {
  interface RouteMeta {
    pageName?: string
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
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/not-found/not-found.vue')
  }
]

export const getDynamicRoutes: () => RouteRecordRaw[] = () => [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    meta: {
      pageName: '基础页'
    },
    children: [
      {
        path: 'station',
        name: 'station',
        component: () => import('@/views/station/station.vue'),
        meta: {
          pageName: '台站管理'
        }
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/views/history/history.vue'),
        meta: {
          pageName: '历史回算'
        }
      },
      {
        path: 'authority',
        meta: {
          pageName: '权限管理'
        },
        children: [
          {
            path: 'role',
            name: 'role',
            component: () => import('@/views/role/role.vue'),
            meta: {
              pageName: '角色管理'
            }
          },
          {
            path: 'manage',
            name: 'manage',
            component: () => import('@/views/manage/manage.vue'),
            meta: {
              pageName: '用户管理'
            }
          }
        ]
      },
      {
        path: 'monitor',
        name: 'monitor',
        component: () => import('@/views/monitor/monitor.vue'),
        meta: {
          pageName: '监控日志'
        }
      }
    ]
  }
]

export const getAuthorityTree = (i_routes = getDynamicRoutes(), basePath = '/'): IAuthorityTree =>
  i_routes.map(item => ({
    label: item.meta?.pageName ?? '',
    value: path.resolve(basePath, item.path),
    ...(item.children?.length
      ? { children: getAuthorityTree(item.children, path.resolve(basePath, item.path)) }
      : {})
  }))

const router = createRouter({
  history: createWebHistory(CONFIG.basePath),
  routes
})

export default router
