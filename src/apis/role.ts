/* eslint-disable arrow-body-style */
import { request } from '@/common/axios'
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
      if (item.authoritiesList) {
        try {
          item.authoritiesList = JSON.parse(item.authoritiesList as any as string)
        } catch (error) {
          item.authoritiesList = []
        }
      } else {
        item.authoritiesList = []
      }
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
  try {
    data.authoritiesList = JSON.stringify(data.authoritiesList) as any
  } catch (error) {
    data.authoritiesList = '' as any
  }
  return request({
    url: '/role/updatePermissions',
    method: 'post',
    data: {
      roleId: data.roleId,
      permissions: data.authoritiesList
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
