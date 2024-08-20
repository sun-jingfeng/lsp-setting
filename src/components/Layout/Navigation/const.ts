import router from '@/router'
import { useUserStore } from '@/stores/user'

type INavigation = {
  label: string
  routeName?: string
  children?: INavigation
}[]

export const getRoutesList = (): INavigation => {
  const result =
    useUserStore()
      .getAuthorityRoutesList()
      .find(route => route.path === '/')?.children ?? []

  const recursion = (navi = result): INavigation =>
    navi.map(route => ({
      label: route.meta?.pageName ?? '',
      routeName: (route.name ?? '') as string,
      ...(route.children?.length ? { children: recursion(route.children) } : {})
    })) ?? []

  return recursion(result)
}

export const getIndex = (navi = getRoutesList(), index = ''): string | undefined => {
  for (let i = 0; i < navi.length; i++) {
    const newIndex = index + `${index.length ? '-' : ''}${i}`
    if (navi[i].routeName === router.currentRoute.value.name) {
      return newIndex
    }
    if (navi[i].children?.length) {
      const result = getIndex(navi[i].children, newIndex)
      if (result) {
        return result
      }
    }
  }
}

export const getLabel = (navi = getRoutesList()): string => {
  for (let i = 0; i < navi.length; i++) {
    if (navi[i].routeName === router.currentRoute.value.name) {
      return navi[i].label
    }
    if (navi[i].children?.length) {
      const result = getLabel(navi[i].children)
      if (result) {
        return result
      }
    }
  }
  return ''
}

export const imgPath = 'components/Layout/Navigation/images'
