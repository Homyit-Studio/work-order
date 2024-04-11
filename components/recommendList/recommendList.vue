<template>
	<view class="recommend-list-page">
		<uni-card margin="2px">
			<view class="top-button">
				<view class="search-button" @click="searchRecom">
					<uni-icons type="search" size="16"></uni-icons>
					<text>查找</text>
				</view>
				<view @click="viewurl" class="search-button"><uni-icons type="wallet-filled"></uni-icons> <text>套餐详情
					</text></text></view>
			</view>
			<view>
				<uni-data-picker ref="picker" placeholder="请选择设备类型" popup-title="请选择设备" :step-searh="false"
					:localdata="deviceTree" v-model="deviceChoose.device_id" @nodeclick="onnodeclick">
				</uni-data-picker>
			</view>
			<view class="recom-detail">
				<text>单价:{{recomDetail}}</text>
			</view>
			<view class="number-box">
				<uni-number-box :step="0.01" v-model="deviceChoose.number" padding />
				<text> {{recomUnit}}</text>
			</view>
			<view class="notes">
				<text>备注: </text>
				<uni-easyinput maxlength="100" type="textarea" v-model="deviceChoose.notes" placeholder="请输人备注信息">
				</uni-easyinput>
			</view>
			<button class="add-button" @click="Submit">添加</button>
		</uni-card>
		<uni-card margin="2px">
			<view>
				<text>清单列表(点击进行删除)</text>
			</view>
			<!-- <uni-list>
				<uni-list-item v-for="(item, index) in finishReList" :key="index" :title="deviceidMap[item.device_id]"
					:rightText="'数量:' + item.number" showArrow clickable @click="dellocalDevice(index, item)">
				</uni-list-item>
			</uni-list> -->
			<view class="recom-list">
				<view class="recom-item" v-for="(item, index) in finishReList" :key="index">
					<view class="title">{{deviceidMap[item.device_id]}}</view>
					<view class="cost">单价: {{item.cost}}</view>
					<view class="number">数量: {{item.number}}
						<view class="recom-icon-delete" @click="dellocalDevice(index, item)">
							删除
						</view>
						<view class="recom-icon-modify" @click="modifyDevice(item,index)">
							修改
						</view>
						<!-- <uni-icons type="right" size="14" color="#9c9c9c"></uni-icons> -->
					</view>
				</view>
			</view>
			<view class="recom-detail">
				<text>总价:{{allcost}}</text>
			</view>
		</uni-card>
		<button class="button" @click="finishRecom">上传推荐清单</button>
		<!-- <view>
			<uni-popup ref="recommendDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="关闭" confirmText="同意" title="通知" content="是否确认添加"
					@confirm="recommendConfirm"></uni-popup-dialog>
			</uni-popup>
		</view> -->
		<view>
			<uni-popup ref="finishDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="关闭" confirmText="同意" title="通知" content="是否确认提交"
					@confirm="finishConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="deldeviceDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="关闭" confirmText="同意" title="通知" content="是否确认删除"
					@confirm="dellocaldeviceConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
		<view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="errMessage" type="message">
				<uni-popup-message type="error" :message="messageText" :duration="500"></uni-popup-message>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="searchPopup" background-color="#fff">
				<view class="search-content">
					<view class="search-input">
						<uni-easyinput @change="searchDevice" suffixIcon="search" v-model="searchValue"
							placeholder="请输入设备名" @iconClick="searchDevice">
						</uni-easyinput>
					</view>
					<view class="search-area">
						<view class="device-list" v-for="item in deviceSearch" :key="item.device_id"
							@click="chooseDevice(item)">
							<text>{{item.device_type}} /{{item.name}}</text>
						</view>
						<view class="empty" v-if="deviceSearch.length == 0">查找设备为空</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="modifyPopup" background-color="#fff" type="dialog">
				<uni-popup-dialog v-if="isShowDialog" type="info" cancelText="取消" confirmText="修改" title="修改"
					 mode="input" placeholder="请输入修改的数量"  @confirm="handleModifyCondfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
		
		<uni-popup ref="noticeFinishInfoPop">
			<uni-popup-dialog type="info" :showClose="false"  confirmText="我知道了" title="通知" :content="popupText"
				@confirm="finishConfirmNotice"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
