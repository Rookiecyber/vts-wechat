<template>
  <view class="container">
    <view class="search-bar">
      <input v-model="searchText" @input="searchContacts" placeholder="搜索联系人" />
    </view>
    <view class="contact-list" >
      <view v-for="(contact, index) in filteredContacts" :key="index" class="contact-item" @click="getMessageDetail(contact)">
        <image src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" class="avatar" />
        <text>{{ contact.userName }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchText: "",
      contacts: [
        // 示例数据，请根据实际情况替换
        { userName: "张三1", avatar: "https://example.com/avatar1.jpg" },
        { userName: "李四2", avatar: "https://example.com/avatar2.jpg" },
        { userName: "王五3", avatar: "https://example.com/avatar3.jpg" }
      ],
	  adminList:[],
      filteredContacts: []
    };
  },
  onLoad() {
    // 初始化时显示所有联系人
    // this.filteredContacts = this.contacts;
	this.initAdminList()
  },
  onPullDownRefresh() {
  	this.initAdminList()
  	setTimeout(() => {
  		// 模拟1秒后停止下拉刷新显示样式
  		uni.stopPullDownRefresh()
  	}, 1000)
  },
  methods: {
    searchContacts() {
      const keyword = this.searchText.trim().toLowerCase();
      this.filteredContacts = this.adminList.filter(
        contact => contact.userName.toLowerCase().includes(keyword)
      );
    },
	initAdminList(){
		let that = this
		that.$api.getAllAdmin({}).then((res) => {
			that.adminList = res.datas
			that.filteredContacts = that.adminList
		})
	},
	getMessageDetail(item){
		console.log("点击",item)
		uni.navigateTo({
			url: '/pages/message/messageInfo?item='+encodeURIComponent(JSON.stringify(item))
		});
	}
  }
};
</script>

<style>
.container {
  padding: 10px;
}
.search-bar {
  margin-bottom: 10px;
}
input {
  width: 100%;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}
.contact-list {
  display: flex;
  flex-direction: column;
}
.contact-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>