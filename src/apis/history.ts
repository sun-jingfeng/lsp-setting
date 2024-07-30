/* eslint-disable arrow-body-style */
import { request } from '@/common/axios'
import type { IAreaList, IStation } from '@/views/station/Operate/const'
import { areaList } from '@/views/station/Operate/const'
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
