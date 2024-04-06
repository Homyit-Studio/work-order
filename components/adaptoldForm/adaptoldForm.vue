<template>
	<view class="confirm-form-page">
		<view class="confirm-form">
			<uni-card margin="2">
				<view class="confirm-title">
					<text>申请表</text>
				</view>
				<uni-forms ref="confirmForm" label-position="left" label-width="75px" :modelValue="confirmFormData"
					:rules="confirmFormRules">
					<uni-forms-item required label="乡镇" name="town">
						<uni-easyinput v-model="confirmFormData.town" placeholder="请输入乡镇(街道)" />
					</uni-forms-item>
					<uni-forms-item label="村" name="village" required>
						<uni-easyinput v-model="confirmFormData.village" placeholder="请输入村" />
					</uni-forms-item>
					<uni-forms-item label="县区" name="county" required>
						<uni-easyinput v-model="confirmFormData.county" placeholder="请输入县区" />
					</uni-forms-item>
					<uni-forms-item required label="姓名" name="name">
						<uni-easyinput v-model="confirmFormData.name" placeholder="请输入姓名" />
					</uni-forms-item>
					<uni-forms-item label="身份证号码" name="id_number" required>
						<uni-easyinput @blur="caculatePeople(confirmFormData.id_number)"
							v-model="confirmFormData.id_number" placeholder="请输入身份证号码" />
					</uni-forms-item>
					<uni-forms-item label="性别" name="sex" required>
						<uni-data-checkbox disabled v-model="confirmFormData.sex" :localdata="sexs" />
					</uni-forms-item>
					<uni-forms-item label="联系电话" name="mobile" required>
						<uni-easyinput v-model="confirmFormData.mobile" placeholder="请输入联系电话" />
					</uni-forms-item>
					<uni-forms-item label="家庭住址" name="address" required>
						<uni-easyinput type="textarea" v-model="confirmFormData.address" placeholder="请输入家庭住址" />
					</uni-forms-item>


					<view v-if="newwork == 2">
						<uni-forms-item label="户籍" name="dis_house">
							<uni-easyinput v-model="confirmFormData.dis_house" placeholder="请输入户籍" />
						</uni-forms-item>
						<uni-forms-item label="身份类型" name="type">
							<uni-data-select v-model="confirmFormData.type" :localdata="typeRange"
								placeholder="请输入身份类型">
							</uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="身体状态" name="health_status">
							<uni-data-select v-model="confirmFormData.health_status" :localdata="healthStatus"
								placeholder="请输入老人身体状态">
							</uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="是否使用轮椅" name="wheelchair_or">
							<uni-data-checkbox v-model="confirmFormData.wheelchair_or" :localdata="wheelchairStatus" />
						</uni-forms-item>


						<uni-forms-item label="家庭人口" name="family_number">
							<uni-easyinput v-model="confirmFormData.family_number" placeholder="请输入家庭人口数" />
						</uni-forms-item>
						<uni-forms-item label="家庭老人数" name="dis_number">
							<uni-easyinput v-model="confirmFormData.dis_number" placeholder="请输入家庭老人数" />
						</uni-forms-item>

						<uni-forms-item label="住宅情况" name="house_or">
							<uni-data-checkbox v-model="confirmFormData.house_or" :localdata="houseStatus" />
						</uni-forms-item>
						<uni-forms-item label="家庭联系人" name="fa_contact">
							<uni-easyinput v-model="confirmFormData.fa_contact" placeholder="请输入家庭联系人" />
						</uni-forms-item>
						<uni-forms-item label="联系人电话" name="contact_tel">
							<uni-easyinput v-model="confirmFormData.contact_tel" placeholder="请输入联系人电话" />
						</uni-forms-item>
						<view v-for="item in addList" :key="item.name">
							<uni-forms-item :label="item.c_name" :name="item.name">
								<uni-easyinput v-if="item.logical_len" type="textarea"
									v-model="confirmFormData[item.name]" :placeholder="'请输入'+item.c_name" />
								<uni-easyinput v-else v-model="confirmFormData[item.name]"
									:placeholder="'请输入'+item.c_name" />
							</uni-forms-item>
						</view>
						<uni-forms-item label="其他" name="detail">
							<uni-easyinput type="textarea" v-model="confirmFormData.detail" placeholder="请输入其他" />
						</uni-forms-item>
					</view>
				</uni-forms>
				<button class="button" @click="confirmSubmit('confirmForm')">提交</button>
			</uni-card>
		</view>
		<view>
			<uni-popup ref="reqDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="关闭" confirmText="同意" title="通知" content="是否确认提交"
					@confirm="reqConfirm"></uni-popup-dialog>
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
		name: 'adaptoldForm',
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
				addList: [],
				/* 身份类型 特困，建挡*/
				typeRange: [
				],
				/* 身体状态 自理老人*/
				healthStatus: [
				],
				rankRange: [{
						value: '一级',
						text: "一级"
					},
					{
						value: '二级',
						text: "二级"
					},
					{
						value: '三级',
						text: "三级"
					},
					{
						value: '四级',
						text: "四级"
					},
				],
				record_id: this.recordid,
				messageText: "",
				confirmFormData: {
					title: "",
					town: "",
					village: "",
					name: "",
					id_number: "",
					sex: "",
					mobile: "",
					address: "",
					county: ""
				},
				sexs: [{
					text: "男",
					value: "男"
				}, {
					text: "女",
					value: "女"
				}],
				wheelchairStatus: [{
					text: "是",
					value: "是"
				}, {
					text: "否",
					value: "否"
				}],
				houseStatus: [{
					text: "自有",
					value: "自有"
				}, {
					text: "非自有",
					value: "非自有"
				}],
				confirmFormRules: {
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
					id_number: {
						rules: [{
							required: true,
							errorMessage: '身份证号码不能为空'
						}]
					},
					sex: {
						rules: [{
							required: true,
							errorMessage: '性别不能为空'
						}]
					},
					mobile: {
						rules: [{
							required: true,
							errorMessage: '联系电话不能为空'
						}]
					},
					address: {
						rules: [{
							required: true,
							errorMessage: '地址不能为空'
						}]
					},
					county: {
						rules: [{
							required: true,
							errorMessage: '县区不能为空'
						}]
					},
				},
			};
		},
		mounted() {
			const healStatus = uni.getStorageSync('healStatus')
			const idType = uni.getStorageSync('idType')
				
			this.typeRange.push(...idType.map((_item,index)=>{
				return {
					value:_item.name,
					text:_item.name
				}
			}))
				
			this.healthStatus.push(...healStatus.map((_item)=>{
				return {
					value:_item.name,
					text:_item.name
				}
			}))
		},
		created() {
			console.log("create")
			if (this.newwork == 2) {

				this.getFieldAdd()
				this.getWorkdetail()
			}
		},
		methods: {
			getFieldAdd() {
				uni.$http.get("/field/add/").then((res) => {
					if (res.data.code == 400) {
						uni.showToast({
							icon: "error",
							title: res.data.errmsg
						})
					} else if (res.data.code == 0) {
						this.addList = res.data.add_list
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
			},
			caculatePeople(IDCard) {
				let age = 0,
					yearBirth, monthBirth, dayBirth, sex;
				//获取用户身份证号码
				let userCard = IDCard;
				//如果身份证号码为undefind则返回空
				if (!userCard) {
					return age;
				}
				let reg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/; //验证身份证号码的正则
				if (reg.test(userCard)) {
					if (userCard.length == 15) {
						let org_birthday = userCard.substring(6, 12);
						//获取出生年月日
						yearBirth = "19" + org_birthday.substring(0, 2);
						monthBirth = org_birthday.substring(2, 4);
						dayBirth = org_birthday.substring(4, 6);
						sex = userCard.substring(15, 16);
					} else if (userCard.length == 18) {
						//获取出生年月日
						yearBirth = userCard.substring(6, 10);
						monthBirth = userCard.substring(10, 12);
						dayBirth = userCard.substring(12, 14);
						sex = userCard.substring(16, 17);

					}
					//获取当前年月日并计算年龄
					let myDate = new Date();
					let monthNow = myDate.getMonth() + 1;
					let dayNow = myDate.getDate();
					let age = myDate.getFullYear() - yearBirth;
					if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
						age--;
					}
					//返回年龄
					// this.confirmFormData.age = age
					// this.confirmFormData.birth = yearBirth + monthBirth
					this.confirmFormData.sex = parseInt(sex) % 2 == 0 ? '女' : "男"
				} else {
					return ''
				}
			},
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
						//vue2响应式原理问题
						var isconemptyObj = (JSON.stringify(apptable) == "{}");
						if (isconemptyObj) {
							this.confirmFormData = {
								title: null,
								town: null,
								village: null,
								name: null,
								id_number: null,
								dis_house: null,
								sex: null,
								type: null,
								county: null,
								mobile: null,
								dis_number: null,
								family_number: null,
								address: null,
								detail: null,
								house_or: null,
								fa_contact: null,
								contact_tel: null,
								wheelchair_or: null,
								health_status: null,
							}
							this.getFieldAdd()
						} else {
							this.confirmFormData = apptable
						}
					} else {
						uni.showToast({
							icon: 'error',
							title: "未知错误"
						})
					}
					console.log(res)
				}, err => {
					uni.showToast({
						icon: 'error',
						title: "系统错误"
					})
				})
			},
			confirmSubmit(ref) {
				this.$refs[ref].validate().then(res => {
					const {
						name,
						town,
						village
					} = this.confirmFormData
					this.confirmFormData.title = `${name}${town}${village}申请表`
					this.$refs.reqDialog.open()
				}).catch(err => {
					console.log('err', err);
				})
			},
			reqConfirm() {
				if (this.newwork == 1) {
					this.newConfirm()
				} else if (this.newwork == 2) {
					this.modifyConfirm()
				}

			},
			newConfirm() {
				this.confirmFormData.record_id = this.record_id
				uni.showLoading({
					title: "正在提交中..."
				})
				console.log(this.confirmFormData)
				uni.$http.post('/oldtable/create/', this.confirmFormData).then((res) => {
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
							this.$emit("finishSteptwo")
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
			modifyConfirm() {
				this.confirmFormData.record_id = this.record_id
				uni.showLoading({
					title: "正在提交中..."
				})
				console.log(this.confirmFormData)
				uni.$http.post('/oldtable/modify/', this.confirmFormData).then((res) => {
					if (res.data.code == 400) {
						uni.showToast({
							icon: "error",
							title: res.data.errmsg
						})
					} else if (res.data.code == 0) {
						console.log(res)
						uni.showToast({
							title: `提交成功`
						})
						setTimeout(() => {
							this.$emit("finishSteptwo")
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
		},
	}
</script>

<style lang="scss">
	.confirm-form-page {
		.confirm-form {
			margin-top: 30rpx;

			.confirm-title {
				text-align: center;
				font-size: 18px;
				margin-bottom: 20rpx;
			}

			.form-catalog {
				text-align: center;
				padding: 10rpx;
				color: $work-color-main;
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
