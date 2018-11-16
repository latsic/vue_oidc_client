import Vue from 'vue';
import Vuex from 'vuex';

import auth from '@/store/auth';
import settings from '@/store/settings';
import account from '@/store/account';
import claims from '@/store/claims';

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    
  },
  mutations: {

  },
  actions: {

  },
  modules: {
    auth,
    account,
    claims,
    settings
  }
});
