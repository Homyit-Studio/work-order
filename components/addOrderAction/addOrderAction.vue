<template>
	<view class="add-action-page">
		<view class="add-form">
			<uni-card margin="2">
				<uni-forms ref="baseForm" :modelValue="baseFormData" :rules="baseFormRules">
					<uni-forms-item label="工单名称" name="name" required label-width="75px">
						<uni-easyinput v-model="baseFormData.name" placeholder="请输入工单名称" />
					</uni-forms-item>
					<uni-forms-item label="表类型" name="record_type" label-width="75px" required>
						<uni-data-checkbox v-model="baseFormData.record_type" :localdata="types" />
					</uni-forms-item>
				</uni-forms>
				<button class="button" @click="addSubmit('baseForm')">提交</button>
			</uni-card>
		</view>
		<view>
			<uni-popup ref="addDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="关闭" confirmText="同意" title="通知" content="是否确认提交"
					@confirm="addConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
		<view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="errMessage" type="message">
				<uni-popup-message type="error" :message="messageText" :duration="500"></uni-popup-message>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'addOrderAction',
		data() {
			return {
				messageText: "",
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
			};
		},
		methods: {
			addSubmit(ref) {
				this.$refs[ref].validate().then(res => {
					this.$refs.addDialog.open()
				}).catch(err => {
					console.log('err', err);
				})
			},
			addConfirm() {
				this.baseFormData.submitter = uni.getStorageSync('user').username
				uni.showLoading({
					title: "正在提交中..."
				})
				uni.$http.post('/order/create/', this.baseFormData).then((res) => {
					if (res.data.code == 400) {
						this.showToast({
							icon: "error",
							title: res.data.errmsg
						})
					} else if (res.data.code == 0) {
						uni.showToast({
							title: "提交成功"
						})
						setTimeout(() => {
							this.$emit("finishStepone", res.data.record_id)
						}, 100)
					} else {
						this.showToast({
							icon: "error",
							title: "未知错误"
						})
					}
				}).catch((err) => {
					this.showToast({
						icon: "error",
						title: "系统错误"
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.add-action-page {
		.add-form {
			margin-top: 30rpx;

			.button {
				background-color: $work-color-main;
				height: 70rpx;
				width: 400rpx;
				line-height: 70rpx;
				color: white;
				font-size: 14px;
				margin-bottom: 70rpx;
			}
		}
	}
</style>
