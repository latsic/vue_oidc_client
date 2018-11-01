<template>
  <v-layout align-center justify-center>
  <v-flex xs11 sm8 md6>
  <h3 class="text-xs-left">What does this application do?</h3>
  <div :style="{'border-top': '1px solid black', 'padding-top': '1rem'}">
    <p class="text-xs-left">
      A <a href="https://vuejs.org/">Vue</a> SPA client using 
      <a href="https://de.wikipedia.org/wiki/OpenID_Connect">OpenId Connect</a> to get access
      to <router-link :to="'credentials'">Identity</router-link> (authentication) and 
      <router-link :to="'idapi1'">API resources</router-link> (authorization). It uses
      the <a href="https://github.com/IdentityModel/oidc-client-js">oidc-client</a>
      javascript library.
    </p>
    <p class="text-xs-left">
      One backend this app talks to is an <a :href="idServerUrl">authorization server</a> implemented with <a href="https://en.wikipedia.org/wiki/ASP.NET_Core">
      Asp.net Core</a> and <a href="http://docs.identityserver.io">Identity Server 4</a>.
    </p>

    <p class="text-xs-left">
      The technologies mentioned above enable, among others, features like 
      <a href="https://en.wikipedia.org/wiki/Single_sign-on">Single Sign-On (SSO)</a>, 
      login with external providers and <a href="https://en.wikipedia.org/wiki/Access_token">
      Access Control for APIs</a>.
    </p>

    <p class="text-xs-left">
      The purpose of this app is to learn about the involved technologies. There is also
      a <a :href="idApiSwaggerUrl">webapi</a> running which provides endpoints to test
      access to api resources. These endpoints require various kinds of
      <a href="https://en.wikipedia.org/wiki/Claims-based_identity">authorization</a>. For
      example the age of a user or the role of a user. If you are logged in, you can try it
      out <router-link :to="{name: 'idapi1'}">here</router-link>.
    </p>
    <v-layout
      align-center row py-3 :style="{'border-top': '1px solid black', 'border-bottom': '1px solid black'}">
      <v-card flat
        color="#00000000"
        width="50%"
        max-width="50%"
        max-height="150px"
        height="150px"
        href="https://openid.net/connect/"
        >
        <v-img :src="require('@/assets/OpenID_logo.svg')" contain height="150px" max-height="150px"></v-img>
      </v-card>
      <v-card flat
        color="#00000000"
        width="50%"
        max-width="50%"
        max-height="150px"
        height="150px"
        href="https://oauth.net/2/"
        >
        <v-img :src="require('@/assets/Oauth_logo.svg')" contain height="150px" max-height="150px"></v-img>
      </v-card>

    </v-layout>
    
  </div>
  </v-flex>
  </v-layout>
</template>

<script>

export default {
  data() {
    return {
      idServerUrl: process.env.VUE_APP_IDSERVER_URL_BASE,
      idApiSwaggerUrl: process.env.VUE_APP_IDAPI1_URL_SWAGGER
    }
  }
}
</script>

<style scoped>
  a:link {
    text-decoration: none;
  }
  .image {
    width: 28px;
    height: 28px;
    margin-right: 10px;
  }
</style>

