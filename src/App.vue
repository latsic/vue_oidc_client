<template>
  <div id="app">
    <v-app>
    <v-content>
    <v-container pl-0 pr-0>
    <v-layout align-center justify-center>
    <v-flex>
  
    <div id="nav">
           
      <app-navbar
        :userName="$store.getters['user/userName']"
        :isSignedIn="$store.getters['user/signedIn']"
        :signIn="signInAsync"
        :signOut="signOutAsync"
        :signInError="$store.getters['user/signInRedirectError']"
        >
      </app-navbar>
    </div>
    
    <router-view>
      <app-access-token-info
        :userLoginState="$store.getters['user/userLoginState']"
        :requestUpdate="updateLoginState"
        :clockSkew="this.$store.getters['settings/clockSkew']"
        slot="infobar"
        >
      </app-access-token-info>
    </router-view>

    </v-flex>
    </v-layout>
    </v-container>
    </v-content>
    </v-app>
  </div>
</template>

<script>
  import Navbar from '@/components/Navbar';
  import AccessTokenInfo from '@/components/AccessTokenInfo';
  
  export default {
    components: {
      'appNavbar': Navbar,
      'appAccessTokenInfo': AccessTokenInfo
    },
    data() {
      return {
      };
    },
    methods: {
      async signInAsync() {
        await this.$store.dispatch('user/signIn');
      },
      async signOutAsync() {
        await this.$store.dispatch('user/signOut');
      },
      updateLoginState() {
        this.$store.dispatch('user/updateLoginState');
      }
    },
    created() {
      this.$store.dispatch('user/init');
      this.$store.dispatch('settings/init')
    }
  };
</script>


<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    
    /* margin-top: 60px; */
  }
  html {
    overflow-y: auto;
  }
  
</style>
