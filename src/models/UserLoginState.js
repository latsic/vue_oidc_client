
export class UserLoginState {
  
  userName = '';
  signedIn = false;
  silentSignInOngoing = false;
  silentSignInError = null;
  accessTokenExpiring = null;
  accessTokenExpired = false;
  accessTokenIssueTime = null;
  accessTokenExpiresInSeconds = null;
}