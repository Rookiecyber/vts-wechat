<template>
	<view class="container">
		<uni-card :title="userInfo.vehicleId?vehicleInfo.vehicleNum:'未绑定'"  extra="当前车辆" thumbnail="/static/image/vehicle.png">
		</uni-card>
		<uni-section title="操作" type="line" class="hideOnPc">
			<view class="example-body box">
				<button class="button popup-warn" @click="dialogToggle('warn')"><text
						class="button-text warn-text" :disabled="!userInfo.vehicleId">解绑</text></button>
			</view>
		</uni-section>

		<uni-section title="绑定" type="line" padding>
			<view class="dialog-box">
				<text class="dialog-text">输入车牌号：</text>
			</view>
			<button class="button" type="primary" @click="inputDialogToggle"><text
					class="button-text">绑定</text></button>
		</uni-section>
		

		<view>
			<!-- 提示窗示例 -->
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="同意" title="解绑" content="确定要与该车辆接解除绑定吗？" @confirm="dialogConfirm"
					@close="dialogClose"></uni-popup-dialog>
			</uni-popup>
		</view>

		<view>
			<!-- 输入框示例 -->
			<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose"  mode="input" title="输入车牌号 " :value="inputVehicleNum"
					placeholder="请输入车牌号" @confirm="dialogInputConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		mapState, // 从vuex中引入mapState函数，用于在计算属性中映射store中的state
		mapActions, // 从vuex中引入mapActions函数，用于在methods中映射store中的actions
		mapGetters // 从vuex中引入mapGetters函数，用于在计算属性中映射store中的getters
	} from 'vuex'
	export default {
		
		data() {
			return {
				userInfo:{},
				vehicleInfo:{},
				type: 'center',
				msgType: 'success',
				messageText: '这是一条成功提示',
				value: '',
				inputVehicleNum:""
			}
		},
		onReady() {},
		onLoad(){
			this.getData()
		},
		methods: {
			...mapActions(['setDriver','setVehicleNum']), // 映射store中的actions到方法中
			getData(){
				let _this = this
				_this.userInfo = uni.getStorageSync("userInfo")
				console.log("userInfo",_this.userInfo)
				if(_this.userInfo.vehicleId>0){ //存在车辆信息
					console.log("已经存在")
					_this.vehicleInfo = uni.getStorageSync("vehicleInfo")
					
					
				}
				console.log("bind页面中vehicleInfo",_this.vehicleInfo)
				
				//将数据保存到vuex中
				_this.setDriver(_this.userInfo)
				_this.setVehicleNum({vehicleNum:_this.vehicleInfo.vehicleNum})
			},
			dialogToggle(type) {
				this.msgType = type
				this.$refs.alertDialog.open()
			},
			dialogConfirm() {
				console.log('点击确认')
				this.messageText = `点击确认了 ${this.msgType} 窗口`
				// this.$refs.message.open()
				uni.showLoading({
					title: '解除绑定'
				})
				//确认解除绑定
				this.$api.UnbindVehicle({
					driverId:this.vehicleInfo.driverId,
					vehicleId:this.vehicleInfo.vehicleId
				}).then((res) => {
					console.log("解除绑定后userinfo,",res.datas)
					//解除绑定
					uni.setStorage({
						key:"userInfo",
						data:res.datas
					})
					uni.removeStorageSync("vehicleInfo")
				})
				//重新取出数据渲染
				setTimeout(()=>{
					this.getData()
					uni.hideLoading()
				},2000)
					
			},
			inputDialogToggle() {
				this.inputVehicleNum = ""  //每次打开清空
				this.$refs.inputDialog.open()
			},
			dialogClose() {
				console.log('点击关闭')
			},
			dialogInputConfirm(val) {
				let  _this = this
				uni.showLoading({
					title: '正在绑定'
				})

				setTimeout(() => {
					uni.hideLoading()
					// console.log(val)
					_this.inputVehicleNum = val
					//取到车牌号
					_this.$api.BindVehicle({
						driverId: _this.userInfo.driverId,
						vehicleNum: _this.inputVehicleNum
					}).then((res)=>{
						console.log("绑定车辆提交后：",res)
						uni.setStorageSync("userInfo",res.datas.driver)
						uni.setStorageSync("vehicleInfo",res.datas.vehicle)
						//重新获取数据渲染页面
						_this.getData()
					})
					// 关闭窗口后，恢复默认内容
					_this.$refs.inputDialog.close()
				}, 2000)
			}
		}
	}
</script>
<style lang="scss">
	@mixin flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	@mixin height {
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}

	.box {
		@include flex;
	}

	.button {
		@include flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 35px;
		margin: 0 5px;
		border-radius: 5px;
	}

	.example-body {
		background-color: #fff;
		padding: 10px 0;
	}

	.button-text {
		color: #fff;
		font-size: 12px;
	}

	.popup-content {
		@include flex;
		align-items: center;
		justify-content: center;
		padding: 15px;
		height: 50px;
		background-color: #fff;
	}

	.popup-height {
		@include height;
		width: 200px;
	}

	.text {
		font-size: 12px;
		color: #333;
	}

	.popup-success {
		color: #fff;
		background-color: #e1f3d8;
	}

	.popup-warn {
		color: #fff;
		background-color: #faecd8;
	}

	.popup-error {
		color: #fff;
		background-color: #fde2e2;
	}

	.popup-info {
		color: #fff;
		background-color: #f2f6fc;
	}

	.success-text {
		color: #09bb07;
	}

	.warn-text {
		color: #e6a23c;
	}

	.error-text {
		color: #f56c6c;
	}

	.info-text {
		color: #909399;
	}

	.dialog,
	.share {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.dialog-box {
		padding: 10px;
	}

	.dialog .button,
	.share .button {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		margin: 0;
		margin-top: 10px;
		padding: 3px 0;
		flex: 1;
	}

	.dialog-text {
		font-size: 14px;
		color: #333;
	}
</style>

