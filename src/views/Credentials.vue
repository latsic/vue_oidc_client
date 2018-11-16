<template>
  <app-view-layout
    :title="'Credentials'"
    >
   
    <div>
      <text-line :title="'Username'" :value="userName"></text-line>       
      <text-line
        v-for="otherAttribute of otherAttributes"
        :key="otherAttribute.name"
        :title="otherAttribute.name"
        :value="otherAttribute.value"
        >
      </text-line>       
    </div>

    <div v-if="loginAt">
      <app-view-spacer></app-view-spacer>
      <text-line :title="'Login at'" :value="loginAt"></text-line>
    </div>

    <div v-if="hasAccessToken">
      <app-view-spacer></app-view-spacer>
      <text-line :title="'Latest access token issued at'" :value="accessTokenIssuedAt"></text-line>
      <text-line
        :title="`Access token expire${accessTokenExpiresInSeconds > 0 ? 's' : 'd' } at`"
        :value="accessTokenExpiresAt"
        >
      </text-line>
      <text-line
        :title="`Access token expire notification time`"
        :value="accessTokenExpireNotificationTime + ' [s]'"
        >
      </text-line>
      <div>
      
      <div :style="{position: 'relative'}">
        <div
          v-if="!showError"
          :key="'noError'"
          >
          <text-line
            v-if="accessTokenExpiresInSeconds >= 0"
            :title="'Access token expires in'"
            :value="accessTokenExpiresInSeconds + ' [s]'"
            >
            Access token expires in: {{ accessTokenExpiresInSeconds }} seconds
          </text-line>
          <text-line
            v-else
            :title="'Access token expired since'"
            :value="accessTokenExpiresInSeconds + ' [s]'"
            :style="{color: $vuetify.theme.secondary}"
            >
          </text-line>
        </div>
        <div
          v-else
          :key="'error'"
          >
          <transition  name="renew-error" appear v-on:after-enter="afterEnter"> 
            <div 
              :key="'error'"
              >
              <text-line
                :title="'Error renewing access token'"
                :value="silentSignInError && silentSignInError.message ? silentSignInError.message : ''"
                :style="{color: $vuetify.theme.error}"
                >
              </text-line>
            </div>
          </transition>
        </div>
        
        <div 
          :style="{position: 'absolute', top: '50%', left: '95%' }"
          >
          <app-renew-action-icon
            :renewing="silentSignInOngoing"
            :expired="accessTokenExpiresInSeconds < 0"
            @click="renewToken"
            >
          </app-renew-action-icon>
        </div>
      </div>
      
      
      </div>
      <!-- <text-line :title="'Clock skew'" :value="clockSkew + ' [s]'"></text-line> -->
    </div>

    <div>
      <app-view-spacer></app-view-spacer>
      <text-line :title="'All claims inside Id token'" :hideIfNoValue="false"></text-line>
      <pre class="textprops text-xs-left">{{ idTokenClaims }}</pre>
    </div>
    <div>
      <app-view-spacer></app-view-spacer>
      <text-line :title="'Other available info'" :hideIfNoValue="false"></text-line>
      <pre class="textprops text-xs-left">{{ userInfo }}</pre>
    </div>
   
  </app-view-layout>
</template>

<script>
  
import ViewLayout from '@/components/layout/ViewLayout';
import ViewSpacer from '@/components/layout/ViewSpacer';
import Spinner from '@/components/common/Spinner';
import RenewActionIcon from '@/components/common/RenewActionIcon';
import { OidcClientConfig } from '@/configuration/OidcClientConfig';

const TextLine = {
  props: {
    title:{type: String, default: ''},
    value:{type: String | Number, default: ''},
    hideIfNoValue:{type: Boolean, default: true},
    clicked:{type: Function, default: () => {}}
  },
  render() {
    if(!this.value && this.hideIfNoValue) return null;
    return (
      <p onClick={this.clicked} class="text-xs-left textprops mb-0">{this.title}: {this.value}</p>
    );
  } 
};

