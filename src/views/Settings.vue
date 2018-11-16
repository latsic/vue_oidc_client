<template>
  <app-view-layout
    :title="'Settings'"
    >
    
    <slot name="tokeninfoCommon" />

    <app-view-spacer :marginTop="'2rem'" :showLine="true"></app-view-spacer>

    <app-refresh-strategy
      :value="$store.getters['settings/refreshStrategy']"
      @change="(value) => $store.dispatch('settings/setRefreshStrategy', value)"
      >
    </app-refresh-strategy>

    <app-view-spacer></app-view-spacer>

    <app-access-token-lift-time
      :value="$store.getters['settings/accessTokenLifeTime']"
      :error="$store.getters['settings/accessTokenLifeTimeError']"
      @change="accessTokenLifeTimeChanged"
      >
    </app-access-token-lift-time>
    
    <app-view-spacer></app-view-spacer>

    <app-claims
      :initialized="$store.getters['claims/initialized']"
      :users="$store.getters['claims/users']"
      :currentUserId="$store.getters['claims/currentUserId']"
      @userChanged="(userId) => $store.dispatch('claims/setCurrentUserId', userId)"

      :claims="$store.getters['claims/claims']"
      :currentClaim="$store.getters['claims/currentClaim']"
      @claimChanged="claim => $store.commit('claims/setCurrentClaim', claim)"
      
      @claimDelete="$store.dispatch('claims/currentClaimDelete')"
      @claimAdd="$store.dispatch('claims/currentClaimAdd')"
      @claimUpdate="$store.dispatch('claims/currentClaimUpdate')"

      :loadingUsers="$store.getters['claims/loadingUsers']"
      :loadingClaims="$store.getters['claims/loadingClaims']"
      :claimChangeOngoing="$store.getters['claims/changingClaim']"

      :usersError="$store.getters['claims/usersError']"
      :claimsError="$store.getters['claims/claimsError']"
      :changeError="$store.getters['claims/changeError']"
      >
    </app-claims>

    <app-view-spacer :marginBottom="'2rem'" :showLine="false"></app-view-spacer>

    <app-view-title :title="'Settings IdApi1'"></app-view-title>
    
    <slot name="tokeninfoIdApi1" />
    <app-view-spacer :marginTop="'2rem'" :showLine="true"></app-view-spacer>
    <app-clock-skew
      :value="$store.getters['settings/clockSkew']"
      :error="this.$store.getters['settings/clockSkewError']"
      @change="clockSkewChanged"
      >
    </app-clock-skew>

    <app-view-spacer></app-view-spacer>

  </app-view-layout>
</template>

<script>

import ViewLayout from '@/components/layout/ViewLayout';
import ViewSpacer from '@/components/layout/ViewSpacer';
import ViewTitle from '@/components/layout/ViewTitle';
import ClockSkew from '@/components/settings/ClockSkew';
import AccessTokenLifeTime from '@/components/settings/AccessTokenLifeTime';
import RefreshStrategy from '@/components/settings/RefreshStrategy';
import Claims from '@/components/user/Claims';

export default {
  components: {
    'appViewLayout': ViewLayout,
    'appViewSpacer': ViewSpacer,
    'appViewTitle': ViewTitle,
    'appClockSkew': ClockSkew,
    'appAccessTokenLiftTime': AccessTokenLifeTime,
    'appRefreshStrategy': RefreshStrategy,
    'appClaims': Claims
  },
  data() {
    return {
      refreshStrategy: null
    }
  },
  computed: {
   
  },
  watch: {
   
  },
  methods: {
    async clockSkewChanged(clockSkew) {
      await this.$store.dispatch('settings/setClockSkew', {
          timeSpan: clockSkew,
          resetErrorTimeMs: 3000
        });
    },
    async accessTokenLifeTimeChanged(accessTokenLifeTime) {
      await this.$store.dispatch('settings/setAccessTokenLifeTime', {
        accessTokenLifeTime,
        resetErrorTimeMs: 3000
      });
    }
  },
  created() {
    // this.refreshStrategy = this.refreshStrategyStore;
    this.$store.dispatch('claims/init');
  }
}
</script>

<style scoped>

</style>
