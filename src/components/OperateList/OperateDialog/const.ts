export type ITipState = '0' | '1' | '2' | '3'

export type IPageType = 'radar' | 'disaster'

export const getPageName = (pageType: IPageType) => (pageType === 'radar' ? '雷达型号' : '灾害标签')

export const getTipStateOptions = (
  pageType: IPageType
): {
  tipState: ITipState
  msg?: string
  className?: 'success' | 'error'
}[] => [
  {
    tipState: '0'
  },
  {
    tipState: '1',
    msg: `请输入${getPageName(pageType)}`,
    className: 'error'
  },
  {
    tipState: '2',
    msg: `新增${getPageName(pageType)}成功`,
    className: 'success'
  },
  {
    tipState: '3',
    msg: `${getPageName(pageType)}已存在`,
    className: 'error'
  }
]

export const repetitionKey = /禁止重复配置/

export const imgPath = 'components/OperateList/OperateDialog/images'
