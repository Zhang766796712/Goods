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

// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// dateformat  时间格式化
import dateFormat from "dateformat"
// 全局过滤器
Vue.filter("filTime", (val)=>{ // val 指的是管道符前面的数据
    let time = new Date(val*1000)
    return dateFormat(time, "yyyy-mm-dd HH:MM:ss")
})

Vue.use(VueQuillEditor)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
