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
        <text class="title">新增缓存</text>
        <input
          type="text"
          placeholder="请输入Key"
          class="input"
          v-model="key"
        />
        <input
          type="text"
          placeholder="请输入Value"
          class="input"
          v-model="value"
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
  props: {
    /**
     * 默认缓存类型
     */
    storageType: {
      type: String,
      default: "localStorage",
    },
  },
  data() {
    return {
      /**
       * 是否展示
       */
      isShow: false,
      /**
       * 键名称
       */
      key: "",
      /**
       * 值
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
     * 挂载弹窗打开事件
     */
    uni.$on("devTools_showAddStorageDialog", () => {
      that.key = "";
      that.value = "";
      that.isShow = true;
    });
  },
  unmounted() {
    uni.$off("devTools_showAddStorageDialog");
  },
  methods: {
    /**
     * 关闭弹窗
     */
    hide() {
      this.isShow = false;
    },
    /**
     * 保存
     */
    save() {
      let that = this;
      if (that.key == "") {
        return uni.showToast({
          title: "请输入key",
          icon: "none",
        });
      }
      if (that.storageType == "localStorage") {
        uni.setStorageSync(that.key, that.value);
      } else if (that.storageType == "sessionStorage") {
        sessionStorage.setItem(that.key, that.value);
      } else if (that.storageType == "cookie") {
        let key = encodeURIComponent(that.key);
        let val = encodeURIComponent(that.value);
        let cookie =
          `${key}=${val}; path=/; expires=` + new Date(new Date().getTime() + 86400 * 1000 * 365).toGMTString();
        document.cookie = cookie;
      }
      uni.showToast({
        title: "添加成功！",
        icon: "success",
      });
      that.hide();
      setTimeout(() => {
        that.$emit("getPage");
      }, 300);
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
    margin-bottom: 300rpx;
    .title {
      font-size: 28rpx;
      color: #333;
      height: 50rpx;
      line-height: 50rpx;
    }
    .input {
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      width: 640rpx;
      height: 70rpx;
      padding: 5rpx;
      border-radius: 8rpx;
      border: 1px solid rgba(0, 0, 0, 0.05);
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
