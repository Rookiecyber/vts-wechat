<template>
	<!-- 禁止页面穿透 -->
	<page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
	<view class="container">
		<u-overlay :show="allShow" :duration="100" :z-index ="999" :opacity="0.3"></u-overlay>
		<view>
			<uni-segmented-control :current="select" :values="subsectionlist" style-type="text" active-color="#2a781d"
				@clickItem="sectionChange" style="border-radius: 50upx;" />
		</view>
		<!-- // 全部任务界面 -->
		<view v-if="select === 0">
			<!-- 全部任务界面 -->
			<template v-if="taskList.length">
					<!-- 全部任务界面 -->
					<view v-for="(item,index) in taskList" :key="index">
						<!-- <view v-if="item.task"></view> -->
						<uni-card class="task" :title="'任务'+item.taskId" :sub-title="item.taskType" :extra="item.startTime+' --> '+item.endTime" 
								:thumbnail="'/static/image/task'+item.taskStatus+'.png'" >
								<view v-if="item.taskStatus!=0">
									<u-steps :current="item.taskStatus-1">
										<u-steps-item title="待接收" ></u-steps-item>
										<u-steps-item title="进行中"  ></u-steps-item>
										<u-steps-item title="完成"></u-steps-item>
									</u-steps>
								</view>
								<view v-if="item.taskStatus==0">
									<!-- <text style="font-style: ;">已禁用</text> -->
									<text style="font-size: 35upx; font-weight:400;  
									text-align:center; background-color: #ffffff;color: #ff0000;" >
									已禁用
									</text>
								</view>
							<text class="taskContent" v-if="item.taskContent.length>18">内容：	{{item.taskContent.substring(0, 18)}}......</text>
							<text class="taskContent" v-if="item.taskContent.length<=18">内容：	{{item.taskContent}}</text>
							<!-- 操作按钮 -->
							<view class="bottom-buttons">
							    <view class="button-tag" @click="openDetail(item)">查看详情</view>
							    <!-- <view class="button-tag">取消</view> -->
							    <view v-if="item.taskStatus==1" class="button-tag" style="background-color: #0abafa; color: white;"
								 @click="selectTask(item)">
									接受
								</view>
							</view>
						</uni-card>
					</view>
					<u-row customStyle="margin-bottom: 10px">
						<u-col span="4" offset="4">
							<view class="loading" style="margin-left: 20upx;" :hidden="!loadMore">正在载入更多...</view>
						</u-col>
					</u-row>
					<u-row customStyle="margin-bottom: 10px">
						<u-col span="4" offset="4">
							 <view class="loading" style="align-items: center;" :hidden="!loadAll">已加载全部</view>
						</u-col>
					</u-row>
			</template>
			<!-- 无数据提示 -->
			<template v-else>
				<u-empty
						text='正在加载'
						mode="order"
						icon="http://cdn.uviewui.com/uview/empty/order.png"
				>
				</u-empty>
			</template>
		</view>
		<!-- 我的任务 -->
		<view v-if="select === 1">
			<!-- 我的任务界面 -->
			<template v-if="mytaskList.length">
					<!-- 我的任务界面 -->
					<view v-for="(item,index) in mytaskList" :key="index">
						<uni-card class="task" :title="'任务'+item.taskId" :sub-title="item.taskType" :extra="item.startTime+' --> '+item.endTime" 
								:thumbnail="'/static/image/task'+item.taskStatus+'.png'" >
								<view v-if="item.taskStatus!=0">
									<u-steps :current="item.taskStatus-1">
										<u-steps-item title="待接收" ></u-steps-item>
										<u-steps-item title="进行中"  ></u-steps-item>
										<u-steps-item title="完成"></u-steps-item>
									</u-steps>
								</view>
								<view v-if="item.taskStatus==0">
									<!-- <text style="font-style: ;">已禁用</text> -->
									<text style="font-size: 35upx; font-weight:400;  
									text-align:center; background-color: #ffffff;color: #ff0000;" >
									已禁用
									</text>
								</view>
							<text class="taskContent" v-if="item.taskContent.length>18">内容：	{{item.taskContent.substring(0, 18)}}......</text>
							<text class="taskContent" v-if="item.taskContent.length<=18">内容：	{{item.taskContent}}</text>
							<!-- 操作按钮 -->
							<view class="bottom-buttons">
								<!-- <view class="button-tag">删除</view> -->
								<view class="button-tag" @click="openDetail(item)">查看详情</view>
								<view v-if="item.taskStatus==2" class="button-tag" style="background-color: #0abafa;
								 color: white;" @click="finishTask(item)">
								  完成
								 </view>
							</view>
						</uni-card>
					</view>
			</template>
			<!-- 无数据提示 -->
			<template v-else>
				<u-empty
						text='暂无任务'
						mode="order"
						icon="http://cdn.uviewui.com/uview/empty/order.png"
				>
				</u-empty>
			</template>
		</view>
		<!-- 接受任务弹窗 -->
		<u-modal :show="modalInfo.show" :content="modalInfo.content" @confirm="confirmSelect(item)" :showCancelButton="true"
			@cancel="modalInfo.show=false"></u-modal>
		<u-modal :show="modalInfo2.show" :content="modalInfo2.content" @confirm="confirmFinish" :showCancelButton="true"
			@cancel="modalInfo2.show=false"></u-modal>
	</view>
