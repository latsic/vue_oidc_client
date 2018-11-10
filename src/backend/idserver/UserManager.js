import oidcClient from 'oidc-client';
import { Paths } from '@/configuration/Paths';
import { OidcClientConfig } from '@/configuration/OidcClientConfig';
import { RefreshStrategy } from '@/backend/idserver/RefreshStrategy';

const config = {
  
  userStore: new oidcClient.WebStorageStateStore({ store: localStorage }),

  client_id: OidcClientConfig.clientId,
  response_type: OidcClientConfig.responseType,
  scope: OidcClientConfig.scope,
  accessTokenExpiringNotificationTime: OidcClientConfig.accessTokenExpiringNotificationTime,

  authority: Paths.idServer,
  redirect_uri: Paths.callbackRedirect,
  post_logout_redirect_uri: Paths.postLogoutRedirect,
  silent_redirect_uri: Paths.silentRenewRedirect,
  popup_redirect_uri: Paths.popupCallback,

  automaticSilentRenew: false,
  revokeAccessTokenOnSignout: true
};

initLogLevel(OidcClientConfig.logLevel);

const singleton = Symbol();
const singletonEnforcer = Symbol();

export class UserManager {

  constructor(enforcer) {
    if(enforcer != singletonEnforcer) throw 'Cannot construct singleton!';
    
    this.mgr = new oidcClient.UserManager(config);
    this.accessTokenWillExpireSoon = false;
    this.accessTokenExpired = false;
    this.tokenIssuedAt = null;
    this.user = null;

    this.accessTokenExpiredCb = null;
    this.accessTokenExpiringCb = null;
    this.userSignedOutCb = null;
    this.signInSilentCb = null;
    this.signedInSilentCb = null;
    this.userLoadedCb = null;

    this.refreshStrategy = RefreshStrategy.onDemandOnly;

    const localStorageVal = localStorage.getItem('UserManger.RefreshStrategy');
    if(localStorageVal != null) {
      const localStorageValInt = Number.parseInt(localStorageVal, 10);
      if(!Number.isNaN(localStorageValInt)) {
        this.refreshStrategy = localStorageValInt;
      }
    }
  }

  static get instance() {
    if(!this[singleton]) {
      this[singleton] = new UserManager(singletonEnforcer);

      this[singleton]._addAcessTokenExpiringCb();
      this[singleton]._addAccessTokenExpiredCb();
      this[singleton]._addUserSignedOutCb();
      this[singleton]._addUserLoadedCb();
    }
    return this[singleton];
  }

  async init() {
    this.user = await this.mgr.getUser();
  }

  getOidcUser() {
    if(this.user == null) return null;
    this._throwIfError(this.user);
    return this.user;
  }

  getUserName(user = this.user) {
    this._throwIfError(user);
    if(!user.profile) return null;
    if(user.profile.preferred_username) return user.profile.preferred_username;
    return user.profile.name ? user.profile.name : null;
  }

  getUserAttribute(attributeName, user = this.user) {
    this._throwIfError(user);
    if(!user.profile || !user.profile[attributeName]) return null;
    return user.profile[attributeName];
  }

  getAccessTokenExpiresInSeconds(user = this.user) {
    this._throwIfError(user);
    return user.expires_in;
  }

  getAccessTokenIssueTime() {
    // seconds since midnight, 1 Jan 1970
    if(!this.tokenIssuedAt) {
      this.tokenIssuedAt = localStorage.getItem('UserManger.TokenIssuedAt');
    }
    return this.tokenIssuedAt;
  }

  getClockSkew() {
    return this.mgr.settings._clockSkew;
  }

  getRefreshStrategy() {
    return this.refreshStrategy;
  }

  async getAccessTokenAsync_RenewIfNeeded() {
    return await this.getAccessTokenAsync(true);
  }

  async getAccessTokenAsync(ensureNotExpired) {
    
    if(ensureNotExpired && this.accessTokenWillExpireSoon || this.accessTokenExpired) {
      this.user = await this.signInSilentAsync();
    }
    
    this._throwIfError(this.user);
    if(!this.user.access_token) {
      throw new Error('No access token available');
    }
    return this.user.access_token;
  }

  getSignedInUser() {
    if(this.user == null) return null;
    this._throwIfError(this.user);
    return this.user;
  }

  isUserSignedIn() {
    if(this.user == null) return false;
    this._throwIfError(this.user);
    return true;
  }

  setRefreshStrategy(strategy) {

    if(this.refreshStrategy == strategy) {
      return;
    }

    switch(strategy) {
      case RefreshStrategy.onDemandOnly:
      case RefreshStrategy.onExpiring:
      case RefreshStrategy.onExpired:
      case RefreshStrategy.manualOnly:
        break;
      default:
        throw new Error("[UserManager][setRefreshStrategy]: Invalid refresh strategy")
    }

    localStorage.setItem('UserManger.RefreshStrategy', strategy);
    this.refreshStrategy = strategy;
    this._silentSignInIfNeededAsync();
  }

  setClockSkew(clockSkew) {

    if(clockSkew == this.mgr.settings._clockSkew) {
      return;
    }

    this.mgr.settings._clockSkew = clockSkew;
    // localStorage.setItem('UserManger.ClockSkew', clockSkew);
  }

