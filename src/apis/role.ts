/* eslint-disable arrow-body-style */
import { request } from '@/common/axios'
import { getAuthorityTree } from '@/router'
import { radarProductOptions } from '@/views/history/Content1/const'
import type { IAuthorityTree, ISystem } from '@/views/role/Authority/const'
import type { IRole } from '@/views/role/Operate/const'
import { cloneDeep } from 'lodash'

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

// 获取角色列表
export const getRolesListApi = (params: { pageNum: number; pageSize: number }) => {
  return request<{
    total: number
    records: IRole[]
  }>({
    url: '/role/query',
    method: 'get',
    params: {
      currentPage: params.pageNum,
      pageSize: params.pageSize
    }
  }).then(res => {
    res.data.records = res.data.records?.map(
      (item: any) =>
        (({
          roleId: String(item.roleId),
          roleName: item.roleName,
          creator: item.creator,
          createTime: item.creationTime,
          authoritiesList: item.permissions
        } as any) ?? [])
    )
    res.data.records.forEach(item => {
      let result: any = item.authoritiesList
      if (result) {
        try {
          result = JSON.parse(result as any as string)
        } catch (error) {
          result = {}
        }
      } else {
        result = {}
      }
      item.authoritiesList = Object.keys(result)
        .map(item2 => result[item2])
        .reduce((acc, cur) => [...acc, ...cur], [] as string[])
    })
    return res
  })
}

// 验证角色名称是否重复
export const sameVerifyApi = (params: { roleName: string }) => {
  return request({
    url: '/role/checkRoleExists',
    method: 'get',
    params
  }).then(res => {
    // 数据处理
    return res
  })
}

// 新增角色
export const addRoleApi = (data: IRole) => {
  return request<string>({
    url: '/role/add',
    method: 'post',
    data
  }).then(res => {
    // 数据处理
    return res
  })
}

// 获取全部权限
export async function getAllAuthoritiesApi() {
  const result: IAuthorityTree = [
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
            {
              label: '跳转'
            },
            {
              label: '产品显示',
              children: cloneDeep(radarProductOptions)
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
  const proList = (['dtscreenSta', 'lsp-station', 'Ndtshortwarn', 'radar3dLSP'] as ISystem[]).map(
    system => getSingleAuthoritiesApi({ system })
  )
  try {
    const resList = await Promise.all(proList)
    resList.forEach(({ data: res }) => {
      if (res.authorityTree.length) {
        if (res.system !== 'lsp-station') {
          const target = result.find(item => item.value === res.system)
          target && (target.children = res.authorityTree)
        } else {
          const target = result[0]?.children?.find(item => item.value === 'lsp-station')
            ?.children?.[0]
          target && (target.children = res.authorityTree)
        }
      }
    })
    return { data: result }
  } catch (error) {
    return Promise.reject(error)
  }
  function getSingleAuthoritiesApi(params: { system: ISystem }) {
    return request<{ system: ISystem; authorityTree: IAuthorityTree }>({
      url: '/permissions/query',
      method: 'get',
      params: {
        menu: params.system
      }
    }).then(res => {
      try {
        res.data = {
          system: (res as any).data.menu,
          authorityTree: JSON.parse((res as any).data.permissions)
        }
      } catch (error) {
        res.data = {
          system: (res as any).data.menu,
          authorityTree: []
        }
      }
      return res
    })
  }
}

// 编辑角色权限
export const editRoleApi = async (data: { roleId: string; authoritiesList: string[] }) => {
  try {
    const { data: allAuthorities } = await getAllAuthoritiesApi()
    let result =
      allAuthorities[0].children
        ?.map(item => item.value)
        .reduce((acc, cur) => {
          cur && (acc[cur] = [])
          return acc
        }, {} as Record<string, string[]>) ?? {}
    data.authoritiesList.forEach(authority => {
      allAuthorities[0].children
        ?.map(item => item.value)
        .some(key => {
          if (
            hasAuthority(
              allAuthorities[0].children?.find(item => item.value === key)?.children ?? [],
              authority
            )
          ) {
            key && result[key].push(authority)
            return true
          }
        })
    })
    try {
      result = JSON.stringify(result) as any
    } catch (error) {
      result = '' as any
    }
    return request({
      url: '/role/updatePermissions',
      method: 'post',
      data: {
        roleId: data.roleId,
        permissions: result
      }
    }).then(res => {
      // 数据处理
      return res
    })
  } catch (error: any) {
    return Promise.reject(error)
  }
  function hasAuthority(i_authorityTree: IAuthorityTree, i_authority: string) {
    if (i_authorityTree.length) {
      for (let i = 0; i < i_authorityTree.length; i++) {
        if (i_authorityTree[i].value === i_authority) {
          return true
        }
        if (hasAuthority(i_authorityTree[i].children ?? [], i_authority)) {
          return true
        }
      }
    }
    return false
  }
}

// 添加全部权限
export const addAllAuthoritiesApi = async (data: { roleId: string }) => {
  try {
    const { data: res } = await getAllAuthoritiesApi()
    const authoritiesList = flatten(res)
    await editRoleApi({
      roleId: data.roleId,
      authoritiesList
    })
  } catch (error: any) {
    return Promise.reject(error)
  }
  function flatten(authorityTree: IAuthorityTree): string[] {
    const result: string[] = []
    authorityTree.forEach(item => {
      if (item.value && !item.children?.length) {
        result.push(item.value)
      }
      if (item.children?.length) {
        result.push(...flatten(item.children))
      }
    })
    return result
  }
}

// 删除角色
export const deleteRoleApi = (params: { roleId: string }) => {
  return request<string>({
    url: '/role/delete',
    method: 'get',
    params: {
      roleId: params.roleId
    }
  }).then(res => {
    // 数据处理
    return res
  })
}
