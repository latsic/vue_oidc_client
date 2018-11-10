<template>
  <div :style="{margin: '0', padding: '0'}">
    <p :style="{color: values.color, margin: '0', padding: '0'}">
      {{ values.msg }}
    </p>
  </div>  
</template>

<script>

import { Paths } from '@/configuration/Paths';

export default {
  props: {
    userLoginState: {
      type: Object,
      required: true
    },
    requestUpdate: {
      type: Function,
      default: () => {}
    },
    clockSkew: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      intervalFn: null,
      expiredMessageAppend: '',
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
        return {
          color: this.clockSkewExpired ? this.$vuetify.theme.error : this.$vuetify.theme.warning,
          msg: this.expiredMessage
        };
      }
      return {
        color: this.$vuetify.theme.success,
        msg: 'Access token valid'
      };
    },
    acessTokenExpired() {
      return this.userLoginState.accessTokenExpired;
    },
    expiredMessage() {
      return 'Access token expired' + this.expiredMessageAppend;
    }
  },
  watch: {
    acessTokenExpired(newVal) {
      this.handleExpired(newVal);
    }
  },
  methods: {
    handleExpired(expired = this.acessTokenExpired) {
      
      this.expiredMessageAppend = '';
      
      if(expired) {
        
        this.intervalFn = setInterval(() => {

          this.requestUpdate();
          const clockSkewTimeLeft = this.clockSkew + this.userLoginState.accessTokenExpiresInSeconds;

          if(clockSkewTimeLeft > 0) {
            this.expiredMessageAppend = `, clock skew time left: ${clockSkewTimeLeft} [s]`;
          }
          else {
            clearInterval(this.intervalFn);
            this.intervalFn = null;
            this.clockSkewExpired = true;
            this.expiredMessageAppend = '';
          }

        }, 1000)
      }
      else if(this.intervalFn) {
        clearInterval(this.intervalFn);
        this.intervalFn = null;
        this.clockSkewExpired = false;
      }
    }
  },
  created() {
    this.handleExpired();
  }
};
</script>
<style scoped>
</style>
