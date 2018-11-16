<template>
  <app-slider
    :title="'Access token lifetime'"
    :min="1"
    :max="1800"
    :unit="'″'"
    :error="error"
    :value="value"
    @change="(value) => $emit('change', value)"
    >
    <template
      slot="caption"
      >
      <p class="caption text-xs-left">
        Access tokens are only valid for a certain time.
        This sets the lifetime of the issued access token.
        <strong>In real life, allowing a client to change this value
        would totally defeat its purpose.</strong>
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
      type: Object,
      default: null
    }
  }
}
</script>


<style scoped>

</style>
