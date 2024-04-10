<template>
	<view class="popup" v-if="isShow">
		<view class="center">
			{{text}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "CustomPopup",
		props:{
			text:{
				default:'1221',
			},
		},
		data() {
			return {
				isShow:false
			};
		},
		mounted() {
		
		},
		methods:{
			show(){
				this.isShow = true
			},
			close(){
				this.isShow = false
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.popup {
		position: fixed;
		top: 0;
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		animation: opac .2s ease-in-out;
		.center{
			transform: translateY(-50%);
			padding: 24rpx;
			width: fit-content;
			height: fit-content;
			background: rgba(0, 0, 0, 0.8);
			color: white;
			border-radius: 10rpx;
			font-size: 28rpx;
			max-width: 70vw;
		}
	}
	@keyframes opac {
		from{
			opacity: 0;
		}
		to{
			opacity: 1;
		}
	}
</style>