export type IAuthorityTree = {
  label: string
  value?: string
  disabled?: boolean
  children?: IAuthorityTree
}[]

export type ISystem = 'dtscreenSta' | 'lsp-station' | 'Ndtshortwarn' | 'radar3dLSP' | 'lsp-setting'
