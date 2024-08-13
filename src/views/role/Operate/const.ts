export type IOperateType = 'add' | 'edit'

export type IRole = {
  roleId?: string
  roleName: string
  creator: string
  createTime?: string
  authority?: string[]
}
