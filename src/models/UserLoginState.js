
export class UserLoginState {
  
  userName = '';
  signedIn = false;
  silentSignInOngoing = false;
  silentSignInError = null;
  accessTokenExpiring = false;
  accessTokenExpired = false;
  accessTokenIssueTime = null;
  accessTokenExpiresInSeconds = null;
}