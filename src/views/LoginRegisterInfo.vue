<template>
  <v-layout align-center justify-center>
  <v-flex xs12 sm10 md8 lg6>
  <div>
    <p class="text-xs-left">
      To get Access to Identity or Api Resources you to need to be logged in.
    </p>
    <p class="text-xs-left">
      You can either <a @click="signIn">Login</a> with an existing account, or you 
      can <router-link :to="{ name: 'register'}">Register</router-link> a new account.
    </p>
  </div>
  </v-flex>
  </v-layout>
</template>

<script>

import { UserManager } from '@/backend/idserver/UserManager';

export default {
  methods: {
    signIn() {
      UserManager.instance.signin();
    }
  }
}
</script>

<style scoped>
  div {
    margin: 3rem;
  }
  a:link {
    text-decoration: none;
  }
</style>
