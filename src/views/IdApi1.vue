<template>
  <v-layout align-center justify-center>
  <v-flex xs11 sm8 md7 lg6>
    
    <h3 class="text-xs-left">What can be done here?</h3>
    <div :style="{
      'border-top': '1px solid black',
      'border-bottom': '1px solid black',
      'padding-top': '1rem'
      }"> 
      <p class="text-xs-left">
        This page provides access to some <a :href="idApiSwaggerUrl">API endpoints</a>.
        Those enpoints require various kinds of authorization. If a user
        has access to an endpoint depends on the claims of a user
        and how the endpoint is secured. The endpoint can check the claims
        of the user by inspecting the access token (if any).
      </p>
    </div>

    <div
      :style="{'min-height': '2rem'}"
      >
      <slot name="infobar" />
    </div>

    <app-api-elem
      v-for="actionInfo of actionInfos"
      :actionInfo="actionInfo"
      :apiAccess="testApi"
      :key="actionInfo.name"
      >
    </app-api-elem>
   
  </v-flex>
  </v-layout>
</template>

<script>

import { TestApi } from '@/backend/IdApi1/TestApi';
import ApiElem from '@/components/ApiElem';

export default {
  components: {
    'appApiElem': ApiElem,
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
      testApi: new TestApi(process.env.VUE_APP_IDAPI1_URL_TESTAPI),
      idApiSwaggerUrl: process.env.VUE_APP_IDAPI1_URL_SWAGGER
    }
  }
}
</script>

<style scoped>
  a:link {
    text-decoration: none;
  }
</style>
