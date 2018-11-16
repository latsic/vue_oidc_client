
import router from '@/router'
import { AccountApi } from '@/backend/idUserApi/AccountApi';
import { Paths } from '@/configuration/Paths';
import { RegisterData } from '@/models/RegisterData';

const state = {
  registerData: new RegisterData(),
  registeredData: null,
  registerError: null,
  registering: false
}

const getters = {
  registerData(state){
    return state.registerData;
  },
  registerError(state) {
    return state.registerError;
  },
  registering(state) {
    return state.registering;
  },
  registeredData(state) {
    return state.registeredData;
  }
}

const mutations = {
  setRegisterData(state, registerData) {
    state.registerData = registerData;
  },
  setRegisterError(state, error) {
    state.registerError = error;
  },
  registering(state, value) {
    state.registering = value;
  },
  setRegisteredData(state, registeredData) {
    state.registeredData = registeredData;
  }
}

const actions = {
  async register(context, registerData) {
    const accountApi = new AccountApi(Paths.accountApi);
    
    if(context.getters['registering']) {
      return;
    }

    if(context.getters['registerError']) {
      context.commit('setRegisterError', null);
    }
    context.commit('registering', true);
    
    return accountApi.register(registerData)
    .then(registeredData => {
      context.commit('setRegisteredData', registeredData);
      router.push({
        name: 'registersuccessfull',
        params: { registerData: registeredData }
      });
      context.dispatch('clearRegisterData');
    })
    .catch(error => {
      context.commit('setRegisterError', error);
    })
    .finally(() => {
      context.commit('registering', false);
    });
  },
  clearRegisterError(context) {
    context.commit('setRegisterError', null);
  },
  clearRegisterData(context) {
    context.commit('setRegisterData', new RegisterData());
  },
  setRegisterData(context, registerData) {
    context.commit('setRegisterData', registerData);
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};