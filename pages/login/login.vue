<template>
	<view class="login-page">
		<view class="com-image">
			<image src="../../static/company.jpg" mode="aspectFit"></image>
		</view>
		<view class="title-text">
			<text>
				账号登录
			</text>
		</view>
		<view class="login-box">
			<!-- 自定义表单校验 -->
			<uni-forms ref="loginForm" :rules="loginRules" :modelValue="loginFormData">
				<uni-forms-item name="username">
					<uni-easyinput type="text" prefixIcon=".uniui-person-filled" v-model="loginFormData.username"
						placeholder="请输入用户名或手机号" />
				</uni-forms-item>
				<uni-forms-item name="password">
					<uni-easyinput type="password" prefixIcon=".uniui-locked-filled" v-model="loginFormData.password"
						placeholder="请输入密码" />
				</uni-forms-item>
			</uni-forms>
			<button type="primary" class="login-submit" @click="loginSubmit('loginForm')">确认</button>
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
				messageText: "",
				loginFormData: {
					username: "",
					password: ""
				},
				// 自定义表单校验规则
				loginRules: {
					username: {
						rules: [{
							required: true,
							errorMessage: '姓名不能为空'
						}]
					},
					password: {
						rules: [{
								required: true,
								errorMessage: '密码不能为空'
							}, {
								format: 'string',
								errorMessage: '密码类型有误'
							},
							{
								validateFunction: function(rule, value, data, callback) {
									if (value.length < 6) {
										callback('密码应不少于6位')
									}
									return true
								}
							}
						]
					}

				},
			}
		},
		onLoad(options) {
			this.loginFormData.is_type = options.card
		},
		onReady() {
			this.$refs.loginForm.setRules(this.loginRules)
		},
		methods: {
			loginSubmit(ref) {
				this.$refs[ref].validate().then(res => {
					uni.showLoading({
						title: "正在登录中"
					})
					uni.$http.post('/login/', this.loginFormData).then((res) => {
						if (res.data.code == 400) {
							uni.hideLoading()
							this.messageText = res.data.errmsg
							this.$refs.errMessage.open()
						} else if (res.data.code == 0) {
							uni.setStorage({
								key: 'x-token',
								data: res.data.data.sessionid
							})
							uni.setStorage({
								key: 'user',
								data: this.loginFormData
							})
							uni.setStorage({
								key: 'fullName',
								data: res.data.data.full_name
							})
							uni.showToast({
								title:"登录成功"
							})
							
							if(this.loginFormData.is_type != 'investor'){
								uni.setStorage({
									key : "hide",
									data : true
								})
								setTimeout(() => {
									uni.switchTab({
										url: "../myWork/myWork",
										fail(err) {
											console.log(err)
										}
									})
								}, 600)
							}else{
								uni.setStorage({
									key : "hide",
									data : false
								})
								setTimeout(()=> {
									uni.switchTab({
										url: "../myWork/myWork"
									})
								}, 600)
							}
						} else {
							uni.hideLoading()
							this.messageText = "未知错误"
							this.$refs.errMessage.open()
						}
					}).catch((err) => {
						console.log(err)
						uni.showToast({
							icon:"error",
							title: "系统错误"
						})
					})

				}).catch(err => {
					console.log('err', err);
				})
			}
		}
	}
</script>

<style lang="scss">
	.login-page {
		.title-text {
			text-align: center;
			margin: 60rpx 0 50rpx 0;
		}
		.com-image {
			width: 750rpx;
			height: 220px;
			overflow: hidden;
		
			image {
				width: 100%;
				// height: 100%;
				border-radius: 0 0 10px 10px;
			}
		}

		.login-box {
			display: flex;
			flex-direction: column;
			align-items: center;

			.uni-easyinput {
				width: 600rpx;
			}

			.login-submit {
				width: 500rpx;
				height: 70rpx;
				line-height: 70rpx;
				border-radius: 20rpx;
				box-shadow: 0px 0xp 0px 10px #666;
				font-size: 14px;
				background-color: $work-color-main;
			}
		}
	}
</style>
