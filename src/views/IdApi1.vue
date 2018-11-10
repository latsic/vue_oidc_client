<template>
  <app-view-layout
    :title="'What can be done here?'"
    >
    <div> 
      <p class="text-xs-left">
        This page provides access to some <a :href="idApiSwaggerUrl">API endpoints</a>.
        Those endpoints require various kinds of authorization. If a user
        has access to an endpoint depends on the claims of a user
        and how the endpoint is secured. The endpoint can check the claims
        of the user by inspecting the access token (if any).
      </p>
    </div>

    <app-view-spacer marginBottom="0.5rem"></app-view-spacer>

    <div class="text-xs-left" :style="{position: 'relative'}">
      <slot name="infobar" />
        
      <div 
          :style="{position: 'absolute', top: '50%', left: '95%' }"
          >
          <app-renew-action-item
            :renewing="silentSignInOngoing"
            :expired="expired"
            :clicked="renewToken"
            >
          </app-renew-action-item>
        </div>
    </div>

    <app-view-spacer marginTop="0.5rem"></app-view-spacer>

    <app-api-elem
      v-for="actionInfo of actionInfos"
      :actionInfo="actionInfo"
      :apiAccess="testApi"
      :key="actionInfo.name"
      >
    </app-api-elem>
   
  </app-view-layout>
</template>

<script>

import { TestApi } from '@/backend/IdApi1/TestApi';
import { Paths } from '@/configuration/Paths'
import ApiElem from '@/components/ApiElem';
import ViewLayout from '@/components/layout/ViewLayout';
import ViewSpacer from '@/components/layout/ViewSpacer';
import RenewActionIcon from '@/components/common/RenewActionIcon';

export default {
  components: {
    'appApiElem': ApiElem,
    'appViewLayout': ViewLayout,
    'appViewSpacer': ViewSpacer,
    'appRenewActionItem': RenewActionIcon
  },
  props: {
    tokenInfo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      actionInfos: [
        { name: 'Everybody', desc: 'No token needed' },
        { name: 'EverybodyWithAToken', desc: 'Token, but no claims needed' },
        { name: 'AgeAtLeast16', desc: 'Token with age >= 16 claim' },
        { name: 'AgeAtLeast18', desc: 'Token with age >= 18 claim' },
        { name: 'AgeAtLeast21', desc: 'Token with age >= 21 claim' },
        { name: 'AdminRole', desc: 'Token with role = Admin claim' },
        { name: 'AdminRoleAgeAtLeast21', desc: 'Token with age >= 21 and role = Admin claims' },
        { name: 'UserNumberAtLeast20', desc: 'Token with UserNumber >= 20 claim' },
        { name: 'UserNumberAtLeast20AgeAtLeast18', desc: 'Token with UserNumber >= 20 and age >= 18 claim' }
      ],
      testApi: new TestApi(
        Paths.testApi,
        () => this.$store.dispatch('user/signInSilentIfAsync'),
        () => this.$store.getters['user/accessToken']),
      idApiSwaggerUrl: Paths.swagger
    }
  },
  computed: {
    silentSignInOngoing() {
      return this.$store.getters['user/userLoginState'].silentSignInOngoing;
    },
    expired() {
      return this.$store.getters['user/userLoginState'].accessTokenExpired;
    }
  },
  methods: {
    async renewToken() {
      try {
        await this.$store.dispatch('user/signInSilent');
        this.init();
      }
      catch(error) {
        // Nothing to do. Error is repored elsewhere.
      }
    }
  }
}
</script>

<style scoped>
  a:link {
    text-decoration: none;
  }
</style>
