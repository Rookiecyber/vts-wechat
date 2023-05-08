<template>
	<view class="content">
		<image class="logo" src="/static/image/avatar.png"></image>

		<!-- <u-input class="input" type="text" v-model="value" border placeholder="请输入"></u-input> -->
		<!-- <u-button class="btn" type="primary" @click="check" style="margin-top: 30rpx;">校验</u-button> -->
		<!-- 	<button class="button popup-success" @click="dialogToggle('success')"><text
								class="button-text success-text">成功</text></button> -->
		<u-button class="btn" type="success" @click="login()" style="margin-top: 30rpx;width: 70%;">微信授权登录</u-button>
		<!-- <button open-type="getPhoneNumber" @getphonenumber="PhoneNumber">登录2</button> -->
		<view class="text-area" @click="$utils.navigateTo('/pages/login2/login2')">
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState, // 从vuex中引入mapState函数，用于在计算属性中映射store中的state
		mapActions, // 从vuex中引入mapActions函数，用于在methods中映射store中的actions
		mapGetters // 从vuex中引入mapGetters函数，用于在计算属性中映射store中的getters
	} from 'vuex'
	import myapi from "../../api/api.js"
	
	export default {
		data() {
			return {
				sessionKey: "",
				openId: "",
				title:"使用其他方式登录"
			};
		},
		onLaunch: function() {
			console.log('Login Launch')
			uni.getStorage({
				key:"userInfo"
			}).then((res)=>{
				console.log("userinfo",res)
			})
		},
		onShow: function() {
			console.log('Login Show')
		},
		onHide: function() {
			console.log('Login Hide')
		},
		methods: {
			...mapActions(['setDriver','setVehicleNum']), // 映射store中的actions到方法中
			testLogin(){
				let that = this
				uni.setStorage({
				  key: "userInfo",
				  data: "测试用户",
				  success() {
					uni.getStorage({
					  key: "key",
					  success(res) {
						console.log(res.data)
					  }
					})
				  }
				})
				uni.switchTab({
					url: '/pages/index/index'
				});

			},
			login(){
				let _this = this
				console.log("执行登录")
				uni.login({
				  provider: 'weixin', //使用微信登录
				  success: function (res) {
				    console.log(res);
					let data = {
						 code: res.code
					}
					_this.$api.wxlogin(data).then(res => {
						console.log("微信codeD登录")
						console.log(res)
						if(res.code!=-1){//返回正确数据
						
							//将数据存入Vuex
							_this.setDriver(res.datas)
						
							//将用户数据缓存
							uni.setStorage({
								key:"userInfo",
								data:res.datas
							})
							//跳转至下一页面
							//TODO
							
							if(res.datas.vehicleId>0){
								//已经绑定车辆就查询车辆信息
								_this.$api.queryVehicleById({
									vehicleId:res.datas.vehicleId
								}).then((vehicle) => {
									console.log("login页面获取到车辆信息",vehicle)
									uni.setStorage({
										key:"vehicleInfo",
										data:vehicle.datas
									})
									_this.setVehicleNum({
										vehicleNum:vehicle.datas.vehicleNum
									})
								})
							}
							// console.log(_this.$store.state)
							console.log("login页面中测试vuex,",_this.$store.state)
							
							
							uni.showToast({
								title: "登录中",
								icon: 'loading'
							})
							setTimeout(()=>{
								uni.switchTab({
									url: '/pages/index/index'
								}).then((res)=>{
									uni.showToast({
										title: "登录成功",
										icon: 'success'
									})
								})
							},2500)
							

						}
					})
				  }
				});
			}
						
		},
	}
</script>

<style lang="scss">
/* ---弹窗css--- */
.login-btn{
	top:360rpx;
	width:522rpx;
}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.input {
		margin-top: 30rpx;
		width: 500rpx;
	}

	.btn {
		width: 500rpx;
	}
</style>
