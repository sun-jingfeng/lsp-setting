/* eslint-disable arrow-body-style */
import { request } from '@/common/axios'
import type { IRole } from '@/views/role/Operate/const'

// export const mockApi = () => {
//   return request<string>({
//     url: '/lsp-tianjin/login',
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
    url: '/lsp-tianjin/role/query',
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
          authority: item.permissions
        } as any) ?? [])
    )
    res.data.records.forEach(item => {
      if (item.authority) {
        try {
          item.authority = JSON.parse(item.authority as any as string)
        } catch (error) {
          item.authority = []
        }
      } else {
        item.authority = []
      }
    })
    return res
  })
}

// 验证角色名称是否重复
export const sameVerifyApi = (params: { roleName: string }) => {
  return request({
    url: '/lsp-tianjin/role/checkRoleExists',
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
    url: '/lsp-tianjin/role/add',
    method: 'post',
    data
  }).then(res => {
    // 数据处理
    return res
  })
}

// 编辑角色权限
export const editRoleApi = (data: { roleId: string; authority: string[] }) => {
  try {
    data.authority = JSON.stringify(data.authority) as any
  } catch (error) {
    data.authority = '' as any
  }
  return request({
    url: '/lsp-tianjin/role/updatePermissions',
    method: 'post',
    data: {
      roleId: data.roleId,
      permissions: data.authority
    }
  }).then(res => {
    // 数据处理
    return res
  })
}

// 删除角色
export const deleteRoleApi = (params: { roleId: string }) => {
  return request<string>({
    url: '/lsp-tianjin/role/delete',
    method: 'get',
    params: {
      roleId: params.roleId
    }
  }).then(res => {
    // 数据处理
    return res
  })
}
