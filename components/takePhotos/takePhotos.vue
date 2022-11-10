<template>
	<view class="takephotos-page">
		<uni-card v-show="newwork == 2" margin="2px" padding="0px" spacing="2px">
			<view class="title">
				<text>已上传图片</text>
			</view>
			<view class="upload-image">
				<view v-for="(item,index) in histroyImage" :key="item.id" class="image-box">
					<image class="image" style="width: 180rpx; height: 200rpx;box-shadow: 0px 0px 2px #979797;"
						:src="'https://gd.jxiot.top/static/download/' + item.name" mode="aspectFill"
						@click="previewUpload(histroyImage, index)"></image>
					<view class="del-icon" @click="delServerImage(item.id)">
						<uni-icons type="closeempty" style="padding: 3px;" size="18" color="#fff"></uni-icons>
					</view>
				</view>
				<view class="empty" v-if="histroyImage.length == 0">
					<text>暂无已上传图片</text>
				</view>
			</view>
		</uni-card>
		<uni-card margin="2px" padding="0px" spacing="2px">
			<view class="title">
				<text>现场照片</text>
			</view>
			<view class="upload-image">
				<view v-for="(item,index) in imgList" :key="item" class="image-box">
					<image class="image" style="width: 180rpx; height: 200rpx;box-shadow: 0px 0px 2px #979797;"
						:src="item" mode="aspectFill" @click="preview(imgList, index)"></image>
					<view class="del-icon" @click="delImage(item)">
						<uni-icons type="closeempty" style="padding: 3px;" size="18" color="#fff"></uni-icons>
					</view>
				</view>
				<!-- v-if="imgList.length + histroyImage.length < maxImageCount" -->
				<view class="add-image" @click="chooseImage">
					<uni-icons type="plusempty" size="70" color="#979797"></uni-icons>
				</view>
			</view>
			<button class="button" @click="putPhotos">提交</button>
		</uni-card>
		<view>
			<uni-popup ref="delDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="关闭" confirmText="同意" title="通知" content="是否确认删除图片"
					@confirm="delConfirm" @close="delClose"></uni-popup-dialog>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="subDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="取消" confirmText="确认" title="通知" content="是否确认提交"
					@confirm="subConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="delServerDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="取消" confirmText="确认" title="提醒" content="是否确认删除已上传图片"
					@confirm="delServerConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
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
				record_id: this.recordid,
				imgList: [],
				delimageId: null,
				delImageItem: null,
				maxImageCount: 9,
				histroyImage: []
			}
		},
		created() {
			if (this.newwork == 2) {
				this.getWorkdetail()
			}
		},
		methods: {
			//删除服务器图片
			delServerImage(id) {
				this.delimageId = id
				this.$refs.delServerDialog.open()
			},
			delServerConfirm() {
				uni.showLoading({
					title: "正在删除中"
				})
				uni.$http.get(`/image/delete/${this.delimageId}`).then(res => {
					if (res.data.code == 400) {
						uni.showToast({
							icon: 'error',
							title: res.data.errmsg
						})
					} else if (res.data.code == 0) {
						uni.hideLoading()
						this.getWorkdetail()
					} else {
						uni.showToast({
							icon: 'error',
							title: "未知错误"
						})
					}
					console.log(res)
				}, err => {
					uni.showToast({
						icon: 'error',
						title: "系统错误"
					})
				})
			},
			getWorkdetail() {
				uni.showLoading({
					title: "数据加载中"
				})
				uni.$http.get(`/image/query/${this.record_id}`).then(res => {
					if (res.data.code == 400) {
						uni.showToast({
							icon: 'error',
							title: res.data.errmsg
						})
					} else if (res.data.code == 0) {
						uni.hideLoading()
						const imagelist = res.data.image_list
						this.histroyImage = imagelist.filter((ele) => {
							return ele.type == 'inv_scene'
						})
					} else {
						uni.showToast({
							icon: 'error',
							title: "未知错误"
						})
					}
					console.log(res)
				}, err => {
					uni.showToast({
						icon: 'error',
						title: "系统错误"
					})
				})
			},
			chooseImage() {
				const that = this
				//const maxcount = this.maxImageCount - this.imgList.length - this.histroyImage.length
				uni.chooseImage({
					// count: maxcount, 
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						that.imgList = [...that.imgList, ...res.tempFilePaths]
					}
				});
			},
			preview(imagelist, index) {
				let array = [];
				imagelist.forEach((item) => {
					let url = item
					array.push(url);
				})
				uni.previewImage({
					current: array[index],
					urls: array
				});
			},
			previewUpload(imagelist, index) {
				let array = [];
				imagelist.forEach((item) => {
					let url = 'https://gd.jxiot.top/static/download/' + item.name
					array.push(url);
				})
				uni.previewImage({
					current: array[index],
					urls: array
				});
			},
			putPhotos() {
				this.$refs.subDialog.open()
			},
			delImage(item) {
				this.delImageItem = item
				this.$refs.delDialog.open()
			},
			delConfirm() {
				this.imgList.forEach((item, index) => {
					if (item == this.delImageItem) {
						this.imgList.splice(index, 1)
						return
					}
				})
			},
			//递归上传图片
			async subConfirm() {
				await this.uploadImage()
				setTimeout(() => {
					this.$emit("finishStepthree")
				}, 400)
			},
			uploadImage() {
				const that = this
				const record_id = this.record_id

				const token = uni.getStorageSync('x-token')
				//微信小程序只支持单文件上传，所以要循环调用
				// uni.showLoading({
				// 	title: '图片正在上传中'
				// })
				uni.showToast({
					title: "提交图片"
				})
				console.log(this.imgList)
				this.imgList.forEach(item => {
					uni.uploadFile({
						url: "https://gd.jxiot.top/image/upload/",
						filePath: item,
						name: 'image', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
						header: {
							"x-token": token
						},
						formData: {
							"type": "inv_scene",
							"record_id": record_id
						},
						success: (res) => {
							console.log(res)
						},
						fail: (err) => {
							uni.showToast({
								icon: 'error',
								title: '提交失败'
							});
							console.log(err)
						},
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.takephotos-page {
		.empty {
			margin: 20rpx;
			text-align: center;
		}

		.title {
			margin-left: 25rpx;
			margin-top: 10rpx;
		}

		.upload-image {
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;

			.image-box {
				margin: 6rpx 30rpx;
				position: relative;

				.del-icon {
					position: absolute;
					top: 0rpx;
					right: 0rpx;
					background-color: #666;
					border-radius: 50%;
				}
			}

			.add-image {
				align-self: flex-start;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 180rpx;
				height: 200rpx;
				box-shadow: 0px 0px 2px #979797;
				margin: 6rpx 30rpx;
			}
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
