<template>
	<!-- 整个页面的最外层容器 -->
	<view class="container">
		<!-- 该部分展示了用户头像、真实姓名 -->
		<u-cell-group :border="false">
			<u-cell :border="false">
				<!-- 单元格左侧图标，使用 u-avatar 组件显示用户头像 -->
				<u-avatar slot="icon" :src="full_avatar_url" size="70"></u-avatar>
				<template slot="title">
					<u-text :text="driverName" style="font-size: 20upx;"></u-text>
				</template>
				<!-- 标题下方的描述信息 -->
				<u-text slot="label" :text="driverPhone" color="#909399" size="13.5" :show-sex="true"></u-text>
			</u-cell>
		</u-cell-group>
		<!-- 功能入口展示区域 -->
		<view class="grid">
			<!-- 循环遍历渲染每一个功能入口 -->
			<view v-for="(gridItem,itemIndex) in gridItems" :key="itemIndex" class="grid-item"
				@click="goToPage(gridItem.pagePath)">
				<!-- 使用uni-icons组件渲染对应的图标 -->
				<view>
					<uni-icons customPrefix="iconfont" :type="gridItem.iconName" :color="gridItem.iconColor" size="30">
					</uni-icons>
				</view>
				<!-- 渲染对应的功能名称 -->
				<view>
					<u-text :text="gridItem.title"></u-text>
				</view>
			</view>
		</view>

		<view class="cell-group">
			<u-cell-group :border="false">
				<u-cell title="关于" :border="false" isLink url="/pages/about/about">
					<uni-icons slot="icon" customPrefix="iconfont" type="icon-about" color="mediumslateblue"
						size="20">
					</uni-icons>
				</u-cell>
				<u-cell title="退出登录" :border="false" isLink @click="showModal">
					<uni-icons slot="icon" customPrefix="iconfont" type="icon-exit" color="mediumslateblue"
						size="20">
					</uni-icons>
				</u-cell>
			</u-cell-group>
		</view>

		<!-- 退出登录弹窗 -->
		<u-modal :show="modalInfo.show" :content="modalInfo.content" @confirm="logout" :showCancelButton="true"
			@cancel="modalInfo.show=false"></u-modal>
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
				full_avatar_url: '@/static/image/avatar.png',
				show: true,
				gridItems: [ // 定义一个数组gridItems
					{ // 对象1
						iconName: 'icon-auth', // 图标名称
						iconColor: '#2b85e4 ', // 图标颜色
						title: '个人资料', // 标题
						pagePath: '/pages/mine/detail' // 跳转路径
					},
					{
						iconName: 'icon-edit-password', // 图标名称
						iconColor: '#606266', // 图标颜色
						title: '车辆绑定', // 标题
						pagePath: '/pages/bind/bind' // 跳转路径
					}
				],
				modalInfo: { // 定义一个modalInfo对象
					content: '确定要退出登录吗？', // 内容
					show: false // 是否展示
				}
			}
		},
		computed:{
			...mapState(['driverName',"driverAge","driverGender","driverPhone","idcard"]),   // 得到账号信息
		},
		onLoad() {
			
		},
		methods: {
			showModal() { // 定义showModal方法
				this.modalInfo.show = true; // 修改modalInfo的show属性
			},
			logout() { // 定义logout方法
				// TODO
				//this.userLogout() // 调用userLogout action
				uni.removeStorage({
					key:"userInfo"
				}).then((res)=> {
					console.log("删除userInfo--storage")
				})
				uni.removeStorage({
					key:"vehicleInfo"
				}).then((res)=> {
					console.log("删除vehicleInfo--storage")
				})
				// 重新启动应用
				uni.reLaunch({ // 重新启动应用
					url: '/pages/login/login' // 跳转到登录页
				})
			},
			goToPage(path) { // 定义goToPage方法
				uni.navigateTo({ // 跳转到指定页面
					url: path
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100vw;
		height: 100vh;
		background-color: WhiteSmoke;
	}

	.grid {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 200rpx;
		width: 95vw;
		margin: 30rpx auto;
		background-color: white;
		border-radius: 20rpx;
	}

	.grid-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.grid-item:active {
		opacity: 0.5;
	}

	.cell-group {
		width: 95vw;
		margin: 30rpx auto;
		border-radius: 20rpx;
		background-color: white;
	}

	.logout-btn {
		margin: 40rpx 20rpx;
	}
</style>
