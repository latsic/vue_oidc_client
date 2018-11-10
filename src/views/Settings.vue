<template>
  <app-view-layout
    :title="'Settings'"
    >
    <app-view-spacer :marginTop="'2rem'" :showLine="false"></app-view-spacer>
    <div>
      <p class="text-xs-left" :style="{'margin-bottom': '0'}">{{ "Access token refresh strategy" }}</p>
      <!-- <app-view-spacer :marginTop="'0'"></app-view-spacer> -->
      <v-radio-group v-model="refreshStrategy" :mandatory="false">
        <v-radio label="On demand only" :value="refreshStrategies.onDemandOnly"></v-radio>
        <v-radio label="On expiring" :value="refreshStrategies.onExpiring"></v-radio>
        <v-radio label="On expired" :value="refreshStrategies.onExpired"></v-radio>
        <v-radio label="Manual only" :value="refreshStrategies.manualOnly"></v-radio>
      </v-radio-group>
    </div>
    <app-view-spacer :marginBottom="'3rem'"></app-view-spacer>
    <p class="text-xs-left">Clock Skew (for IdApi1)</p>
    <p class="text-xs-left caption">{{ clockSkewInfo }}</p>
    <v-layout row justify-start mr-2>
      <v-slider
        v-model="clockSkew"
        :max="clockSkewMaxValue"
        :min="0"
        :step="1"
        
        :persistent-hint="true"
        :label="'0 [s] - 500 [s]'"
        :style="{'margin-top': '0'}"
        :thumb-label="'always'"
        :error-messages="clockSkewErrorMessages"
        @end="clockSkewChanged"
        >
      </v-slider>
    </v-layout>
    <app-view-spacer></app-view-spacer>
    <p class="text-xs-left">Access token lifetime</p>
    <p class="text-xs-left caption">{{ accessTokenLifeTimeInfo }}</p>
    <v-layout row justify-start mr-2>
      <v-slider
        v-model="accessTokenLifeTime"
        :max="acessTokenLifeTimeMaxValue"
        :min="0"
        :step="1"
        
        :persistent-hint="true"
        :label="`0 [s] -  ${acessTokenLifeTimeMaxValue} [s]`"
        :style="{'margin-top': '0'}"
        :thumb-label="'always'"
        :error-messages="accessTokenLifeTimeErrorMessages"
        @end="accessTokenLifeTimeChanged"
        >
      </v-slider>
    </v-layout>


    <app-view-spacer></app-view-spacer>
    
  </app-view-layout>
</template>

<script>

import { RefreshStrategy } from '@/backend/idserver/RefreshStrategy';
import ViewLayout from '@/components/layout/ViewLayout';
import ViewSpacer from '@/components/layout/ViewSpacer';

export default {
  components: {
    'appViewLayout': ViewLayout,
    'appViewSpacer': ViewSpacer
  },
  data() {
    return {
      refreshStrategy: null,
      clockSkew: this.clockSkewStore ? this.clockSkewStore : 300,
      accessTokenLifeTime: this.accessTokeLifeTimeStore ? this.accessTokeLifeTimeStore : 600,
    }
  },
  computed: {
    refreshStrategies() {
      return RefreshStrategy;
    },
    refreshStrategyStore() {
      return this.$store.getters['settings/refreshStrategy'];
    },
    clockSkewMaxValue() {
      return 500;
    },
    clockSkewStore() {
      return this.$store.getters['settings/clockSkew'];
    },
    clockSkewInfo() {
      return 'Clock skew compensates for server time drift (default is 300 seconds).' +
        'This sets the value for all requests made to the server running the api (IdApi1).' +
        'In real life, a server would not publicly expose an endpoint to set the clock skew!'
    },
    clockSkewErrorMessages() {
      if(this.clockSkewError) {
        return [this.clockSkewError.message ? this.clockSkewError.message : 'Unknown error!'];
      }
      return [];
    },
    clockSkewError() {
      return this.$store.getters['settings/clockSkewError'];
    },
    accessTokenLifeTimeInfo() {
      return 'Issued access tokens are only valid for a certain time.' +
        'This sets the lifetime of the issued access token.' + 
        'In real life, allowing a client to change this value would totally' +
        'defeat their purpose.'
    },
    acessTokenLifeTimeMaxValue() {
      return 3600;
    },
    accessTokenLifeTimeStore() {
      return this.$store.getters['settings/accessTokenLifeTime'];
    },
    accessTokenLifeTimeErrorMessages() {
      if(this.accessTokenLifeTimeError) {
        return [this.accessTokenLifeTimeError.message ? this.accessTokenLifeTimeError.message : 'Unknown error!'];
      }
      return [];
    },
    accessTokenLifeTimeError() {
      return this.$store.getters['settings/accessTokenLifeTimeError'];
    }
  },
  watch: {
    refreshStrategy() {
      this.$store.dispatch('settings/setRefreshStrategy', this.refreshStrategy);
    },
    refreshStrategyStore(newValue) {
      this.refreshStrategy = newValue;
    },
    clockSkewStore(newVal) {
      this.clockSkew = newVal;
    },
    accessTokenLifeTimeStore(newVal) {
      this.accessTokenLifeTime = newVal;
    }
  },
  methods: {
    async clockSkewChanged(clockSkew) {
      await this.$store.dispatch('settings/setClockSkew', { timeSpan: clockSkew, resetErrorTimeMs: 3000 });
    },
    async accessTokenLifeTimeChanged(accessTokenLifeTime) {
      await this.$store.dispatch(
        'settings/setAccessTokenLifeTime',
        { accessTokenLifeTime, resetErrorTimeMs: 3000 });
    }

  },
  created() {
    this.refreshStrategy = this.refreshStrategyStore;
    this.clockSkew = this.clockSkewStore;
    this.accessTokenLifeTime = this.accessTokenLifeTimeStore;
  },
  mounted() {
    this.accessTokenLifeTime = this.accessTokenLifeTimeStore;
  }
}
</script>

<style scoped>

</style>
