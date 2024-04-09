<template>
	<view class="invest-detail-page">
		<view v-if="userMsg.is_type == 'investor'">
			<uni-notice-bar show-icon text="完成各项工单修正后请务必点击完成工单修正才能将工单提交至监理处" />
		</view>
		<uni-card>
			<view v-show="userMsg.is_type != 'investor'">
				<view class="confirmtable table" v-if="record_type == 1">
					<view class="table-title">
						<uni-icons type="contact-filled" color="#f949ff" size="26"></uni-icons>
						<text>{{confirmtable.title}}</text>
					</view>
					<uni-list>
						<uni-list-item title="乡镇" :rightText="confirmtable.town" />
						<uni-list-item title="村" :rightText="confirmtable.village" />
						<uni-list-item title="县区" :rightText="confirmtable.county" />
						<view class="work-catalog">
							<text>残疾人家庭基本情况</text>
						</view>
						<uni-list-item title="户主姓名" :rightText="confirmtable.fa_name" />
						<uni-list-item title="家庭地址" :note="confirmtable.address" />
						<uni-list-item title="电话号码" :rightText="confirmtable.mobile" />
						<uni-list-item title="家庭人口数" :rightText="confirmtable.family_number" />
						<uni-list-item title="家庭残疾数" :rightText="confirmtable.dis_number" />
						<uni-list-item title="家庭年收入" :rightText="confirmtable.family_eco" />
						<view class="work-catalog">
							<text>残疾人基本情况</text>
						</view>
						<uni-list-item title="姓名" :rightText="confirmtable.name" />
						<uni-list-item title="性别" :rightText="confirmtable.sex" />
						<uni-list-item title="年龄" :rightText="confirmtable.age" />
						<uni-list-item title="出生年月" :rightText="confirmtable.birth" />
						<uni-list-item title="身份证号码" :rightText="confirmtable.id_number" />
						<uni-list-item title="残疾人年收入" :rightText="confirmtable.dis_eco" />
						<uni-list-item title="残疾类型" :rightText="confirmtable.type" />
						<uni-list-item title="残疾等级" :rightText="confirmtable.rank" />
						<uni-list-item title="残疾证号" :rightText="confirmtable.dis_id" />
						<uni-list-item title="户籍" :rightText="confirmtable.dis_house" />
						<view v-for="item in addList" :key="item.name">
							<uni-list-item v-if="item.logical_len" :title="item.c_name"
								:note="confirmtable[item.name]" />
							<uni-list-item v-else :title="item.c_name" :rightText="confirmtable[item.name]" />

						</view>
						<view class="work-catalog">
							<text>改造内容</text>
						</view>
						<uni-list-item title="平整面积" :rightText="confirmtable.m2" />
						<uni-list-item title="坡化数" :rightText="confirmtable.bo_num" />
						<uni-list-item title="房门改造数" :rightText="confirmtable.door_num" />
						<uni-list-item title="厨房灶台数" :rightText="confirmtable.kit_num" />
						<uni-list-item title="厨房扶手数" :rightText="confirmtable.kit_hold_num" />
						<uni-list-item title="卫生间扶手数" :rightText="confirmtable.wc_hold_num" />
						<uni-list-item title="卫生间扶手数" :rightText="confirmtable.seat_num" />
						<uni-list-item title="浴凳" :rightText="confirmtable.chair_num" />
						<uni-list-item title="其他" :note="confirmtable.detail" />
					</uni-list>
				</view>
				<view class="confirmtable table" v-else-if="record_type == 2">
					<view class="table-title">
						<uni-icons type="contact-filled" color="#f949ff" size="26"></uni-icons>
						<text>{{confirmtable.title}}</text>
					</view>
					<uni-list>
						<uni-list-item title="乡镇" :rightText="confirmtable.town" />
						<uni-list-item title="村" :rightText="confirmtable.village" />
						<uni-list-item title="姓名" :rightText="confirmtable.name" />
						<uni-list-item title="身份证号码" :rightText="confirmtable.id_number" />
						<uni-list-item title="性别" :rightText="confirmtable.sex" />
						<uni-list-item title="电话号码" :rightText="confirmtable.mobile" />
						<uni-list-item title="家庭地址" :note="confirmtable.address" />
						<uni-list-item title="户籍" :rightText="confirmtable.dis_house" />
						<uni-list-item title="身份类型" :rightText="confirmtable.type" />
						<uni-list-item title="身体状态" :rightText="confirmtable.health_status" />
						<uni-list-item title="是否使用轮椅" :rightText="confirmtable.wheelchair_or" />
						<uni-list-item title="住宅情况" :rightText="confirmtable.house_or" />
						
						<uni-list-item title="家庭老人数" :rightText="confirmtable.dis_number" />
						<uni-list-item title="家庭人口数" :rightText="confirmtable.family_number" />
						<uni-list-item title="家庭联系人" :rightText="confirmtable.fa_contact" />
						<uni-list-item title="联系人电话" :rightText="confirmtable.contact_tel" />
						<view v-for="item in addList" :key="item.name">
							<uni-list-item v-if="item.logical_len" :title="item.c_name"
								:note="confirmtable[item.name]" />
							<uni-list-item v-else :title="item.c_name" :rightText="confirmtable[item.name]" />
						</view>
						<uni-list-item title="其他" :note="confirmtable.detail" />
					</uni-list>
				</view>
				<view class="device_list table">
					<view class="table-title">
						<uni-icons type="shop-filled" color="#49e1ff" size="26"></uni-icons>
						<text>推荐清单</text>
					</view>
					<view @click="viewurl" class="search-button" v-show="userMsg.is_type == 'director'">
						<uni-icons type="wallet-filled"></uni-icons> <text>套餐详情 </text></text>
					</view>
					<view class="recom-list">
						<view class="recom-item" v-for="(item, index) in device_list" :key="index">
							<view class="title">{{item.name}}</view>
							<view class="cost">单价: {{item.cost}}</view>
							<view class="number">数量: {{item.number}}
							</view>
						</view>
					</view>
					<view class="empty" v-if="device_list.length == 0">
						<text>没有相关数据</text>
					</view>
				</view>
				<view class="image_list table">
					<view class="table-title">
						<uni-icons type="image" color="#ffea00" size="26"></uni-icons>
						<text>调查员相关图片</text>
					</view>
					<view v-show="userMsg.is_type == 'director' || userMsg.is_type == 'leader'">
						<view class="work-catalog">
							<text>家庭情况图片</text>
						</view>
						<view class="img-box">
							<view v-for="(item,index) in family_image_list" :key="item.name">
								<image @click="preview(family_image_list,index)"
									:src="`${BASE_URL}/static/download/` + item.name"
									style="width: 180rpx;height: 210rpx;" mode="aspectFill"></image>
							</view>
						</view>
						<view class="empty" v-if="family_image_list.length == 0">
							<text>没有相关数据</text>
						</view>
					</view>
					<view class="work-catalog">
						<text>改造前</text>
					</view>
					<view class="img-box">
						<view v-for="(item,index) in inv_image_list" :key="item.name">
							<image @click="preview(inv_image_list,index)"
								:src="`${BASE_URL}/static/download/` + item.name"
								style="width: 180rpx;height: 210rpx;" mode="aspectFill"></image>
						</view>
					</view>
					<view class="empty" v-if="inv_image_list.length == 0">
						<text>没有相关数据</text>
					</view>
					<view class="work-catalog">
						<text>调查员确认签名</text>
					</view>
					<view class="img-box">
						<view v-for="(item, index) in sign_image_list" :key="item.name" style="height: 210rpx;">
							<image @click="preview(sign_image_list, index)"
								:src="`${BASE_URL}/static/download/` + item.name"
								style="width: 210rpx;height: 310rpx;transform: rotate(270deg);margin-top: -60rpx;"
								mode="aspectFill"></image>
						</view>
					</view>
					<view class="empty" v-if="sign_image_list.length == 0">
						<text>没有相关数据</text>
					</view>
				</view>
				<!-- <view class="image_list table" v-if="userMsg.is_type == 'repair'">
					<view class="table-title">
						<uni-icons type="location-filled" color="#007aff" size="16"></uni-icons>
						<text>审核人员签名</text>
					</view>
					<view class="img-box">
						<view v-for="item in app_image_list" :key="item.name" style="height: 210rpx;">
							<image @click="preview(item.name)"
								:src="'${BASE_URL}/static/download/' + item.name"
								style="width: 210rpx;height: 310rpx;transform: rotate(270deg);margin-top: -60rpx;"
								mode="aspectFill"></image>
						</view>
					</view>
					<view class="empty" v-if="app_image_list.length == 0">
						<text>没有相关数据</text>
					</view>
				</view> -->
			</view>
			<view v-if="userMsg.is_type == 'director' && workStatus == '待审核'" class="table">
				<view class="table-title">
					<uni-icons type="upload-filled" color="#ff6581" size="26"></uni-icons>
					<text>审核工单</text>
				</view>
				<view class="check-button">
					<button @click="checkRevise" class="cancel">退回</button>
					<button @click="checkAgree" class="agree">通过</button>
				</view>
			</view>
			<view v-show="userMsg.is_type == 'director' || userMsg.is_type == 'leader'" class="table">
				<view class="table-title">
					<uni-icons type="videocam-filled" color="#25a8ff" size="26"></uni-icons>
					<text>施工人员相关图片</text>
				</view>
				<view class="work-catalog">
					<text>改造后</text>
				</view>
				<view class="img-box">
					<view v-for="(item,index) in rep_image_list" :key="item.name">
						<image @click="preview(rep_image_list, index)"
							:src="`${BASE_URL}/static/download/` + item.name"
							style="width: 180rpx;height: 210rpx;" mode="aspectFill"></image>
					</view>
				</view>
				<view class="empty" v-if="rep_image_list.length == 0">
					<text>没有相关数据</text>
				</view>
				<view class="work-catalog">
					<text>施工人员确认签名</text>
				</view>
				<view class="img-box">
					<view v-for="(item, index) in rep_sign_images" :key="item.name" style="height: 210rpx;">
						<image @click="preview(rep_sign_images, index)"
							:src="`${BASE_URL}/static/download/` + item.name"
							style="width: 210rpx;height: 310rpx;transform: rotate(270deg);margin-top: -60rpx;"
							mode="aspectFill"></image>
					</view>
				</view>
				<view class="empty" v-if="rep_sign_images.length == 0">
					<text>没有相关数据</text>
				</view>
			</view>

			<view v-if="userMsg.is_type == 'investor'" class="investor-modi table">
				<view class="table-title">
					<uni-icons type="color" color="#ff77db" size="26"></uni-icons>
					<text>修正工单</text>
				</view>
				<uni-list>
					<uni-list-item title="查看工单导航位置" showArrow clickable @click="navigatePosition" />
					<uni-list-item title="修正工单导航位置" showArrow clickable @click="toModifynav" />
					<!-- <uni-list-item title="修正工单申请表" showArrow clickable @click="toModifyInvestor(1)" /> -->
					<uni-list-item title="修正工单申请表" showArrow clickable @click="toModifyInvestor(2)" />
					<uni-list-item title="修正家庭情况图片" showArrow clickable @click="toModifyInvestor(6)" />
					<uni-list-item title="修正工单现场图片" showArrow clickable @click="toModifyInvestor(3)" />
					<uni-list-item title="修正工单推荐清单" showArrow clickable @click="toModifyInvestor(4)" />
					<uni-list-item title="修正工单确认签名" showArrow clickable @click="toModifyInvestor(5)" />
				</uni-list>
				<view>
					<button class="button" @click="investorFinishConfirm">完成工单修正</button>
				</view>
			</view>
			<view v-else-if="userMsg.is_type == 'repair'" class="investor-modi table">
				<view class="table-title">
					<uni-icons type="location-filled" color="#007aff" size="26"></uni-icons>
					<text>施工反馈</text>
				</view>
				<uni-list>
					<uni-list-item title="修正改造前现场图片" showArrow clickable @click="repairClick(0)" />
					<!-- <uni-list-item title="填写施工验收表" showArrow clickable @click="repairClick(1)" /> -->
					<uni-list-item title="上传改造后现场图片" showArrow clickable @click="repairClick(2)" />
					<uni-list-item title="确认签名" showArrow clickable @click="repairClick(3)" />
				</uni-list>
				<view>
					<button class="button" @click="repairConfirm">完成施工反馈</button>
				</view>
			</view>
		</uni-card>
		<uni-popup ref="checkRevisepop" background-color="#fff">
			<view class="popup-content">
				<uni-easyinput v-model="suggestion" type="textarea" placeholder="请输入审核意见"></uni-easyinput>
				<view class="check-button">
					<button @click="checkReviceCancel" class="cancel">取消</button>
					<button @click="checkReviceConfirm" class="agree">确认</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="checkAgreepop" background-color="#fff">
			<view class="popup-content">
				<uni-easyinput v-model="suggestion" type="textarea" placeholder="请输入审核意见"></uni-easyinput>
				<view class="check-button">
					<button @click="checkAgreeCancel" class="cancel">取消</button>
					<button @click="checkAgreeConfirm" class="agree">确认</button>
				</view>
			</view>
		</uni-popup>
		<view>
			<uni-popup ref="modifyDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="关闭" confirmText="同意" title="通知" content="是否确认完成工单修正"
					@confirm="modifyConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="repairfinishDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="关闭" confirmText="同意" title="通知" content="是否确认完成"
					@confirm="repairfinishConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
		<!-- v-show="userMsg.is_type == 'repair'" -->
		<view class="nav-map" v-if="userMsg.is_type == 'repair'" @click="navigatePosition">
			<uni-icons type="navigate-filled" size="26" color="#fff"></uni-icons>
			<text>导航</text>
		</view>
		<uni-popup ref="positionPopup" background-color="#fff" @change="change">
			<view class="popup-content"><text class="text">应选择准确的地点，如果选择的只是位置，则无法解析准确，请重新选择一次，如果再次选择错误，将提交定位地点</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { BASE_URL } from '../../main'

	export default {
		data() {
			return {
				addList: [],
				record_id: null,
				apptable: {},
				confirmtable: {},
				checktable: {},
				suggestion: "",
				device_list: [],
				inv_image_list: [],
				sign_image_list: [],
				app_image_list: [],
				rep_image_list: [],
				rep_sign_images: [],
				userMsg: {},
				isRepairEmpty: null,
				position: {},
				record_type: null,
				family_image_list: null,
				workStatus: ""
			}
		},
		onLoad(options) {
			this.record_id = options.id
			this.userMsg = uni.getStorageSync('user')
			this.record_type = options.type
			this.workStatus = options.status
		},
		onShow() {
			this.getFieldAdd()
			this.getWorkdetail()
			// if (this.userMsg.is_type != 'investor') {
			// 	this.getWorkdetail()
			// }
		},
		methods: {
			// 查看套餐详情
			viewurl() {
				uni.downloadFile({
					url: `${BASE_URL}/static/excel/device-detail.xlsx`, // 文件下载路径
					success: (res) => {
						if (res.statusCode === 200) {
							//保存成功并打开文件
							uni.openDocument({
								filePath: res.tempFilePath,
								success: (res) => console.log('成功打开文件')
							})
						}
					},
					fail(err) {
						this.$u.toast('下载失败');
					}
				})
			},
			getFieldAdd() {
				if (this.userMsg.is_type != "leader") {
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
				}

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
									console.log(resmsgt)
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
						}
					});
				}
			},
			toModifynav() {
				uni.showLoading({
					title: "正在打开地图"
				})
				// this.$refs.positionPopup.open()
				const record_id = this.record_id
				const that = this
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function(res) {
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

									// uni.showLoading({
									// 	title: "正在提交中"
									// })
									// that.addLocation(res, record_id)
									// uni.showToast({
									// 	title: "提交成功"
									// })
								}
							}
						});
					}
				});
			},
			addLocation(res, record_id) {
				const {
					latitude,
					longitude
				} = res
				console.log(res)
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
						console.log("$")
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
			navigatePosition() {
				const {
					latitude,
					longitude
				} = this.position
				console.log(this.position)
				uni.openLocation({
					latitude,
					longitude,
					success: function() {
						console.log('success');
					},
					fail() {
						uni.showToast({
							title: "导航错误",
							icon: "error"
						})
					}
				});
			},
			repairClick(status) {
				uni.navigateTo({
					url: `../repairOrder/repairOrder?recordid=${this.record_id}&status=${status}&new=${this.isRepairEmpty}`
				})
			},
			repairConfirm() {
				this.$refs.repairfinishDialog.open()
			},
			repairfinishConfirm() {
				uni.$http.get(`/repairstate/modify/${this.record_id}`).then(res => {
					if (res.data.code == 400) {
						uni.showToast({
							title: res.data.errmsg,
							icon: "error"
						})
					} else if (res.data.code == 0) {
						uni.showToast({
							title: "提交成功"
						})
						uni.navigateBack({
							fail(err) {
								console.log(err)
							}
						})
					} else {
						uni.showToast({
							title: res.data.errmsg,
							icon: "未知错误"
						})
					}
				}, err => {
					uni.showToast({
						title: res.data.errmsg,
						icon: "系统错误"
					})
				})
			},
			investorFinishConfirm() {
				this.$refs.modifyDialog.open()
			},
			modifyConfirm() {
				uni.showLoading({
					title: "正在修正中..."
				})
				uni.$http.get(`/appstate/modify/${this.record_id}`).then(res => {
					if (res.data.code == 400) {
						uni.showToast({
							title: res.data.errmsg,
							icon: "error"
						})
					} else if (res.data.code == 0) {
						uni.showToast({
							title: "成功"
						})
						uni.navigateBack({
							fail(err) {
								console.log(err)
							}
						})
					} else {
						uni.showToast({
							title: res.data.errmsg,
							icon: "未知错误"
						})
					}
				}, err => {
					uni.showToast({
						title: res.data.errmsg,
						icon: "系统错误"
					})
				})
			},
			toModifyInvestor(status) {
				console.log(status,'status')
				uni.navigateTo({
					url: `/pages/investworkModify/investworkModify?status=${status}&&recordid=${this.record_id}&type=${this.record_type}`
				})
			},
			checkRevise() {
				this.$refs.checkRevisepop.open('center')
			},
			checkAgree() {
				this.$refs.checkAgreepop.open('center')
			},
			checkReviceCancel() {
				this.suggestion = ""
				this.$refs.checkRevisepop.close()
			},
			checkAgreeCancel() {
				this.suggestion = ""
				this.$refs.checkAgreepop.close()
			},
			//确认拒绝审核
			checkReviceConfirm() {
				uni.showLoading({
					title: "正在提交中..."
				})
				uni.$http.post("/nostate/", {
					record_id: this.record_id,
					suggestion: this.suggestion
				}).then(res => {
					if (res.data.code == 400) {
						uni.showToast({
							title: res.data.msg,
							icon: "error"
						})
					} else if (res.data.code == 0) {
						uni.showToast({
							title: "提交成功"
						})
						setTimeout(() => {
							uni.navigateBack({
								fail(err) {
									console.log(err)
								}
							})
						}, 500)
					} else {
						uni.showToast({
							title: "未知错误",
							icon: "error"
						})
					}
					this.suggestion = ""
				}, err => {
					uni.showToast({
						title: res.data.msg,
						icon: "系统错误"
					})
				})
			},
			//确认通过审核
			checkAgreeConfirm() {
				uni.$http.post("/yesstate/", {
					record_id: this.record_id,
					suggestion: this.suggestion
				}).then(res => {
					if (res.data.code == 400) {
						uni.showToast({
							title: res.data.msg,
							icon: "error"
						})
					} else if (res.data.code == 0) {
						uni.showToast({
							title: "审核完成"
						})
						setTimeout(() => {
							uni.reLaunch({
								url: "/pages/myWork/myWork"
							})
						}, 500)
					} else {
						uni.showToast({
							title: "未知错误",
							icon: "error"
						})
					}
				}, err => {
					uni.showToast({
						title: res.data.msg,
						icon: "系统错误"
					})
				})
				this.suggestion = ""
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
							apptable,
							confirmtable,
							checktable,
							device_list,
							positon
						} = res.data.data
						console.log(res.data.data)
						// this.apptable = apptable
						this.confirmtable = apptable
						// this.checktable = checktable
						this.device_list = device_list
						this.position = positon
						this.isRepairEmpty = (JSON.stringify(checktable) == "{}");
						console.log(this.isRepairEmpty)
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
				uni.$http.get(`/image/query/${this.record_id}`).then(res => {
					if (res.data.code == 400) {
						uni.showToast({
							icon: 'error',
							title: res.data.errmsg
						})
					} else if (res.data.code == 0) {
						uni.hideLoading()

						this.inv_image_list = res.data.image_list.filter((item) => {
							return item.type == 'inv_scene'
						})
						this.sign_image_list = res.data.image_list.filter((item) => {
							return item.type == 'inv_sign'
						})
						this.app_image_list = res.data.image_list.filter((item) => {
							return item.type == 'app_sign'
						})
						this.rep_image_list = res.data.image_list.filter((item) => {
							return item.type == 'rep_scene'
						})
						this.rep_sign_images = res.data.image_list.filter((item) => {
							return item.type == 'rep_sign'
						})
						this.family_image_list = res.data.image_list.filter((item) => {
							return item.type == "fam_scene"
						})
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
			preview(imagelist, index) {
				let array = [];
				imagelist.forEach((item) => {
					let url = `${BASE_URL}/static/download/` + item.name
					array.push(url);
				})
				uni.previewImage({
					current: array[index],
					urls: array
				});
			},
		}
	}
</script>

<style lang="scss">
	.invest-detail-page {
		position: relative;

		.recom-list {

			.recom-item {
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid gainsboro;
				padding: 10px 20px;

				.title {
					font-size: 14px;
					color: #323232;
					width: 170rpx;
				}

				.cost,
				.number {
					text-align: left;
					font-size: 12px;
					color: #9c9c9c;
				}

				.uni-icons {
					margin-left: 20rpx;
				}
			}
		}

		.nav-map {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: fixed;
			bottom: 50rpx;
			right: 50rpx;
			width: 80rpx;
			height: 80rpx;
			padding: 10rpx;
			background-color: $work-color-main;
			color: #fff;
			border-radius: 50%;
			font-size: 12px;
		}

		.empty {
			font-size: 10px;
			margin: 20rpx;
			text-align: center;
		}

		.table {
			.table-title {
				display: flex;
				align-items: center;
				font-size: 16px;
				margin: 30rpx 20rpx;

				text {
					margin-left: 10rpx;
				}
			}
		}

		.search-button {
			text-align: center;
			width: 150rpx;
			margin: 10px auto;
			background-color: aqua;
			border-radius: 5px;
			padding: 8rpx 10rpx;
			color: #323232;
		}


		.work-catalog {
			text-align: center;
			margin: 10rpx;
		}

		.img-box {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
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

		.investor-modi {
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
	}
</style>
