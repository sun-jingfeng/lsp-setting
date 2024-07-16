export type ITipState = '0' | '1' | '2' | '3'

export const tipStateOptions: {
  tipState: ITipState
  msg?: string
  className?: 'success' | 'error'
}[] = [
  {
    tipState: '0'
  },
  {
    tipState: '1',
    msg: '请输入雷达型号',
    className: 'error'
  },
  {
    tipState: '2',
    msg: '新增雷达型号成功',
    className: 'success'
  },
  {
    tipState: '3',
    msg: '雷达型号已存在',
    className: 'error'
  }
]

export const repetitionKey = /禁止重复配置/
