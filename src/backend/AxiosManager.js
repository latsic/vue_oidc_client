
import axios from 'axios';

const singleton = Symbol();
const singletonEnforcer = Symbol();

export class AxiosManager {
  
  constructor(enforcer) {

    if(enforcer != singletonEnforcer) throw 'Cannot construct Singleton!';
    
    this.axiosInstances = new Map();
    this.axiosInstancesSpecial = new Map();
  }

  static get instance() {
    if(!this[singleton]) {
      this[singleton] = new AxiosManager(singletonEnforcer);
    }
    return this[singleton];
  }

  removeAxiosInstance(url) {
    this.axiosInstances.delete(url);
  }

  addInterceptor(url, tokenPromiseFn) {

    const elem = this.axiosInstances.get(url);
    if(elem && elem.interceptor == null) {
      elem.interceptor = elem.axiosInstance.interceptors.request.use(config => {
        return tokenPromiseFn()
        .then(token => {
          config.headers.Authorization = `Bearer ${token}`;
          //return Promise.resolve(config);
          return Promise.resolve(config);
        })
        .catch(error => {
          return Promise.reject(error);
        });
      }, error => {
        return Promise.reject(error);
      });
      return true;
    }
    return false;
  }

  _getAxiosInstance(url, axiosInstances) {
    let elem = axiosInstances.get(url);
    if(!elem) {
      
      const axiosInstance =  axios.create({
        baseURL: url,
        timeout: 50000
      });

      elem = {
        axiosInstance,
        interceptor: null
      };
      axiosInstances.set(url, elem);
    }
    return elem.axiosInstance;
  }

  getAxiosInstance(url) {
    return this._getAxiosInstance(url, this.axiosInstances);
  }

  getAxiosInstanceSpecial(url) {
    return this._getAxiosInstance(url, this.axiosInstancesSpecial);
  }

  addAxiosInstance(url) {
    this.getAxiosInstance(url);
  }

}