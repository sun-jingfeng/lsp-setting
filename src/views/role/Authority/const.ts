import { getAuthorityTree } from '@/router'
import { radarProductOptions } from '@/views/history/Content1/const'

export type IAuthorityTree = { label: string; value?: string; children?: IAuthorityTree }[]

export type ISystem = 'dtscreenSta' | 'lsp-station' | 'Ndtshortwarn' | 'radar3dLSP' | 'lsp-setting'

export const authorityTree: IAuthorityTree = [
  {
    label: '全部',
    value: '全部',
    children: [
      // {
      //   label: '首页',
      //   value: 'dtscreenSta' as ISystem
      // },
      {
        label: '单站',
        value: 'lsp-station' as ISystem,
        children: [
          // {
          //   label: '跳转'
          // },
          {
            label: '产品显示',
            children: radarProductOptions
          }
        ]
      },
      // {
      //   label: '单省',
      //   value: 'Ndtshortwarn' as ISystem
      // },
      // {
      //   label: '三维',
      //   value: 'radar3dLSP' as ISystem
      // },
      {
        label: '后台管理',
        value: 'lsp-setting' as ISystem,
        children: getAuthorityTree()
      }
    ]
  }
]
