<template>
  <view
    class="routeItem"
    @click.stop="showMenu"
  >
    <view>
      <text class="routeText">{{ item.path }}</text>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  methods: {
    /**
     * 展示菜单
     */
    showMenu() {
      let that = this;

      let menuList = [];

      let p = that.item.path.substr(0, 20);
      if (p.length == 20) {
        p = p + "...";
      }
      menuList.push(`复制路径(${p})`);

      let isTabBar = false;
      if (that.item.meta && that.item.meta.isTabBar) {
        isTabBar = true;
      }
      if (!isTabBar) {
        menuList.push("跳转至此页面");
      }

      uni.showActionSheet({
        itemList: menuList,
        success({ tapIndex }) {
          if (tapIndex == 0) {
            uni.setClipboardData({
              data: that.item.path,
            });
          } else {
            uni.$emit("devTools_showRouteDialog", that.item.path);
          }
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.routeItem {
  padding: 10rpx 20rpx;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  .routeText {
    width: 710rpx;
    font-size: 20rpx;
    line-height: 26rpx;
    color: #333;
  }
}
.routeItem:active {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
