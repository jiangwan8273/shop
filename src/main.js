import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import '../src/assets/index.css'
import axios from 'axios'
import './assets/iconfont/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
import 'element-ui/lib/theme-chalk/index.css'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 赋值给请求头属性Authorization，获取token值
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

// 添加全局过滤器，筛选秒为年月日-时分秒
Vue.filter('dataFilter', function (mmVal) {
  const dt = new Date(mmVal)
  const yy = dt.getFullYear()
  var mm = dt.getMonth() + 1
  var dd = dt.getDate()
  var h = dt.getHours()
  var m = dt.getMinutes()
  var s = dt.getSeconds()
  return `${yy}/${mm}/${dd}-${h}/${m}/${s}`
})

new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')
