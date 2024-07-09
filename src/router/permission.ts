import { getToken } from '@/common/utils'
import router from './index'
import { loginPath, redirectKey } from '@/views/login/const'

router.beforeEach(to => {
  if (getToken()) {
    if (to.path === loginPath) {
      return '/'
    } else {
      return true
    }
  } else {
    if (to.path === loginPath) {
      return true
    } else {
      return {
        path: loginPath,
        query: to.path === '/' ? {} : { [redirectKey]: to.path }
      }
    }
  }
})
