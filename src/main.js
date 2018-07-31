import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import fastclick from 'fastclick'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import 'common/stylus/index.styl'
import store from './store'

/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole'

Vue.use(VueLazyLoad, {
  loading: require('./components/m-header/default@2x.png')
})
Vue.config.productionTip = false
fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
