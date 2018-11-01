import oidcClient from 'oidc-client';

const config = {
  userStore: new oidcClient.WebStorageStateStore({ store: localStorage }),
  authority: process.env.VUE_APP_IDSERVER_URL_BASE,
  client_id: "js",
  redirect_uri: process.env.VUE_APP_IDSERVER_URL_CALLBACK_REDIRECT_URI,
  response_type: "id_token token",
  scope:"openid profile IdApi1 custom.profile",
  post_logout_redirect_uri: process.env.VUE_APP_IDSERVER_URL_POST_LOGOUT_REDIRECT_URI,
  silent_redirect_uri: process.env.VUE_APP_IDSERVER_URL_SILENT_REDIRECT_URI,
  accessTokenExpiringNotificationTime: 60,
  automaticSilentRenew: false
};

oidcClient.Log.logger = console;
oidcClient.Log.level = oidcClient.Log.INFO;

const singleton = Symbol();
const singletonEnforcer = Symbol();

export class UserManager {

  constructor(enforcer) {
    if(enforcer != singletonEnforcer) throw 'Cannot construct Singleton!';
    
    this.mgr = new oidcClient.UserManager(config);
    this.accessTokenWillExpireSoon = false;
    this.accessTokenExpired = false;
  }

  static get instance() {
    if(!this[singleton]) {
      this[singleton] = new UserManager(singletonEnforcer);
    }
    return this[singleton];
  }

  signin() {
    return this.mgr.signinRedirect()
    .then(() => {
      return true;
    })
    .catch(error => {
      throw error;
    });
  }

  signout() {
    return this.mgr.signoutRedirect()
    .then(() => {
      return true;
    })
    .catch(error => {
      throw error;
    })
  }

  throwIfError(user) {
    if(user instanceof Error) {
      throw user;
    }
    if(user == null) {
      throw new Error('Not signed in');
    }
  }

  getSignedInUserAsync() {
    return this.mgr.getUser()
    .then(user => {
      if(user == null) return null;
      this.throwIfError(user);
      return user;
    })
    .catch(error => {
      throw error;
    });
  }

  isUserSignedInAsync() {
    return this.mgr.getUser()
    .then(user => this.isUserSignedIn(user))
    .catch(error => {
      throw error;
    });
  }

  isUserSignedIn(user) {
    if(user == null) return false;
    this.throwIfError(user);
    return true;
  }

  getUserNameAsync() {
    return this.mgr.getUser()
    .then(user => this.getUserName(user));
  }

  getUserName(user) {
    this.throwIfError(user);
    if(!user.profile) return null;
    if(user.profile.preferred_username) return user.profile.preferred_username;
    return user.profile.name ? user.profile.name : null;
  }

  getUserEmailAsync() {
    return this.mgr.getUser()
    .then(user => this.getUserEmail(user));
  }

  getUserEmail(user) {
    this.throwIfError(user);
    if(!user.profile.email) return null;
    return user.profile.email;
  }

  getAttribute(user, attributeName) {
    this.throwIfError(user);
    if(!user.profile || !user.profile[attributeName]) return null;
    return user.profile[attributeName];
  }

  getAccessTokenExpiresInSecondsAsync() {
    return this.mgr.getUser()
    .then(user => this.getAccessTokenExpiresInSeconds(user));
  }

  getAccessTokenExpiresInSeconds(user) {
    this.throwIfError(user);
    return user.expires_in;
  }

  setAccessTokenExpiredCb(accessTokenExpiredCb) {
    this.accessTokenExpiredCb = accessTokenExpiredCb;
    this.mgr.events.addAccessTokenExpired(() => {
      // eslint-disable-next-line no-console
      console.log('[UserManager][mgr.AccessTokenExpiredCb]');
      this.accessTokenExpired = true;
      if(this.accessTokenExpiredCb) this.accessTokenExpiredCb();
    });
  }

  setAcessTokenExpiringCb(accessTokenExpiringCb) {
    this.accessTokenExpiringCb = accessTokenExpiringCb;
    this.mgr.events.addAccessTokenExpiring(() => {
      // eslint-disable-next-line no-console
      console.log('[UserManager][mgr.AcessTokenExpiringCb]');
      this.accessTokenWillExpireSoon = true;

      if(this.accessTokenExpiringCb) this.accessTokenExpiringCb();
    });
  }

  signInSilent() {
    if(this.signInSilentCb) this.signInSilentCb();
    return this.mgr.signinSilent()
    .then(user => {
      this.throwIfError(user);
      // eslint-disable-next-line no-console
      console.log('[UserManager][signInSilent][success][user]', user);
      this.accessTokenWillExpireSoon = false;
      this.accessTokenExpired = false;
      if(this.signedInSilentCb) this.signedInSilentCb(user);
      return user;
    });
  }

  getAccessTokenAsync() {
    if(this.accessTokenWillExpireSoon || this.accessTokenExpired) {
      return this.signInSilent()
      .then(user => {
        this.throwIfError(user);
        if(!user.access_token) {
          throw new Error('No access token available');
        }
        return user.access_token;
      });
    }
    return this.mgr.getUser()
    .then(user => {
      this.throwIfError(user);
      if(!user.access_token) {
        throw new Error('No access token available');
      }
      return user.access_token;
    })
    .catch(error => {
      throw error;
    });
  }

  getClockSkew() {
    return this.mgr.settings._clockSkew;
  }

  setAddUserSignedOutCb(userSignedOutCb) {
    this.userSignedOutCb = userSignedOutCb;
    this.mgr.events.addUserSignedOut(() => {
      // eslint-disable-next-line no-console
      console.log('[UserManager][mgr.UserSignedOutCb]');
      this.mgr.removeUser()
      .then(() => {
        if(this.userSignedOutCb) this.userSignedOutCb();
      });
    });
  }

  setUserLoadedCb(userLoadedCb) {
    this.userLoadedCb = userLoadedCb;
    this.mgr.events.addUserLoaded(user => {
      // eslint-disable-next-line no-console
      console.log('[UserManager][mgr.UserLoadedCb][user]', user);
      
      if(this.userLoadedCb) this.userLoadedCb();
    });
  }

  setSignedInSilentCb(signedInSilentCb) {
    this.signedInSilentCb = signedInSilentCb;
  }

  setSignInSilentCb(signInSilentCb) {
    this.signInSilentCb = signInSilentCb;
  }
}