
import { CommonApi } from '@/backend/CommonApi';

export class TokenConfigApi extends CommonApi {

  constructor(apiUrl, ensureTokenAsyncFn, accessTokenFn) {
    super(apiUrl, ensureTokenAsyncFn, accessTokenFn);
  }
  
}