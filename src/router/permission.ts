import { getToken, removeToken } from '@/common/utils'
import router from './index'
import { loginPath, redirectKey } from '@/views/login/const'
import { useUserStore } from '@/stores/user'
import { getUserInfoApi } from '@/apis/user'

let removeRouteList: ReturnType<typeof router.addRoute>[] = []

router.beforeEach(async to => {
  const userStore = useUserStore()
  if (getToken()) {
    if (!userStore.userinfo) {
      try {
        const { data: res } = await getUserInfoApi()
        userStore.userinfo = res
        userStore
          .getAuthorityRoutesList()
          .forEach(route => removeRouteList.push(router.addRoute(route)))
        return to.path
      } catch (error: any) {
        console.error(error)
        removeToken()
        return `/login${to.path === '/' ? '' : `?redirect=${to.path}`}`
      }
    }
    if (to.path === loginPath) {
      return '/'
    } else {
      return true
    }
  } else {
    if (to.path === loginPath) {
      userStore.userinfo = null
      removeRouteList.forEach(item => item())
      removeRouteList = []
      return true
    } else {
      return {
        path: loginPath,
        query: to.path === '/' ? {} : { [redirectKey]: to.path }
      }
    }
  }
})
