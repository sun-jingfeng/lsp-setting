export type IProState = 1 | 0

export const stateOptions: { label: string; value: IProState }[] = [
  {
    label: '实时',
    value: 1
  },
  {
    label: '未实时',
    value: 0
  }
]

export const initFilterData = (): {
  radarAreaList?: string[]
  proState?: IProState
  radarIdList?: string[]
} => ({
  radarAreaList: [],
  radarIdList: []
})
