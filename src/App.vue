<template>
  <div id="app">
    <v-app>
    <v-content>
    <v-container pl-0 pr-0>
    <v-layout align-center justify-center>
    <v-flex>
  
    <div id="nav">
           
      <app-navbar
        :userName="$store.getters['auth/userName']"
        :isSignedIn="$store.getters['auth/signedIn']"
        :signIn="signInAsync"
        :signOut="signOutAsync"
        :signInError="$store.getters['auth/signInRedirectError']"
        >
      </app-navbar>
    </div>
    
    <router-view>
      <app-access-token-info
        :userLoginState="$store.getters['auth/userLoginState']"
        :clockSkew="this.$store.getters['settings/clockSkew']"
        @renewToken="signInSilent"
        @requestLoginStateUpdate="updateLoginState"
        slot="tokeninfoIdApi1"
        >
      </app-access-token-info>
      <app-access-token-info
        :userLoginState="$store.getters['auth/userLoginState']"
        :clockSkew="300"
        @renewToken="signInSilent"
        @requestLoginStateUpdate="updateLoginState"
        slot="tokeninfoCommon"
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
  import Navbar from '@/components/navigation/Navbar';
  import AccessTokenInfo from '@/components/common/AccessTokenInfo';
  
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
        await this.$store.dispatch('auth/signIn');
      },
      async signOutAsync() {
        await this.$store.dispatch('auth/signOut');
      },
      updateLoginState() {
        this.$store.dispatch('auth/updateLoginState');
      },
      async signInSilent() {
        try {
          await this.$store.dispatch('auth/signInSilent');
        }
        catch(error) {
          // Nothing to do. Error is repored elsewhere.
        }
      }
    },
    created() {
      this.$store.dispatch('auth/init');
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
