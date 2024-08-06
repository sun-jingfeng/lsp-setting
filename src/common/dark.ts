import { useSystemStore } from '@/stores/system'
import { getStorage, setStorage } from './utils'

const darkKey = 'appearance-dark'

const darkClassName = 'dark'

window.addEventListener('DOMContentLoaded', () => {
  initialDark()
  setDark()
})

window.addEventListener('storage', event => {
  if (event.key === darkKey || event.key === null) {
    if (typeof getStorage(darkKey) !== 'boolean') {
      initialDark()
    }
    setDark()
  }
})

export const toggleDark = () => {
  const dark = getStorage(darkKey)
  if (typeof dark === 'boolean') {
    setStorage(darkKey, !dark)
    setDark()
  }
}

function initialDark() {
  if (typeof getStorage(darkKey) !== 'boolean') {
    setStorage(darkKey, window.matchMedia('(prefers-color-scheme: dark)').matches)
  }
}

function setDark() {
  const dark = getStorage(darkKey)
  if (typeof dark === 'boolean') {
    const systemStore = useSystemStore()
    if (dark) {
      document.documentElement.classList.add(darkClassName)
      systemStore.dark = true
    } else {
      document.documentElement.classList.remove(darkClassName)
      systemStore.dark = false
    }
  }
}
