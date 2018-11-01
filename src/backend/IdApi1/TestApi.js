
import { AxiosManager } from '@/backend/AxiosManager.js'
import { UserManager } from '@/backend/idserver/UserManager';

export class TestApi {

  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.axiosInstance = AxiosManager.instance.getAxiosInstance(apiUrl);
    AxiosManager.instance.addInterceptor(apiUrl, () => {
      return UserManager.instance.getAccessTokenAsync()
        .then(access_token => access_token);
    });
    this.axiosInstanceNoToken = AxiosManager.instance.getAxiosInstanceSpecial(apiUrl);
  }

  get(apiActionName, attachToken = true) {

    const axiosInstance = attachToken
      ? this.axiosInstance
      : this.axiosInstanceNoToken;

    return axiosInstance.get(apiActionName)
      .then(response => response.data)
      .catch(error => {
      // eslint-disable-next-line no-console
      console.log('[TestApi][get][error]', error);
      throw error;
    });
  }
}
