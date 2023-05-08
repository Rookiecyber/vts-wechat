import http from '@/common/http.js'
export default {
	// 获取用户信息
	getInfo: (data, header) => {
		return http.request('/Recruit/GetUserInfo', "GET", data, header)
	},
	// 提交信息1
	Submit: (data, header) => {
		return http.request('/Recruit/AddInterView', "POST", data, header)
	},
	// 查询定位信息
	insertLocation: (data, header) => {
		return http.request('/location', "POST", data, header)
	},
	// 查询定位信息
	queryLocation: (data, header) => {
		return http.request('/location/query', "POST", data, header)
	},
	// 微信授权登录获取openid
	wxlogin: (data, header) => {
		return http.request('/mini/wxlogin', "POST", data, header)
	},
	// 手机号 + 身份证登录
	LoginByPhone: (data, header) => {
		return http.request('/mini/loginByPhone', "POST", data, header)
	},
	// 微信openid查询
	getByOpenid: (data, header) => {
		return http.request('/driver/openid', "POST", data, header)
	},
	// vehicleId 查询
	queryVehicleById: (data, header) => {
		return http.request('/vehicle/'+data.vehicleId, "GET", data, header)
	},
	// vehicleId  和 driverId 绑定
	BindVehicle: (data, header) => {
		return http.request('/driver/bind', "POST", data, header)
	},
	// vehicleId  和 driverId 解绑
	UnbindVehicle: (data, header) => {
		return http.request('/driver/unbind', "POST", data, header)
	},
	// 任务单个查询
	queryTaskById: (data, header) => {
		return http.request('/task/'+data.taskId, "GET", data, header)
	},
	// 任务分页查询
	queryTaskByPage: (data, header) => {
		return http.request('/task/queryByPage', "POST", data, header)
	},
	// 查询我的任务
	queryMyTask: (data, header) => {
		return http.request('/task/queryMyTask', "POST", data, header)
	},
	// 接受任务
	selectTask: (data, header) => {
		return http.request('/task/selectTask', "PUT", data, header)
	},
	// 更新任务
	updateTask: (data, header) => {
		return http.request('/task', "PUT", data, header)
	},
	// 添加消息
	insertMessage: (data, header) => {
		return http.request('/message', "POST", data, header)
	},
	// 查询消息列表
	getMessageByUser: (data, header) => {
		return http.request('/message/queryByUser', "POST", data, header)
	},
	// 获取所有管理员
	getAllAdmin: (data, header) => {
		return http.request('/admin/queryAll', "GET", data, header)
	},
	// 获取电子围栏
	getFence: (data, header) => {
		return http.request('/fence/'+data.id, "GET", data, header)
	},
	//最近一条报警
	getLastAlarm:(data, header) => {
		return http.request('/alarm/getLast', "POST", data, header)
	},
	//添加报警信息
	insertAlarm:(data, header) => {
		return http.request('/alarm', "POST", data, header)
	}
}
