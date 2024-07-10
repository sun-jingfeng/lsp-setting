type INavigation = {
  label: string
  routeName?: string
  children?: INavigation
}[]

export const navigation: INavigation = [
  {
    label: '台站管理',
    routeName: 'station'
  },
  {
    label: '历史回算',
    routeName: 'history'
  },
  {
    label: '权限管理',
    children: [
      {
        label: '权限管理',
        routeName: 'authority'
      },
      {
        label: '权限管理',
        routeName: 'authority'
      },
      {
        label: '权限管理',
        routeName: 'authority'
      }
    ]
  },
  {
    label: '监控日志',
    routeName: 'page'
  },
  {
    label: '其他栏目',
    routeName: 'page'
  }
]

export const imgPath = 'components/Layout/Navigation/images'
