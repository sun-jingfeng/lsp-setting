export type IOperateType = 'add' | 'edit'

export type IUser = {
  userId?: string
  username: string
  password: string
  roleId: string
  roleName?: string
  createTime?: string
}
