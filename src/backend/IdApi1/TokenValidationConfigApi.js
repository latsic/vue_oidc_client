
import { CommonApi } from '@/backend/CommonApi';

export class TokenValidationConfigApi extends CommonApi {

  constructor(apiUrl, ensureTokenAsyncFn, accessTokenFn) {
    super(apiUrl, ensureTokenAsyncFn, accessTokenFn);
  }
}