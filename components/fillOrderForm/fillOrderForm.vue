<template>
	<view class="fill-form-page">
		<view class="fill-form">
			<uni-card margin="2">
				<view class="fill-title">
					<text>项目申请表</text>
				</view>
				<uni-forms ref="fillForm" label-position="left" label-width="75px" :modelValue="fillFormData"
					:rules="fillFormRules">
					<uni-forms-item required label="乡镇" name="town">
						<uni-easyinput v-model="fillFormData.town" placeholder="请输入乡镇(街道)" />
					</uni-forms-item>
					<uni-forms-item label="村" name="village" required>
						<uni-easyinput v-model="fillFormData.village" placeholder="请输入村" />
					</uni-forms-item>
					<uni-forms-item required label="姓名" name="name">
						<uni-easyinput v-model="fillFormData.name" placeholder="请输入残疾人姓名" />
					</uni-forms-item>
					<uni-forms-item label="性别" name="sex" required>
						<uni-data-checkbox v-model="fillFormData.sex" :localdata="sexs" />
					</uni-forms-item>
					<uni-forms-item label="出生年月" name="birth" required>
						<uni-easyinput v-model="fillFormData.birth" placeholder="请输入出生年月" />
					</uni-forms-item>
					<uni-forms-item label="残疾类别" name="type" required>
						<uni-easyinput v-model="fillFormData.type" placeholder="请输入残疾类别" />
					</uni-forms-item>
					<uni-forms-item label="残疾等级" name="rank" required>
						<uni-easyinput v-model="fillFormData.rank" placeholder="请输入残疾等级" />
					</uni-forms-item>
					<uni-forms-item label="残疾证号码" name="dis_id" required>
						<uni-easyinput v-model="fillFormData.dis_id" placeholder="请输入残疾证号码" />
					</uni-forms-item>
					<uni-forms-item label="家庭入口数" name="family_number" required>
						<uni-easyinput v-model="fillFormData.family_number" placeholder="请输入家庭入口数" />
					</uni-forms-item>
					<uni-forms-item label="经济情况" name="family_eco" required>
						<uni-easyinput v-model="fillFormData.family_eco" placeholder="请输入家庭经济年收入(单位:元)" />
					</uni-forms-item>
					<uni-forms-item label="联系电话" name="mobile" required>
						<uni-easyinput v-model="fillFormData.mobile" placeholder="请输入联系电话" />
					</uni-forms-item>
					<uni-forms-item label="家庭住址" name="address" required>
						<uni-easyinput type="textarea" v-model="fillFormData.address" placeholder="请输入家庭住址" />
					</uni-forms-item>
					<uni-forms-item label="改造内容" name="detail" required>
						<uni-easyinput type="textarea" v-model="fillFormData.detail" placeholder="请输入申请改造内容" />
					</uni-forms-item>
				</uni-forms>
				<button class="button" @click="fillSubmit('fillForm')">提交</button>
			</uni-card>
		</view>
		<view>
			<uni-popup ref="fillDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="关闭" confirmText="同意" title="通知" content="是否确认提交"
					@confirm="fillConfirm"></uni-popup-dialog>
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
		name: 'fillOrderForm',
		props: {
			recordid: {
				type: Number,
				required: true
			},
			newwork: {
				type: Number
			}
		},
		created() {
			if (this.newwork == 2) {
				this.getWorkdetail()
			}
		},
		data() {
			return {
				record_id: this.recordid,
				massageText: "",
				fillFormData: {
					title: null,
					town: null,
					village: null,
					name: null,
					sex: null,
					birth: null,
					type: null,
					rank: null,
					dis_id: null,
					family_number: null,
					family_eco: null,
					mobile: null,
					address: null,
					detail: null
				},
				sexs: [{
					text: "男",
					value: "男"
				}, {
					text: "女",
					value: "女"
				}],
				fillFormRules: {
					town: {
						rules: [{
							required: true,
							errorMessage: '乡镇不能为空'
						}]
					},
					village: {
						rules: [{
							required: true,
							errorMessage: '村不能为空'
						}]
					},
					name: {
						rules: [{
							required: true,
							errorMessage: '姓名不能为空'
						}]
					},
					sex: {
						rules: [{
							required: true,
							errorMessage: '性别不能为空'
						}]
					},
					birth: {
						rules: [{
							required: true,
							errorMessage: '出生年月不能为空'
						}]
					},
					type: {
						rules: [{
							required: true,
							errorMessage: '工单名称不能为空'
						}]
					},
					rank: {
						rules: [{
							required: true,
							errorMessage: '残疾类别不能为空'
						}]
					},
					dis_id: {
						rules: [{
							required: true,
							errorMessage: '残疾证号码不能为空'
						}]
					},
					family_number: {
						rules: [{
							required: true,
							errorMessage: '家庭入口数不能为空'
						}, {
							format: 'number',
							errorMessage: "家庭入口数只能为数字"
						}]
					},
					family_eco: {
						rules: [{
							required: true,
							errorMessage: '家庭经济收入不能为空'
						}, {
							format: 'number',
							errorMessage: "家庭经济收入情况只能为数字"
						}]
					},
					mobile: {
						rules: [{
							required: true,
							errorMessage: '联系电话不能为空'
						}
						]
					},
					address: {
						rules: [{
							required: true,
							errorMessage: '家庭住址不能为空'
						}]
					},
					detail: {
						rules: [{
							required: true,
							errorMessage: '改造内容不能为空'
						}]
					}
				},
			};
		},
		methods: {
			getWorkdetail() {
				uni.showLoading({
					title: "数据加载中"
				})
				uni.$http.get(`/info/${this.record_id}`).then(res => {
					if (res.data.code == 400) {
						uni.showToast({
							icon: 'error',
							title: res.data.errmsg
						})
					} else if (res.data.code == 0) {
						uni.hideLoading()
						const {
							apptable
						} = res.data.data
						//因为vue2中不能实时监听对象的添加，所以要先对对象进行属性赋空
						var isemptyObj = (JSON.stringify(apptable) == "{}");
						if (isemptyObj) {
							this.fillFormData = {
								title: null,
								town: null,
								village: null,
								name: null,
								sex: null,
								birth: null,
								type: null,
								rank: null,
								dis_id: null,
								family_number: null,
								family_eco: null,
								mobile: null,
								address: null,
								detail: null
							}
						} else {
							this.fillFormData = apptable
						}
					} else {
						uni.showToast({
							icon: 'error',
							title: "未知错误"
						})
					}
				}, err => {
					uni.showToast({
						icon: 'error',
						title: "系统错误"
					})
				})
			},
			fillSubmit(ref) {
				this.$refs[ref].validate().then(() => {
					this.fillFormData.title = this.fillFormData.name + this.fillFormData.town + this.fillFormData
						.village + '申请表'
					this.$refs.fillDialog.open()
				}).catch(err => {
					console.log('err', err);
				})
			},
			fillConfirm() {
				if (this.newwork == 1) {
					this.newConfirm()
					
				} else if (this.newwork == 2) {
					this.modifyConfirm()
				} else {
					uni.showToast({
						title: "模式错误",
						icon: "error"
					})
				}
			},
			modifyConfirm() {
				console.log("modify")
				const that = this
				this.fillFormData.record_id = this.record_id
				uni.showLoading({
					title: "正在提交中..."
				})
				uni.$http.post('/apptable/modify/', this.fillFormData).then((res) => {
					if (res.data.code == 400) {
						uni.showToast({
							icon: "error",
							title: res.data.errmsg
						})
					} else if (res.data.code == 0) {
						uni.showToast({
							title: `提交成功`
						})
						setTimeout(() => {
							this.$emit("finishStepone", that.fillFormData)
						}, 100)
					} else {
						uni.showToast({
							icon: "error",
							title: "未知错误"
						})
					}
				}).catch((err) => {
					uni.showToast({
						icon: "error",
						title: "系统错误"
					})
				})
			},
			newConfirm() {
				console.log("new")
				const that = this
				this.fillFormData.record_id = this.record_id
				uni.showLoading({
					title: "正在提交中..."
				})
				uni.$http.post('/apptable/create/', this.fillFormData).then((res) => {
					if (res.data.code == 400) {
						uni.showToast({
							icon: "error",
							title: res.data.errmsg
						})
					} else if (res.data.code == 0) {
						uni.showToast({
							title: `提交成功`
						})
						setTimeout(() => {
							this.$emit("finishStepone", that.fillFormData)
						}, 100)
					} else {
						uni.showToast({
							icon: "error",
							title: "未知错误"
						})
					}
				}).catch((err) => {
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
	.fill-form-page {
		.fill-form {
			margin-top: 30rpx;

			.fill-title {
				text-align: center;
				font-size: 18px;
				margin-bottom: 20rpx;
			}

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