</template>
<script>
	export default {
		components: {},
		data() {
			return {
				allShow:false, //全局屏蔽遮罩
				loadMore: false, //"上拉加载"的变量，默认false，隐藏  
				loadAll: false ,//“没有数据”的变量，默认false，隐藏  
				// 是否正在请求数据(节流)
				isloading: false,
				subsectionlist: ['全部任务', '我的任务'],
				select: 0,    // 0:全部任务 1：我的任务
				// 新增
				taskList:[],
				mytaskList:[],
				currentPage:1,
				pageSize:5,
				total:0,
				show:false ,//禁止页面滑动穿透,
				modalInfo: { // 定义一个modalInfo对象
					content: '确定要接受该任务吗？', // 内容
					show: false // 是否展示
				},
				modalInfo2: { // 定义一个modalInfo对象
					content: '确定完成该任务吗？', // 内容
					show: false // 是否展示
				},
				tempTask:null,  //临时task数据
			};
		},
		/**
		 * 页面下拉刷新事件的处理函数
		 */
		// 监听到下拉刷新
		onPullDownRefresh() {
			let that =this
			console.log("监听到下拉刷新");
			if(that.select==0){
				that.currentPage =1 //重新开始
				that.loadAll =false
				that.loadMore =false
				that.total = 0
				// that.taskList = []
				that.taskList.splice(0,that.taskList.length)  
				that.initTaskList()
				//全部任务刷新
				console.log("全部任务页面刷新")
			}else if(that.select==1){   // 我的任务刷新
				that.initMyTaskList()
			}
	
			setTimeout(() => {
				// 模拟2秒后停止下拉刷新显示样式
				uni.stopPullDownRefresh()
				that.isloading = false  
			}, 2000)
		}, 
		/**
		 * 页面加载事件的处理函数
		 */
	   onLoad(){
		 this.initTaskList()  
		 this.initMyTaskList()
	   },
	   /**
	    * 页面上拉触底事件的处理函数
	    */
	   onReachBottom() {
			let that = this;
		   // 判断是否正在请求其它数据，如果是，则不发起额外的请求
		   if (that.isloading) {
			   return
		   }else{
			   // 判断数据是否加载完
			  if (that.taskList.length >= that.total) {
			   that.loadMore =false
			   that.loadAll = true
				 uni.showToast({
					title: '数据加载完毕'
				 });
			  }else{
				  // 数据未加载完
				
				  	// 显示加载图标  
				  	that.allShow = true
				     uni.showLoading({
				  	 title: '加载数据中...',
				     })
				     // 查询下一页
				     that.currentPage++
				     
				  if (!that.loadMore) {
				  	that.loadMore =true//加载中  
				  	that.loadAll = false//是否加载完所有数据
				  	 //加载更多，这里做下延时加载
				  	 setTimeout(() => {
				  		 //
				  	   that.initTaskList()
				  		uni.hideLoading()
						that.loadMore =false // 加载完毕
				  		that.allShow = false
				  	 }, 2000)
					}
				   console.log("触发上拉");
			  }
			   
		   }
		   
	   },
		methods: {
			// 禁止页面滑动穿透
			change(e) {
				this.show = e.show
			},
			sectionChange(index) {
				this.select = index.currentIndex;
				console.log("当前选择:",this.select) // 0:全部任务 1：我的任务
			},
			// 初始化任务列表数据
			initMyTaskList(){
				this.isloading = true
				let that = this
				let _data = {
					driverId: uni.getStorageSync("userInfo").driverId
				}
				// 查询我的任务
				that.$api.queryMyTask(_data).then((res) => {
					that.mytaskList = res.datas.task
					console.log("我的任务列表",that.mytaskList)
				})
			},
			initTaskList(){
				console.log("开始查询")
				// ** 打开节流阀
				this.isloading = true
				let that = this
				let _data = {
					page:that.currentPage,
					limit:that.pageSize
				}
				console.log('查询参数',_data)
				that.$api.queryTaskByPage(_data).then((res) => {
					that.total = res.datas.total
					let temptaskList = res.datas.task
					// that.taskList = [...that.taskList, ...res.datas.task]
					temptaskList.forEach((item) => {
						that.taskList.push(item)
					})
					// this.goodsList = [...this.goodsList, ...res.message.goods]
					console.log("任务列表结果：",that.taskList)
					console.log("总长度",that.total)
					that.isloading = false
				})
				that.isloading = false
			},
		// 查看任务详情
		openDetail(item){
			console.log('查看任务详情',item)
			// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
			// this.$refs.popup.open("center")
			//在起始页面跳转到test.vue页面并传递参数
			// item='+ encodeURIComponent(JSON.stringify(item))
			// '/pages/test/test?item='+ encodeURIComponent(JSON.stringify(item))
			uni.navigateTo({
				url: '/pages/task/taskInfo?item='+encodeURIComponent(JSON.stringify(item))
			});

		},
		selectTask(item){
			this.modalInfo.show = true; //接受任务弹窗
			this.tempTask = item
			console.log("接受任务",this.tempTask)
		},
		finishTask(item){
			this.modalInfo2.show = true;   //完成任务弹窗
			this.tempTask = item
			console.log("完成任务",this.tempTask)
		},
		confirmSelect(){
			console.log("确认点击接受")
			let that = this
			let _data = {
				taskId: this.tempTask.taskId,
				driverId: uni.getStorageSync("userInfo").driverId,
				taskStatus:2
			}
			that.$api.selectTask(_data).then((res) => {
				console.log("接受后任务",res)
				if(res.code==-1){ //发送错误
					uni.showToast({
						title: res.message,
						icon: 'error'
					})
				}else{
					let tmp = res.datas.task
					uni.showLoading({
						message:"更新中"
					})
					that.modalInfo.show =false  //关闭弹窗

					setTimeout(()=>{
					// 延迟更新
					that.taskList.forEach((taskItem,index) => {
						if(taskItem.taskId== tmp.taskId){
							console.log("index = ",index)
							that.taskList.splice(index,1,tmp)
						}
						
					})
					// 更新我的任务
					that.initMyTaskList()
					uni.hideLoading()
					},1500)
				}
		
			})
			console.log("接受任务结束")
		},
		confirmFinish(){
			let that = this
			let _data = {
				taskId: this.tempTask.taskId,
				taskStatus:3,
				finishTime: that.$utils.getCurrentTime()
			}
			that.$api.updateTask(_data).then((res)=>{
				console.log("完成任务",res)
				if(res.code==-1){
					uni.showToast({
						title: res.message,
						icon: 'error'
					})
				}
				else{
					let tmp = res.datas.task
					uni.showLoading({
						message:"更新中"
					})
					that.modalInfo2.show =false  //关闭弹窗
					
					setTimeout(()=>{
					// 延迟更新
					that.mytaskList.forEach((taskItem,index) => {
						if(taskItem.taskId== tmp.taskId){
							console.log("index = ",index)
							that.mytaskList.splice(index,1,tmp)
						}
						
					})
					uni.hideLoading()
					},1500)
				}
			})
		}
		}
	};
