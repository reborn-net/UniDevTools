<template>
  <view
    class="dayOnlineItem"
    @click.stop="$emit('click')"
    @longpress.stop="logLongpress"
  >
    <view class="info">
      <text class="text-xs">{{ item.date }}</text>
      <text class="text-xs margin-left">{{ item.timeCount }}</text>
    </view>
    <view class="arrow">
      <image
        class="icon"
        src="@/devTools/page/static/fold.png"
      />
    </view>
  </view>
</template>
<script>
export default {
  props: {
    /**
     * logs单行数据
     */
    item: {
      type: Object,
      default() {
        return {
          date: "", //日期
          timeCount: "", //活跃时间
          page: [], //页面详细数据
        };
      },
    },
  },
  methods: {
    /**
     * 长按事件
     */
    logLongpress() {
      let that = this;

      let menu = [
        {
          text: `复制日志信息`,
          click() {
            uni.setClipboardData({
              data: JSON.stringify(that.item),
            });
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
.dayOnlineItem:active {
  background-color: rgba(0, 0, 0, 0.03);
}
.dayOnlineItem {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 750rpx;
  padding: 10rpx 20rpx;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  .info {
    width: 610rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    .text-xs {
      font-size: 20rpx;
    }
    .margin-left {
      margin-left: 30rpx;
    }
  }
  .arrow {
    .icon {
      width: 20rpx;
      height: 20rpx;
      transform: rotate(90deg);
    }
  }
}
</style>
