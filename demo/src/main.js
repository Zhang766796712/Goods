import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

// 引入重置样式
import 'normalize.css'
// 引入全局样式
import '@/assets/style/public.css'
// 引入字体图标
import '@/assets/style/iconfont/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
