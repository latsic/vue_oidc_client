import { UserManager } from '@/backend/idserver/UserManager';
import { UserLoginState } from '@/models/UserLoginState';
import { OidcClientConfig } from '@/configuration/OidcClientConfig';

const um = UserManager.instance;

function actionHelperSignOut(context) {

  context.commit('setUserLoginState');
  context.commit('setOidcUser', { oidcUser: null });
  context.commit('setAccessToken', { accessToken: null });
}

function mutationHelperSetAccessToken(context) {
  context.commit('setAccessToken', {
    accessToken: context.state.oidcUser
      ? context.state.oidcUser.access_token
      : null });
}

const state = {

  userLoginState: new UserLoginState(),
  signInRedirectError: null,
  oidcUser: null,
  accessToken: null,
  initialized: false,
}

const getters = {
  userLoginState: state => {
    return state.userLoginState;
  },
  oidcUser: state => {
    return state.oidcUser
  },
  accessToken: state => {
    return state.accessToken;
  },
  userName: state => {
    return state.userLoginState.userName;
  },
  userAttribute: state => attributeName => {
    return um.getUserAttribute(attributeName, state.oidcUser);
  },
  accessTokenExpiresInSeconds: state => {
    return state.userLoginState.accessTokenExpiresInSeconds;
  },
  accessTokenExpired: state => {
    return state.userLoginState.accessTokenExpired;
  },
  accessTokenExpiring: state => {
    return state.userLoginState.accessTokenExpiring;
  },
  accessTokenIssueTime: () => {
    return state.userLoginState.accessTokenIssueTime;
  },
  signedIn: (state) => {
    return state.userLoginState.signedIn;
  },
  initialized: state => {
    return state.initialized;
  },
  signInRedirectError: state => {
    return state.signInRedirectError;
  }
}

const mutations = {
  setUserLoginState: (state) => {
    const ls = state.userLoginState;

    ls.signedIn = um.isUserSignedIn();
    if(!ls.signedIn) return;

    ls.userName = um.getUserName();
    if(!ls.userName) ls.userName = um.getUserAttribute('email');

    ls.accessTokenIssueTime = um.getAccessTokenIssueTime();
    ls.accessTokenExpiresInSeconds = um.getAccessTokenExpiresInSeconds();

    ls.accessTokenExpired = ls.accessTokenExpiresInSeconds < 0;
    ls.accessTokenExpiring = ls.accessTokenExpiresInSeconds < OidcClientConfig.accessTokenExpiringNotificationTime;
  },
  setInitialized: (state) => {
    state.initialized = true;
  },
  setOidcUser: (state, payload) => {
    state.oidcUser = payload.oidcUser;
  },
  setAccessToken: (state, payload) => {
    state.accessToken = payload.accessToken;
  },
  setSilentSignInOngoing: (state, payload) => {
    state.userLoginState.silentSignInOngoing = payload.silentSignInOngoing;
  },
  setSilentSignInError: (state, payload) => {
    state.userLoginState.silentSignInError = payload.error;
  },
  setSignInRedirectError: (state, payload) => {
    state.signInRedirectError = payload.error;
  }
}

const actions = {
  async init(context) {
    
    um.setUserLoadedCb(() => {
      context.commit('setOidcUser', { oidcUser: um.getOidcUser() });
      mutationHelperSetAccessToken(context);
      context.commit('setUserLoginState');
    });

    um.setUserSignedOutCb(() => {
      actionHelperSignOut(context);
    });

    um.setSignInSilentCb(() => {
      context.commit('setSilentSignInOngoing', { silentSignInOngoing: true });
      context.commit('setSilentSignInError', { silentSignInError: null });
    });

    um.setSignedInSilentCb(error => {
      context.commit('setSilentSignInOngoing', { silentSignInOngoing: false });
      context.commit('setUserLoginState');
      context.commit('setSilentSignInError', { error });
      context.commit('setOidcUser', { oidcUser: um.getOidcUser() });
      mutationHelperSetAccessToken(context);
    });
    um.setAccessTokenExpiredCb(() => {
      context.commit('setUserLoginState');
    });
    um.setAccessTokenExpiringCb(() => {
      context.commit('setUserLoginState');
    });

    await um.init();
    context.commit('setUserLoginState');
    context.commit('setOidcUser', { oidcUser: um.getOidcUser() });
    mutationHelperSetAccessToken(context);
    context.commit('setInitialized');
  },
  async signIn(context) {
    try{
      await um.signInAsync();
    }
    catch(error) {
      // eslint-disable-next-line no-console
      console.log('[Store][User][Action][signIn][Error]', error);
      context.commit('setSignInRedirectError', { error });
      setTimeout(() => {
        // clear the error after a short while.
        context.commit('setSignInRedirectError', { error: null });
      }, 3000);
    }
  },
  async signInSilent(context, payload = { onlyIfAccesTokenExpiringOrExpired: false }) {
    await um.signInSilentAsync(payload.onlyIfAccesTokenExpiringOrExpired);
  },
  async signInSilentIfAsync() {
    await um.signInSilentIfAsync();
  },
  async signOut(context) {
    try {
      await um.signOutAsync();
    }
    catch(error) {
      // eslint-disable-next-line no-console
      console.log('[Store][User][Action][signOut][Error]', error)
      actionHelperSignOut(context);
    }
  },
  updateLoginState(context) {
    context.commit('setUserLoginState');
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};