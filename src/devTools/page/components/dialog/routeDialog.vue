<template>
  <view>
    <view
      class="routeDialogMask"
      v-if="isShow"
      :style="{
        height: height + 'px',
      }"
      @click.stop
    >
      <view
        class="routeDialog"
        @click.stop
      >
        <view>
          <text class="title">跳转至指定页面</text>
        </view>
        <textarea
          v-model="path"
          type="text"
          placeholder="请输入..."
          class="textarea"
        />
        <view class="btnGroup">
          <view
            class="btnItem left"
            @click="hide"
          >
            <text class="btnText">取消</text>
          </view>
          <view
            class="btnItem right"
            @click="goPath"
          >
            <text class="btnText">跳转</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      /**
       * 是否展示
       */
      isShow: false,
      /**
       * 输入框的值
       */
      path: "",
      /**
       * 屏幕高度
       */
      height: uni.getSystemInfoSync().windowHeight,
    };
  },
  mounted() {
    let that = this;
    /**
     * 使用uni.$on打开弹窗
     */
    uni.$on("devTools_showRouteDialog", (path) => {
      that.path = path ? path : "";
      that.isShow = true;
    });
  },
  beforeDestroy() {
    uni.$off("devTools_showRouteDialog");
  },
  methods: {
    /**
     * 关闭弹窗
     */
    hide() {
      this.isShow = false;
    },
    /**
     * 执行跳转
     */
    goPath() {
      let that = this;
      let path = String(that.path);
      path = path.replace(/[\r\n\s]+/g, "");
      if (path.substring(0, 1) !== "/") {
        return uni.showToast({
          title: "页面路径需以“/”开头!",
          icon: "none",
        });
      }
      if (path.length < 2) {
        return uni.showToast({
          title: "请输入正确的路径！",
          icon: "none",
        });
      }
      uni.navigateTo({
        url: path,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.routeDialogMask {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  width: 750rpx;
  flex: 1;
  /* #ifndef APP-PLUS */
  height: 100vh;
  backdrop-filter: blur(1px);
  /* #endif */
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  .routeDialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 690rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 20rpx;
    .title {
      font-size: 28rpx;
      line-height: 28rpx;
      color: #333;
      max-width: 600rpx;
      word-wrap: break-word;
    }
    .textarea {
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      width: 640rpx;
      min-height: 200rpx;
      max-height: 750rpx;
      background-color: rgba(0, 0, 0, 0.02);
      padding: 10rpx;
    }
    .btnGroup {
      display: flex;
      flex-direction: row;
      width: 640rpx;
      justify-content: space-between;
      .btnItem {
        height: 64rpx;
        border-radius: 10rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .btnText {
          font-size: 24rpx;
          color: #fff;
        }
        &.left {
          width: 160rpx;
          background-color: #8799a3;
        }
        &.right {
          width: 450rpx;
          background-color: #3cbb45;
        }
      }
    }
  }
}
</style>
