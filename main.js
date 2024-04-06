import App from './App'
import './common.scss' // 由于微信小程序存在组件的样式隔离，因此这个地方旨在修改全局样式文件

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
const BASE_URL = 'https://gd.jxiot.top'
// const BASE_URL = 'https://test.jxiot.top/'

$http.baseUrl = BASE_URL

$http.beforeRequest = function(options) {
	if (options.url !== `${BASE_URL}login/`) {
		options.header["x-token"] = uni.getStorageSync('x-token')
	}
}

// $http.afterRequest = function(res) {
// }