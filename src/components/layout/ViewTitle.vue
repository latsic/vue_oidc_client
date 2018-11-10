<template>
  <div>
    <h3 class="text-xs-left">
      {{ title }}
    </h3>
    <app-view-spacer :marginTop="'0'"></app-view-spacer>
  </div>
</template>

<script>

import ViewSpacer from '@/components/layout/ViewSpacer';

export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  components: {
    'appViewSpacer': ViewSpacer
  }
}
</script>

<style scoped>

</style>
