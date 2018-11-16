
import { UserApi } from '@/backend/idUserApi/UserApi';
import { Paths } from '@/configuration/Paths';
import { Claim } from '@/models/Claim';

function helper_getUserApi(context, ensureToken = false) {
  return new UserApi(Paths.userConfigApi,
    ensureToken
    ? () => context.dispatch('auth/signInSilent', { onlyIfAccesTokenExpiringOrExpired: true }, { root: true })
    : () => context.dispatch('auth/signInSilentIfAsync', null, { root: true }),
    () => context.rootGetters['auth/accessToken']);
}

function helper_claimCallPrepare(context) {

  if(context.getters['changingClaim']) {
    return false;
  }
  context.commit('setChangeError', null);
  context.commit('setChangingClaim', true);
  return true;
}
function helper_claimCallError(context, error) {

  context.commit('setChangeError', error);
}
function helper_claimCallFinalize(context) {
  context.commit('setChangingClaim', false);
}

async function helper_claimCall(context, fn) {
  try {
    if(!helper_claimCallPrepare(context)) {
      return;
    }
    await fn();
  }
  catch(error) {
    helper_claimCallError(context, error);
  }
  finally {
    helper_claimCallFinalize(context)
  }
}

const state = {
  users: [],
  currentUserId: null,

  claims: [],
  currentClaim: null,

  loadingUsers: false,
  loadingClaims: false,
  changingClaim: false,

  usersError: null,
  claimsError: null,
  changeError: null,

  initialized: false
}

const getters = {
  users(state) {
    return state.users;
  },
  currentUserId() {
    return state.currentUserId;
  },
  claims(state) {
    return state.claims;
  },
  currentClaim(state) {
    return state.currentClaim;
  },
  loadingUsers(state) {
    return state.usersLoading;
  },
  loadingClaims(state) {
    return state.claimsLoading;
  },
  changingClaim(state) {
    return state.changingClaim;
  },
  usersError(state) {
    return state.usersError;
  },
  claimsError(state) {
    return state.claimsError;
  },
  changeError(state) {
    return state.changeError;
  },
  initialized(state) {
    return state.initialized;
  }
}

const mutations = {
  setUsers(state, users) {
    state.users = users;
    
    if(users.some(user => user.userId == state.currentUserId)) {
      return;
    }
    state.currentUserId = null;
    state.claims = [];
    state.currentClaim = null;
  },
  setCurrentUserId(state, userId) {
    if(state.currentUserId == userId) return;

    state.currentUserId = userId;
    state.claims = [];
    state.currentClaim = null;
  },
  setClaims(state, claims) {
    state.claims = claims;
    state.currentClaim = null;
  },
  updateClaim(state, { claimId, claim }) {
    const existingClaim = state.claims.find(claim => claim.id == claimId);
    if(existingClaim) {
      existingClaim.id = claim.id;
      existingClaim.type = claim.type;
      existingClaim.value = claim.value;
    }
  },
  setCurrentClaim(state, currentClaim) {
    state.currentClaim = currentClaim;
  },
  setCurrentClaimId(state, claimId) {
    state.currentClaim.id = claimId;
  },
  persistCurrentClaim(state, remove = false) {

    if(remove) {
      state.claims = state.claims.filter(claim => claim.id != state.currentClaim.id);
      return;
    }

    const claim = state.claims.find(claim => claim.id == state.currentClaim.id);
    if(claim) {
      claim.type = state.currentClaim.type;
      claim.value = state.currentClaim.value;
    }
    else if(state.currentClaim.id) {
      state.claims.push(new Claim(
        state.currentClaim.id,
        state.currentClaim.type,
        state.currentClaim.value));
    }
  },
  setLoadingUsers(state, value) {
    state.loadingUsers = value;
  },
  setLoadingClaims(state, value) {
    state.loadingClaims = value;
  },
  setChangingClaim(state, value) {
    state.changingClaim = value;
  },

  setUsersError(state, error) {
    state.usersError = error;
  },
  setClaimsError(state, error) {
    state.claimsError = error;
  },
  setChangeError(state, error) {
    state.changeError = error;
  },

  setInitialized(state, value) {
    state.initialized = value;
  }
}

const actions = {
  async init(context) {
    await context.dispatch('loadUsers', !context.getters['initialized']);
    context.commit('setInitialized', true);
  },
  async loadUsers(context, ensureToken = false) {
    
    if(context.getters['loadingUsers']) return;
    context.commit('setUsersError', null);
    context.commit('setLoadingUsers', true);
    try {
      const users = await helper_getUserApi(context, ensureToken).users();
      context.commit('setUsers', users);
    }
    catch(error) {
      context.commit('setUsersError', error);
    }
    finally {
      context.commit('setLoadingUsers', false);
    }
  },
  setCurrentUserId(context, userId) {
    if(context.getters['currentUserId'] == userId) return;
    context.commit('setCurrentUserId', userId);
    context.dispatch('loadClaims');
  },

  async loadClaims(context, ensureToken = false) {

    if(context.getters['loadingClaims']) return;
    context.commit('setClaimsError', null);
    context.commit('setLoadingClaims', true);
    try {
      const claims = await helper_getUserApi(context, ensureToken)
        .claims(context.getters['currentUserId']);
      context.commit('setClaims', claims);
    }
    catch(error) {
      context.commit('setClaimsError', error);
    }
    finally {
      context.commit('setLoadingClaims', false);
    }
  },
  async currentClaimDelete(context) {

    await helper_claimCall(context, async () => {
      try {
        context.commit('persistCurrentClaim', true);
        await helper_getUserApi(context).claimDelete(
          context.state.currentUserId, context.state.currentClaim);
        context.commit('setCurrentClaimId', null);
      }
      catch(error) {
        context.commit('persistCurrentClaim', false);
        throw error;
      }
    });
  },
  async currentClaimAdd(context) {

    await helper_claimCall(context, async () => {
      try {
        context.commit('setCurrentClaimId', '-1');
        context.commit('persistCurrentClaim', false);
        const addedClaim = await helper_getUserApi(context).claimAdd(
          context.state.currentUserId, context.state.currentClaim);
        context.commit('setCurrentClaimId', addedClaim.id);
        context.commit('updateClaim', {claimId: '-1', claim: addedClaim});
      }
      catch(error) {
        context.commit('persistCurrentClaim', true);
        throw error;
      }
    });
  },
  async currentClaimUpdate(context) {
    
    const currentClaim = context.getters['currentClaim'];
    const claimBackup = currentClaim
      ? new Claim(currentClaim.id, currentClaim.type, currentClaim.value)
      : null;

    try {
      await helper_claimCall(context, async () => {
        context.commit('persistCurrentClaim', false);
        await helper_getUserApi(context).claimUpdate(
          context.state.currentUserId, context.state.currentClaim);
      });
    }
    catch(error) {
      context.commit('setCurrentClaim', claimBackup);
      context.commit('persistCurrentClaim', false);
      throw error;
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};