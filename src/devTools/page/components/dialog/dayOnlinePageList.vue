<template>
  <view>
    <view
      class="dialogMask"
      v-if="isShow"
      :style="{
        height: height + 'px',
      }"
      @click.stop="hide"
    >
      <view
        class="dialogContent"
        @click.stop
      >
        <view
          class="dialogHead"
          @click="hide"
        >
          <view>
            <text class="title">{{ item.date + "   " + item.timeCount }}</text>
          </view>
          <view>
            <image
              src="@/devTools/page/static/unfold.png"
              class="fold"
            />
          </view>
        </view>
        <scroll-view
          scroll-y
          class="scrollList"
        >
          <view
            v-for="(row, index) in item.page"
            :key="index"
            class="pageLogItem"
            @click.stop="showMenu(row)"
          >
            <text class="p">页面：{{ row.r }}</text>
            <text class="t">活跃：{{ row.timeCount }}</text>
          </view>
          <view style="height: 100rpx"></view>
        </scroll-view>
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
       * 屏幕高度
       */
      height: uni.getSystemInfoSync().windowHeight,
      /**
       * 详情列表
       */
      item: {
        date: "",
        timeCount: "",
        page: [
          {
            r: "",
            timeCount: "",
          },
        ],
      },
    };
  },
  methods: {
    /**
     * 展示弹窗
     */
    show(item) {
      let that = this;
      return new Promise((yes, err) => {
        success = yes;
        error = err;
        that.item.date = item.date;
        that.item.timeCount = item.timeCount;
        that.item.page = item.page;
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
    /**
     * 展示菜单
     */
    showMenu(row) {
      let that = this;

      let r = String(row.r).substring(0, 10) + "...";

      let menu = [
        {
          text: `复制路径(${r})`,
          click() {
            uni.setClipboardData({
              data: row.r,
            });
          },
        },
        {
          text: `复制时间(${row.timeCount})`,
          click() {
            uni.setClipboardData({
              data: row.timeCount,
            });
          },
        },
        {
          text: `跳转至此页面`,
          click() {
            uni.$emit("devTools_showRouteDialog", row.r);
          },
        },
      ];

      uni.showActionSheet({
        itemList: menu.map((x) => x.text),
        success({ tapIndex }) {
          menu[tapIndex].click();
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dialogMask {
  display: flex;
  flex-direction: column-reverse;
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
  .dialogContent {
    display: flex;
    flex-direction: column;
    width: 750rpx;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    .dialogHead {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 80rpx;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      width: 750rpx;
      .title {
        margin-left: 20rpx;
        font-size: 24rpx;
        line-height: 24rpx;
        color: #333;
      }
      .fold {
        width: 20rpx;
        height: 20rpx;
        margin-right: 20rpx;
      }
    }
    .scrollList {
      width: 750rpx;
      height: 750rpx;
      .pageLogItem {
        width: 750rpx;
        display: flex;
        flex-direction: column;
        padding: 10rpx 20rpx;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        &:active {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .p {
          font-size: 20rpx;
          color: #333;
        }
        .t {
          margin-top: 4rpx;
          font-size: 20rpx;
          color: #333;
        }
      }
    }
  }
}
</style>