import { BASE_URL } from '../../main'
	export default {
		name: "recommendList",
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
				finishReList: [],
				messageText: "",
				deviceChoose: {
					record_id: this.recordid,
					device_id: null,
					number: 0.0,
					cost: 0,
					notes: ""
				},
				searchValue: "",
				deviceTree: [],
				recomDetail: "",
				deviceMap: {},
				deviceidMap: {},
				deviceAll: [],
				deviceSearch: [],
				costMap: {},
				delindex: null,
				allcost: 0.0,
				saveDevice: [],
				delitem: {},
				recomUnit: "",
				isShowDialog:false, // 对dialog进行销毁，以便重置数据
				popupText:'', 
				exitDeviceId:[] // 已存在的
			}
		},
		//asnyc原理还需要理解透彻
		//为了解决时间上的错误，运用两个生命周期
		created() {
			this.initDevice()
		},
		mounted() {
			if (this.newwork == 2) {
				this.getWorkdetail()
			}
		},
		computed:{
			// 存储已选择的id号
			ListId(){
				return this.finishReList.map((_item)=>_item.device_id)
			}
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
			chooseDevice(item) {
				uni.showToast({
					title: "选择成功"
				})
				this.deviceChoose.device_id = item.device_id
				this.deviceChoose.cost = item.cost
				this.recomDetail = item.cost
				this.recomUnit = item.unit_type
				this.$refs.searchPopup.close()
			},
			searchDevice() {
				let work = this.deviceAll.filter(item => {
					console.log(item.name.indexOf(this.searchValue))
					if (item.name.indexOf(this.searchValue) != -1) {
						return true
					} else {
						return false
					}
				})
				this.deviceSearch = work
			},
			searchRecom() {
				this.$refs.searchPopup.open()
			},
			dellocaldeviceConfirm() {
				this.finishReList.splice(this.delindex, 1)
				this.allcost -= parseFloat((this.costMap[`${this.delitem.device_id}`] * this.delitem.number).toFixed(2))
				console.log((this.costMap[`${this.delitem.device_id}`] * this.delitem.number).toFixed(2))
				uni.showToast({
					title: "删除成功"
				})
			},
			dellocalDevice(index, item) {
				this.delindex = index
				this.delitem = item
				this.$refs.deldeviceDialog.open()
			},
			deleteDeviceAll(devicelist) {
				console.log("delete")
				devicelist.map((item) => {
					uni.$http.get(`/devicelist/delete/${item.id}`).then(res => {
						if (res.data.code == 400) {
							uni.showToast({
								title: res.data.errmsg,
								icon: "error"
							})
						} else if (res.data.code == 0) {
							console.log(res.data.errmsg)
						} else {
							uni.showToast({
								title: "未知错误",
								icon: "error"
							})
						}
					}, err => {
						uni.showToast({
							title: "系统错误",
							icon: "error"
						})
					})
				})

			},
			getWorkdetail() {
				const that = this
				const record_id = this.deviceChoose.record_id
				uni.showLoading({
					title: "数据加载中"
				})
				uni.$http.get(`/info/${record_id}`).then(res => {
					if (res.data.code == 400) {
						uni.showToast({
							icon: 'error',
							title: res.data.errmsg
						})
					} else if (res.data.code == 0) {
						uni.hideLoading()
						const {
							device_list,
							all_cost
						} = res.data.data
						if (all_cost != null) {
							this.allcost = all_cost
						}
						device_list.forEach((item) => {
							const obj = {}
							obj.record_id = record_id
							obj.number = item.number
							obj.device_id = that.deviceMap[item.name]
							obj.cost = item.cost
							// that.allcost += that.costMap[item.name]*obj.number
							this.finishReList.push(obj)
							this.exitDeviceId.push(obj.device_id)
						})
						this.saveDevice = device_list
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
			initDevice() {
				let num = 10000
				const that = this
				uni.$http.get("/device/all/").then(res => {
					if (res.data.code == 400) {
						messageText = res.data.errmsg
						this.$refs.errMessage.open
					} else if (res.data.code == 0) {
						that.deviceAll = res.data.sub_data.subs
						that.deviceSearch = that.deviceAll
						res.data.sub_data.subs.forEach((item) => {
							that.$set(that.deviceMap, item.name, item.device_id)
							that.$set(that.deviceidMap, `${item.device_id}`, item.name)
							that.$set(that.costMap, `${item.device_id}`, item.cost)
							let istype = that.deviceTree.some(type => {
								if (type) {
									return type.text == item.device_type
								} else {
									return false
								}
							})
							if (!istype) {
								const devicetypeobj = {
									text: item.device_type,
									value: num,
									children: [{
										text: item.name,
										value: item.device_id,
										cost: item.cost,
										unit_type: item.unit_type
									}]
								}
								num = num + 1
								that.deviceTree.push(devicetypeobj)
							} else {
								that.deviceTree.forEach((type) => {
									if (type.text == item.device_type) {
										type.children.push({
											text: item.name,
											value: item.device_id,
											cost: item.cost,
											unit_type: item.unit_type
										})
									}
								})
							}
							// console.log(that.deviceTree)
						})
					} else {
						this.messageText = "未知错误"
						this.$refs.errMessage.open()
					}
				}, err => {
					this.messageText = "系统错误"
					this.$refs.errMessage.open()
				})
			},
			onnodeclick(e) {
				if (e.cost == undefined) {
					this.recomDetail = ""
					this.recomUnit = ""
					this.$refs.picker.show()
				} else {
					this.recomDetail = e.cost
					this.deviceChoose.cost = e.cost
					this.recomUnit = e.unit_type
				}
			},
			Submit() {
				//对原对象进行深拷贝
				//运用Object.assign会发生错误
				const obj = {}
				obj.number = this.deviceChoose.number
				obj.cost = this.deviceChoose.cost
				obj.device_id = this.deviceChoose.device_id
				obj.notes = this.deviceChoose.notes
				if (obj.device_id == null) {
					uni.showToast({
						icon: "error",
						title: "请选择设备"
					})
					return
				}
				if (obj.number <= 0) {
					uni.showToast({
						icon: "error",
						title: "数量不能为0"
					})
					return
				}
				if(this.ListId.includes(obj.device_id)){
					uni.showToast({
						title: "不能重复添加",
						icon:'fail',
						mask:true
					})
					return
				}
				obj.record_id = this.deviceChoose.record_id
				this.allcost += parseFloat((this.costMap[`${obj.device_id}`] * obj.number).toFixed(2))
				this.allcost = parseFloat(this.allcost.toFixed(2))
				console.log((this.costMap[`${obj.device_id}`] * obj.number).toFixed(2))
				this.finishReList.push(obj)
				console.log(this.finishReList)
				uni.showToast({
					title: "成功"
				})
			},
			async recommendConfirm() {
				try {
					let isdelete = await this.deleteDeviceAll(this.saveDevice)
					let iscreate = await this.deviceCreate()
				} catch (err) {
					uni.showToast({
						title: "错误",
						icon: "error"
					})
				}

			},
			deviceCreate() {
				const that = this
				// uni.showLoading({
				// 	title: "正在添加中"
				// })
				if (this.finishReList.length == 0) {
					this.finishReList.push({
						record_id: this.recordid
					})
					this.allcost = 0
				}
				uni.$http.post("/devicelist/create/", {
					data: this.finishReList,
					cost: this.allcost
				}).then(res => {
					if (res.data.code == 400) {
						uni.showToast({
							title: res.data.errmsg,
							icon: "error"
						})
					} else if (res.data.code == 0) {
						// uni.showToast({
						// 	title: res.data.notice || 'success'
						// })
						this.popupText = res.data.notice
						this.$refs.noticeFinishInfoPop.open()
					
					} else {
						uni.showToast({
							title: "未知错误",
							icon: "error"
						})
					}
				}, err => {
					uni.showToast({
						title: "系统错误",
						icon: "error"
					})
				})
			},
			finishRecom() {
				this.$refs.finishDialog.open()
			},
			finishConfirm() {
				// uni.showToast({
				// 	title: `提交成功`
				// })
				this.recommendConfirm()
			},
			modifyDevice(item, index) {
				if(this.exitDeviceId.includes(item.device_id)){
					this.isShowDialog = true
					this.delitem = item
					this.delindex = index
					this.$refs.modifyPopup.open()
					return
				}
				uni.showToast({
					title:'不能够修改新添加的设备',
					icon:'none'
				})
				
			
			},
			finishConfirmNotice(){
				this.$emit("finishStepfour")
			},
			handleModifyCondfirm(inputValue){
				const {record_id,device_id} = this.delitem
				uni.$http.post('/modify/number/',{
					number:inputValue,
					record_id,
					device_id,
				}).then(({data})=>{
					// 调用成功
					if(data.code===0){
						// 修改数量以及价格
						uni.showToast({
							title:'修改成功',
							icon:'success'
						})
						
						this.finishReList[this.delindex].number = Number(inputValue);
						// 修改总数量
						this.allcost = this.finishReList.reduce((acc,cur)=>{
							return acc+=cur.number * cur.cost
						},0)
						// 初始化输入框内容
						this.isShowDialog = false
						
					}
				}).catch((err)=>{
					uni.showToast({
						title:'错误',
						icon:'fail'
					})
					console.log(err);
				})
			}
			
		}
	}
</script>

<style lang="scss">
	.recommend-list-page {
		.notes {
			display: flex;
			margin: 20rpx 10rpx 0px 20rpx;

			text {
				margin-right: 10rpx;
			}
		}

		.recom-icon {
			&-delete {
				margin: 0 5px;
				background-color: #ecf5ff;
				display: inline-block;
				height: 20px;
				padding: 0 5px;
				line-height: 20px;
				font-size: 12px;
				color: #409eff;
				border: 1px solid #d9ecff;
				border-radius: 4px;
				box-sizing: border-box;
				white-space: nowrap;
			}

			&-modify {
				margin: 0 5px;
				display: inline-block;
				height: 20px;
				padding: 0 5px;
				line-height: 20px;
				font-size: 12px;
				color: #409eff;
				border: 1px solid #d9ecff;
				border-radius: 4px;
				box-sizing: border-box;
				white-space: nowrap;
				background-color: #fff;
				border-color: #f5dab1;
				color: #e6a23c;
			}
		}

		.recom-list {

			.recom-item {
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid gainsboro;
				padding: 10px;

				.title {
					font-size: 14px;
					color: #323232;
					width: fit-content;
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

		.search-button {
			text-align: center;
			// width: 120rpx;
			margin: 10px 0;
			background-color: aqua;
			border-radius: 5px;
			padding: 8rpx 10rpx;
			color: #323232;
		}

		.search-content {
			padding: 20px;
			border-radius: 10px;

			.search-area {
				width: 450rpx;
				margin: 20rpx 5rpx;
				height: 320rpx;
				overflow-y: scroll;
				font-size: 14px;
				color: #8a8a8a;

				.device-list {
					padding: 8rpx 0;
					border-bottom: 1px solid #ebebeb;
				}

				.empty {
					text-align: center;
					font-size: 12px;
					color: #6c6c6c;
				}
			}
		}

		.top-button {
			display: flex;
			justify-content: space-between;
		}

		.number-box {
			display: flex;
			align-items: center;
			margin: 20rpx;

			text {
				margin-left: 20rpx;
			}
		}

		.recom-detail {
			margin: 20rpx;
			height: 40rpx;
		}


		.add-button {
			background-color: #666;
			color: #fff;
			height: 60rpx;
			width: 200rpx;
			line-height: 60rpx;
			color: white;
			font-size: 14px;
			margin: 70rpx auto;
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