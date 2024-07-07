<template>
  <view>
    <!-- #ifdef APP-PLUS -->
    <swiper
      :current="tabIndex"
      :style="{
        height: scrollHeight + 'px',
      }"
      @change="$emit('tabIndexChange', $event.detail.current)"
    >
      <swiper-item
        v-for="(item, index) in tabList"
        :key="index + 'tabList'"
      >
        <list
          :style="{
            height: scrollHeight + 'px',
          }"
          class="contentList"
          show-scrollbar
          :index="index"
          :id="`contentList_${index}`"
          :fixFreezing="true"
          ref="mob_list"
        >
          <refresh
            v-if="item.canRefreshing"
            class="refreshView"
            @refresh="$emit('refresh', index)"
            @pullingdown="$emit('pullingdown', { event: $event, index })"
            :display="item.isRefreshing ? 'show' : 'hide'"
          >
            <view class="content">
              <template v-if="item.refreshType == 'waitPullUp'">
                <text class="statusText">↓下拉刷新</text>
              </template>
              <template v-if="item.refreshType == 'waitRelease'">
                <text class="statusText">松手刷新</text>
              </template>
              <template v-if="item.refreshType == 'refreshing'">
                <text class="statusText">刷新中...</text>
              </template>
              <template v-if="item.refreshType == 'success'">
                <text class="statusText">刷新成功</text>
              </template>
              <template v-if="item.refreshType == 'error'">
                <text class="statusText">刷新失败</text>
              </template>
            </view>
          </refresh>
          <slot
            :item="item"
            :index="index"
          ></slot>
          <cell ref="mob_list_end">
            <view></view>
          </cell>
        </list>
      </swiper-item>
    </swiper>
    <!-- #endif -->
    <!-- #ifndef APP-PLUS -->
    <scroll-view
      scroll-y
      :style="{
        height: scrollHeight + 'px',
      }"
      :scroll-top="scrollTop"
    >
      <slot
        :item="tabList[tabIndex]"
        :index="tabIndex"
      ></slot>
    </scroll-view>
    <!-- #endif -->
  </view>
</template>
<script>
export default {
  props: {
    /**
     * 分类索引
     */
    tabIndex: {
      type: Number,
      default: 0,
    },
    /**
     * tab列表
     */
    tabList: {
      type: Array,
      default: () => [],
    },
    /**
     * 滚动高度
     */
    scrollHeight: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      /**
       * 滚动位置
       */
      scrollTop: 0,
    };
  },
  methods: {
    /**
     * 滚动到列表底部
     */
    scrollToBottom() {
      let that = this;
      // #ifdef APP-PLUS
      const dom = weex.requireModule("dom");
      dom.scrollToElement(that.$refs.mob_list_end[that.tabIndex]);
      // #endif
      // #ifndef APP-PLUS
      that.scrollTop = 999999999 + Math.random();
      // #endif
    },
  },
};
</script>
<style lang="scss" scoped>
.contentList {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 750rpx;
  .cell {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 20rpx;
    width: 750rpx;
  }
}
.refreshView {
  background-color: #fff;
  width: 750rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100rpx;
  .content {
    height: 100rpx;
    width: 750rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
.statusText {
  color: #8799a3;
  font-size: 24rpx;
  margin-left: 10rpx;
}
</style>
