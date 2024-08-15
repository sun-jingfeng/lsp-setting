/* eslint-disable arrow-body-style */
import { request } from '@/common/axios'
import type { IAuthorityTree } from '@/views/role/Authority/const'
import { authorityTree } from '@/views/role/Authority/const'
import type { IRole } from '@/views/role/Operate/const'

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

// 编辑角色权限
export const editRoleApi = (data: { roleId: string; authoritiesList: string[] }) => {
  let result =
    authorityTree[0].children
      ?.map(item => item.value)
      .reduce((acc, cur) => {
        cur && (acc[cur] = [])
        return acc
      }, {} as Record<string, string[]>) ?? {}
  data.authoritiesList.forEach(authority => {
    authorityTree[0].children
      ?.map(item => item.value)
      .some(key => {
        if (
          hasAuthority(
            authorityTree[0].children?.find(item => item.value === key)?.children ?? [],
            authority
          )
        ) {
          key && result[key].push(authority)
          return true
        }
      })
  })
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
