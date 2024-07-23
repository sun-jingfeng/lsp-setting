export type IProState = 1 | 0

export type IRadarType =
  | 'S波段单偏振'
  | 'S波段双偏振'
  | 'S波段相控阵'
  | 'C波段单偏振'
  | 'C波段双偏振'
  | 'C波段相控阵'
  | 'X波段非相控阵'
  | 'X波段相控阵'

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

export const radatTypeOptions: { label: string; value: IRadarType }[] = [
  {
    label: 'S波段单偏振',
    value: 'S波段单偏振'
  },
  {
    label: 'S波段双偏振',
    value: 'S波段双偏振'
  },
  {
    label: 'S波段相控阵',
    value: 'S波段相控阵'
  },
  {
    label: 'C波段单偏振',
    value: 'C波段单偏振'
  },
  {
    label: 'C波段双偏振',
    value: 'C波段双偏振'
  },
  {
    label: 'C波段相控阵',
    value: 'C波段相控阵'
  },
  {
    label: 'X波段非相控阵',
    value: 'X波段非相控阵'
  },
  {
    label: 'X波段相控阵',
    value: 'X波段相控阵'
  }
]

export const initFilterData = (): {
  radarAreaList: string[]
  proState?: IProState
  radarModelIdList: string[]
  radarTypeList: string[]
} => ({
  radarAreaList: [],
  radarModelIdList: [],
  radarTypeList: []
})
