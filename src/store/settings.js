
import { Paths } from '@/configuration/Paths';
import { UserManager } from '@/backend/idserver/UserManager';
import { RefreshStrategy } from '@/backend/idserver/RefreshStrategy';
import { TokenValidationConfigApi } from '@/backend/IdApi1/TokenValidationConfigApi';
import { TokenConfigApi } from '@/backend/idserver/TokenConfigApi';
import { OidcClientConfig } from '@/configuration/OidcClientConfig';

const um = UserManager.instance;

const state = {
  refreshStrategy: RefreshStrategy.manualOnly,

  clockSkew: 0,
  clockSkewError: null,
  clockSkewSetCallOngoing: false,
  clockSkewInitFailed: false,

  accessTokenLifeTime: 0,
  accessTokenLifeTimeError: null,
  accessTokenLifeTimeSetCallOngoing: false,
  accessTokenLifeTimeInitFailed: false,
}

const getters = {
  refreshStrategy: state => {
    return state.refreshStrategy;
  },

  clockSkew: (state) => {
    return state.clockSkew;
  },
  clockSkewError: state => {
    return state.clockSkewError;
  },
  clockSkewSetCallOngoing: state => {
    return state.clockSkewSetCallOngoing;
  },
  clockSkewInitFailed: state => {
    return state.clockSkewInitFailed;
  },

  accessTokenLifeTime: state => {
    return state.accessTokenLifeTime;
  },
  accessTokenLifeTimeError: state => {
    return state.accessTokenLifeTimeError;
  },
  accessTokenLifeTimeSetCallOngoing: state => {
    return state.accessTokenLifeTimeSetCallOngoing;
  },
  accessTokenLifeTimeInitFailed: state => {
    return state.accessTokenLifeTimeInitFailed;
  }
}

