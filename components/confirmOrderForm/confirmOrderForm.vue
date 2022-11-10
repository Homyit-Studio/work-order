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

					<view class="form-catalog">
						<text>残疾人基本情况</text>
					</view>
					<uni-forms-item required label="姓名" name="name">
						<uni-easyinput v-model="confirmFormData.name" placeholder="请输入户主姓名" />
					</uni-forms-item>
					<uni-forms-item label="身份证号码" name="id_number" required>
						<uni-easyinput @blur="caculatePeople(confirmFormData.id_number)"
							v-model="confirmFormData.id_number" placeholder="请输入身份证号码" />
					</uni-forms-item>
					<uni-forms-item label="出生年月" name="birth" required>
						<uni-easyinput disabled v-model="confirmFormData.birth" placeholder="请输入出生年月" />
					</uni-forms-item>
					<uni-forms-item label="年龄" name="age" required>
						<uni-easyinput disabled v-model="confirmFormData.age" placeholder="请输入年龄(周岁)" />
					</uni-forms-item>
					<uni-forms-item label="性别" name="sex" required>
						<uni-data-checkbox disabled v-model="confirmFormData.sex" :localdata="sexs" />
					</uni-forms-item>

					<uni-forms-item label="家庭住址" name="address" required>
						<uni-easyinput type="textarea" v-model="confirmFormData.address" placeholder="请输入家庭住址" />
					</uni-forms-item>
					<uni-forms-item label="联系电话" name="mobile" required>
						<uni-easyinput v-model="confirmFormData.mobile" placeholder="请输入联系电话" />
					</uni-forms-item>

					<view v-if="newwork == 2">
						<uni-forms-item required label="户主姓名" name="fa_name">
							<uni-easyinput v-model="confirmFormData.fa_name" placeholder="请输入户主姓名" />
						</uni-forms-item>
						<uni-forms-item label="家庭人口数" name="family_number" required>
							<uni-easyinput v-model="confirmFormData.family_number" placeholder="请输入家庭人口数" />
						</uni-forms-item>
						<uni-forms-item label="家庭残疾人数" name="dis_number" required>
							<uni-easyinput v-model="confirmFormData.dis_number" placeholder="请输入家庭内残疾人数(人)" />
						</uni-forms-item>
						<uni-forms-item label="家庭年收入" name="family_eco" required>
							<uni-easyinput v-model="confirmFormData.family_eco" placeholder="请输入家庭经济年收入(元/年)" />
						</uni-forms-item>



						<uni-forms-item label="残疾人年收入" name="dis_eco" required>
							<uni-easyinput v-model="confirmFormData.dis_eco" placeholder="请输入残疾人年收入(元/年)" />
						</uni-forms-item>
						<uni-forms-item label="残疾类别" name="type" required>
							<uni-data-select v-model="confirmFormData.type" :localdata="typeRange"
								placeholder="请输入残疾类别">
							</uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="残疾等级" name="rank" required>
							<uni-data-select v-model="confirmFormData.rank" :localdata="rankRange"
								placeholder="请输入残疾等级">
							</uni-data-select>
						</uni-forms-item>
						<uni-forms-item label="残疾证号码" name="dis_id" required>
							<uni-easyinput v-model="confirmFormData.dis_id" placeholder="请输入残疾证号码" />
						</uni-forms-item>
						<uni-forms-item label="户籍性质" name="dis_house" required>
							<uni-data-checkbox v-model="confirmFormData.dis_house" :localdata="dis_houses" />
						</uni-forms-item>
						<view v-for="item in addList" :key="item.name">
							<uni-forms-item :label="item.c_name" :name="item.name" required>
								<uni-easyinput v-if="item.logical_len" type="textarea"
									v-model="confirmFormData[item.name]" :placeholder="'请输入'+item.c_name" />
								<uni-easyinput v-else v-model="confirmFormData[item.name]"
									:placeholder="'请输入'+item.c_name" />
							</uni-forms-item>
						</view>

						<view class="form-catalog">
							<text>改造内容</text>
						</view>
						<uni-forms-item label="地面平整" name="m2" required>
							<uni-easyinput v-model="confirmFormData.m2" placeholder="请输入地面平整数(平方米)" />
						</uni-forms-item>
						<uni-forms-item label="坡化" name="bo_num" required>
							<uni-easyinput v-model="confirmFormData.bo_num" placeholder="请输入坡化数(处)" />
						</uni-forms-item>
						<uni-forms-item label="房门改造" name="door_num" required>
							<uni-easyinput v-model="confirmFormData.door_num" placeholder="请输入房门改造数(个)" />
						</uni-forms-item>
						<uni-forms-item label="厨房:低位灶台" name="kit_num" required>
							<uni-easyinput v-model="confirmFormData.kit_num" placeholder="请输入厨房:低位灶台数(个)" />
						</uni-forms-item>
						<uni-forms-item label="卧室:安装扶手" name="kit_hold_num" required>
							<uni-easyinput v-model="confirmFormData.kit_hold_num" placeholder="请输入卧室:安装扶手(副)" />
						</uni-forms-item>
						<uni-forms-item label="卫生间:安装扶手" name="wc_hold_num" required>
							<uni-easyinput v-model="confirmFormData.wc_hold_num" placeholder="请输入卫生间:安装扶手(副)" />
						</uni-forms-item>
						<uni-forms-item label="安装座便器" name="seat_num" required>
							<uni-easyinput v-model="confirmFormData.seat_num" placeholder="请输入安装座便器数(个)" />
						</uni-forms-item>
						<uni-forms-item label="浴凳" name="chair_num" required>
							<uni-easyinput v-model="confirmFormData.chair_num" placeholder="请输入浴凳数(个)" />
						</uni-forms-item>
						<uni-forms-item label="改造内容" name="detail" required>
							<uni-easyinput type="textarea" v-model="confirmFormData.detail" placeholder="请输入改造内容)" />
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
		name: 'confirmOrderForm',
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
				typeRange: [{
						value: '视力残疾',
						text: "视力残疾"
					},
					{
						value: '听力残疾',
						text: "听力残疾"
					},
					{
						value: '言语残疾',
						text: "言语残疾"
					},
					{
						value: '智力残疾',
						text: "智力残疾"
					},
					{
						value: '肢体残疾',
						text: "肢体残疾"
					},
					{
						value: '精神残疾',
						text: "精神残疾"
					},
					{
						value: '多重残疾',
						text: "多重残疾"
					},
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
				fillformData: this.fillFormData,
				record_id: this.recordid,
				messageText: "",
				dis_houses: [{
					text: "城镇户口",
					value: "城镇户口"
				}, {
					text: "农村户口",
					value: "农村户口"
				}],
				confirmFormData: {
					title: "",
					town: "",
					village: "",
					name: "",
					id_number: "",
					sex: "",
					mobile: "",
					address: "",
					county: "",
					birth: "",
					age: ""
				},
				sexs: [{
					text: "男",
					value: "男"
				}, {
					text: "女",
					value: "女"
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
			this.confirmFormRules = {
				town: {
					rules: [{
						required: true,
						errorMessage: '乡镇不能为空'
					}]
				},
				birth: {
					rules: [{
						required: true,
						errorMessage: '出生年月不能为空'
					}]
				},
				village: {
					rules: [{
						required: true,
						errorMessage: '村不能为空'
					}]
				},
				fa_name: {
					rules: [{
						required: true,
						errorMessage: '户主姓名不能为空'
					}]
				},
				address: {
					rules: [{
						required: true,
						errorMessage: '家庭住址不能为空'
					}]
				},
				county: {
					rules: [{
						required: true,
						errorMessage: '县区不能为空'
					}]
				},
				mobile: {
					rules: [{
						required: true,
						errorMessage: '电话号码不能为空'
					}]
				},
				family_number: {
					rules: [{
							required: true,
							errorMessage: '家庭人口数不能为空'
						},
						{
							format: "number",
							errorMessage: '家庭人口数只能为数字'
						}
					]
				},
				dis_number: {
					rules: [{
							required: true,
							errorMessage: '家庭残疾人数不能为空'
						},
						{
							format: "number",
							errorMessage: '家庭残疾人数只能为数字'
						}
					]
				},
				family_eco: {
					rules: [{
							required: true,
							errorMessage: '家庭年收入不能为空'
						},
						{
							format: "number",
							errorMessage: '家庭年收入只能为数字'
						}
					]
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
				age: {
					rules: [{
							required: true,
							errorMessage: '年龄不能为空'
						},
						{
							format: "number",
							errorMessage: '年龄只能为数字'
						}
					]
				},
				id_number: {
					rules: [{
						required: true,
						errorMessage: '身份证号码不能为空'
					}]
				},
				dis_eco: {
					rules: [{
							required: true,
							errorMessage: '残疾人年不能为空'
						},
						{
							format: "number",
							errorMessage: '残疾人年收入只能为数字'
						}
					]
				},
				type: {
					rules: [{
						required: true,
						errorMessage: '残疾类型不能为空'
					}]
				},
				rank: {
					rules: [{
						required: true,
						errorMessage: '残疾等级不能为空'
					}]
				},
				dis_id: {
					rules: [{
						required: true,
						errorMessage: '残疾证号不能为空'
					}]
				},
				dis_house: {
					rules: [{
						required: true,
						errorMessage: '户籍不能为空'
					}]
				},
				m2: {
					rules: [{
							required: true,
							errorMessage: '平整面积不能为空'
						},
						{
							format: "number",
							errorMessage: '平整面积只能为数字'
						}
					]
				},
				bo_num: {
					rules: [{
							required: true,
							errorMessage: '坡化数不能为空'
						},
						{
							format: "number",
							errorMessage: '坡化数只能为数字'
						}
					]
				},
				door_num: {
					rules: [{
							required: true,
							errorMessage: '房门改造数不能为空'
						},
						{
							format: "number",
							errorMessage: '房门改造数只能为数字'
						}
					]
				},
				kit_num: {
					rules: [{
							required: true,
							errorMessage: '厨房灶台数不能为空'
						},
						{
							format: "number",
							errorMessage: '厨房灶台数只能为数字'
						}
					]
				},
				kit_hold_num: {
					rules: [{
							required: true,
							errorMessage: '卧室扶手数不能为空'
						},
						{
							format: "number",
							errorMessage: '卧室扶手数只能为数字'
						}
					]
				},
				wc_hold_num: {
					rules: [{
							required: true,
							errorMessage: '卫生间扶手数不能为空'
						},
						{
							format: "number",
							errorMessage: '卫生间扶手数只能为数字'
						}
					]
				},
				seat_num: {
					rules: [{
							required: true,
							errorMessage: '座便器不能为空'
						},
						{
							format: "number",
							errorMessage: '座便器只能为数字'
						}
					]
				},
				
				detail: {
					rules: [{
						required: true,
						errorMessage: '改造内容不能为空'
					}]
				},
				chair_num: {
					rules: [{
							required: true,
							errorMessage: '浴凳不能为空'
						},
						{
							format: "number",
							errorMessage: '浴凳只能为数字'
						}
					]
				}
			}
			this.addList.map(item => {
				if (item.c_type == "int") {
					this.confirmFormRules[item.name] = {
						rules: [{
							format: "number",
							errorMessage: `${item.c_name}只能为数字`
						}]
					}
					this.confirmFormRules[item.name].rules.push({

						required: true,
						errorMessage: `${item.c_name}不能为空`

					})

				} else {
					this.confirmFormRules[item.name] = {
						rules: [{
							required: true,
							errorMessage: `${item.c_name}不能为空`
						}]
					}
				}
			})
		},
		created() {

			if (this.newwork == 2) {
				// this.confirmFormRules = {
				// 	town: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '乡镇不能为空'
				// 		}]
				// 	},
				// 	birth: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '出生年月不能为空'
				// 		}]
				// 	},
				// 	village: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '村不能为空'
				// 		}]
				// 	},
				// 	fa_name: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '户主姓名不能为空'
				// 		}]
				// 	},
				// 	address: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '家庭住址不能为空'
				// 		}]
				// 	},
				// 	county: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '县区不能为空'
				// 		}]
				// 	},
				// 	mobile: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '电话号码不能为空'
				// 		}]
				// 	},
				// 	family_number: {
				// 		rules: [{
				// 				required: true,
				// 				errorMessage: '家庭人口数不能为空'
				// 			},
				// 			{
				// 				format: "number",
				// 				errorMessage: '家庭人口数只能为数字'
				// 			}
				// 		]
				// 	},
				// 	dis_number: {
				// 		rules: [{
				// 				required: true,
				// 				errorMessage: '家庭残疾人数不能为空'
				// 			},
				// 			{
				// 				format: "number",
				// 				errorMessage: '家庭残疾人数只能为数字'
				// 			}
				// 		]
				// 	},
				// 	family_eco: {
				// 		rules: [{
				// 				required: true,
				// 				errorMessage: '家庭年收入不能为空'
				// 			},
				// 			{
				// 				format: "number",
				// 				errorMessage: '家庭年收入只能为数字'
				// 			}
				// 		]
				// 	},
				// 	name: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '姓名不能为空'
				// 		}]
				// 	},
				// 	sex: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '性别不能为空'
				// 		}]
				// 	},
				// 	age: {
				// 		rules: [{
				// 				required: true,
				// 				errorMessage: '年龄不能为空'
				// 			},
				// 			{
				// 				format: "number",
				// 				errorMessage: '年龄只能为数字'
				// 			}
				// 		]
				// 	},
				// 	id_number: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '身份证号码不能为空'
				// 		}]
				// 	},
				// 	dis_eco: {
				// 		rules: [{
				// 				required: true,
				// 				errorMessage: '残疾人年不能为空'
				// 			},
				// 			{
				// 				format: "number",
				// 				errorMessage: '残疾人年收入只能为数字'
				// 			}
				// 		]
				// 	},
				// 	type: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '残疾类型不能为空'
				// 		}]
				// 	},
				// 	rank: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '残疾等级不能为空'
				// 		}]
				// 	},
				// 	dis_id: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '残疾证号不能为空'
				// 		}]
				// 	},
				// 	dis_house: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '户籍不能为空'
				// 		}]
				// 	},
				// 	m2: {
				// 		rules: [{
				// 				required: true,
				// 				errorMessage: '平整面积不能为空'
				// 			},
				// 			{
				// 				format: "number",
				// 				errorMessage: '平整面积只能为数字'
				// 			}
				// 		]
				// 	},
				// 	bo_num: {
				// 		rules: [{
				// 				required: true,
				// 				errorMessage: '坡化数不能为空'
				// 			},
				// 			{
				// 				format: "number",
				// 				errorMessage: '坡化数只能为数字'
				// 			}
				// 		]
				// 	},
				// 	door_num: {
				// 		rules: [{
				// 				required: true,
				// 				errorMessage: '房门改造数不能为空'
				// 			},
				// 			{
				// 				format: "number",
				// 				errorMessage: '房门改造数只能为数字'
				// 			}
				// 		]
				// 	},
				// 	kit_num: {
				// 		rules: [{
				// 				required: true,
				// 				errorMessage: '厨房灶台数不能为空'
				// 			},
				// 			{
				// 				format: "number",
				// 				errorMessage: '厨房灶台数只能为数字'
				// 			}
				// 		]
				// 	},
				// 	kit_hold_num: {
				// 		rules: [{
				// 				required: true,
				// 				errorMessage: '卧室扶手数不能为空'
				// 			},
				// 			{
				// 				format: "number",
				// 				errorMessage: '卧室扶手数只能为数字'
				// 			}
				// 		]
				// 	},
				// 	wc_hold_num: {
				// 		rules: [{
				// 				required: true,
				// 				errorMessage: '卫生间扶手数不能为空'
				// 			},
				// 			{
				// 				format: "number",
				// 				errorMessage: '卫生间扶手数只能为数字'
				// 			}
				// 		]
				// 	},
				// 	seat_num: {
				// 		rules: [{
				// 				required: true,
				// 				errorMessage: '座便器不能为空'
				// 			},
				// 			{
				// 				format: "number",
				// 				errorMessage: '座便器只能为数字'
				// 			}
				// 		]
				// 	},
				// 	chair_num: {
				// 		rules: [{
				// 				required: true,
				// 				errorMessage: '浴凳不能为空'
				// 			},
				// 			{
				// 				format: "number",
				// 				errorMessage: '浴凳只能为数字'
				// 			}
				// 		]
				// 	},
				// 	detail: {
				// 		rules: [{
				// 			required: true,
				// 			errorMessage: '其他不能为空'
				// 		}]
				// 	}
				// }
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
						// this.addList.map(item => {
						// 	this.confirmFormRules[item.name] = {
						// 		rules: [{
						// 			required: true,
						// 			errorMessage: `${item.c_name}不能为空`
						// 		}]
						// 	}
						// 	if (item.c_type == "int") {
						// 		this.confirmFormRules[item.name].rules.push({
						// 			format: "number",
						// 			errorMessage: `${item.c_name}只能为数字`
						// 		})
						// 	}
						// })
						// console.log(this.confirmFormData)
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
					this.confirmFormData.age = age
					this.confirmFormData.birth = yearBirth + monthBirth
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
								fa_name: null,
								address: null,
								mobile: null,
								family_number: null,
								dis_number: null,
								family_eco: null,
								name: null,
								sex: null,
								age: null,
								id_number: null,
								dis_eco: null,
								type: null,
								rank: null,
								dis_id: null,
								dis_house: null,
								m2: null,
								bo_num: null,
								door_num: null,
								kit_num: null,
								kit_hold_num: null,
								wc_hold_num: null,
								seat_num: null,
								chair_num: null,
								detail: null,
								birth: null,
								county: null
							}
							this.getFieldAdd()
						} else {
							this.confirmFormData = apptable
							this.caculatePeople(this.confirmFormData.id_number)
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
					console.log(res)
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
				uni.$http.post('/apptable/modify/', this.confirmFormData).then((res) => {
					console.log(res)
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
