<template>
	<view >
		<!-- // 地图 -->
		<view >	
			<map class="map" 
			:latitude="latitude"
			:longitude="longitude" 
			:markers="covers"
			:polygons="polygons"
			>
			</map>
		</view>
		
		<view class="content">
			<u-overlay :show="allShow" :duration="100" :z-index ="999" :opacity="0.3"></u-overlay>
			<uni-card :title="vehicleId?vehicleNum:'未绑定'"  :extra="extra" thumbnail="/static/image/vehicle.png">
				<text>温馨提示：请确保开启后台定位再开始上传数据！</text>
				<button class ="btn1" type="primary" @click="isGetLocation()" style="margin-top: 50rpx;margin-bottom: 30rpx;" >定位当前位置</button>
				<button class="btn1" type="primary" @click="clickUpload()" style="margin-top: 30rpx;" :disabled="isStart||(!vehicleId)">开始上传</button>
				<button class="btn1" type="primary" @click="endUpload()" style="margin-top: 30rpx;" :disabled=" (!vehicleId) ">停止上传</button>
			</uni-card>
		</view>

	</view>
</template>

<script>
	import {
		mapState, // 从vuex中引入mapState函数，用于在计算属性中映射store中的state
		mapActions, // 从vuex中引入mapActions函数，用于在methods中映射store中的actions
		mapGetters // 从vuex中引入mapGetters函数，用于在计算属性中映射store中的getters
	} from 'vuex'
	import QQMapWX from "@/common/qqmap-wx-jssdk1.1/qqmap-wx-jssdk.min.js"
	import { getCurrentTime, getTimestamp } from "@/utils/utils.js"
	
	let location = {
	       longitude: 0,
	       latitude: 0,
	       province: "",
	       city: "",
	       area: "",
	       street: "",
	       address: "",
	}
	export default {
		data() {
			return {
				title:"温馨提示：请确保开启后台定位再点击上传数据！" ,
				isStart:false, //上传GPS数据是否开始
				allShow:false, //全局遮罩
				extra:"当前车辆" ,
				timer: null , // 定时器编号
				timer2:null , // 用于更新电子围栏
				temp:{                  
					vehicleId:0,
					longitude:0,
					latitude:0,
					speed:0,
					direction:0,
					accuracy:0 ,
					reportTime:"",
				},
				latitude : 39.909 ,
				longitude : 116.39742 ,
				covers: [{
					id: 1 ,
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerNew.png' ,
					width: "40",
					height: "40"
				}],
				polygons:null , //多边形
				fence: null ,//电子围栏
				notInFence:0 ,
				overSpeed:0 
			}
		},
		computed: {
			...mapState(['vehicleNum',"vehicleId","driverId"]),   // 得到车牌号 和id
		},
		onLoad() {
			console.log("进入index页面onLoad")
			const that = this;
			// that.$api.getFence
			// that.$api.getFence({id:1}).then((res) => {
			// 	console.log('fence',res)
			// 	that.fence =  res.datas
			// 	console.log('电子围栏', that.fence)
			// 	that.polygons = JSON.parse(that.fence.points)
			// })
			that.initPolygons()
			// 每间隔一个小时更新一次
			this.timer2 = setInterval(()=>{
				that.initPolygons()
			},1000 * 3600)
			/*
			uni.getStorage({
				key:"userInfo"
			}).then((res)=>{
				console.log("userInfo",res)
				let userInfo = res[1].data
				console.log("userinfo",userInfo)
				that.setDriver(userInfo)
				if(userInfo.vehicleId > 0){
					uni.getStorage({
						key:"vehicleInfo"
					}).then((res)=> {
						console.log("vehicleInfo",res)
						that.setVehicleNum({
							vehicleNum: res[1].data.vehicleNum
						})
					})
					// that.$api.queryVehicleById({
					// 	vehicleId:userInfo.vehicleId
					// }).then((res) => {
					// 	console.log("获取到车辆信息",res)
					// 	// that.vehicleNum = res.datas.vehicleNum
					// })
				}

			})*/
			let userInfo = uni.getStorageSync("userInfo")
			that.setDriver(userInfo)
			console.log("index页面OnLoad方法内部1",userInfo)
			
			if(userInfo.vehicleId>0){
				let vehicleInfo = uni.getStorageSync("vehicleInfo")
				that.setVehicleNum({vehicleNum:vehicleInfo.vehicleNum})
				console.log("index页面OnLoad方法内部2",vehicleInfo)
			}

			console.log("index页面OnLoad方法内部3",this.$store.state)
		},
		onShow() {
			const that = this;
			
		},
		// 监听到下拉刷新
		onPullDownRefresh() {
			console.log("监听到下拉刷新");
			this.initPolygons()
			this.isGetLocation()
			setTimeout(() => {
				// 模拟1秒后停止下拉刷新显示样式
				uni.stopPullDownRefresh();
			}, 1000)
		}, 
		onHide() {
			console.log('页面消失了');
		},
		onUnload() {
			if(this.timer2){
				clearInterval(this.timer2)
				this.timer2 = null
			}
		},
		methods: {
			...mapActions(['setDriver','setVehicleNum']), // 映射store中的actions到方法中
			_locationChangeFn(res) {
			  console.log('location change', res)
			 },
			 //监听地理位置变化
			 mapWeizhi2: function () {
				var that = this;
				//定时执行每隔40秒获取当前位置（配送员）一次
				that.timer = setInterval(function () { //这里把setInterval赋值给变量名为timer的变量
				  const _locationChangeFn = function (res) {
					var markers = that.data.markers;
					markers[0].latitude = res.latitude;
					markers[0].longitude = res.longitude;
					that.setData({
					  markers,
					})
					that.GetDistance();
					wx.offLocationChange(_locationChangeFn)
				  }
				  wx.onLocationChange(_locationChangeFn)
				}, 5000)
			  },
			//点击开始上传按钮
			clickUpload(){
				let _this = this
				uni.getSetting({
					success(res){
						console.log(res)
						//每次进入程序判断当前是否获得授权，如果没有就去获得授权，如果获得授权，就直接获取当前地理位置
						if(!res.authSetting["scope.userLocationBackground"]){
							//  没有授权就先弹窗授权
							uni.authorize({
								scope:"scope.userLocationBackground",
								success(){
									_this.startUpload()  //完成授权开始上传
								}
							})
						}else{  //已经授权
							_this.startUpload()
						}
					}
				})
			},
			startUpload(){
				let _this = this
				_this.allShow = true
				uni.showToast({
					title: "正在开启",
					icon: 'loading'
				})
				setTimeout(()=>{
					_this.allShow = false
				},2000)
				console.log("点击开始上传GPS数据")
				_this.isStart = true
				
				//开启前后台位置变化监测
				uni.startLocationUpdateBackground().then((res) => {
					console.log("开启前后台位置变化监测", res);
					
					_this.timer =  setInterval(function () { //这里把setInterval赋值给变量名为timer的变量
					  const _locationChangeFn = function (res) {
						  console.log("location change:+",res)
						//将经纬度赋给地图标记点
						_this.latitude = res.latitude
						_this.longitude = res.longitude
						_this.covers[0].latitude = res.latitude
						_this.covers[0].longitude = res.longitude;
						_this.temp.vehicleId = _this.vehicleId  //vuex中的数据
						_this.temp.latitude = res.latitude
						_this.temp.longitude = res.longitude
						_this.temp.speed = res.speed
						_this.temp.direction = res.direction
						_this.temp.accuracy = res.accuracy
						_this.temp.reportTime = _this.$utils.getCurrentTime()
						//console.log(_this.temp)
						//超速
						if(_this.temp.speed *3.6 > _this.fence.maxSpeed){
							_this.overSpeed += 1
							if(_this.overSpeed >= 12){
								//上传报警信息
								_this.$api.insertAlarm({
									vehicleId:_this.vehicleId,
									alarmType:0,
									alarmSpeed:_this.temp.speed * 3.6,
									alarmLat:_this.temp.latitude,
									alarmLng: _this.temp.longitude,
									alarmTime: _this.$utils.getCurrentTime()
								}).then((Response)=>{
									console.log('超速报警')
									_this.overSpeed = 0
								})
							}
						}
						//超出电子围栏
						if(!_this.isPointInPolygon(_this.covers[0],_this.polygons[0].points)){
							//TODO ->报警！
							_this.$api.getLastAlarm({vehicleId:_this.vehicleId}).then((res)=>{
								// console.log('上一次报警信息',res.datas.alarm)
								let alarmInfo =  res.datas.alarm
								if(_this.moreThanOneHour(alarmInfo.alarmTime)&&alarmInfo.alarmType==1){
									//超过一小时，上传警报信息
									_this.$api.insertAlarm({
										vehicleId:_this.vehicleId,
										alarmType:1,
										alarmSpeed:_this.temp.speed,
										alarmLat:_this.temp.latitude,
										alarmLng: _this.temp.longitude,
										alarmTime: _this.$utils.getCurrentTime()
									}).then((Response)=>{
										console.log('上传超过围栏报警')
									})
								}
							})
						}
						//上传数据
						_this.$api.insertLocation(_this.temp)
						//关闭
						uni.offLocationChange(_locationChangeFn)
					  }
					  uni.onLocationChange(_locationChangeFn)
					}, 5000)
				})
			},
			endUpload(){
				let _this = this
				_this.allShow = true
				uni.showToast({
					title: "正在关闭",
					icon: 'loading'
				})
				setTimeout(()=>{
					_this.allShow = false
					_this.isStart = false
					// 	前后台都关闭监听
					uni.stopLocationUpdate().then((res)=>{
						//取消定时器
						clearInterval(_this.timer)
					})
				},2000)
				console.log("关闭上传GPS数据")
				
			},

			//获取定位信息
			isGetLocation(a = "scope.userLocation"){
				let _this = this
				uni.getSetting({
					success(res){
						console.log(res)
						//每次进入程序判断当前是否获得授权，如果没有就去获得授权，如果获得授权，就直接获取当前地理位置
						if(!res.authSetting[a]){
								_this.getAuthorizeInfo()
						}else{
							_this.getLocation();
						}
					}
				})
			},
			
			getAuthorizeInfo(a = "scope.userLocation") { // uniapp弹窗弹出获取授权（地理，个人微信信息等授权信息）弹窗
				var _this = this;
				uni.authorize({
					scope: a,
					success() { //允许授权
						//方式一
						// _this.getLocationInfo();
						// 方式二
						_this.getLocation();
					}
				})
			},
			getLocation(){
				uni.getLocation({
					type:"gcj02" ,
					isHighAccuracy:true ,
					success: (res) => {
						console.log("调用uni-getlocation")
						console.log(res)
						this.latitude = res.latitude
						this.longitude = res.longitude
						this.covers[0].latitude = res.latitude
						this.covers[0].longitude = res.longitude
						if(this.isPointInPolygon(this.covers[0],this.polygons[0].points)){
							// uni.showToast({
							// 	title:"在内部"
							// })
						}else{
							uni.showToast({
								title:"超出围栏",
								icon:"error"
							})
						}
						// temp赋值
						this.temp.vehicleId = this.vehicleId
						this.temp.latitude = res.latitude
						this.temp.longitude = res.longitude
						this.temp.speed = res.speed
						this.temp.accuracy = res.accuracy
						 this.temp.reportTime = this.$utils.getCurrentTime() //获取时间字符串
						console.log("被插入的值")
						console.log(this.temp)
						// // 单次插入
						// this.$api.insertLocation(this.temp).then((res) => {
						// 	console.log("插入成功")
						// })
					}
				})
			},
			//获取位置信息
			// async 
			bgetLocationInfo(){
				return new Promise((resolve) => {
					uni.getLocation({
						type: "gcj02",
						isHighAccuracy:true,
						success(res){
							  location.longitude = res.longitude;
							  location.latitude = res.latitude;
						      console.log("成功返回值")
							  console.log(res)
								console.log('当前位置的经度：' + res.longitude)
								console.log('当前位置的纬度：' + res.latitude)
							  const qqmapsdk = new QQMapWX({
							              key: 'QKJBZ-VXDE4-ZQMUP-DUWBN-OW4EH-GCBCM'  //这里填写自己申请的key
							       });
								  qqmapsdk.reverseGeocoder({
									location,
									success(response) {
									  let info = response.result;
									  console.log(info);
									  location.province = info.address_component.province;
									  location.city = info.address_component.city;
									  location.area = info.address_component.district;
									  location.street = info.address_component.street;
									  location.address = info.address;
									  // position = info.address;
									  resolve(location);
									},
								  });
								
						},
						fail(err){
						  console.log(err)
						  resolve(location)
						}
					})
				})
			},
			// 初始化多边形
			initPolygons(){
				let that = this
				that.$api.getFence({id:1}).then((res) => {
					console.log('更新电子围栏')
					that.fence =  res.datas
					let tmpPoints = JSON.parse(that.fence.points)
					var points = []
					// 封装新的结构
					tmpPoints.forEach((item) => {
						points.push({
							latitude:item.lat,
							longitude: item.lng
						})
					})
					that.polygons=[
					  {
					    points: points,
					    strokeWidth: 2,
						strokeColor: '#1492ff', // 描边的颜色
                        fillColor: '#b0cfff94', // 填充颜色
					    zIndex: 1,
					  },
					]
				})
			},
			// 判度是否在多边形内部
			isPointInPolygon(point, polygon) {
			  let inside = false;
			  const x = point.latitude;
			  const y = point.longitude;
			
			  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
			    const xi = polygon[i].latitude;
			    const yi = polygon[i].longitude;
			    const xj = polygon[j].latitude;
			    const yj = polygon[j].longitude;
			
			    const intersect = ((yi > y)   !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
			    if (intersect) {
			      inside = !inside;
			    }
			  }
			  return inside;
			},
			moreThanOneHour(time1) {
			  const date = new Date(time1)
			  const date2 = new Date()
			  // 超过一天
			  if ((date2.getTime() - date.getTime()) > 3600 * 1000 ) {
				return true
			  } else {
				return false
			  }
			},
			async sendRequest1() {
				let res = await this.$api.queryLocation({
					vehicleId: 1,
					startTime: '2023-04-06 07:03:11'
				});
				// this.res = '请求结果 : ' + JSON.stringify(res);
				console.log("请求结果")
				console.log(res)
			}
		}
	}
</script>

<style>

	.map{
		width: 100%;
		height: 500rpx;
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
