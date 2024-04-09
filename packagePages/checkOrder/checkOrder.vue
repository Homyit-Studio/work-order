<template>
    <view class="check-order-page">
        <view>
            <uni-notice-bar show-icon text="点击提交审核将工单上传至后台管理人员" />
        </view>
        <uni-card margin="2">
            <view class="sign-box">
                <view class="sign-buttons">
                    <button class="click-button" @click="clear">清空</button>
                    <button class="click-button" @click="revoke">撤回</button>
                    <!-- <button class="click-button" @click="saveTempFilePath">保存临时图片路径</button> -->
                    <button class="click-button" @click="signConfirm">提交签名</button>
                </view>
                <v-sign borderWidth="10" height="1100" @init="onSignInit"></v-sign>
            </view>
        </uni-card>
        <!-- 	<view style="position: absolute; z-index: 9999;">
			<uni-popup ref="signDialog" type="dialog">
				<uni-popup-dialog type="info" cancelText="取消" confirmText="确认" title="通知" content="是否确认提交"
					@confirm="signConfirm"></uni-popup-dialog>
			</uni-popup>
		</view> -->
        <!-- <view>
			<button class="button" @click="finishCheck">提交审核</button>
		</view> -->
        <view>
            <uni-popup ref="finishDialog" type="dialog">
                <uni-popup-dialog
                    type="info"
                    cancelText="关闭"
                    confirmText="同意"
                    title="通知"
                    content="是否确认完成"
                    @confirm="finishConfirm"
                ></uni-popup-dialog>
            </uni-popup>
        </view>
    </view>
</template>

<script>
import { BASE_URL } from "../../main"

export default {
    data() {
        return {
            record_id: null,
            messageText: "",
            suggestion: "",
        }
    },
    onLoad(options) {
        this.record_id = options.recordid
        this.suggestion = options.suggestion
    },
    methods: {
        // finishCheck() {
        // 	this.finishConfirm()
        // },
        finishConfirm() {
            uni.$http
                .post("/yesstate/", {
                    record_id: this.record_id,
                    suggestion: this.suggestion,
                })
                .then(
                    (res) => {
                        if (res.data.code == 400) {
                            uni.showToast({
                                title: res.data.msg,
                                icon: "error",
                            })
                        } else if (res.data.code == 0) {
                            uni.showToast({
                                title: "审核完成",
                            })
                            setTimeout(() => {
                                uni.reLaunch({
                                    url: "../myWork/myWork",
                                })
                            }, 500)
                        } else {
                            uni.showToast({
                                title: "未知错误",
                                icon: "error",
                            })
                        }
                    },
                    (err) => {
                        uni.showToast({
                            title: res.data.msg,
                            icon: "系统错误",
                        })
                    }
                )
        },
        onSignInit(signCtx) {
            this.signCtx = signCtx
        },
        // 清空
        clear() {
            this.signCtx.clear()
        },
        // 撤回
        revoke() {
            this.signCtx.revoke()
        },
        async signConfirm() {
            uni.showLoading({
                title: "提交中",
            })
            const that = this
            const path = await this.signCtx.canvasToTempFilePath({ fileType: "jpg" })
            const token = uni.getStorageSync("x-token")
            const record_id = this.record_id
            console.log(path)
            uni.uploadFile({
                url: `${BASE_URL}/image/upload/`,
                filePath: path,
                name: "image", //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
                header: {
                    "x-token": token,
                },
                formData: {
                    type: "app_sign",
                    record_id: record_id,
                },
                success: (res) => {
                    uni.showToast({
                        title: "提交成功",
                    })
                    that.finishConfirm()
                },
                fail: (err) => {
                    uni.showToast({
                        icon: "error",
                        title: "提交失败",
                    })
                    console.log(err)
                },
            })
        },
    },
}
</script>

<style lang="scss">
.check-order-page {
    .sign-box {
        display: flex;

        .sign-buttons {
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            .click-button {
                width: 170rpx;
                font-size: 12px;
                transform: rotate(90deg);
            }
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
