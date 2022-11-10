<template>
	<view class="user-operate-page">
		<view>
			<button class="button" @click="logout">退出登录</button>
		</view>
		
		<view>
			<uni-popup ref="logoutDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="取消" confirmText="确认" title="通知" content="是否确认退出登录"
					@confirm="logoutConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			logout(){
				this.$refs.logoutDialog.open()
			},
			logoutConfirm(){
				uni.showLoading({
					title: "退出登录中..."
				})
				uni.$http.delete('/logout/').then(res => {
					if(res.data.code == 400){
						uni.showToast({
							icon: "error",
							title : res.data.errmsg
						})
					}else if(res.data.code == 0){
						uni.clearStorage()
						uni.showToast({
							title: "退出登录成功"
						})
						setTimeout(() => {
							uni.reLaunch({
								url: "../index/index"
							})
						}, 500)
					}else{
						uni.showToast({
							icon: "error",
							title : "未知错误"
						})
					}
				},err => {
					uni.showToast({
						icon: "error",
						title : "系统错误"
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.user-operate-page{
		.button {
			background-color: #dd524d;
			height: 70rpx;
			width: 450rpx;
			line-height: 70rpx;
			color: white;
			font-size: 14px;
			margin: 70rpx auto;
		}
	}
</style>
