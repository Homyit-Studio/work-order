<template>
	<view class="login-page">
		<view class="com-image">
			<image :src="logoUrl" mode="aspectFit"></image>
		</view>
		<view class="title-text">
			<text> 账号登录 </text>
		</view>
		<view class="login-box">
			<!-- 自定义表单校验 -->
			<uni-forms ref="loginForm" :rules="loginRules" :modelValue="loginFormData">
				<uni-forms-item name="username">
					<view class="username">
						<uni-easyinput type="text" prefixIcon=".uniui-person-filled" v-model="loginFormData.username"
							placeholder="请输入用户名或手机号"  @focus="handleFocus" @blur="handleBlur" />
						<view id="popup" :style="{'bottom':-(popupStyle.height+12)+'px'}" v-show="loginFormData.username.length===0 && isFocus && this.users.length!==0">
							<view class="popup-item" v-for="item in users" @click="handleClickUsername(item)" :key="item.username">
								<text>{{item.username}}</text>
							</view>
							<view class="angle" />
						</view>
					</view>
				</uni-forms-item>
				<uni-forms-item name="password" class="form-password">
					<uni-easyinput type="password" prefixIcon=".uniui-locked-filled" v-model="loginFormData.password"
						placeholder="请输入密码" />
				</uni-forms-item>

				<!-- 新增记住密码功能 -->
				<view class="remember" @click="handleCheckRatio">
					<view class="remember-radio">
						<radio color="#007aff" :checked="checked" />
					</view>

					<view class="remember-password">
						<text>记住密码</text>
					</view>
				</view>
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
					password: "",
				},
				// 自定义表单校验规则
				loginRules: {
					username: {
						rules: [{
							required: true,
							errorMessage: "姓名不能为空",
						}, ],
					},
					password: {
						rules: [{
								required: true,
								errorMessage: "密码不能为空",
							},
							{
								format: "string",
								errorMessage: "密码类型有误",
							},
							{
								validateFunction: function(rule, value, data, callback) {
									if (value.length < 6) {
										callback("密码应不少于6位")
									}
									return true
								},
							},
						],
					},
				},
				/* 是否记住密码 */
				checked: false,
				popupStyle: {
					height: 0
				},
				users:[],
				isFocus:false,
				logoUrl:'',
			}
		},
		onLoad(options) {
			const images = uni.getStorageSync('images')
			this.logoUrl = images['company']
			try{
				this.loginFormData.is_type = options.card
				// 自动存储，初始化表单
				let usersInfo = []
				if(Array.isArray(uni.getStorageSync('usersInfo'))){
					usersInfo = uni.getStorageSync('usersInfo').filter((_item)=>{
						return _item.is_type=== options.card
					})
				}
				this.users.push(...usersInfo)
			}catch(e){
				console.log('109',e)
			}
		},
		onReady() {
			this.$refs.loginForm.setRules(this.loginRules)
		},
		mounted() {
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this)
				query
					.select("#popup")
					.boundingClientRect((data) => {
						const {
							height
						} = data
						this.popupStyle.height = height
					})
					.exec()
			})
		},
		methods: {
			loginSubmit(ref) {
				this.$refs[ref]
					.validate()
					.then((res) => {
						uni.showLoading({
							title: "正在登录中",
						})
						uni.$http
							.post("/login/", this.loginFormData)
							.then((res) => {
								if (res.data.code == 400) {
									uni.hideLoading()
									this.messageText = res.data.errmsg
									this.$refs.errMessage.open()
								} else if (res.data.code == 0) {
									uni.setStorage({
										key: "x-token",
										data: res.data.data.sessionid,
									})
									uni.setStorage({
										key: "user",
										data: this.loginFormData,
									})
									uni.setStorage({
										key: "fullName",
										data: res.data.data.full_name,
									})
									// 存储密码
									if(this.checked){
										const storageInfo = this.users.filter(_item=>{
											return _item.username!== this.loginFormData.username
										})
										storageInfo.push(this.loginFormData)
										uni.setStorageSync('usersInfo',storageInfo)
									}
								
									uni.showToast({
										title: "登录成功",
									})

									if (this.loginFormData.is_type != "investor") {
										uni.setStorage({
											key: "hide",
											data: true,
										})
										setTimeout(() => {
											uni.switchTab({
												url: "../myWork/myWork",
												fail(err) {
													console.log(err)
												},
											})
										}, 600)
									} else {
										uni.setStorage({
											key: "hide",
											data: false,
										})
										setTimeout(() => {
											uni.switchTab({
												url: "../myWork/myWork",
											})
										}, 600)
									}
								} else {
									uni.hideLoading()
									this.messageText = "未知错误"
									this.$refs.errMessage.open()
								}
							})
							.catch((err) => {
								console.log(err)
								uni.showToast({
									icon: "error",
									title: "系统错误",
								})
							})
					})
					.catch((err) => {
						console.log("err", err)
					})
			},
			handleCheckRatio() {
				this.checked = !this.checked
			},
			handleClickUsername(item){
				const {username,password} =  item
				this.loginFormData.password = password
				this.loginFormData.username = username
			},
			handleFocus(){
				this.isFocus = true
			},
			handleBlur(){
				this.isFocus = false
			}
		},
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
				box-shadow: 0px 0px 10px #666;
				font-size: 14px;
				background-color: $work-color-main;
			}
		}
	}

	.remember {
		// margin-left: 200rpx;
		position: relative;
		top: -40rpx;
		left: 10rpx;
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 11rpx 15rpx;

		&-radio {
			radio {
				transform: scale(0.7);
			}
		}

		&-password {
			font-size: 14px;
			color: black;
		}
	}

	#popup {
		position: absolute;
		z-index: 99;
		width: 600rpx;
		box-sizing: border-box;
		position: absolute;
		top: calc(100% + 12px);
		left: 0;
		height: fit-content;
		width: 100%;
		background-color: #fff;
		border: 1px solid #ebeef5;
		border-radius: 6px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
		z-index: 3;
		padding: 4px 0;
		
		
		.angle {
			-webkit-filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));
			filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));
			top: -6px;
			left: 10%;
			border-top-width: 0;
			width: 0;
			height: 0;
			border-left: 12rpx solid transparent;
			border-right: 12rpx solid transparent;
			border-bottom: 12rpx solid #fff;
			position: absolute;
		}
			
		.popup-item{
			box-sizing: border-box;
			display: flex;
			cursor: pointer;
			line-height: 35px;
			font-size: 14px;
			text-align: center;
			padding: 0 10px;
		}
	}

	.username {
		position: relative;
	}
</style>