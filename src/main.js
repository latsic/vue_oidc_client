import '@babel/polyfill'
import Vue from 'vue'
import '@/plugins/vuetify'
import App from '@/App.vue'
import router from '@/router'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import store from '@/store/store'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.config.errorHandler = (error, vm, info) => {
  // eslint-disable-next-line no-console
  console.log(error, vm, info);
}