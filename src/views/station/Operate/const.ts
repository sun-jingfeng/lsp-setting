import type { IProState } from '../const'

export type IOperateType = 'add' | 'edit'

export type IStation = {
  stationNo: string
  stationName: string
  area: string
  province: string
  longitude: string
  latitude: string
  altitude: string
  radarModelId: string
  radarType: string
  stationId?: string
  proState?: IProState
}

export type IAreaList = {
  label: string
  value: string
  num?: number
  children?: IAreaList
}[]

export const areaList: IAreaList = [
  {
    label: '华北地区',
    value: '华北地区',
    children: [
      {
        label: '北京',
        value: '北京'
      },
      {
        label: '天津',
        value: '天津'
      },
      {
        label: '河北',
        value: '河北'
      },
      {
        label: '山西',
        value: '山西'
      },
      {
        label: '内蒙古',
        value: '内蒙古'
      }
    ]
  },
  {
    label: '东北地区',
    value: '东北地区',
    children: [
      {
        label: '黑龙江',
        value: '黑龙江'
      },
      {
        label: '吉林',
        value: '吉林'
      },
      {
        label: '辽宁',
        value: '辽宁'
      }
    ]
  },
  {
    label: '华东地区',
    value: '华东地区',
    children: [
      {
        label: '上海',
        value: '上海'
      },
      {
        label: '江苏',
        value: '江苏'
      },
      {
        label: '浙江',
        value: '浙江'
      },
      {
        label: '安徽',
        value: '安徽'
      },
      {
        label: '福建',
        value: '福建'
      },
      {
        label: '山东',
        value: '山东'
      }
    ]
  },
  {
    label: '华中地区',
    value: '华中地区',
    children: [
      {
        label: '河南',
        value: '河南'
      },
      {
        label: '湖北',
        value: '湖北'
      },
      {
        label: '湖南',
        value: '湖南'
      }
    ]
  },
  {
    label: '华南地区',
    value: '华南地区',
    children: [
      {
        label: '广东',
        value: '广东'
      },
      {
        label: '广西',
        value: '广西'
      },
      {
        label: '海南',
        value: '海南'
      },
      {
        label: '香港',
        value: '香港'
      },
      {
        label: '澳门',
        value: '澳门'
      }
    ]
  },
  {
    label: '西南地区',
    value: '西南地区',
    children: [
      {
        label: '重庆',
        value: '重庆'
      },
      {
        label: '四川',
        value: '四川'
      },
      {
        label: '贵州',
        value: '贵州'
      },
      {
        label: '云南',
        value: '云南'
      },
      {
        label: '西藏',
        value: '西藏'
      }
    ]
  },
  {
    label: '西北地区',
    value: '西北地区',
    children: [
      {
        label: '陕西',
        value: '陕西'
      },
      {
        label: '甘肃',
        value: '甘肃'
      },
      {
        label: '青海',
        value: '青海'
      },
      {
        label: '宁夏',
        value: '宁夏'
      },
      {
        label: '新疆',
        value: '新疆'
      }
    ]
  }
]

export const repetitionKey = /禁止重复配置/
