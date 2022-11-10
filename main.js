import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

// 按需导入 $http 对象
//npm install @escook/request-miniprogram
import {
	$http
} from '@escook/request-miniprogram'
uni.$http = $http

$http.baseUrl = 'https://gd.jxiot.top'

$http.beforeRequest = function(options) {
	if (options.url !== "https://gd.jxiot.top/login/") {
		options.header["x-token"] = uni.getStorageSync('x-token')
	}
}

// $http.afterRequest = function(res) {
// }