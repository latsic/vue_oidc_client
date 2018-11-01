<template>
  <v-layout align-center justify-center>
  <v-flex xs12 sm10 md8 lg6>
  <div :style="{'margin-left': '1rem'}">
    <br>
    <div>
      <p class="text-xs-left textprops mb-0">Username: {{ userName ? userName : 'unknown' }}</p>
      <p class="text-xs-left textprops mb-0">Email: {{ email ? email : 'unknown' }}</p>
      <p class="text-xs-left textprops mb-0"
        v-for="otherAttribute of otherAttributes"
        :key="otherAttribute.name"
        >
        {{ otherAttribute.name }}: {{ otherAttribute.value }}
      </p>
    </div>
    <div class="spacer">
      <p class="text-xs-left textprops mb-0">Login At: {{ loginAt }}</p>
      <p class="text-xs-left textprops mb-0">Access Token Expires in: {{ accessTokenExpiresInSeconds }} seconds</p>
      <p class="text-xs-left textprops mb-0">Clock Skew: {{ clockSkew  }} seconds</p>
    </div>
    <div class="spacer">
      <p class="text-xs-left textprops mb-0">All claims inside Id token:</p>
      <pre class="textprops text-xs-left">{{ idTokenClaims }}</pre>
    </div>
    <div class="spacer">
      <p class="text-xs-left textprops mb-0">Other available info:</p>
      <pre class="textprops text-xs-left">{{ userInfo }}</pre>
    </div>
  </div>
  </v-flex>
  </v-layout>
</template>

<script>
  
import { UserManager } from '@/backend/idserver/UserManager'

export default {
  data() {
    return {
      userManager: UserManager.instance,
      credentials: '',
      idTokenClaims: '',
      userInfo: '',
      intervalFunc: null,
      userName: null,
      email: null,
      otherAttributes: [],
      clockSkew : null,
      loginAt: '',
      accessTokenExpiresInSeconds: null
    }
  },
  methods: {

    setIdTokenClaims(user) {
      this.idTokenClaims = '';
      if(!user || ! user.profile) return;

      const d = new Date(Date.UTC(1970, 0, 1, 0, 0, 0, 0));
      d.setSeconds(user.profile.auth_time);

      const userProfile = {
        ...user.profile,
        auth_time: d.toLocaleString()
      }

      this.idTokenClaims = JSON.stringify(userProfile, null, 2);
    },

    setUserInfo(user) {
      this.userInfo = '';
      if(!user) return;
      
      const d = new Date(Date.UTC(1970, 0, 1, 0, 0, 0, 0));
      d.setSeconds(user.expires_at);

      const userNoProfile = {
        ...user,
        expires_at: d.toLocaleString()
      };
      delete userNoProfile.profile;
      this.userInfo = JSON.stringify(userNoProfile, null, 2);

      this.loginAt = d.toLocaleString();
    },
  },
  created() {

    this.userManager.getSignedInUserAsync()
    .then(user => {
      
      this.clockSkew = this.userManager.getClockSkew();
      this.setIdTokenClaims(user);
      this.setUserInfo(user);

      if(!this.userManager.isUserSignedIn(user)) {
        return;
      }
      this.userName = this.userManager.getUserName(user);
      this.email = this.userManager.getUserEmail(user);

      const attributeName = ['role', 'birthdate', 'UserNumber'];
      attributeName.forEach(name => {
        const value = this.userManager.getAttribute(user, name);
        if(value) this.otherAttributes.push({name, value});
      });

      this.accessTokenExpiresInSeconds = this.userManager.getAccessTokenExpiresInSeconds(user);
       this.intervalFunc = setInterval(() => {
        this.accessTokenExpiresInSeconds = this.userManager.getAccessTokenExpiresInSeconds(user)
      }, 5000);
    });
  },
  beforeDestroy() {
    if(this.intervalFunc) clearInterval(this.intervalFunc);
  }

}
</script>

<style scoped>
  .textprops {
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: 'left';
  }
  .spacer {
    border-top: 1px solid black;
    padding-top: 1rem;
    margin-top: 1rem;
    margin-right: 1rem;
  }
</style>
