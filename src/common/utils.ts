import { tokenKey } from '@/views/login/const'
import { ElMessage } from 'element-plus'
import copy from 'copy-to-clipboard'
import type { Directive } from 'vue'

export function setStorage(key: string, value: any, type: 'local' | 'session' = 'local') {
  const method = type === 'local' ? window.localStorage : window.sessionStorage
  try {
    value = JSON.stringify(value)
  } catch (error) {}
  method.setItem(key, value)
}

export function getStorage<T = any>(key: string, type: 'local' | 'session' = 'local'): T {
  const method = type === 'local' ? window.localStorage : window.sessionStorage
  let value: any = method.getItem(key)
  try {
    if (value) {
      value = JSON.parse(value)
    }
  } catch (error) {}
  return value
}

export function removeStorage(key: string, type: 'local' | 'session' = 'local') {
  const method = type === 'local' ? window.localStorage : window.sessionStorage
  method.removeItem(key)
}

export function clearStorage(type: 'local' | 'session' = 'local') {
  const method = type === 'local' ? window.localStorage : window.sessionStorage
  method.clear()
}

export function getToken() {
  return getStorage(tokenKey)
}

export function setToken(token: string) {
  setStorage(tokenKey, token)
}

export function removeToken() {
  removeStorage(tokenKey)
}

export const getImgSrc = (imgPath: string, imgName: string, imgType = 'png') =>
  new URL(`../${imgPath}/${imgName}.${imgType}`, import.meta.url).href

export const formatNum = (value: string, config?: { positive?: boolean; integer?: boolean }) => {
  let regular: RegExp | undefined
  if (config?.integer) {
    if (config.positive) {
      regular = /[^0-9]/g
    } else {
      regular = /[^0-9-]/g
    }
  } else {
    if (config?.positive) {
      regular = /[^0-9.]/g
    } else {
      regular = /[^0-9-.]/g
    }
  }
  value = value.replace(regular, '')
  if (!config?.integer) {
    value = value.replace('.', '#')
    value = value.replaceAll('.', '')
    value = value.replace('#', '.')
  }
  if (!config?.positive) {
    value = value.replace(/^-/, '#')
    value = value.replaceAll('-', '')
    value = value.replace('#', '-')
  }
  return value
}

export const onCopy = (text: string) => {
  if (copy(text)) {
    ElMessage.success('复制成功！')
  } else {
    ElMessage.warning('复制失败！')
  }
}

export const vDrag: Directive<HTMLElement, (HTMLElement | undefined)[] | undefined> = {
  mounted: (container, { value: noDragElList }) => {
    container.style.position = 'absolute'
    container.style.cursor = 'grab'
    container.onmousedown = event => {
      const disX = event.clientX - container.offsetLeft
      const disY = event.clientY - container.offsetTop
      document.onmousemove = event2 => {
        event2.preventDefault()
        const left = event2.clientX - disX
        const top = event2.clientY - disY
        container.style.margin = '0'
        container.style.left = left + 'px'
        container.style.top = top + 'px'
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
    noDrag(noDragElList)
  },
  updated: (container, { value: noDragElList }) => {
    noDrag(noDragElList)
  }
}
const noDrag = (elementList?: (HTMLElement | undefined)[]) => {
  elementList &&
    elementList.forEach(el => {
      if (el) {
        el.style.cursor = 'initial'
        el.onmousedown = event => {
          event.stopPropagation()
        }
      }
    })
}
