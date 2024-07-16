/* eslint-disable arrow-body-style */
import { request, requestPackage } from '@/common/axios'

export const loginApi = (data: { username: string; password: string }) => {
  return request<string>({
    url: '/lsp-tianjin/login',
    method: 'get',
    data
  }).then(res => {
    // 数据处理
    return res
  })
}

export const loginApiPackage = (data: { username: string; password: string; cid: string }) => {
  const responsePackage = requestPackage<string>({
    url: '/admin/log/login',
    method: 'post',
    params: data
  })
  responsePackage.response = responsePackage.response.then(res => {
    // 数据处理
    return res
  })
  return responsePackage
}
