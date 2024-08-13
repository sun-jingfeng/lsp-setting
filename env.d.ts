/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_PATH: string
  readonly VITE_BASE_URL: string
  readonly VITE_HOME_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'element-plus/dist/locale/zh-cn.mjs'
