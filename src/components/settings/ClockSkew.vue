<template>
  <app-slider
    :title="'Clock skew (for IdApi1)'"
    :min="0"
    :max="500"
    :unit="'″'"
    :error="error"
    :value="value"
    @change="(value) => $emit('change', value)"
    >
    <template
      slot="caption"
      >
      <p class="caption text-xs-left">
        Clock skew compensates for server time drift (default is 300 seconds).
        This sets the value for all requests made to the server running the api (IdApi1).
        <strong>In real life, a server would not publicly expose an endpoint to set the clock skew!</strong>
      </p>
    </template>
  </app-slider>
</template>

<script>

import Slider from '@/components/common/Slider';

export default {
  components: {
    'appSlider': Slider
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    error: {
      type: Object | Error,
      default: null
    }
  }
}
</script>

<style scoped>

</style>
