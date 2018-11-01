<template>
  <div id="app">
    <v-app>
    <v-content>
    <v-container pl-0 pr-0>
    <v-layout align-center justify-center>
    <v-flex>
  
    <div id="nav">
           
      <app-navbar
        :userName="userName"
        :isSignedIn="signedIn"
        :signIn="signin"
        :signOut="signout"
        >
      </app-navbar>
    </div>
    
    <router-view>
      <div
        slot="infobar"
        :style="{margin: '0', padding: '0'}"
        >
        <p
          v-if="silentSignInOngoing"
          :style="{
            'z-index': 1000,
            margin: '0', padding: '0',
            color: $vuetify.theme.primary}"
          >
          Getting new Access Token from {{ idServerUrl }}
        </p>
      </div>
    </router-view>

    </v-flex>
    </v-layout>
    </v-container>
    </v-content>
    </v-app>
  </div>
</template>

<script>
  import { UserManager } from "@/backend/idserver/UserManager";
  import Navbar from '@/components/Navbar';

  export default {
    components: {
      'appNavbar': Navbar
    },
    data() {
      return {
        signedIn: false,
        userManager: UserManager.instance,
        userName: "",
        silentSignInOngoing: false,
        idServerUrl: process.env.VUE_APP_IDSERVER_URL_BASE
      };
    },
    methods: {
      signin() {
        this.userManager.signin();
      },
      signout() {
        this.signedIn = false;
        this.userManager.signout();
      },
      updateUserState() {
        this.userManager.getSignedInUserAsync().then(user => {
          this.signedIn = this.userManager.isUserSignedIn(user);
          if (!this.signedIn) return;

          this.userName = this.userManager.getUserName(user);
          if (!this.userName) this.userManager.getUserEmail(user);
        });
      },
      accessTokenExpired() {
        // eslint-disable-next-line no-console
        console.log("[App.vue][accessTokenExpired]");
      },
      accessTokenExpiring() {
        // eslint-disable-next-line no-console
        console.log("[App.vue][accessTokenExpiring]");
      },
      userLoaded() {
        // eslint-disable-next-line no-console
        console.log("[App.vue][userLoaded]");
        this.updateUserState();
      },
      userSignedOut() {
        // eslint-disable-next-line no-console
        console.log("[App.vue][userSignedOut]");
        this.updateUserState();
      },
      signInSilent() {
        // eslint-disable-next-line no-console
        console.log("[App.vue][signInSlient]");
        this.silentSignInOngoing = true;
      },
      signedInSlient(user) {
        // eslint-disable-next-line no-console
        console.log("[App.vue][signedInSlient][user]", user);
        this.silentSignInOngoing = false;
      }
    },
    created() {
      this.userManager.setAccessTokenExpiredCb(this.accessTokenExpired);
      this.userManager.setAcessTokenExpiringCb(this.accessTokenExpiring);
      this.userManager.setAddUserSignedOutCb(this.userSignedOut);
      this.userManager.setUserLoadedCb(this.userLoaded);
      this.userManager.setSignedInSilentCb(this.signedInSlient);
      this.userManager.setSignInSilentCb(this.signInSilent);
      this.updateUserState();
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
html { overflow-y: auto; }
</style>
