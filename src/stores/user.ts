type IState = {}
type IGetters = {}
type IActions = {}

export const useUserStore = defineStore<string, IState, IGetters, IActions>('user', {
  state: () => ({}),
  getters: {},
  actions: {}
})
