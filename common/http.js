// 定义api请求的公用域名,封装HTTP请求
import {
	devUrl,
	buildUrl,
	tokenUrl,
} from '@/common/config.js'

// 设置请求api接口的基础路径
const baseUrl = process.env.NODE_ENV === 'production' ? buildUrl : devUrl;

/**
 * 封装uni.request
 * @param url     api接口地址
 * @param method  uni.request请求方法 "POST" 和 "GET"
 * @param data    uni.request请求携带的参数 {}
 * @param header  uni.request请求携带的header {}
 */
const request = (url, method, data, header) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			method: method || "GET",
			data: data
		}).then(data => {
			 let [err, res] = data;  //关于uniapp发起请求获取到的数据第一个值为null的问题
			
			//获取结果
			// let res = data
			console.log("request结果")
			console.log(res)
			// if (res.data.result == 401) { //登录过期，不一定是401，请根据具体项目设置
			// 	uni.showToast({
			// 		title: 'token已过期，请重试',
			// 		icon: 'none'
			// 	})
				// 1.登录过期后重新获取token
				// uni.request({
				// 	url: tokenUrl + '/api/Recruit/token',
				// 	method: "GET",
				// 	success(res) {
				// 		console.log("获取TOKEN", res);
				// 		uni.setStorageSync('token', res.data.token)
				// 	}
				// })
				// 2.或者重定向到登录页面
				// uni.redirectTo({
				// 	url:'/pages.login/login'
				// })
				// return resolve(res)
				
			 if (res.data.code == 200) { //调用接口成功返回的正常数据
				return resolve(res.data)   //直接返回data
			} else if (res.data.code == -1 )  { 
				//调用接口成功返回的异常数据（例：缺少必传字段等）
				//url.indexOf('/Recruit/UpdateBeginTime') == -1 为当调用'/Recruit/UpdateBeginTime'接口时，不展示返回的异常数据信息
				uni.showToast({
					title: res.data.message,
					icon: 'none'
				})
				// return resolve(res) 
				return resolve(res.data)
			}
		}).catch(error => { //调用接口失败时返回的数据
			let [err, res] = error;
			reject(err)
		})
	})
}

export default {
	request,
	baseUrl,
	tokenUrl,
}
