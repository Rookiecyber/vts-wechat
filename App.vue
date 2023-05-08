<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')

			console.group('%c 作者信息', "color:#999")
			this.makeMulti()
			console.groupEnd()
			
			
			// 已经登录就直接跳转
			uni.getStorage({
				key:"userInfo",
				success(res){
					console.log("APP.vue 中 ：用户已经登录")
					// this.setDriver(res.data)
					// console.log(res.data)
					uni.switchTab({
						url: '/pages/index/index'
					});
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			// 作者信息打印
			makeMulti() {
				let string = function() {
					/* 
				 __           _____  __       
				|  \         |     \|  \      
				| $$          \$$$$$| $$      
				| $$            | $$| $$      
				| $$       __   | $$| $$      
				| $$      |  \  | $$| $$      
				| $$_____ | $$__| $$| $$_____ 
				| $$     \ \$$    $$| $$     \
				 \$$$$$$$$  \$$$$$$  \$$$$$$$$ 
				    */
				   
				}
				let l = new String(string)
				l = l.substring(l.indexOf("/*") + 3, l.lastIndexOf("*/"))
				console.log(`%c ${l}`, "color:#999;font-weight:boldx");
			},


		}
	}
</script>



<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
@import url('static/iconfont/icon/iconfont.css');
// @import "uni_modules/uview-ui/index.scss";
	/*每个页面公共css */
</style>
