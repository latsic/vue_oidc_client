
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
  }

  async get(apiActionName, attachToken = true) {
    const response = await this._axiosInstance(attachToken).get(apiActionName);
    return await response.data;
  }

  async getWithParams(apiActionName, params, attachToken = true) {
    const response = await this._axiosInstance(attachToken).get(`${apiActionName}/${params}`);
    return await response.data;
  }

  async post(apiActionName, bodyData, attachToken = true) {
    const response = await this._axiosInstance(attachToken).post(apiActionName, bodyData);
    return await response.data;
  }

  async put(apiActionName, bodyData, attachToken = true) {
    const response = await this._axiosInstance(attachToken).put(apiActionName, bodyData);
    return await response.data;
  }

  async putWithParams(apiActionName, params, bodyData, attachToken = true) {
    const response = await this._axiosInstance(attachToken).put(`${apiActionName}/${params}`, bodyData);
    return await response.data;
  }

  _axiosInstance(attachToken = true) {
    return attachToken
      ? this.axiosInstance
      : this.axiosInstanceNoToken;
  }
}