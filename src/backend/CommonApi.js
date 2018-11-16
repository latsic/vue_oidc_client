
import { AxiosManager } from '@/backend/AxiosManager.js';

export class CommonApi {

  constructor(apiUrl, ensureTokenAsyncFn, accessTokenFn = null) {
    this.apiUrl = apiUrl;
    this.axiosInstance = AxiosManager.instance.getAxiosInstance(apiUrl);
    
    if(accessTokenFn != null) {
      AxiosManager.instance.addInterceptor(apiUrl, async () => {
        if(ensureTokenAsyncFn) {
          await ensureTokenAsyncFn();
        }
        return accessTokenFn();
      });
    }
    this.axiosInstanceNoToken = AxiosManager.instance.getAxiosInstance2(apiUrl);
    this.logLevel = 'debug';
  }

  async get(apiActionName, attachToken = true) {
    return await this._call(
      async () => this._axiosInstance(attachToken).get(apiActionName),
      { method: 'get', apiActionName, attachToken }
    );
  }

  async getWithParams(apiActionName, params, attachToken = true) {
    return await this._call(
      async () => this._axiosInstance(attachToken).get(`${apiActionName}/${params}`),
      { method: 'get', apiActionName, params, attachToken }
    );
  }

  async post(apiActionName, bodyData, attachToken = true) {
    return await this._call(
      async () => this._axiosInstance(attachToken).post(apiActionName, bodyData),
      { method: 'post', apiActionName, bodyData, attachToken }
    );
  }

  async postWithParams(apiActionName, params, bodyData = null, attachToken = true) {
    return await this._call(
      async () => this._axiosInstance(attachToken).post(`${apiActionName}/${params}`, bodyData),
      { method: 'post', apiActionName, params, bodyData, attachToken }
    );
  }

  async put(apiActionName, bodyData, attachToken = true) {
    return await this._call(
      async () => this._axiosInstance(attachToken).put(apiActionName, bodyData),
      { method: 'put', apiActionName, bodyData, attachToken }
    );
  }

  async putWithParams(apiActionName, params, bodyData = null, attachToken = true) {
    return await this._call(
      async () => this._axiosInstance(attachToken).put(`${apiActionName}/${params}`, bodyData),
      { method: 'put', apiActionName, params, bodyData, attachToken }
    );
  }

  async deleteWithParams(apiActionName, params, attachToken = true) {
    return await this._call(
      async () => this._axiosInstance(attachToken).delete(`${apiActionName}/${params}`),
      { method: 'delete', apiActionName, params, attachToken }
    );
  }

  _axiosInstance(attachToken = true) {
    return attachToken
      ? this.axiosInstance
      : this.axiosInstanceNoToken;
  }

  async _call(fnAsync, logInfo = null) {
    
    const timeStart = new Date();
    const apiActionName = logInfo ? `[${logInfo.apiActionName}]` : '';

    try {

      if(logInfo && this.logLevel == 'debug') {

        const p1 = `[CommonApi][_call]`;
        const p2 = `[${logInfo.method ? logInfo.method : 'method unknown'}]`;
        const p3 = `[${logInfo.apiActionName ? logInfo.apiActionName : 'action unknown'}]`;
        const p4 = logInfo.params ? `[${logInfo.params}]` : '' ;
        const p5 = logInfo.attachToken ? '[attachToken=true]' : '[attachToken=false]';
        const p6 = logInfo.bodyData ? `, body:` : '';
        // eslint-disable-next-line no-console
        console.log(p1 + p2 + p3 + p4 + p5, p6, p6 ? logInfo.bodyData : '');
      }

      const response = await fnAsync();
      
      // eslint-disable-next-line no-console
      console.log(`[CommonApi][_call]${apiActionName}[success][${new Date() - timeStart}ms]`, response.data);

      return response.data;
    }
    catch(error){

      // eslint-disable-next-line no-console
      console.log(`[CommonApi][_call]${apiActionName}[${new Date() - timeStart}ms][error]`, error);

      if(error.response && error.response.data && error.response.data.message) {
        throw error.response.data;
      }
      if(error.response && error.response.statusText) {
        throw new Error(error.response.statusText);
      }
      if(error.message){
        throw error;
      }
      throw new Error('Uknown error');
    }
  }
}