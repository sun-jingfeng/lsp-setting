export type IAuthorityTree = {
  label: string
  value?: string
  disabled?: boolean
  children?: IAuthorityTree
}[]

export type ISystem = 'dtscreenSta' | 'lsp-station' | 'Ndtshortwarn' | 'radar3dLSP' | 'lsp-setting'

export type IAllAuthorities = { [key in ISystem]?: string[] }

export const getEncodeValue = (value: string, system: ISystem) => value + getUniqueKey(system)

export const getDecodeValue = (value: string, system: ISystem) => {
  const reg = new RegExp(`^(.*)${getUniqueKey(system)}$`)
  if (reg.test(value)) {
    return value.match(reg)?.[1] ?? ''
  } else {
    return value
  }
}

function getUniqueKey(system: ISystem) {
  return `_${system}`
}