</script>
<style lang="scss">
	.pagecontrol-top-scroll {
	    height: 40px;
	    width: 100%;
	    white-space: nowrap;
	    box-sizing: border-box;
	    border-bottom-width: 1rpx;
	    border-bottom-style: solid;
	    border-bottom-color: #ededed;
	}
	
	.pagecontrol-top-title {
	    height: 100%;
	    width: 100%;
	    display: flex;
	    justify-content: space-around;
	}
	
	.pagecontrol-top-text {
	    height: 100%;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	    text-align: center;
	}
	
	.pagecontrol-top-normal {
	    color: black;
	    font-size: 16px;
	}
	
	.pagecontrol-top-selected {
	    color: #0abafa;
	    font-size: 17px;
	}
	
	.pagecontrol-bottom-line {
	    width: 100%;
	    height: 1px;
	    margin-top: 2px;
	    background-color: #0abafa;
	}
	
	.pagecontrol-bottom-line-show {
	    visibility: visible;
	}
	
	.pagecontrol-bottom-line-visibility {
	    visibility: hidden;
	}
	.task{
		sub-title{
			color: red;
		}
	}
	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}
	 .taskCard{
text-overflow: ellipsis;
white-space: nowrap;
overflow: hidden;
	}

	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 10px;
		width: 30px;
		height: 30px;
	}
	
	.slot-text {
		flex: 1;
		font-size: 14px;
		color: #4cd964;
		margin-right: 10px;
	}
	.bottom-buttons {
	    margin-top: 10rpx;
	    display: flex;
	    justify-content: flex-end;
	    align-items: center;
	}
	
	.button-tag {
	    margin-left: 40rpx;
	    height: 30px;
	    line-height: 30px;
	    padding: 0 20px;
	    border-radius: 15px;
	    color: #a5a5a5;
	    border: 1px solid #ededed;
	}
</style>

