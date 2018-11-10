

export class OidcClientConfig {
  
  static get clientId() {
    return process.env.VUE_APP_OIDC_CLIENT_ID;
  }
  static get responseType() {
    return process.env.VUE_APP_OIDC_RESPONSE_TYPE;
  }
  static get scope() {
    return process.env.VUE_APP_OIDC_SCOPE;
  }
  static get accessTokenExpiringNotificationTime() {
    const val = Number.parseInt(process.env.VUE_APP_OIDC_ACCESS_TOKEN_EXPIRING_NOTIFICATION_TIME, 10);
    return Number.isNaN(val) ? 60 : val;
  }
  static get logLevel() {
    return process.env.VUE_APP_OIDC_LOGLEVEL;
  }
  static get usePopup() {
    return process.env.VUE_APP_OIDC_USE_POPUP == '1';
  }
}