export default {  

  components: {
    'appViewLayout': ViewLayout,
    'appViewSpacer': ViewSpacer,
    'textLine': TextLine,
    'appSpinner': Spinner,
    'appRenewActionIcon': RenewActionIcon
  },
  data() {
    return {
      //userManager: UserManager.instance,
      credentials: '',
      idTokenClaims: '',
      userInfo: '',
      intervalFunc: null,
      userName: null,
      email: null,
      otherAttributes: [],
      // clockSkew : null,
      accessTokenIssuedAt: '',
      accessTokenExpiresAt: '',
      accessTokenExpiresInSeconds: null,
      hasAccessToken: false,
      loginAt: '',
      iconName: 'refresh',
      renewing: false,
      showError: false
    }
  },
  computed: {
    user() {
      return this.$store.getters['auth/oidcUser'];
    },
    silentSignInOngoing() {
      return this.$store.getters['auth/userLoginState'].silentSignInOngoing;
    },
    silentSignInError() {
      return this.$store.getters['auth/userLoginState'].silentSignInError;
    },
    accessTokenExpireNotificationTime() {
      return OidcClientConfig.accessTokenExpiringNotificationTime;
    },
  },
  watch: {
    user() {
      this.init();
    },
    silentSignInError(newVal) {
      if(newVal != null) {
        this.showError = true;
      }
      else {
        this.showError = false;
      }
    }
  },
  methods: {
    async renewToken() {
      try {
        await this.$store.dispatch('auth/signInSilent');
        this.init();
      }
      catch(error) {
        // Nothing to do. Error is repored elsewhere.
      }
    },
    setIdTokenClaims(user) {
      this.idTokenClaims = '';
      if(!user || ! user.profile) return;

      const userProfile = { ...user.profile };
      this.idTokenClaims = JSON.stringify(userProfile, null, 2);
    },
    convertToLocalDateString(timeInSeconds) {
      const d = new Date(0);
      d.setSeconds(timeInSeconds);
      return d.toLocaleString();
    },
    setUserInfo(user) {
      this.userInfo = '';
      if(!user) return;
      
      if(user.profile) {
        this.loginAt = this.convertToLocalDateString(user.profile.auth_time);
      }
      if(user.access_token) {
        this.hasAccessToken = true;
      }
      this.accessTokenExpiresAt = this.convertToLocalDateString(user.expires_at);
      
      const issuedAtInSeconds = this.$store.getters['auth/accessTokenIssueTime'];
      if(issuedAtInSeconds) {
        this.accessTokenIssuedAt = this.convertToLocalDateString(issuedAtInSeconds)
      }

      const userNoProfile = { ...user };
      delete userNoProfile.profile;
      this.userInfo = JSON.stringify(userNoProfile, null, 2);
    },
    init() {
      
      // this.clockSkew = this.$store.getters['settings/clockSkew'];
      this.setIdTokenClaims(this.user);
      this.setUserInfo(this.user);

      if(!this.$store.getters['auth/signedIn']) {
        return;
      }
      this.userName = this.$store.getters['auth/userName'];
      
      this.otherAttributes = [];
      const attributeNames = ['email', 'role', 'birthdate', 'UserNumber'];
      attributeNames.forEach(name => {
        const value = this.$store.getters['auth/userAttribute'](name);
        if(value) this.otherAttributes.push({name, value});
      });

      const updateLoginState = () => {
        this.$store.dispatch('auth/updateLoginState');
        this.accessTokenExpiresInSeconds = this.$store.getters['auth/accessTokenExpiresInSeconds'];
      }

      if(this.intervalFunc) clearInterval(this.intervalFunc);
      updateLoginState();
      this.intervalFunc = setInterval(updateLoginState, 1000); 
    },
    afterEnter() {
      this.showError = false;
    }
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    if(this.intervalFunc) clearInterval(this.intervalFunc);
    this.intervalFunc = null;
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

  .renew-error-enter {
    opacity: 1;
  }
  .renew-error-enter-to {
    opacity: 0.0;
  }
  .renew-error-enter-active {
    transition: opacity 4s ease-in;
  }
  .renew-error-leave,
  .renew-error-leave-active {
    transition: opacity 0s;
    opacity: 0;
  }
</style>
