<template>
  <view
    class="pageItem"
    @click.stop="showMenu"
  >
    <view class="content">
      <view>
        <text class="text-xs">页面路由：{{ item.route }}</text>
      </view>
      <view>
        <text class="text-xs">停留时长：{{ item.timeCount }}</text>
      </view>
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
          route: "",
          timeCount: "",
        };
      },
    },
  },
  methods: {
    /**
     * 展示菜单
     */
    showMenu() {
      let that = this;

      let r = String(that.item.route).substring(0, 10) + "...";

      let menu = [
        {
          text: `复制路径(${r})`,
          click() {
            uni.setClipboardData({
              data: that.item.route,
            });
          },
        },
        {
          text: `复制时间(${that.item.timeCount})`,
          click() {
            uni.setClipboardData({
              data: that.item.timeCount,
            });
          },
        },
        {
          text: `跳转至此页面`,
          click() {
            uni.$emit("devTools_showRouteDialog", that.item.route);
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
.pageItem:active {
  background-color: rgba(0, 0, 0, 0.03);
}
.pageItem {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 750rpx;
  padding: 10rpx 20rpx;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  .content {
    width: 610rpx;
    display: flex;
    flex-direction: column;
    .context {
      font-size: 20rpx;
      color: #333;
      line-height: 24rpx;
    }
  }
}
.text-xs {
  font-size: 20rpx;
}
</style>
