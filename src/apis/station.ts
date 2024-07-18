/* eslint-disable arrow-body-style */
import { request } from '@/common/axios'
import type { IProState } from '@/views/station/const'
import type { IStation } from '../views/station/Operate/const'

// export const mockApi = (params: { id: number }) => {
//   return request({
//     url: '/lsp-tianjin/radarType/delete',
//     method: 'get',
//     params
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

// 获取雷达型号的台站数量
export const getStationNumByRadarTypeApi = (params: { radarTypeId: number }) => {
  return request<number>({
    url: '/lsp-tianjin/stationInfo/selectPage',
    method: 'post',
    params: {
      pageNum: 1,
      pageSize: 999,
      radarTypeID: params.radarTypeId
    }
  }).then(res => {
    res.data = (res.data as any).records?.length ?? 0
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

// 获取站点列表
export const getStationListApi = (params: {
  pageNum: number
  pageSize: number
  proState?: IProState
  radarType?: string
}) => {
  return request<{
    total: number
    records: (IStation & {
      id: number
      proState: IProState
    })[]
  }>({
    url: '/lsp-tianjin/stationInfo/selectPage',
    method: 'post',
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      realTimeFlag: params.proState,
      radarTypeID: params.radarType
    }
  }).then(res => {
    res.data.records = res.data.records?.map(
      (item: any) =>
        (({
          stationNo: item.station_no,
          stationName: item.station_name,
          area: item.area,
          province: item.province,
          longitude: item.lon,
          latitude: item.lat,
          altitude: item.alti,
          radarType: item.radar_type,
          proState: item.real_time_flag
        } as any) ?? [])
    )
    return res
  })
}

// 新增站点
export const addStationApi = (data: Record<keyof IStation, string>) => {
  return request<string>({
    url: '/lsp-tianjin/stationInfo/add',
    method: 'post',
    data: {
      station_no: data.stationNo,
      station_name: data.stationName,
      area: data.area,
      province: data.province,
      lon: data.longitude,
      lat: data.latitude,
      alti: data.altitude,
      radar_type: data.radarType
    }
  }).then(res => {
    // 数据处理
    return res
  })
}

// 编辑站点
export const editStationApi = (data: Record<keyof IStation, string> & { id: number }) => {
  return request<string>({
    url: '/lsp-tianjin/stationInfo/update',
    method: 'post',
    data
  }).then(res => {
    // 数据处理
    return res
  })
}

// 删除站点
export const deleteStationApi = (params: { id: number }) => {
  return request<string>({
    url: '/lsp-tianjin/stationInfo/delete',
    method: 'get',
    params
  }).then(res => {
    // 数据处理
    return res
  })
}
