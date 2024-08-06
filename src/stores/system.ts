type IState = {
  dark: boolean
}
type IGetters = {}
type IActions = {}

export const useSystemStore = defineStore<string, IState, IGetters, IActions>('system', {
  state: () => ({
    dark: false
  }),
  getters: {},
  actions: {}
})
