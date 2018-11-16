<template>
  <div>
    <p
      class="text-xs-left"
      :style="{'margin-bottom': '0'}"
      >
      {{ "Access token refresh strategy" }}
    </p>
    <v-radio-group
      v-model="refreshStrategy"
      :mandatory="false"
      @change="$emit('change', refreshStrategy)"
      >
      <v-radio label="On demand only" :value="refreshStrategies.onDemandOnly"></v-radio>
      <v-radio label="On expiring" :value="refreshStrategies.onExpiring"></v-radio>
      <v-radio label="On expired" :value="refreshStrategies.onExpired"></v-radio>
      <v-radio label="Manual only" :value="refreshStrategies.manualOnly"></v-radio>
    </v-radio-group>
  </div>
</template>

<script>

import { RefreshStrategy } from '@/backend/idserver/RefreshStrategy';

export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      refreshStrategy: this.value
    }
  },
  computed: {
    refreshStrategies() {
      return RefreshStrategy;
    }
  },
  watch: {
    value(newValue) {
      this.refreshStrategy = newValue;
    }
  }
}
</script>

<style scoped>
</style>
