export type IBusiness = '1' | '2'

export type IMonitor = Partial<
  {
    monitorId: string
    disasterTag: string
    stationName: string
    stationNo: string
    province: string
    area: string
    caseStartTime: string
    caseEndTime: string
    productionStartTime: string
    productionEndTime: string
    orderSubmitTime: string
    progress: number
  } & {
    orderSubmitTime2: string
    latestTime: string
  }
>

export const businessOptions: { label: string; value: IBusiness }[] = [
  {
    label: '历史回算',
    value: '1'
  },
  {
    label: '实时生产',
    value: '2'
  }
]

export const initFilterData = (): {
  stationNoList: string[]
  business: IBusiness
  startTime: string
  endTime: string
} => ({
  stationNoList: [],
  business: '1',
  startTime: '',
  endTime: ''
})
