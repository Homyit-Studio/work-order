<template>
	<!-- 维修人员可以修改调查员上传的图片 -->
	<view class="repairorder-page">
		<view class="add-main">
			<takePhotos v-if="currentactive == 0" :newwork="2" :recordid="record_id"
				@finishStepthree="finishStepone"></takePhotos>
		<!-- 	<repairForm v-else-if="currentactive == 1" :recordid="record_id" :newrepair="newrepair"
				@finishStepone="finishSteptwo"></repairForm> -->
			<repairImage v-else-if="currentactive == 2" :recordid="record_id" :newrepair="newrepair"
				@finishSteptwo="finishSteptwo"></repairImage>
			<repairSign v-else-if="currentactive == 3" :recordid="record_id" :newrepair="newrepair"></repairSign>
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
				newrepair: null,
				status: null
			}
		},
		onLoad(options) {
			this.init(options)
		},
		methods: {
			async init(options){
				 this.record_id = await options.recordid
				this.newrepair = await  options.new
				this.currentactive = options.status
			},
			finishStepone() {
				uni.navigateBack({
					fail(err) {
						console.log(err)
					}
				})
			},
			finishSteptwo() {
				uni.navigateBack({
					fail(err) {
						console.log(err)
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.repairorder-page {
		margin-top: 20rpx;
	}
</style>
