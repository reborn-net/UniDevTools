<template>
  <view
    class="subTitleBar"
    @click.stop="click"
  >
    <view class="left">
      <view class="titleLine"></view>
      <text class="titleText">{{ title }}</text>
    </view>
    <view
      v-if="showArrow"
      class="right"
    >
      <image
        v-if="isOpen"
        src="@/devTools/page/static/fold.png"
        class="arrow"
      />
      <image
        v-else
        src="@/devTools/page/static/unfold.png"
        class="arrow"
      />
    </view>
  </view>
</template>
<script>
export default {
  emits: ['click'],
  props: {
    /**
     * 标题名称
     */
    title: {
      type: String,
      default: "标题",
    },
    /**
     * 是否显示右侧箭头
     */
    showArrow: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否为开启状态
     */
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    click(){
      this.$emit('click');
    },
  }
};
</script>
<style lang="scss" scoped>
.subTitleBar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  width: 750rpx;
  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
  .left {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 20rpx;
    .titleLine {
      width: 4rpx;
      height: 24rpx;
      border-radius: 4px;
      background-color: #ff2d55;
    }
    .titleText {
      color: #333;
      margin-left: 10rpx;
      font-size: 24rpx;
      line-height: 24rpx;
    }
  }
  .right {
    margin-right: 20rpx;
    .arrow {
      width: 30rpx;
      height: 30rpx;
    }
  }
}
</style>
