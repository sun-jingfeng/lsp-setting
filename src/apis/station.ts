/* eslint-disable arrow-body-style */
import { request } from '@/common/axios'
import type { IProState } from '@/views/station/const'
import type { IAreaList } from '../views/station/Operate/const'
import { areaList, type IStation } from '../views/station/Operate/const'
import { cloneDeep } from 'lodash'

// export const mockApi = () => {
//   return request<string>({
//     url: '/login',
//     method: 'get',
//     data: {
//       username: 'admin',
//       password: 123456
//     }
//   }).then(res => {
//     // 数据处理
//     return res
//   })
// }

// 获取雷达型号列表
export const getRadarModelListApi = () => {
  return request<{ dataId: string; dataContent: string; top: 0 | 1 }[]>({
    url: '/radarType/select',
    method: 'post'
  }).then(res => {
    res.data = res.data.map((item: any) => ({
      dataId: String(item.id),
      dataContent: item.radarType,
      top: item.top
    }))
    return res
  })
}

// 新增雷达型号
export const addRadarModelApi = (params: { dataContent: string }) => {
  return request<string>({
    url: '/radarType/add',
    method: 'post',
    params: {
      radarType: params.dataContent
    }
  }).then(res => {
    // 数据处理
    return res
  })
}

// 编辑雷达型号
export const editRadarModelApi = (data: { dataId: string; dataContent: string; top: 0 | 1 }) => {
  return request<string>({
    url: '/radarType/update',
    method: 'post',
    data: {
      id: data.dataId,
      radarType: data.dataContent,
      top: data.top
    }
  }).then(res => {
    // 数据处理
    return res
  })
}

// 获取雷达型号的台站数量
export const getNumByRadarModelApi = (params: { dataId: string }) => {
  return request<number>({
    url: '/stationInfo/selectPage',
    method: 'post',
    params: {
      pageNum: 1,
      pageSize: 99999,
      radarTypeID: params.dataId
    }
  }).then(res => {
    res.data = (res.data as any).records?.length ?? 0
    return res
  })
}

// 删除雷达型号
export const deleteRadarModelApi = (params: { dataId: string }) => {
  return request({
    url: '/radarType/delete',
    method: 'get',
    params: {
      id: params.dataId
    }
  }).then(res => {
    // 数据处理
    return res
  })
}

// 获取雷达区域选项
export const getStationNoOptionsApi = () => {
  return request<IAreaList>({
    url: '/stationInfo/selectPage',
    method: 'post',
    params: {
      pageNum: 1,
      pageSize: 99999
    }
  }).then(res => {
    const records: IStation[] = (res as any).data.records?.map(
      (item: any) =>
        (({
          stationNo: item.station_no,
          stationName: item.station_name,
          area: item.area,
          province: item.province,
          longitude: String(item.lon),
          latitude: String(item.lat),
          altitude: String(item.alti),
          radarModelId: String(item.radar_type_id),
          stationId: String(item.id),
          proState: item.real_time_flag
        } as any) ?? [])
    )
    const c_areaList: IAreaList = [{ label: '全部', value: '全部', children: cloneDeep(areaList) }]
    formatAreaList(c_areaList)
    function formatAreaList(i_areaList: IAreaList) {
      const uselessList: IAreaList = []
      i_areaList.forEach(item => {
        if (item.children) {
          formatAreaList(item.children)
          item.num = item.children.reduce((acc, cur) => acc + (cur.num ?? 0), 0)
        } else {
          const targetRecords = records.filter(item2 => item2.province === item.value)
          if (targetRecords.length !== 0) {
            item.num = targetRecords.length
            item.children = targetRecords.map(item3 => ({
              label: `${item3.stationName} ${item3.stationNo}`,
              value: item3.stationNo
            }))
          } else {
            uselessList.push(item)
          }
        }
        item.label = `${item.label}（${item.num}）`
      })
      for (let i = i_areaList.length - 1; i >= 0; i--) {
        if (uselessList.includes(i_areaList[i])) {
          i_areaList.splice(i, 1)
        }
      }
    }
    res.data = c_areaList
    return res
  })
}

// 获取站点列表
export const getStationListApi = (params: {
  pageNum: number
  pageSize: number
  stationNoList?: string[]
  radarAreaList?: string[]
  proState?: IProState
  radarModelIdList?: string[]
  radarTypeList?: string[]
  nameOrNo?: string
}) => {
  params.radarAreaList = params.radarAreaList?.filter(item => item !== '全国')
  return request<{
    total: number
    records: IStation[]
  }>({
    url: '/stationInfo/selectPage',
    method: 'post',
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      stationNo: params.stationNoList?.join() || undefined,
      province: params.radarAreaList?.join() || undefined,
      realTimeFlag: params.proState === -1 ? undefined : params.proState,
      radarTypeID: params.radarModelIdList?.join() || undefined,
      radar_classify: params.radarTypeList?.join() || undefined,
      fuzzy: params.nameOrNo
    }
  }).then(res => {
    res.data.records = res.data.records?.map(
      (item: any) =>
        (({
          stationNo: item.station_no,
          stationName: item.station_name,
          area: item.area,
          province: item.province,
          longitude: String(item.lon),
          latitude: String(item.lat),
          altitude: String(item.alti),
          radarModelId: String(item.radar_type_id),
          radarType: item.radar_classify,
          stationId: String(item.id),
          proState: item.real_time_flag
        } as any) ?? [])
    )
    return res
  })
}

// 验证站号、站名是否重复
export const sameVerifyApi = (params: { stationNo?: string; stationName?: string }) => {
  return request<boolean>({
    url: '/stationInfo/selectPage',
    method: 'post',
    params: {
      pageNum: 1,
      pageSize: 99999,
      stationNo: params.stationNo,
      stationName: params.stationName
    }
  }).then(res => {
    res.data = Boolean((res.data as any).records?.length)
    return res
  })
}

// 新增/编辑站点
export const addOrEditStationApi = (data: IStation) => {
  return request<string>({
    url: data.stationId ? '/stationInfo/update' : '/stationInfo/add',
    method: 'post',
    data: {
      station_no: data.stationNo,
      station_name: data.stationName,
      area: data.area,
      province: data.province,
      lon: +data.longitude,
      lat: +data.latitude,
      alti: +data.altitude,
      radar_type: data.radarModelId,
      radar_classify: data.radarType,
      id: data.stationId,
      real_time_flag: data.proState
    }
  }).then(res => {
    // 数据处理
    return res
  })
}

// 批量改变站点生产情况
export const changeProStateApi = (params: { stationIdList: string[]; proState: IProState }) => {
  return request({
    url: '/stationInfo/realTimeFlag',
    method: 'post',
    params: {
      id: params.stationIdList.join(),
      realTimeFlag: params.proState
    }
  }).then(res => {
    // 数据处理
    return res
  })
}

// 删除站点
export const deleteStationApi = (params: { stationId: string }) => {
  return request<string>({
    url: '/stationInfo/delete',
    method: 'get',
    params: {
      id: params.stationId
    }
  }).then(res => {
    // 数据处理
    return res
  })
}
