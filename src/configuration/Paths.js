
export class Paths {

  static _appendSlashIf(value, appendSlash = true) {
    return appendSlash
      ? value + '/'
      : value ;
  }

  static _getBaseUrlApp(appendSlash = true) {
    return this._appendSlashIf(process.env.VUE_APP_URL, appendSlash); 
  }

  static _getBaseUrlIdServer(appendSlash = true) {
    return this._appendSlashIf(process.env.VUE_APP_URL_IDSERVER, appendSlash);
  }

  static _getBaseUrlIdUserServer(appendSlash = true) {
    return this._appendSlashIf(process.env.VUE_APP_URL_IDUSERSERVER, appendSlash);
  }

  static _getBaseUrlIdApi1(appendSlash = true) {
    return this._appendSlashIf(process.env.VUE_APP_URL_IDAPI1, appendSlash);
  }

  static get testApi() {
    return `${this._getBaseUrlIdApi1()}${process.env.VUE_APP_PATH_IDAPI1_TEST}`;
  }

  static get tokenValidationConfigIdApi1() {
    return `${this._getBaseUrlIdApi1()}${process.env.VUE_APP_PATH_IDAPI1_TOKEN_VALIDATION_CONFIG}`;
  }

  static get swagger() {
    return `${this._getBaseUrlIdApi1()}${process.env.VUE_APP_PATH_IDAPI1_SWAGGER}`;
  }

  static get registerEndpoint() {
    return `${this._getBaseUrlIdUserServer()}${process.env.VUE_APP_PATH_IDUSERSERVER_REGISTER}`;
  }

  static get tokenConfigApi() {
    return `${this._getBaseUrlIdServer()}${process.env.VUE_APP_PATH_IDSERVER_TOKEN_CONFIG}`;
  }
  
  static get userConfigApi() {
    return `${this._getBaseUrlIdUserServer()}${process.env.VUE_APP_PATH_IDUSERSERVER_USER}`;
  }

  static get postLogoutRedirect() {
    return `${this._getBaseUrlApp(false)}${process.env.BASE_URL}${process.env.VUE_APP_PAGE_POST_LOGOUT_RD}`;
  }

  static get callbackRedirect() {
    return `${this._getBaseUrlApp(false)}${process.env.BASE_URL}${process.env.VUE_APP_PAGE_CALLBACK_RD}`;
  }

  static get silentRenewRedirect() {
    return `${this._getBaseUrlApp(false)}${process.env.BASE_URL}${process.env.VUE_APP_PAGE_SILENT_RENEW_RD}`;
  }

  static get popupCallback() {
    return `${this._getBaseUrlApp(false)}${process.env.BASE_URL}${process.env.VUE_APP_PAGE_POPUP_CALLBACK}`;
  }

  static get idServer() {
    return this._getBaseUrlIdServer();
  }
}
