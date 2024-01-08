import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import UserStoreModule from './modules/UserStoreModule'
import MenuStoreModule from './modules/MenuStoreModule'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    UserStoreModule,
    MenuStoreModule
  },
  getters: {
    
  },
  plugins: [ createPersistedState() ],
})
