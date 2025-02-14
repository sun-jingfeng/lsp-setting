export const CONFIG = {
  appName: '系统配置管理',
  authorityRoute: true,
  mode: import.meta.env.MODE,
  basePath: import.meta.env.VITE_BASE_PATH,
  baseUrl: import.meta.env.VITE_BASE_URL,
  homeUrl: import.meta.env.VITE_HOME_URL
}

export const showLogo = import.meta.env.MODE !== 'production'
