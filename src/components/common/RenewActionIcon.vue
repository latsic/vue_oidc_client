<template>
  <div>
    <app-spinner
      v-if="renewing"
      :color="$vuetify.theme.primary"
      :style="{transform: 'translate(-50%, -50%) scale(0.5)'}"
      >
    </app-spinner>
    <v-icon
      v-else
      :style="{
        color: expired ? colorExpiredC : colorNotExpiredC,
        transform: 'translate(-50%, -50%)'}"
        @click="$emit('click')"
        >
        {{ iconName }}
    </v-icon>
  </div>
</template>

<script>

import Spinner from '@/components/common/Spinner';

export default {
  components: {
    'appSpinner': Spinner
  },
  props: {
    expired: {
      type: Boolean,
      default: false
    },
    renewing: {
      type: Boolean,
      default: false
    },
    iconName: {
      type: String,
      default: 'refresh'
    },
    colorExpired: {
      type: String,
      default: ''
    },
    colorNotExpired: {
      type: String,
      default: ''
    },
    clicked: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    colorExpiredC() {
      return this.colorExpired ? this.colorExpired : this.$vuetify.theme.primary;
    },
    colorNotExpiredC() {
      return this.colorNotExpired ? this.colorNotExpired : this.$vuetify.theme.secondary;
    }
    
  }
}
</script>

<style scoped>

</style>
