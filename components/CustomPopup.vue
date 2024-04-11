<template>
	<view class="popup" v-if="isShow">
		<view class="center">
			{{text}}
			<view class="confirmButton">
				我知道了
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: "CustomPopup",
		props: {
			text: {
				default: '1221',
			},
		},
		data() {
			return {
				isShow: false
			};
		},
		mounted() {

		},
		methods: {
			show() {
				this.isShow = true
			},
			close() {
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

		.center {
			transform: translateY(-50%);
			padding: 24rpx;
			width: fit-content;
			height: fit-content;
			background: rgba(0, 0, 0, 0.8);
			color: white;
			border-radius: 10rpx;
			font-size: 28rpx;
			max-width: 70vw;
			position: relative;

			.confirmButton {
				display: inline-block;
				line-height: 1;
				white-space: nowrap;
				cursor: pointer;
				background: #fff;
				border: 1px solid #dcdfe6;
				color: #606266;
				-webkit-appearance: none;
				text-align: center;
				box-sizing: border-box;
				outline: none;
				margin: 0;
				transition: .1s;
				font-weight: 500;
				-moz-user-select: none;
				-webkit-user-select: none;
				-ms-user-select: none;
				padding: 12px 20px;
				font-size: 14px;
				border-radius: 4px;
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translate(-50%, -100%);
			}
		}
	}

	@keyframes opac {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}
</style>