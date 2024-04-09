<template>
    <button @click="down">下载文件</button>
</template>

<script>
import { BASE_URL } from "../../main"

export default {
    data() {
        return {
            url: "",
        }
    },
    onLoad(item) {
        this.url = decodeURIComponent(`${BASE_URL}/static/excel/device-detail.xlsx`)
    },
    methods: {
        down() {
            uni.downloadFile({
                url: "https://gd.jxiot.top/static/excel/device-detail.xlsx", // 文件下载路径
                success: (res) => {
                    if (res.statusCode === 200) {
                        //保存成功并打开文件
                        uni.openDocument({
                            filePath: res.tempFilePath,
                            success: (res) => console.log("成功打开文件"),
                        })
                    }
                },
                fail(err) {
                    this.$u.toast("下载失败")
                },
            })
        },
    },
}
</script>

<style lang="scss"></style>
