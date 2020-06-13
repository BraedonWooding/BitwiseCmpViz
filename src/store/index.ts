import Vue from 'vue'
import Vuex from 'vuex'
import {defineActions, defineGetters, defineMutations} from 'direct-vuex';

Vue.use(Vuex)

export interface State {
  theme: string;
  intSize: number;
  forceSize: boolean;
  emphasiseBytes: boolean;
  forceUnsigned: boolean;
}

export default new Vuex.Store({
  state: {
    theme: 'dark',
    intSize: 16,
    forceSize: false,
    emphasiseBytes: true,
    forceUnsigned: false,
  },
  mutations: {
    updateTheme(state: State, newTheme: string) {
      state.theme = newTheme;
    },
    setEm(state: State, newEm: boolean) {
      state.emphasiseBytes = newEm;
    },
    intSize(state: State, newIntSize: number) {
      state.intSize = newIntSize;
    },
    forceSize(state: State, forceSize: boolean) {
      state.forceSize = forceSize;
    },
    forceUnsigned(state: State, forceUnsigned: boolean) {
      state.forceUnsigned = forceUnsigned;
    }
  },
  actions: defineActions({
    
  }),
  modules: {
  }
})
