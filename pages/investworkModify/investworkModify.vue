<template>
	<view>
<!-- 		<fillOrderForm v-if="status == 1" :newwork="2" :recordid="record_id" @finishStepone="finishStepone">
		</fillOrderForm> -->
		<div v-if="status == 2">
			<confirmOrderForm v-if="type == 1" :newwork="2" :recordid="record_id"
				@finishSteptwo="finishSteptwo"></confirmOrderForm>
				<adaptoldForm v-else-if="type == 2" :newwork="2" :recordid="record_id"
				@finishSteptwo="finishSteptwo"></adaptoldForm>
		</div>
		<takePhotos v-else-if="status == 3" :newwork="2"  @finishStepthree="finishStepthree" :recordid="record_id"></takePhotos>
		<recommendList v-else-if="status == 4" :newwork="2" @finishStepfour="finishStepfour" :recordid="record_id">
		</recommendList>
		<signNature v-else-if="status == 5" :newwork="2" :recordid="record_id"></signNature>
		<familyImage v-else-if="status == 6" :newwork="2" @finishStepone="finishStepone"  :recordid="record_id"></familyImage>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: null,
				record_id: null,
				type : null
			};
		},
		onLoad(options) {
			console.log(options)
			this.status = options.status
			this.type = options.type
			this.record_id = options.recordid
		},
		methods: {
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
			finishStepthree() {
				uni.navigateBack({
					fail(err) {
						console.log(err)
					}
				})
			},
			finishStepfour() {
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

</style>
