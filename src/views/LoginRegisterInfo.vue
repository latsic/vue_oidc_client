<template>
  <app-view-layout
    :title="'Register or Login'"
    >
    <div>
      <p class="text-xs-left">
        To get Access to Identity or Api Resources you to need to be logged in.
      </p>
      <p class="text-xs-left">
        You can either <a @click="signIn">Login</a> with an existing account, or you 
        can <router-link :to="{ name: 'register'}">Register</router-link> a new account.
      </p>
    </div>
  </app-view-layout>
</template>

<script>

import ViewLayout from '@/components/layout/ViewLayout';

export default {
  components: {
    'appViewLayout': ViewLayout
  },
  methods: {
    async signIn() {
      await this.$store.dispatch('user/signIn');
    }
  }
}
</script>

<style scoped>
  a:link {
    text-decoration: none;
  }
</style>
