/* eslint-disable arrow-body-style */
import { request } from '@/common/axios'
import type { IOperateType, IUser } from '@/views/manage/Operate/const'

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

// 获取用户列表
export const getUsersListApi = (params: {
  pageNum: number
  pageSize: number
  username: string
}) => {
  return request<{
    total: number
    records: IUser[]
  }>({
    url: '/user/query',
    method: 'get',
    params: {
      currentPage: params.pageNum,
      pageSize: params.pageSize,
      userName: params.username
    }
  }).then(res => {
    res.data.records = res.data.records?.map(
      (item: any) =>
        (({
          userId: String(item.id),
          username: item.username,
          password: item.clearTextPassword,
          roleId: String(item.roleId),
          roleName: item.roleName,
          createTime: item.creationTime
        } as any) ?? [])
    )
    return res
  })
}

// 验证用户名称是否重复
export const sameVerifyApi = (params: { username: string }) => {
  return request({
    url: '/user/checkUserExists',
    method: 'get',
    params: {
      userName: params.username
    }
  }).then(res => {
    // 数据处理
    return res
  })
}

// 新增、编辑用户
export const addOrEditUserApi = (operateType: IOperateType, data: IUser) => {
  return request<string>({
    url: operateType === 'add' ? '/user/add' : '/user/update',
    method: 'post',
    data: {
      userId: data.userId,
      [operateType === 'add' ? 'username' : 'userName']: data.username,
      clearTextPassword: data.password,
      roleId: data.roleId
    }
  }).then(res => {
    // 数据处理
    return res
  })
}

// 删除用户
export const deleteUserApi = (params: { userId: string }) => {
  return request<string>({
    url: '/user/delete',
    method: 'get',
    params: {
      userId: params.userId
    }
  }).then(res => {
    // 数据处理
    return res
  })
}
