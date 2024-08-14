/* eslint-disable arrow-body-style */
import { request } from '@/common/axios'

export const loginApi = (data: { username: string; password: string }) => {
  return request<string>({
    url: '/login',
    method: 'get',
    data
  }).then(res => {
    // 数据处理
    return res
  })
}

export const getUserInfoApi = () => {
  return request<{
    username: string
    authoritiesList: string[]
  }>({
    url: '/user/queryUserNameAndPermission',
    method: 'get'
  }).then(res => {
    res.data = {
      username: res.data.username,
      authoritiesList: (res as any).data.permissions
    }
    try {
      res.data.authoritiesList = JSON.parse(res.data.authoritiesList as any as string)
    } catch (error) {
      res.data.authoritiesList = []
    }
    return res
  })
}
