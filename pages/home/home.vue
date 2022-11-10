<template>
	<view class="home-page">
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="2000"
				:duration="duration">
				<swiper-item>
					<view class="swiper-image">
						<image src="../../static/chanji.jpg" mode="aspectFit"></image>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-image">
						<image src="../../static/old.jpg" mode="aspectFit"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="workorder-operate">
			<uni-card :is-shadow="false" is-full>
				<view class="operate-options">
					<view class="nav-option" @click="addOrder">
						<uni-icons type="plusempty" color="#007aff" size="50"></uni-icons>
						<text>新建工单</text>
					</view>
				</view>
			</uni-card>
		</view>
		<uni-popup ref="newWorkpop" background-color="#fff">
			<view class="popup-content">
				<uni-forms ref="baseForm" :modelValue="baseFormData" :rules="baseFormRules">
					<uni-forms-item label="表类型" name="record_type" label-width="75px" required>
						<uni-data-checkbox v-model="baseFormData.record_type" :localdata="types" />
					</uni-forms-item>
				</uni-forms>
				<view class="check-button">
					<button @click="newCancel" class="cancel">取消</button>
					<button @click="newConfirm" class="agree">确认</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="positionPopup" background-color="#fff" @change="change">
			<view class="pospopup-content"><text class="text">应选择准确的地点，如果选择的只是位置，则无法解析准确，请重新选择一次，如果再次选择错误，将提交定位地点</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				record_id: null,
				baseFormData: {
					name: null,
					record_type: null
				},
				types: [{
					text: "适老化改造",
					value: "适老化改造"
				}, {
					text: "无障碍改造",
					value: "无障碍改造"
				}],
				baseFormRules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '工单名称不能为空'
						}]
					},
					record_type: {
						rules: [{
							required: true,
							errorMessage: '表选择不能为空'
						}]
					}
				},
			}
		},
		methods: {
			newCancel() {
				this.$refs.newWorkpop.close()
			},
			addOrder() {
				this.$refs.newWorkpop.open()
			},
			newConfirm() {
				const that = this
				this.$refs.baseForm.validate().then(res => {
					this.addConfirm()
				}).catch(err => {
					console.log('err', err);
				})
			},
			change(e) {
				// console.log('当前模式：' + e.type + ',状态：' + e.show);
				const record_id = this.record_id
				const that = this
				if (!e.show) {
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						success: function(res) {
							uni.hideLoading()
							console.log('当前位置的经度：' + res.longitude);
							console.log('当前位置的纬度：' + res.latitude);
							uni.chooseLocation({
								success: function(resmsgt) {
									//将数据传给后端
									console.log("success")
									uni.showLoading({
										title: "正在提交中"
									})
									that.addLocation(resmsgt, record_id)
									uni.showToast({
										title: "提交成功"
									})
								},
								fail: function(errt) {
									console.log(errt)
									if (errt.errMsg !=
										'chooseLocation:fail cancel') {
										uni.showToast({
											icon: "warn",
											title: "位置错误，提交初始位置"
										})
										that.addLocation(res, record_id)
									}
								}
							});
						},
						fail: function(err) {
							console.log(err)
						}
					});
				}
			},
			addConfirm() {
				const that = this
				this.baseFormData.submitter = uni.getStorageSync('user').username
				uni.showLoading({
					title: "正在提交中..."
				})
				uni.$http.post('/order/create/', this.baseFormData).then((res) => {
					if (res.data.code == 400) {
						uni.showToast({
							icon: "error",
							title: res.data.errmsg
						})
					} else if (res.data.code == 0) {
						uni.hideLoading()
						uni.showLoading({
							title: "正在打开地图"
						})
						const record_id = res.data.data.record_id
						this.record_id = record_id
						uni.getLocation({
							type: 'gcj02',
							geocode: true,
							success: function(res) {
								console.log(res)
								uni.hideLoading()
								uni.chooseLocation({
									success: function(resmsg) {
										//将数据传给后端
										console.log("success")
										uni.showLoading({
											title: "正在提交中"
										})
										that.addLocation(resmsg, record_id)
										uni.showToast({
											title: "提交成功"
										})
									},
									fail: function(err) {
										console.log(err)
										if (err.errMsg != 'chooseLocation:fail cancel') {
											uni.hideLoading()
											that.$refs.positionPopup.open()
										}
									}
								});
							},
							fail:function(err){
								console.log(err)
							}
						});
					} else {
						this.showToast({
							icon: "error",
							title: "未知错误"
						})
					}
					this.newCancel()
				}).catch((err) => {
					this.showToast({
						icon: "error",
						title: "系统错误"
					})
				})
			},
			addLocation(res, record_id) {
				const {
					latitude,
					longitude
				} = res
				console.log(latitude,
					longitude)
				uni.$http.post("/position/modify/", {
					record_id,
					latitude,
					longitude
				}).then(res => {
					if (res.data.code == 400) {
						uni.showToast({
							icon: "error",
							title: res.data.errmsg
						})
					} else if (res.data.code == 0) {
						if (this.baseFormData.record_type == '无障碍改造') {
							uni.navigateTo({
								url: `../addOrder/addOrder?recordid=${record_id}&type=1`
							})
						} else if (this.baseFormData.record_type == '适老化改造') {
							uni.navigateTo({
								url: `../addOrder/addOrder?recordid=${record_id}&type=2`
							})
						}
					} else {
						uni.showToast({
							icon: "error",
							title: "未知错误"
						})
					}
				}, err => {
					uni.showToast({
						icon: "error",
						title: "系统错误"
					})
				})

			}
		}
	}
</script>

<style lang="scss">
	.home-page {
		swiper {
			height: 230px;
		}

		.swiper-image {
			width: 750rpx;
			height: 230px;

			image {
				width: 100%;
			}
		}

		.operate-options {
			display: flex;
			justify-content: flex-start;

			.nav-option {
				padding: 60rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				background-color: #e6e6e6;
				border-radius: 5rpx;
				margin-right: 20rpx;
			}
		}

		.popup-content {
			width: 450rpx;
			padding: 40rpx;

			.cancel,
			.agree {
				width: 180rpx;
				height: 55rpx;
				line-height: 55rpx;
				margin: 10rpx;
			}
		}

		.check-button {
			display: flex;
			justify-content: space-around;
			margin: 30rpx;

			.cancel {
				width: 200rpx;
				height: 60rpx;
				color: #fff;
				font-size: 14px;
				line-height: 60rpx;
				background-color: #dd524d;
			}

			.agree {
				width: 200rpx;
				height: 60rpx;
				line-height: 60rpx;
				font-size: 14px;
				color: #fff;
				background-color: $work-color-main;
			}
		}
	}
</style>
