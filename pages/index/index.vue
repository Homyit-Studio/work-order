<template>
	<view class="index-page">
		<view class="image">
			<image src="../../static/imagefeng.jpg" mode="widthFix"></image>
		</view>
		<view class="header-one">
			<text>工单助手</text>
		</view>
		<view class="card-options">
			<view class="remind-text">
				<text>请选择身份:</text>
			</view>
			<view class="card-option card-click" @click="navigatorTo('investor')">
				<!-- <navigator hover-start-time="2" hover-class="card-click" url="../login/login?card=investor"
					open-type="redirect">调查员</navigator> -->
				<text>调查员</text>
			</view>
			<view class="card-option card-click" @click="navigatorTo('repair')">
				<!-- <navigator hover-class="card-click" url="../login/login?card=repair" open-type="redirect">施工人员
				</navigator> -->
				<text>施工人员</text>
			</view>
			<view class="card-option card-click" @click="navigatorTo('director')">
				<!-- <navigator hover-class="card-click" url="../login/login?card=director" open-type="redirect">监理
				</navigator> -->
				<text>监理</text>
			</view>
			<view class="card-option card-click" @click="navigatorTo('leader')">
				<!-- <navigator hover-class="card-click" url="../login/login?card=leader" open-type="redirect">企业负责人
				</navigator> -->
				<text>企业负责人</text>
			</view>
			<view class="contact">
				<button open-type="contact" class="contact-button" size="mini">售后服务</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {

		},
		methods: {
			navigatorTo(card) {
				uni.navigateTo({
					url: `../login/login?card=${card}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.index-page {
		.image {
			width: 750rpx;
			height: 200px;
			overflow: hidden;

			image {
				width: 100%;
				// height: 100%;
				border-radius: 0 0 10px 10px;
			}
		}

		.header-one {
			font-size: 60rpx;
			text-align: center;
			margin: 20rpx 0;
		}

		.card-options {
			display: flex;
			flex-direction: column;
			align-items: center;

			.remind-text {
				color: red;
				text-align: center;
				margin-bottom: 40rpx;
			}

			.card-option {
				box-sizing: border-box;
				width: 400rpx;
				padding: 32rpx;
				margin: 20rpx;
				text-align: center;
				font-size: 30rpx;
				// background-image: linear-gradient(90deg,#EE9CA7 , #FFDDE1);
				background-color: $work-color-main;
				color: white;
				box-shadow: 0px 0px 1px #666;
			}
		}
		
		.contact{
			margin-top: 120rpx;
			button{
				background-color: #fff;
				border: none;
				outline: none;
				color: red;
			}
		}
	}

	.card-click {
		box-shadow: 0px 0px 20px #666;
	}
	
</style>
