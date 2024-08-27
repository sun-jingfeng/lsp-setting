/* eslint-disable arrow-body-style */
import { request } from '@/common/axios'
import { dateFormat1, dateFormat2 } from '@/common/date'
import type { IBusiness, IMonitor } from '@/views/monitor/const'
import { dayjs } from 'element-plus'

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

// 获取数据列表
export const getDataListApi = (params: {
  business: IBusiness
  stationNoList: string[]
  startTime: string
  endTime: string
  pageNum: number
  pageSize: number
}) => {
  return request<{
    total: number
    records: IMonitor[]
    business: IBusiness
  }>({
    url: params.business === '1' ? '/stationHistory/selectPage' : '/stationInfo/selectRealPage',
    method: 'post',
    params: {
      stationNo: params.stationNoList.join(),
      beginDate: (params.startTime && dayjs(params.startTime).format(dateFormat2)) || '',
      endDate: (params.endTime && dayjs(params.endTime).format(dateFormat2)) || '',
      pageNum: params.pageNum,
      pageSize: params.pageSize
    }
  }).then(res => {
    res.data.records = res.data.records?.map(
      (item: any, index) =>
        (({
          monitorId: String(item.id ?? index),
          disasterTag: item.disaster_tag,
          stationName: item.station_name,
          stationNo: item.station_no,
          province: item.province,
          area: item.area,
          caseStartTime:
            (item.back_begin_time &&
              dayjs(item.back_begin_time).add(8, 'hour').format(dateFormat1)) ||
            '',
          caseEndTime:
            (item.back_end_time && dayjs(item.back_end_time).add(8, 'hour').format(dateFormat1)) ||
            '',
          productionStartTime: item.begin_date,
          productionEndTime: item.end_date,
          orderSubmitTime: item.commit_date,
          progress: item.progress,
          orderSubmitTime2: item.commit_time,
          latestTime: item.date
        } as any) ?? [])
    )
    res.data.business = params.business
    return res
  })
}

// 删除
export const deleteDataApi = (params: { monitorId: string }) => {
  return request<string>({
    url: '/stationHistory/delete',
    method: 'get',
    params: {
      id: params.monitorId
    }
  }).then(res => {
    // 数据处理
    return res
  })
}
