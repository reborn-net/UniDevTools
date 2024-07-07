<template>
  <view>
    <view
      class="editMask"
      v-if="isShow"
      :style="{
        height: height + 'px',
      }"
      @click.stop
    >
      <view
        class="editDialog"
        @click.stop
      >
        <view>
          <text class="title">{{ title }}</text>
        </view>
        <textarea
          v-model="value"
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
            @click="save"
          >
            <text class="btnText">提交</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
let success, error;
export default {
  data() {
    return {
      /**
       * 是否展示
       */
      isShow: false,
      /**
       * 标题
       */
      title: "",
      /**
       * 输入框的值
       */
      value: "",
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
    uni.$on("devTools_showEditDialog", (options) => {
      that
        .show(options.title, options.value)
        .then((val) => {
          uni.$emit("devTools_editDialogSaveSuccess", val);
        })
        .catch(() => {
          uni.$emit("devTools_editDialogClose");
        });
    });
  },
  beforeDestroy() {
    uni.$off("devTools_showEditDialog");
  },
  methods: {
    /**
     * 展示弹窗
     */
    show(title = "标题", value = "") {
      let that = this;
      return new Promise((yes, err) => {
        success = yes;
        error = err;
        that.title = title;
        that.value = value ? value : "";
        that.isShow = true;
      });
    },
    /**
     * 关闭弹窗
     */
    hide() {
      this.isShow = false;
      error();
    },
    /**
     * 保存
     */
    save() {
      this.isShow = false;
      success(this.value);
    },
  },
};
</script>
<style lang="scss" scoped>
.editMask {
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
  .editDialog {
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
