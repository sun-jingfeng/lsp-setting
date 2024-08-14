import type { getUserInfoApi } from '@/apis/user'
import type { IPickResponse } from '@/common/axios'
import type { RouteRecordRaw } from 'vue-router'
import path from 'path-browserify'
import { getDynamicRoutes } from '@/router'
import { CONFIG } from '@/common/const'

type IState = {
  userinfo: IPickResponse<typeof getUserInfoApi> | null
}
type IGetters = {}
type IActions = {
  getAuthorityRoutesList(dynamicRoutes?: RouteRecordRaw[], basePath?: string): RouteRecordRaw[]
}

export const useUserStore = defineStore<string, IState, IGetters, IActions>('user', {
  state: () => ({
    userinfo: null
  }),
  getters: {},
  actions: {
    getAuthorityRoutesList(dynamicRoutes: RouteRecordRaw[] = getDynamicRoutes(), basePath = '/') {
      const result: RouteRecordRaw[] = []
      dynamicRoutes.forEach(route => {
        const routePath = path.resolve(basePath, route.path)
        if (!CONFIG.authorityRoute || this.userinfo?.authoritiesList?.includes?.(routePath)) {
          result.push(route)
          if (route.children) {
            route.children = this.getAuthorityRoutesList(route.children, routePath)
            if (route.children?.length) {
              route.redirect = path.resolve(basePath, route.children[0].path)
            }
          }
        }
      })
      return result
    }
  }
})
