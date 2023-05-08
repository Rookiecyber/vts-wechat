import http from '@/common/http.js'

import request from '@/common/request.js'; // 引入封装好的request

// 添加定位信息
export function insertLocation (data) {
	return request({
		method: "post", // 请求方式
		url: '/location', // 请求的url
		data: data // 参数
	})
}
// 查询定位信息
export function queryLocation (data) {
	return request({
		method: "post", // 请求方式
		url: '/location/query', // 请求的url
		data: data // 参数
	})
}
