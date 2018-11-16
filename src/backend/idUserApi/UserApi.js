import { CommonApi } from '@/backend/CommonApi';
import { BasicUser } from '@/models/BasicUser';
import { Claim } from '@/models/Claim';

export class UserApi extends CommonApi {

  constructor(apiUrl, ensureTokenAsyncFn, accessTokenFn = null) {
    super(apiUrl, ensureTokenAsyncFn, accessTokenFn);
  }

  async users() {
    const users = await this.get('users');
    return users.map(user => new BasicUser(user.userId, user.userName));
  }

  async claims(userId) {
    const claims = await this.getWithParams('claims', userId);
    return claims.map(claim => new Claim(claim.id, claim.type, claim.value));
  }

  async claimDelete(userId, claim) {
    await this.deleteWithParams('claim', `${userId}/${claim.type}/${claim.value}`);
  }

  async claimUpdate(userId, claim) {
    await this.putWithParams('claim', `${userId}/${claim.id}/${claim.type}/${claim.value}`);
  }

  async claimAdd(userId, claim) {
    const claimId = (await this.postWithParams('claim', `${userId}/${claim.type}/${claim.value}`)).id;
    return new Claim(claimId, claim.type, claim.value);
  }
}
