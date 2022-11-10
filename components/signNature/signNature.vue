<template>
	<view class="sign-nature-page">
		<uni-card margin="2">
			<view class="sign-box">
				<view class="sign-buttons">
					<button class="click-button" @click="clear">清空</button>
					<button class="click-button" @click="revoke">撤回</button>
					<!-- <button class="click-button" @click="saveTempFilePath">保存临时图片路径</button> -->
					<button class="click-button" @click="signConfirm">提交签名</button>
				</view>
				<v-sign borderWidth="10" height="1100" @init="onSignInit"></v-sign>
			</view>
		</uni-card>
		<!-- 	<view style="position: absolute; z-index: 9999;">
			<uni-popup ref="signDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="取消" confirmText="确认" title="通知" content="是否确认提交"
					@confirm="signConfirm"></uni-popup-dialog>
			</uni-popup>
		</view> -->
		<!-- <view v-if="newwork == 1">
			<button class="button" @click="finishWork">完成工单</button>
		</view>
		<view v-else-if="newwork == 2">
			<button class="button" @click="finishSign">完成签名</button>
		</view> -->
		<view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="errMessage" type="message">
				<uni-popup-message type="error" :message="messageText" :duration="500"></uni-popup-message>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="finishDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="关闭" confirmText="同意" title="通知" content="是否确认完成"
					@confirm="finishConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
		<view>
			<image ref="image"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'signNature',
		props: {
			recordid: {
				type: Number
			},
			newwork: {
				type: Number
			}
		},
		data() {
			return {
				record_id: this.recordid,
				messageText: ""
			};
		},
		created() {
			// plus.screen.unlockOrientation();
			// plus.screen.lockOrientation('landscape-primary');

		},
		methods: {
			finishSign() {
				uni.navigateBack({
					fail(err) {
						console.log(err)
					}
				})
			},
			finishConfirm() {
				// uni.$http.get(`/appstate/modify/${this.record_id}`).then(res => {
				// 	if (res.data.code == 400) {
				// 		uni.showToast({
				// 			title: res.data.errmsg,
				// 			icon: "error"
				// 		})
				// 	} else if (res.data.code == 0) {
				// 		uni.showToast({
				// 			title: "成功"
				// 		})
				// 		uni.navigateBack({
				// 			fail(err) {
				// 				console.log(err)
				// 			}
				// 		})
				// 	} else {
				// 		uni.showToast({
				// 			title: res.data.errmsg,
				// 			icon: "未知错误"
				// 		})
				// 	}
				// }, err => {
				// 	uni.showToast({
				// 		title: res.data.errmsg,
				// 		icon: "系统错误"
				// 	})
				// })
				uni.switchTab({
					url:"../../pages/myWork/myWork"
				})
			},
			onSignInit(signCtx) {
				this.signCtx = signCtx
			},
			// 清空
			clear() {
				this.signCtx.clear()
			},
			// 撤回
			revoke() {
				this.signCtx.revoke()
			},
			saveTempFilePath() {
				this.$refs.signDialog.open()
			},
			// 压缩图片
			getImageInfo(src) {
				let _this = this;
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '压缩中...',
						icon: 'none'
					});
					plus.zip.compressImage({
							src: src,
							dst: src,
							overwrite: true, //是否生成新图片
							quality: 20, //1-100,1图片最小，100图片最大
							width: 'auto',
							height: 'auto'
						},
						(result) => {
							let imgPathUrl = result.target;
							let imgPathSize = result.size;
							console.log('压缩后的体积', imgPathSize);
						}
					)
				});
			},
			async signConfirm() {
				uni.showLoading({
					title: "提交中"
				})
				const path = await this.signCtx.canvasToTempFilePath({"fileType":'jpg'})
				const token = uni.getStorageSync('x-token')
				const record_id = this.record_id
				const that = this
				uni.uploadFile({
					url: "https://gd.jxiot.top/image/upload/",
					filePath: path,
					name: 'image', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
					header: {
						"x-token": token
					},
					formData: {
						"type": "inv_sign",
						"record_id": record_id
					},
					success: (res) => {
						uni.showToast({
							title: "提交成功"
						})
						if(that.newwork == 1){
							that.finishConfirm()
						}else if(that.newwork == 2){
							that.finishSign()
						}
					},
					fail: (err) => {
						uni.showToast({
							icon: 'error',
							title: '提交失败'
						});
						console.log(err)
					},
				})
			},

		}
	}
</script>

<style lang="scss">
	.sign-nature-page {
		.sign-box {
			display: flex;

			.sign-buttons {
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				.click-button {
					width: 170rpx;
					font-size: 12px;
					transform: rotate(90deg);
				}
			}
		}

		.button {
			background-color: $work-color-main;
			height: 70rpx;
			width: 400rpx;
			line-height: 70rpx;
			color: white;
			font-size: 14px;
			margin: 70rpx auto;
		}
	}
</style>
