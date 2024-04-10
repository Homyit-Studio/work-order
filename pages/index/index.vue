<template>
    <view class="index-page">
        <view class="image">
            <image :src="images['first_front']" mode="widthFix" :draggable="false"></image>
        </view>
        <view class="header-one">
            <text>工单助手</text>
        </view>
        <view class="card-options">
            <view class="remind-text">
                <text>请选择身份:</text>
            </view>
            <view class="card-option card-click" @click="navigatorTo('investor')">
                <image :src="images['investor']" mode="" class="card-image-icon"></image>
                <text class="card-image-text">调查员</text>
            </view>
            <view class="card-option card-click" @click="navigatorTo('repair')">
                <image :src="images['repair']" mode="" class="card-image-icon"></image>
                <text class="card-image-text">施工人员</text>
            </view>
            <view class="card-option card-click" @click="navigatorTo('director')">
                <image :src="images['check']" mode="" class="card-image-icon"></image>
                <text class="card-image-text">监理</text>
            </view>
            <view class="card-option card-click" @click="navigatorTo('leader')">
                <image :src="images['leader']" mode="" class="card-image-icon"></image>
                <text class="card-image-text">企业负责人</text>
            </view>
            <view class="contact card-option">
                <image :src="images['sail']" mode="" class="card-image-icon"></image>
                <button open-type="contact" class="card-image-text">售后服务</button>
            </view>
        </view>
    </view>
</template>

<script>
import { BASE_URL } from "../../main"

export default {
    data() {
        return {
            images: {},
        }
    },
    onLoad() {
        uni.$http.get("/get/info").then(({ data }) => {
            const { front_image, heal_status, id_type } = data.data
            const images = this.handleFrontImage(front_image)
            this.images = images
            uni.setStorageSync("images", images)
            uni.setStorageSync("healStatus", heal_status)
            uni.setStorageSync("idType", id_type)
        })
    },
    mounted() {},
    methods: {
        navigatorTo(card) {
            uni.navigateTo({
                url: `../login/login?card=${card}`,
            })
        },
        handleFrontImage(images) {
            const prefixUrl = `${BASE_URL}/media/`
            const map = {}
            images.forEach((image) => {
                map[image.type] = prefixUrl + image.file
            })
            return map
        },
    },
}
</script>

<style lang="scss">
.index-page {
    // 适配iphoneX  2024-04-04
    padding-bottom: var(--safe-area-inset-bottom);
    .image {
        width: 750rpx;
        height: auto;
        overflow: hidden;

        image {
            width: 100%;
            border-radius: 0 0 10px 10px;
        }
    }

    .header-one {
        letter-spacing: 3rpx;
        font-weight: 600;
        font-size: 50rpx;
        text-align: center;
        margin: 20rpx 0;
        color: rgb(65, 119, 246);
    }

    .card-options {
        display: flex;
        flex-direction: column;
        align-items: center;

        .remind-text {
            color: #e78058;
            font-weight: 300;
            text-align: center;
            margin-bottom: 40rpx;
            letter-spacing: 2rpx;
        }

        .card-option {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            box-sizing: border-box;
            text-align: center;
			margin: 5rpx;
            font-size: 30rpx;
            color: white;
            font-weight: 600;
            letter-spacing: 2rpx;
        }
        .card-image {
            &-icon {
                width: 100rpx;
                height: 100rpx;
            }
            &-text {
                margin-left: 5px;
                width: fit-content;
                width: 180rpx;
                height: 60rpx;
                border-radius: 50rpx;
                background-color: #007aff;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }

    .contact {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        button {
            font-size: 30rpx;
            background-color: #fff;
            border: none;
            outline: none;
            padding: 0;
        }
        .card-image-text {
            line-height: 60rpx;
            color: white;
            margin-left: 5px;
            width: fit-content;
            width: 180rpx;
            height: 60rpx;
            border-radius: 50rpx;
            background-color: #007aff;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}

// .card-click {
// 	box-shadow: 0px 0px 20px #666;
// }
</style>
