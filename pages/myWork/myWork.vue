<template>
	<view class="mywork-page">
		<view class="user-message">
			<view class="message">
				<view class="text">
					<uni-icons type="person-filled" size="30" color="#ff77db"></uni-icons>
					<text>{{types[user.is_type]}}</text>
				</view>
				<view class="text">
					<text class="text-p">{{user.fullName}}</text>
				</view>
			</view>
			<view class="oprate" @click="userOperate">
				<uni-icons type="gear-filled" size="30" color="#fff"></uni-icons>
			</view>
		</view>
		<view class="workorder-status">
			<view>
				<view class="title">
					<uni-icons type="email-filled" size="26" color="#007aff"></uni-icons>
					<text>我的工单</text>
				</view>
				<view class="search-input">
					<uni-easyinput @change="searchWorklist" suffixIcon="search" v-model="searchValue"
						placeholder="请输入工单名称" @iconClick="searchWorklist">
					</uni-easyinput>
				</view>
				<view v-for="item in workListSearch" :key="item.record_id">
					<uni-card :title="'工单名称: ' + item.name" :sub-title="'工单类型: ' + item.record_type">
						<view class="tag-view" v-if="user.is_type == 'director' || user.is_type == 'leader'">
							<text>工单状态:</text>
							<uni-tag :inverted="true" :text="item.status"
								:type="item.status == '未审核' ? 'warning' : item.status == '待审核' ? 'primary' : 'success'"
								size="mini" />
						</view>
						<view class="button-body">
							<button class="check-button"
								@click="workDetail(item.record_id,item.record_type,item.status)">查看详情</button>
						</view>
					</uni-card>
				</view>
				<uni-card padding="0" spacing="0">
					<view class="empty" v-if="workListSearch.length == 0">
						<text>暂无相关工单</text>
					</view>
				</uni-card>
			</view>
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
		data() {
			return {
				searchValue: "",
				messageText: "",
				workList: [],
				workListSearch : [],
				user: {},
				hide: null,
				types: {
					"investor": "调查员",
					"repair": "施工人员",
					"director": "监理",
					"leader": "企业负责人"
				},
			}
		},
		//onLoad可能更慢?
		async onShow() {
			if (uni.getStorageSync("hide") === true) {
				uni.hideTabBar({
					fail(err) {
						console.log(err)
					}
				})
			} else {
				uni.showTabBar({
					fail(err) {
						console.log(err)
					}
				})
			}
			await this.initWorklist()
			this.getUserMessage()
		},
		methods: {
			searchWorklist() {
				let work = this.workList.filter(item => {
					console.log(item.name.indexOf(this.searchValue))
					if (item.name.indexOf(this.searchValue) != -1) {
						return true
					} else {
						return false
					}
				})
				this.workListSearch = work
			},
			userOperate() {
				uni.navigateTo({
					url: "../userOperate/userOperate"
				})
			},
			getUserMessage() {
				const user = uni.getStorageSync("user")
				this.user = user
				this.user.fullName = uni.getStorageSync("fullName")
			},
			initWorklist() {
				uni.showLoading({
					title: "正在加载中"
				})
				uni.$http.get('/record/').then(res => {
					console.log(res)
					if (res.data.code == 400) {
						uni.showToast({
							icon: "error",
							title: res.data.errmsg
						})
					} else if (res.data.code == 0) {
						this.workList = res.data.record
						this.workList.forEach(item => {
							if (item.status == 'investor' || item.status == 'investor') {
								// this.$set(item, "workStatus", "未审核")
								// this.$set(item, "tagType", "warning")
								item.status = "未审核"
								// item.tagType = "warning"
							} else if (item.status == 'check1') {
								item.status = "待审核"
							} else {
								item.status = "已审核"
							}
						})
						console.log(this.workList)
						this.workListSearch = this.workList
						this.searchWorklist()
						uni.hideLoading()
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
			workDetail(record_id, record_type, status) {
				let type = record_type == '适老化改造' ? 2 : 1;
				uni.navigateTo({
					url: `/packagePages/investworkDetails/investworkDetails?id=${record_id}&type=${type}&status=${status}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.mywork-page {
		.empty {
			padding: 40rpx;
			text-align: center;
			font-size: 12px;
			background-color: #ffffff;
		}
		.search-input{
			width: 680rpx;
			margin: 0 auto;
		}

		.tag-view {
			display: flex;
			align-items: center;

			text {
				margin-right: 10rpx;
			}
		}

		.user-message {
			padding: 40rpx;
			display: flex;
			justify-content: space-around;
			background-color: $work-color-main;
			color: #fff;

			.message {
				.text {
					display: flex;
					align-items: center;
					margin: 10rpx 0;

					.text-p {
						padding-left: 60rpx;
					}
				}
			}
		}

		.button-body {
			display: flex;
			justify-content: flex-end !important;

			.check-button {
				color: #fff;
				height: 40rpx;
				line-height: 40rpx;
				font-size: 12px;
				margin: 0;
				// padding: 5rpx;
				// background-color: $work-color-main;
				background-image: linear-gradient(90deg, #ee9ca7, #ffdde1);
			}
		}

		.workorder-status {
			margin-top: 20rpx;

			.title {
				margin: 20rpx 60rpx;
				display: flex;
				align-items: center;

				text {
					font-size: 18px;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>
