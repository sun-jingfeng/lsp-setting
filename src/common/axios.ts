import router from '@/router'
import axios, { type AxiosRequestConfig } from 'axios'
import { CONFIG } from './const'
import { getToken, removeToken } from './utils'
import { loginPath, redirectKey } from '@/views/login/const'

export type IResponse<T> = Promise<{
  code: string
  data: T
  msg?: string
}>

export type IResponsePackage<T> = {
  response: IResponse<T>
  controller: AbortController
}

export type IPickResponse<T extends (...args: any[]) => any> = ReturnType<T> extends IResponse<
  infer R
>
  ? R
  : unknown

export type IPickResponsePackage<T extends (...args: any[]) => any> =
  ReturnType<T> extends IResponsePackage<infer R> ? R : unknown

const instance = axios.create({
  baseURL: CONFIG.baseUrl,
  timeout: 1000 * 30,
  withCredentials: true
})

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    config.headers.Authorization = getToken()
    return config
  },
  error => Promise.reject(error)
)

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    if (+response.data.code === 200 || (response.status === 200 && response.data instanceof Blob)) {
      return response.data
    } else {
      const currentPath = router.currentRoute.value.path
      if (+response.data.code === 401 && currentPath !== loginPath) {
        removeToken()
        router.push({
          path: loginPath,
          query: currentPath === '/' ? {} : { [redirectKey]: currentPath }
        })
      }
      return Promise.reject(response.data)
    }
  },
  error => Promise.reject(error)
)

const formatOption = <T extends AxiosRequestConfig>(option: T): T => {
  option.method = option.method?.toLocaleLowerCase() || 'get'
  if (option.method === 'get' && option.data) {
    option.params = option.data
  }
  return option
}

export const request = <T = any>(option: AxiosRequestConfig<string | object>): IResponse<T> => {
  option = formatOption(option)
  return instance(option)
}

export const requestPackage = <T = any>(
  option: AxiosRequestConfig<string | object>
): IResponsePackage<T> => {
  option = formatOption(option)
  const controller = new AbortController()
  option.signal = controller.signal
  return { response: instance(option), controller }
}
