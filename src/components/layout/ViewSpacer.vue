<template>
  <div
    :style="{
      'border-top': `1px solid ${lineColor}`,
      'margin-top': marginTop,
      'margin-bottom': marginBottom}"
    >
  </div>
</template>

<script>
export default {
  props: {
    marginTop: {
      type: String,
      default: '1rem'
    },
    marginBottom: {
      type: String,
      default: '1rem'
    },
    showLine: {
      type: Boolean,
      default: true
    }
  },
  computed: {
   lineColor() {
     return this.showLine
      ? this.$vuetify.theme.secondary
      : '#00000000'
   } 
  }
}
</script>

<style scoped>

</style>
