<template>
	<view class="addorder-page">
		<view class="step-list">
			<uni-steps :options="addList" :active="currentactive" />
		</view>
		<view class="notice-bar">
			<uni-notice-bar show-icon text="完成提交签名后在我的工单中检查完成后点击完成工单修正才能提交至审核员处" />
		</view>
		<view class="add-main">
			<!-- <fillOrderForm v-if="currentactive == 0" :newwork="1" :recordid="record_id" @finishStepone="finishStepone">
			</fillOrderForm> -->
			<div v-if="currentactive == 0">
				<confirmOrderForm :newwork="1" :recordid="record_id" v-if="tableStatus == 1"
					@finishSteptwo="finishSteptwo"></confirmOrderForm>
				<adaptoldForm :newwork="1" :recordid="record_id" v-else-if="tableStatus == 2" @finishSteptwo="finishSteptwo">
				</adaptoldForm>
			</div>
			<familyImage v-else-if="currentactive == 1" :newwork="1" @finishStepone="finishStepone"
				:recordid="record_id"></familyImage>
			<takePhotos v-else-if="currentactive == 2" :newwork="1" @finishStepthree="finishStepthree"
				:recordid="record_id"></takePhotos>
			<recommendList v-else-if="currentactive == 3" :newwork="1" @finishStepfour="finishStepfour"
				:recordid="record_id">
			</recommendList>
			<signNature v-else-if="currentactive == 4" :newwork="1" :recordid="record_id"></signNature>
			<!-- <component v-bind:is="currentView"></component> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// currentView : "addOrderAction",
				currentactive: null,
				record_id: null,
				fillFormData: {},
				tableStatus: null,
				addList: [{
						title: "填写申请表"
					},
					{
						title: "家庭情况"
					},
					{
						title: "现场拍照"
					},
					{
						title: "配置清单"
					},
					{
						title: "确认签名"
					}
				]
			}
		},
		onLoad(options) {
			this.getRecord(options)
		},
		methods: {
			//获取recordid 这里会发生时间延迟，导致组件接受不到props
			async getRecord(options) {

				this.record_id = await parseInt(options.recordid)
				this.tableStatus = await parseInt(options.type)
				console.log(this.tableStatus)
				this.currentactive = 0
			},
			finishStepone() {
				this.currentactive = 2
			},
			finishSteptwo() {
				this.currentactive = 1
			},
			finishStepthree() {
				this.currentactive = 3
			},
			finishStepfour() {
				this.currentactive = 4
			},
		}
	}
</script>

<style lang="scss">
	.addorder-page {
		margin-top: 20rpx;

		.step-list {
			width: 750rpx;
			position: fixed;
			top: 0px;
			padding-top: 5px;
			z-index: 100;
			background-color: #fff;
			z-index: 10;
		}

		.notice-bar {
			margin-top: 50px;
		}
	}
</style>
