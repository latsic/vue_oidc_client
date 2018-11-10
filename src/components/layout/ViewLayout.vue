<template>
  <v-layout align-center justify-center>
    <v-flex xs11 sm8 md7 lg6>
      <app-view-title
        v-if="title"
        :title="title"
        >
      </app-view-title>
      <slot></slot>
    </v-flex>
  </v-layout>
</template>

<script>

import ViewTitle from '@/components/layout/ViewTitle';

export default {
  components: {
    'appViewTitle': ViewTitle
  },
  props: {
    title: {
      type: String,
      default: null
    }
  }
}
</script>

<style>

</style>

