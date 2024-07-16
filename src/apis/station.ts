/* eslint-disable arrow-body-style */
import { request } from '@/common/axios'

// export const mockApi = (data: { username: string; password: string }) => {
//   return request<string>({
//     url: '/admin/log/login',
//     method: 'post',
//     params: {
//       ...data,
//       cid: 'hazhqx'
//     }
//   }).then(res => {
//     // 数据处理
//     return res
//   })
// }

// 获取雷达型号列表
export const getRadarTypeListApi = (params?: { radarType: string }) => {
  return request<{ id: number; radarType: string; top: 0 | 1 }[]>({
    url: '/lsp-tianjin/radarType/select',
    method: 'post',
    params
  }).then(res => {
    // 数据处理
    return res
  })
}

// 新增雷达型号
export const addRadarTypeApi = (params: { radarType: string }) => {
  return request<string>({
    url: '/lsp-tianjin/radarType/add',
    method: 'post',
    params
  }).then(res => {
    // 数据处理
    return res
  })
}

// 编辑雷达型号
export const editRadarTypeApi = (data: { id: number; radarType: string; top: 0 | 1 }) => {
  return request<string>({
    url: '/lsp-tianjin/radarType/update',
    method: 'post',
    data
  }).then(res => {
    // 数据处理
    return res
  })
}

// 删除雷达型号
export const deleteRadarTypeApi = (params: { id: number }) => {
  return request({
    url: '/lsp-tianjin/radarType/delete',
    method: 'get',
    params
  }).then(res => {
    // 数据处理
    return res
  })
}
