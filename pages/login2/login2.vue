<template>
	<view class="content">
		<image class="logo" src="/static/image/avatar.png"></image>



		<form name="from1">
			<!-- driverPhone -->
			<view class="inputView">
				<image class="keyImage" src="../../static/image/phone.png"></image>

				<input class="inputText" type="number" placeholder="请输入账号" value="user" v-model="driverPhone"
				 placeholder-style='color:rgb(126, 126, 126);font-size:34rpx;' />
			</view>
			<!-- driverPhone -->
			<view class="inputView">
				<image class="keyImage" src="../../static/image/idcard.png"></image>

				<input class="inputText" maxlength="25"  type="password" placeholder="请输入身份证号" value="password"
					v-model="idcard" 
					placeholder-style='color:rgb(126, 126, 126);font-size:34rpx;' />
			</view>

		</form>
		<button  type="primary" @click="login2()" style="margin-top: 30rpx;width: 500rpx;">登录</button>

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
				driverPhone: '12345', //input 框的值
				idcard:"12345",
				sessionKey: "",
				openId: ""
			}
		},
		onLoad() {
		},
		onShow() {
		},
		// 监听到下拉刷新
		onPullDownRefresh() {
		},
		onHide() {
		},
		methods: {
			...mapActions(['setDriver','setVehicleNum']), // 映射store中的actions到方法中
			//登录
			login2(){
				let _this = this
				console.log("执行登录2")
				
				uni.login({
					provider:"weixin",
					success:function(res){
						let data = {
							code: res.code,
							driverPhone: _this.driverPhone,
							idcard: _this.idcard
						}
						console.log("参数：",data)
						_this.$api.LoginByPhone(data).then((res) => {
							console.log("执行手机登录")
							console.log(res)
							if(res.code!=-1){ // 成功登录
							
								//将数据存入Vuex
								_this.setDriver(res.datas)
								
								if(res.datas.vehicleId>0){
									//已经绑定车辆
									_this.$api.queryVehicleById({
										vehicleId:res.datas.vehicleId
									}).then((res) => {
										console.log("login2获取到车辆信息",res)
										uni.setStorage({
											key:"vehicleInfo",
											data:res.datas
										})
										// that.vehicleNum = res.datas.vehicleNum
										_this.setVehicleNum({
											vehicleNum:res.datas.vehicleNum
										})
									})
								}
								
								uni.setStorage({
									key:"userInfo",
									data:res.datas
								})
								console.log("login2页面中",_this.$store.state)


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
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}


	.login {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 300rpx;
		width: 300rpx;
		margin-top: 100rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}



	.inputView {

		margin: 40rpx;
		border-radius: 25rpx;
		/*	border: 6rpx solid #9EC2EC;*/

		background-color: #efefef;
		line-height: 95rpx;
		border-width: 4px;
		border-bottom: 2dp;
		align-items: center
	}


	.keyImage {
		margin-left: 15rpx;
		margin-button: 0rpx;
		margin-top: 30rpx;
		width: 50rpx;
		height: 50rpx;
	}

	.inputText {
		width: 80%;
		border-radius: true;
		background-color: #efefef;
		flex: block;
		float: right;
		text-align: left;
		margin-right: 22rpx;
		margin-top: 30rpx;
		color: #0c0c0c;
		font-size: 38rpx;
		height: 100%;
	}





	/* 记住密码 */
	.mui-checkbox input[type='checkbox']:checked:before {
		color: #00bbb1;
	}



	.RememberCheck {
		margin-left: -50%;
		margin-top: 10rpx;
		color: #adadad;
	}

	.forget {
		color: #5b50ec;
		margin-top: 10rpx;
		margin-left: 10%;
	}

	/*按钮*/
	.loginBtnView {
		width: 100%;
		height: auto;
		/* background-color:#FFFFFF; */
		margin-top: 50rpx;
		margin-bottom: 0rpx;
		padding-bottom: 0rpx;
	}

	.loginBtn {
		width: 90%;
		margin-top: 50px;
		background-color: #566cec;
		color: aliceblue;
	}

	.checkid {
		width: 90%;
		height: 20rpx;
		margin-top: 3%;
		margin-bottom: 8%;
		margin-left: 0%;
		border-radius: 25rpx;
	}

	.radioclass {
		margin-left: 13%;
	}

	.register {
		color: #5b50ec;
		margin-top: 10rpx;
		margin-left: 28%;
	}
</style>
