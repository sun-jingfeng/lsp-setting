import { radarProductOptions } from '@/views/history/Content1/const'

type IAuthorityTree = { label: string; value: string; children?: IAuthorityTree }[]

export const authorityTree: IAuthorityTree = [
  {
    label: '全部',
    value: '全部',
    children: [
      {
        label: '首页',
        value: '首页'
      },
      {
        label: '单站',
        value: '单站',
        children: radarProductOptions as IAuthorityTree
      },
      {
        label: '单省',
        value: '单省'
      },
      {
        label: '三维',
        value: '三维'
      },
      {
        label: '后台管理',
        value: '后台管理'
      }
    ]
  }
]
