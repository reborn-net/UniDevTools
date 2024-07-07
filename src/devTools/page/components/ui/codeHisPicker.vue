<template>
  <view
    class="codeHisPicker"
    v-if="isShow"
    @click="close"
    :style="{
      height: height + 'px',
    }"
  >
    <view
      class="codeList"
      @click.stop
    >
      <view class="head">
        <view class="title">
          <text class="titleText">历史运行代码：</text>
        </view>
        <view class="subTitle">
          <text class="subTitleText">(保留100条运行记录)</text>
        </view>
      </view>
      <scroll-view
        scroll-y
        class="codeScroll"
      >
        <view
          class="hisItem"
          v-for="(item, index) in list"
          :key="index"
          @click="selectedRow(item)"
        >
          <text class="hisItemCode">
            {{ item }}
          </text>
        </view>
        <view style="height: 100rpx"></view>
      </scroll-view>
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
       * 筛选的列表
       */
      list: [],
      /**
       * 默认选中的索引
       */
      index: 0,
      /**
       * 选中的回调事件
       */
      callback: null,
      /**
       * 屏幕高度
       */
      height: uni.getSystemInfoSync().screenHeight,
    };
  },
  methods: {
    /**
     * 展示弹窗
     */
    show(list = []) {
      let that = this;
      that.index = 0;
      that.list = list;
      that.isShow = true;
      return new Promise((yes) => {
        that.callback = yes;
      });
    },
    /**
     * 选择改变事件
     */
    pickerChange(e) {
      that.callback = "";
      console.log("e", e);
    },
    /**
     * 关闭弹窗
     */
    close() {
      this.isShow = false;
    },
    /**
     * 选择单行代码
     */
    selectedRow(row) {
      this.callback(row);
      this.close();
    },
  },
};
</script>
<style lang="scss" scoped>
.codeHisPicker {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  background-color: rgba(0, 0, 0, 0.3);
  /* #ifndef APP-PLUS */
  backdrop-filter: blur(1px);
  /* #endif */
  display: flex;
  flex-direction: column-reverse;
  z-index: 999;
  .codeList {
    width: 750rpx;
    border-radius: 20rpx 20rpx 0 0;
    background-color: #fff;
    .head {
      padding: 20rpx;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .title {
        .titleText {
          font-size: 24rpx;
          line-height: 28rpx;
          color: #333;
        }
      }
      .subTitle {
        display: flex;
        flex-direction: row;
        align-items: center;
        .subTitleText {
          font-size: 20rpx;
          line-height: 28rpx;
          color: #777;
        }
      }
    }
    .codeScroll {
      height: 750rpx;
      width: 750rpx;
      .hisItem {
        width: 750rpx;
        padding: 10rpx 20rpx;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        .hisItemCode {
          font-size: 20rpx;
          color: #333;
          line-height: 26rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          /* #ifdef H5 */
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          /* #endif */
          lines: 3;
        }
      }
      .hisItem:active {
        background-color: rgba(0, 0, 0, 0.03);
      }
    }
  }
}
</style>
