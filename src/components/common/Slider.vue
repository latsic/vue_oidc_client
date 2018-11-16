<template>
  <div>
    <p
      v-if="title"
      class="text-xs-left"
      >
      {{ `${title}, ${min}″ -  ${max}″` }}
    </p>
    <slot name="caption" />
    <v-layout row justify-space-between align-baseline>
      <v-flex xs2>
        <v-layout row justify-start>
          <strong>{{ sliderValue }}{{ unit }}</strong>
        </v-layout>
      </v-flex>
      <v-flex xs9 pr-5>
        <v-layout row justify-end>
          <v-slider
            v-model="sliderValue"
            :max="max"
            :min="min"
            :step="1"
            :style="{'margin-top': '0'}"
            :error-messages="errorMessages"
            @end="$emit('change', sliderValue)"
            always-dirty
            >
          </v-slider>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    unit: {
      type: String,
      default: ''
    },
    error: {
      type: String | Error,
      default: null
    },
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      sliderValue: this.value
    }
  },
  computed: {
    errorMessages() {
      if(!this.error) return [];
      if(this.error && this.error.message) return [this.error.message];
      return ['Unknown error'];
    }
  },
  watch: {
    value(newValue) {
      this.sliderValue = newValue;
    }
  }
}
</script>

<style scoped>
</style>
