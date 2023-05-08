import App from './App'
import Vue from 'vue'

// 在项目根目录中的main.js中，引入并使用uView的JS库，注意这两行要放在import Vue之后。
// import uView from "uview-ui";
import uView from '@/uni_modules/uview-ui'
import store from './store'

Vue.prototype.$store = store

Vue.use(uView);

// import uView from 'uni_modules/uview-ui' 
// Vue.use(uView)
// 通过import引入定义的通用方法utils.js文件，然后使用Vue.prototype.$utils = utils，添加到Vue实例上
// 之后，在组件页面中，需要使用的话，就是this.$utils.xxx就行了
import utils from "utils/utils.js"
Vue.prototype.$utils = utils;

// import引入api.js并添加到Vue实例上
import api from "api/api.js"
Vue.prototype.$api = api;





Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
