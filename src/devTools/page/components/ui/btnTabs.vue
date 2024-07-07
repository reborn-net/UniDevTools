<template>
  <view
    class="btnTabs"
    v-if="list.length > 0"
  >
    <block v-for="(item, index) in list" :key="item.title">
      <view
        class="btnTabsItem"
        :style="{
          'background-color': '#f9f9f9',
        }"
        @click="$emit('indexChange', index)"
      >
        <text
          class="tabsText"
          :style="{
            color: index == value ? '#ff2d55' : '#333333',
          }"
        >
          {{ item.title }}
        </text>
      </view>
      <view
        v-if="index != list.length - 1"
        :key="index"
        class="splitLine"
      ></view>
    </block>
  </view>
</template>
<script>
export default {
  props: {
    /**
     * 按钮列表
     */
    list: {
      type: Array,
      default: () => [],
    },
    /**
     * 当前选中的按钮索引
     */
    value: {
      type: Number,
      default: 0,
    },
  },
};
</script>
<style lang="scss" scoped>
.btnTabs {
  display: flex;
  flex-direction: row;
  border-radius: 8rpx;
  overflow: hidden;
  height: 40rpx;
  border: 1px solid rgba(0, 0, 0, 0.05);
  .btnTabsItem {
    display: flex;
    height: 40rpx;
    padding: 0 8rpx;
    .tabsText {
      font-size: 20rpx;
      line-height: 40rpx;
      height: 40rpx;
    }
  }
  .splitLine {
    width: 1px;
    height: 40rpx;
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>
