/* eslint-disable arrow-body-style */
import { request } from '@/common/axios'
import { dateFormat4 } from '@/common/date'
import type { IAreaList, IStation } from '@/views/station/Operate/const'
import { areaList } from '@/views/station/Operate/const'
import { dayjs } from 'element-plus'
import { cloneDeep } from 'lodash'

// export const mockApi = (params: { id: string }) => {
//   return request({
//     url: '/lsp-tianjin/radarType/delete',
//     method: 'get',
//     params
//   }).then(res => {
//     // 数据处理
//     return res
//   })
// }

// 获取省份列表
export const getProvinceListApi = () => {
  return request<IAreaList>({
    url: '/lsp-tianjin/stationInfo/selectPage',
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
    const c_areaList = cloneDeep(areaList)
    formatAreaList(c_areaList)
    function formatAreaList(i_areaList: IAreaList) {
      i_areaList.forEach(item => {
        if (item.children) {
          formatAreaList(item.children)
          item.num = item.children.reduce((acc, cur) => acc + (cur.num ?? 0), 0)
        } else {
          item.num = records.filter(item2 => item2.province === item.value).length
        }
        item.label = `${item.label}(${item.num})`
      })
    }
    res.data = c_areaList.reduce((acc, cur) => [...acc, ...(cur.children ?? [])], [] as IAreaList)
    return res
  })
}

// 获取灾害标签列表
export const getDisasterTaglListApi = () => {
  return request<{ dataId: string; dataContent: string; top: 0 | 1 }[]>({
    url: '/lsp-tianjin/disasterTag/select',
    method: 'post'
  }).then(res => {
    res.data = res.data.map((item: any) => ({
      dataId: String(item.id),
      dataContent: item.disasterTag,
      top: item.top
    }))
    return res
  })
}

// 新增灾害标签
export const addDisasterTagApi = (params: { dataContent: string }) => {
  return request<string>({
    url: '/lsp-tianjin/disasterTag/add',
    method: 'post',
    params: {
      disaster_tag: params.dataContent
    }
  }).then(res => {
    // 数据处理
    return res
  })
}

// 编辑灾害标签
export const editDisasterTaglApi = (data: { dataId: string; dataContent: string; top: 0 | 1 }) => {
  return request<string>({
    url: '/lsp-tianjin/disasterTag/update',
    method: 'post',
    data: {
      id: data.dataId,
      disasterTag: data.dataContent,
      top: data.top
    }
  }).then(res => {
    // 数据处理
    return res
  })
}

// 获取灾害标签的回算数量
export const getNumByDisasterTaglApi = (params: { dataId: string }) => {
  return request<number>({
    url: '/lsp-tianjin/stationHistory/selectCount',
    method: 'post',
    params: {
      disaster_tag_id: params.dataId
    }
  }).then(res => {
    // 数据处理
    return res
  })
}

// 删除灾害标签
export const deleteDisasterTaglApi = (params: { dataId: string }) => {
  return request({
    url: '/lsp-tianjin/disasterTag/delete',
    method: 'get',
    params: {
      id: params.dataId
    }
  }).then(res => {
    // 数据处理
    return res
  })
}

// 新增历史回算
export const addHistoryApi = (data: {
  stations: Set<string>
  radarProducts: string[]
  dateTimeRange: [string, string]
  disasterTags: string[]
}) => {
  return request({
    url: '/lsp-tianjin/stationHistory/add',
    method: 'post',
    data: {
      stationNos: [...data.stations].join(),
      product: data.radarProducts.join(),
      back_begin_time: dayjs(data.dateTimeRange[0])
        .subtract(8, 'hour')
        .set('second', 0)
        .format(dateFormat4),
      back_end_time: dayjs(data.dateTimeRange[1])
        .subtract(8, 'hour')
        .set('second', 0)
        .format(dateFormat4),
      disaster_tag_ids: data.disasterTags.join()
    }
  }).then(res => {
    // 数据处理
    return res
  })
}