  setUserLoadedCb(userLoadedCb) {
    this.userLoadedCb = userLoadedCb;
  }

  setUserSignedOutCb(userSignedOutCb) {
    this.userSignedOutCb = userSignedOutCb;
  }

  setSignInSilentCb(signInSilentCb) {
    this.signInSilentCb = signInSilentCb;
  }

  setSignedInSilentCb(signedInSilentCb) {
    this.signedInSilentCb = signedInSilentCb;
  }

  setAccessTokenExpiredCb(accessTokenExipredCb) {
    this.accessTokenExpiredCb = accessTokenExipredCb;
  }

  setAccessTokenExpiringCb(accessTokenExpiringCb) {
    this.accessTokenExpiring = accessTokenExpiringCb;
  }

  async signInAsync() {
    if(OidcClientConfig.usePopup) {
      await this.mgr.signinPopup();
    }
    else {
      await this.mgr.signinRedirect();
    }
  }

  async signOutAsync() {
    await this.mgr.signoutRedirect();
  }

  async signInSilentAsync(onlyIfAccessTokenExpiresOrExpired = false) { 

    if(onlyIfAccessTokenExpiresOrExpired &&
      !this.accessTokenWillExpireSoon &&
      !this.accessTokenExpired) {
      
      return;
    }

    await this._signInSilentAsync();
  }

  async signInSilentIfAsync() {
  
    if(this.refreshStrategy != RefreshStrategy.manualOnly &&
       (this.accessTokenWillExpireSoon || this.accessTokenExpired)) {

      await this._signInSilentAsync();
    }
  }

  async _silentSignInIfNeededAsync() {

    if((this.accessTokenWillExpireSoon &&
        this.refreshStrategy == RefreshStrategy.onExpiring) ||
       (this.accessTokenExpired && 
        (this.refreshStrategy == RefreshStrategy.onExpired ||
         this.refreshStrategy == RefreshStrategy.onExpiring))) {

      await this._signInSilentAsync();
    }
  }

  async _signInSilentAsync() { 

    if(this.signInSilentCb) this.signInSilentCb();

    try {
      this.user = await this.mgr.signinSilent();
      this._throwIfError(this.user);
      // eslint-disable-next-line no-console
      console.log('[UserManager][signInSilent][success][user]', this.user);
      this.accessTokenWillExpireSoon = false;
      this.accessTokenExpired = false;
      if(this.signedInSilentCb) this.signedInSilentCb(null);
      this._updateTokenIssuedAt();
    }
    catch(error) {
      // eslint-disable-next-line no-console
      console.log('[UserManager][signInSilent][error][user]', error);
      this.signedInSilentCb(error);
      throw error;
    }
  }

  _addUserLoadedCb() {
    this.mgr.events.addUserLoaded(user => {
      // eslint-disable-next-line no-console
      console.log('[UserManager][UserLoadedCb][user]', user);
      this.user = user;
      this._updateTokenIssuedAt();
      if(this.userLoadedCb) this.userLoadedCb();
    });
  }

  _addUserSignedOutCb() {
    this.mgr.events.addUserSignedOut(() => {
      // eslint-disable-next-line no-console
      console.log('[UserManager][UserSignedOutCb]');
      this.mgr.removeUser()
      .finally(() => {
        this.user = null;
        if(this.userSignedOutCb) this.userSignedOutCb();
      });
    });
  }

  _addAccessTokenExpiredCb() {
    this.mgr.events.addAccessTokenExpired(() => {
      // eslint-disable-next-line no-console
      console.log('[UserManager][AccessTokenExpiredCb]');
      if(this.accessTokenExpiredCb) this.accessTokenExpiredCb();
      switch(this.refreshStrategy) {
        case RefreshStrategy.onExpired:
          this.signInSilentAsync();
          break;
        default:
          this.accessTokenExpired = true;
      }
    });
  }

  _addAcessTokenExpiringCb() {
    this.mgr.events.addAccessTokenExpiring(() => {
      // eslint-disable-next-line no-console
      console.log('[UserManager][AcessTokenExpiringCb]');
      if(this.accessTokenExpiringCb) this.accessTokenExpiringCb();
      switch(this.refreshStrategy) {
        case RefreshStrategy.onExpiring:
          this.signInSilentAsync();
          break;
        default:
          this.accessTokenWillExpireSoon = true;
      }
    });
  }

  _throwIfError(user) {
    if(user instanceof Error) {
      throw user;
    }
    if(user == null) {
      throw new Error('Not signed in');
    }
  }

  _updateTokenIssuedAt() {
    this.tokenIssuedAt = Date.now() / 1000;
    if(localStorage.setItem('UserManger.TokenIssuedAt', this.tokenIssuedAt));
  }
}

function initLogLevel(logLevel)
{
  if(logLevel == "error") {
    oidcClient.Log.logger = console;
    oidcClient.Log.level = oidcClient.Log.ERROR;
  }
  else if(logLevel == "info") {
    oidcClient.Log.logger = console;
    oidcClient.Log.level = oidcClient.Log.INFO;
  }
  else if(logLevel == "debug") {
    oidcClient.Log.logger = console;
    oidcClient.Log.level = oidcClient.Log.DEBUG;
  }
  else if(logLevel == "warn") {
    oidcClient.Log.logger = console;
    oidcClient.Log.level = oidcClient.Log.WARN;
  }
}
