
import { CommonApi } from '@/backend/CommonApi';

export class TestApi extends CommonApi{

  constructor(apiUrl, ensureTokenAsyncFn, accessTokenFn) {
    super(apiUrl, ensureTokenAsyncFn, accessTokenFn);
  }
}
