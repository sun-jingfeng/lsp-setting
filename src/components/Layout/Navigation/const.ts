import router from '@/router'

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
        label: '角色管理',
        routeName: 'role'
      },
      {
        label: '用户管理',
        routeName: 'user'
      }
    ]
  }
  // {
  //   label: '监控日志',
  //   routeName: 'page'
  // },
  // {
  //   label: '其他栏目',
  //   routeName: 'page'
  // }
]

export const getIndex = (navi = navigation, index = ''): string | undefined => {
  for (let i = 0; i < navi.length; i++) {
    const newIndex = index + `${index.length ? '-' : ''}${i}`
    if (navi[i].routeName === router.currentRoute.value.name) {
      return newIndex
    }
    if (navi[i].children?.length) {
      return getIndex(navi[i].children, newIndex)
    }
  }
}

export const getLabel = (navi = navigation): string => {
  for (let i = 0; i < navi.length; i++) {
    if (navi[i].routeName === router.currentRoute.value.name) {
      return navi[i].label
    }
    if (navi[i].children?.length) {
      return getLabel(navi[i].children)
    }
  }
  return ''
}

export const imgPath = 'components/Layout/Navigation/images'