const mutations = {
  setRefreshStrategy: (state, refreshStrategy) => {
    um.setRefreshStrategy(refreshStrategy);
    state.refreshStrategy = refreshStrategy;
  },
  setClockSkew: (state, payload) => {
    state.clockSkew = payload.timeSpan;
  },
  setClockSkewError: (state, payload) => {
    state.clockSkewError = payload.error;
  },
  clockSkewSetCallOngoing: (state, payload) => {
    state.clockSkewSetCallOngoing = payload.value;
  },
  setClockSkewInitFailed: (state, payload) => {
    state.clockSkewInitFailed = payload.value;
  },

  setAccessTokenLifeTime: (state, payload) => {
    state.accessTokenLifeTime = payload.accessTokenLifeTime;
  },
  setAccessTokenLifeTimeError: (state, payload) => {
    state.accessTokenLifeTimeError = payload.error;
  },
  accessTokenLifeTimeSetCallOngoing: (state, payload) => {
    state.accessTokenLifeTimeSetCallOngoing = payload.value;
  },
  setAccessTokenLifeTimeInitFailed: (state, payload) => {
    state.accessTokenLifeTimeInitFailed = payload.value;
  }
}
const actions = {
  async init(context) {

    const tokenValidationConfigIdApi1 =
      new TokenValidationConfigApi(Paths.tokenValidationConfigIdApi1, null, null);

    context.commit('setRefreshStrategy', um.getRefreshStrategy());

    const promise1 = tokenValidationConfigIdApi1.get('clockSkew', false);
    promise1.then(clockSkewResponse => {
      context.commit('setClockSkew', { timeSpan: clockSkewResponse.timeSpan });
    })
    .catch(error => {
      context.commit('setClockSkewInitFailed', { value: true });
      context.commit('setClockSkewError', { error });
    });

    const tokenConfigApi =
      new TokenConfigApi(Paths.tokenConfigApi, null, null);

    const promise2 = tokenConfigApi.getWithParams('AccessTokenConfig', OidcClientConfig.clientId, false);

    promise2.then(accessTokenConfigResponse => {
      context.commit('setAccessTokenLifeTime', { accessTokenLifeTime: accessTokenConfigResponse.lifeTimeSeconds });
    })
    .catch(error => {
      context.commit('setAccessTokenLifeTimeInitFailed', { value: true });
      context.commit('setAccessTokenLifeTimeError', { error });
    });
  },
  setRefreshStrategy: (context, payload) => {
    context.commit('setRefreshStrategy', payload);
  },
  async setClockSkew(context, payload) {

    if(context.getters['clockSkewSetCallOngoing']) return;

    context.commit('clockSkewSetCallOngoing', { value: true });
    const clockSkewValueBackUp = context.getters['clockSkew'];
    context.commit('setClockSkew', payload);

    const tokenValidationConfigIdApi1 =
      new TokenValidationConfigApi(Paths.tokenValidationConfigIdApi1,
        () => context.dispatch('auth/signInSilentIfAsync', null, { root: true }),
        () => context.rootGetters['auth/accessToken']);

    return tokenValidationConfigIdApi1.post('clockSkew', { timeSpan: payload.timeSpan })
    .then(clockSkewResponse => {
      if(clockSkewResponse.timeSpan != payload.timeSpan) {
        context.commit('setClockSkew', { timeSpan: clockSkewResponse.timeSpan });
      }
      if(context.getters['clockSkewError'] != null) {
        context.commit('setClockSkewError', { error: null });
      }
      if(context.getters['clockSkewInitFailed']) {
        context.commit('setClockSkewInitFailed', { value: false });
      }
    })
    .catch(error => {
      context.commit('setClockSkew', { timeSpan: clockSkewValueBackUp });
      context.commit('setClockSkewError', { error });
      if(payload.resetErrorTimeMs && !context.getters['clockSkewInitFailed']) {
        setTimeout(() => {
          context.commit('setClockSkewError', { error: null });
        }, payload.resetErrorTimeMs);
      }
    })
    .finally(() => {
      context.commit('clockSkewSetCallOngoing', { value: false });
    });
  },

  setAccessTokenLifeTime: (context, payload) => {
    
    if(context.getters['accessTokenLifeTimeSetCallOngoing']) return;

    context.commit('accessTokenLifeTimeSetCallOngoing', { value: true });
    const accessTokenLifeTimeBackUp = context.getters['accessTokenLifeTime'];
    
    const tokenConfigApi =
      new TokenConfigApi(Paths.tokenConfigApi, null, null);
    context.commit('setAccessTokenLifeTime', payload);

    return tokenConfigApi.putWithParams(
      'accessTokenConfig', OidcClientConfig.clientId,
      { lifeTimeSeconds: payload.accessTokenLifeTime }, false)
    .then(accessTokenConfigResponse => {
      if(payload.accessTokenLifeTime != accessTokenConfigResponse.lifeTimeSeconds) {
        context.commit('setAccessTokenLifeTime', { accessTokenLifeTime: accessTokenConfigResponse.lifeTimeSeconds });
      }
      if(context.getters['accessTokenLifeTimeError'] != null) {
        context.commit('setAccessTokenLifeTimeError', { error: null });
      }
      if(context.getters['accessTokenLifeTimeInitFailed']) {
        context.commit('setAccessTokenLifeTimeInitFailed', { value: false });
      }
    })
    .catch(error => {
      context.commit('setAccessTokenLifeTime', { accessTokenLifeTime: accessTokenLifeTimeBackUp });
      context.commit('setAccessTokenLifeTimeError', { error });
      if(payload.resetErrorTimeMs && !context.getters['accessTokenLifeTimeInitFailed']) {
        setTimeout(() => {
          context.commit('setAccessTokenLifeTimeError', { error: null });
        }, payload.resetErrorTimeMs);
      }
    })
    .finally(() => {
      context.commit('accessTokenLifeTimeSetCallOngoing', { value: false });
    });
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};