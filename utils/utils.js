// 校验用户名正则，默认6到16位（字母，数字，下划线，减号）
const checkAccount = (value) => {
	let ruleReg = /^[a-zA-Z0-9_-]{6,16}$/;
	if (!ruleReg.test(value)) {
		return false
	} else {
		return true
	}
}

// 校验密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
const checkPassword = (value) => {
	let ruleReg = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
	if (!ruleReg.test(value)) {
		return false
	} else {
		return true
	}
}

// 校验手机号码
const checkPhone = (value) => {
	let iphoneReg = (
		/^(13[0-9]|14[15679]|15[0-3,5-9]|16[6]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
	); //手机号码
	if (!iphoneReg.test(value)) {
		return false
	} else {
		return true
	}
}

// 校验身份证号码
const checkCard = (idCard) => {
	//15位和18位身份证号码的正则表达式
	var regIdCard =
		/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
	//如果通过该验证，说明身份证格式正确，但准确性还需计算
	if (regIdCard.test(idCard)) {
		if (idCard.length == 18) {
			var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
			var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
			var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
			for (var i = 0; i < 17; i++) {
				idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
			}
			var idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
			var idCardLast = idCard.substring(17); //得到最后一位身份证号码
			//如果等于2，则说明校验码是10，身份证号码最后一位应该是X
			if (idCardMod == 2) {
				if (idCardLast == "X" || idCardLast == "x") {
					return true;
				} else {
					return false;
				}
			} else {
				//用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
				if (idCardLast == idCardY[idCardMod]) {
					return true;
				} else {
					return false;
				}
			}
		}
	} else {
		return false;
	}
}

// 校验邮箱
const checkEmail = (value) => {
	let ruleReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if (!ruleReg.test(value)) {
		return false
	} else {
		return true
	}
}

// 校验中国邮政编码
const checkPostCode = (value) => {
	let ruleReg = /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/;
	if (!ruleReg.test(value)) {
		return false
	} else {
		return true
	}
}

// 获取时间戳
const getTimestamp = (time) => {
	let timeStr = time ? new Date(time.replace(/-/g, '/').replace("T", " ")).getTime() : new Date().getTime()
	return timeStr
}

// 获取当前时间
const getCurrentTime = (fmt = 'YY-MM-DD hh:mm:ss', weekType = '周') => {
	if (fmt == '' || fmt == ' ') {
		weekType = weekType;
		fmt = 'YY-MM-DD hh:mm:ss';
	} else if (fmt == '周' || fmt == '星期') {
		weekType = fmt ? fmt : weekType;
		fmt = 'YY-MM-DD hh:mm:ss';
	} else {
		weekType = weekType;
		fmt = fmt;
	}
	const date = new Date()
	const o = {
		'Y+': date.getFullYear(),
		'M+': date.getMonth() + 1, // 月
		'D+': date.getDate(), // 日
		'h+': date.getHours(), // 时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		W: date.getDay() // 周
	}
	for (let k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, () => {
				if (k === 'W') {
					const week = [weekType + '日', weekType + '一', weekType + '二', weekType + '三', weekType +
						'四', weekType + '五', weekType + '六'
					] // 星期几 周几
					return week[o[k]]
				} else if (k === 'Y+' || RegExp.$1.length === 1) {
					return o[k] // 年份 or 小于10不加0
				} else {
					return ('00' + o[k]).substr(('' + o[k]).length) // 小于10补位0
				}
			})
		}
	}
	return fmt
}

// 显示消息提示框
const showToast = (title, duration = 1500, icon = 'none') => {
	if (!title) {
		return
	}
	uni.showToast({
		title: title.toString(),
		icon: icon,
		mask: true,
		duration: duration,
		// success: (res) => {
		// 	console.log('显示成功', res)
		// },
		// fail: (err) => {
		// 	console.log('显示失败', err)
		// },
	});
}
// 保留当前页面，跳转到应用内的某个页面
const navigateTo = (url) => {
	uni.navigateTo({
		url: url
	})
}
// 关闭当前页面，跳转到应用内的某个页面
const redirectTo = (url) => {
	uni.redirectTo({
		url: url
	})
}
// tabbar跳转
const switchTab = (url) => {
	uni.switchTab({
		url: url
	})
}
// 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages() 获取当前的页面栈，决定需要返回几层
const navigateBack = (delta) => {
	uni.navigateBack({
		delta: delta,
	})
}

// 复制
const copy = (value) => {
	if (value == '') {
		return
	}
	uni.setClipboardData({
		data: value.toString(),
		success: function() {
			uni.showToast({
				title: '内容已复制',
				icon: 'success'
			})
		}
	});
};

// 拨打电话
const callPhone = (phone) => {
	uni.makePhoneCall({
		phoneNumber: phone
	})
};




export default {
	checkAccount,
	checkPhone,
	checkCard,
	checkEmail,
	checkPostCode,
	checkPassword,
	getTimestamp,
	getCurrentTime,
	showToast,
	navigateTo,
	redirectTo,
	switchTab,
	navigateBack,
	copy,
	callPhone,
}
