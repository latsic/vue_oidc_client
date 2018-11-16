<template>

  <div class="text-xs-left" :style="{position: 'relative'}">
    
    <div :style="{margin: '0', padding: '0'}">
      <p :style="{color: values.color, margin: '0', padding: '0'}">
        {{ values.msg }}
      </p>
    </div> 
      
    <div 
      :style="{position: 'absolute', top: '50%', left: '95%' }"
      >
      <app-renew-action-icon
        :renewing="userLoginState.silentSignInOngoing"
        :expired="userLoginState.accessTokenExpired"
        @click="$emit('renewToken')"
        >
      </app-renew-action-icon>
    </div>

  </div>

</template>

<script>

import { Paths } from '@/configuration/Paths';
import RenewActionIcon from '@/components/common/RenewActionIcon';

export default {
  components: {
    'appRenewActionIcon': RenewActionIcon
  },
  props: {
    userLoginState: {
      type: Object,
      required: true
    },
    clockSkew: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      intervalFn: null,
      clockSkewExpired: false,
    }
  },
  computed: {
    messageSignInSilentError() {
      const appendToMessage =
        this.userLoginState.error && this.userLoginState.error.message
          ? ': ' + this.userLoginState.error.message
          : '';
      return `Failed to renew user credentials${appendToMessage}`;
    },
    values() {
      if(this.userLoginState.silentSignInError) {
        return {
          color: this.$vuetify.theme.error,
          msg: this.messageSignInSilentError
        };
      }
      if(this.userLoginState.silentSignInOngoing) {
        return {
          color: this.$vuetify.theme.primary,
          msg: `Renewing user credentials via ${Paths.idServer}`
        };
      }
      if(this.userLoginState.accessTokenExpired) {

        const obj = {
          color: this.$vuetify.theme.error,
          msg: 'Access token expired'
        };

        if(this.clockSkewTimeLeft > 0) {
          obj.color = this.$vuetify.theme.warning,
          obj.msg += `, ${this.clockSkewTimeLeft}″ of clock skew time left`
        }

        return obj;
      }
      if(this.userLoginState.accessTokenExpiring) {
        return {
          color: this.$vuetify.theme.secondary,
          msg: `Access token expires in ${this.userLoginState.accessTokenExpiresInSeconds}″`
        }
      }
      return {
        color: this.$vuetify.theme.success,
        msg: 'Access token valid'
      };
    },
    acessTokenExpired() {
      return this.userLoginState.accessTokenExpired;
    },
    accessTokenExpiring() {
      return this.userLoginState.accessTokenExpiring;
    },
    clockSkewTimeLeft() {
      return this.clockSkew + this.userLoginState.accessTokenExpiresInSeconds;
    }
  },
  watch: {
    acessTokenExpired(isExpired) {
      this.handleExpiredOrExpiring(isExpired);
    },
    accessTokenExpiring(isExpiring) {
      this.handleExpiredOrExpiring(isExpiring);
    }
  },
  methods: {
    handleExpiredOrExpiring(
      startInterval = this.acessTokenExpired || this.accessTokenExpiring) {
      
      this.clearInterval();
      if(!startInterval) return;

      this.intervalFn = setInterval(() => {
        if(this.clockSkewTimeLeft < 0) {
          this.clearInterval();
        }
        this.$emit('requestLoginStateUpdate');
      }, 1000);
    },
    clearInterval() {
      if(this.intervalFn) {
        clearInterval(this.intervalFn);
        this.intervalFn = null;
      }
    }
  },
  created() {
    this.handleExpiredOrExpiring();
  }
};
</script>

<style scoped>
</style>
