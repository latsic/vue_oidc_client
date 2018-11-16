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
      <p class="text-xs-left">
        An access token can expire, <router-link :to="'settings'">here
        </router-link> it can be configured how such cases are handled.
      </p>
    </div>

    <app-view-spacer marginBottom="0.5rem"></app-view-spacer>

    <slot name="tokeninfoIdApi1" />

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
import ApiElem from '@/components/idApi1/ApiElem';
import ViewLayout from '@/components/layout/ViewLayout';
import ViewSpacer from '@/components/layout/ViewSpacer';
// import RenewActionIcon from '@/components/common/RenewActionIcon';

export default {
  components: {
    'appApiElem': ApiElem,
    'appViewLayout': ViewLayout,
    'appViewSpacer': ViewSpacer,
    // 'appRenewActionItem': RenewActionIcon
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
        { name: 'EverybodyWithAToken', desc: 'Token with claim ApiAccess=IdApi1' },
        { name: 'AgeAtLeast16', desc: 'Token with claims age >= 16 claim and ApiAccess=IdApi1' },
        { name: 'AgeAtLeast18', desc: 'Token with claims age >= 18 claim and ApiAccess=IdApi1' },
        { name: 'AgeAtLeast21', desc: 'Token with age >= 21 claim and ApiAccess=IdApi1' },
        { name: 'AdminRole', desc: 'Token with role claim = Admin and ApiAccess=IdApi1' },
        { name: 'AdminRoleAgeAtLeast21', desc: 'Token with age >= 21 and role = Admin claims and ApiAccess=IdApi1' },
        { name: 'UserNumberAtLeast20', desc: 'Token with UserNumber >= 20 claim and ApiAccess=IdApi1' },
        { name: 'UserNumberAtLeast20AgeAtLeast18', desc: 'Token with UserNumber >= 20 and age >= 18 claim and ApiAccess=IdApi1' }
      ],
      testApi: new TestApi(
        Paths.testApi,
        () => this.$store.dispatch('auth/signInSilentIfAsync'),
        () => this.$store.getters['auth/accessToken']),
      idApiSwaggerUrl: Paths.swaggerIdApi1
    }
  },
  computed: {
    silentSignInOngoing() {
      return this.$store.getters['auth/userLoginState'].silentSignInOngoing;
    },
    expired() {
      return this.$store.getters['auth/userLoginState'].accessTokenExpired;
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
    }
  }
}
</script>

<style scoped>
  a:link {
    text-decoration: none;
  }
</style>
