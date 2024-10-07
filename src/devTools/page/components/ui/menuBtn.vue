<template>
  <view>
    <view
      class="menuBtn"
      v-if="list.length > 0"
      @click="showMenu"
    >
      <text class="menuText">{{ title }}</text>
      <text class="menuText">{{ list[value].title }}</text>
      <image
        src="@/devTools/page/static/menu.png"
        class="menuIcon"
      />
    </view>
    <view
      v-if="showMenuList"
      class="menuMock"
      :style="{
        height: height + 'px',
      }"
      @click.stop
    >
      <view
        class="closeBtn"
        @click="close"
      >
        <text class="closeText">关闭</text>
      </view>
      <scroll-view
        :style="{
          maxHeight: height * 0.7 + 'px',
        }"
        scroll-y
        class="scrollList"
      >
        <view
          v-for="(item, index) in list"
          :key="item.title"
          class="menuSelectItem"
          :class="[index > 0 ? 'tl' : '', index == 0 ? 'i-s' : '', index == list.length ? 'i-e' : '']"
          @click="menuSelect(index)"
        >
          <text
            class="menuSelectText"
            :style="{
              color: index == value ? '#ff2d55' : '#333333',
            }"
          >
            {{ item.title }}
          </text>
          <view v-if="item.msg">
            <text class="menuSelectMsg">{{ item.msg }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
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
    /**
     * 标题
     */
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      /**
       * 屏幕高度
       */
      height: uni.getSystemInfoSync().windowHeight,
      /**
       * 是否展示菜单列表
       */
      showMenuList: false,
    };
  },
  methods: {
    /**
     * 展示菜单
     */
    showMenu() {
      this.showMenuList = true;
    },
    /**
     * 点击菜单选择事件
     */
    menuSelect(index) {
      this.$emit("indexChange", index);
      this.showMenuList = false;
    },
    /**
     * 关闭菜单弹窗
     */
    close() {
      this.showMenuList = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.menuBtn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  overflow: hidden;
  height: 40rpx;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 0 8rpx;
  overflow: visible;
  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
  .menuText {
    font-size: 20rpx;
    line-height: 40rpx;
    color: #333;
  }
  .menuIcon {
    margin-left: 8rpx;
    width: 28rpx;
    height: 28rpx;
  }
}
.menuMock {
  position: fixed;
  z-index: 90;
  width: 750rpx;
  left: 0;
  top: 0;
  flex: 1;
  /* #ifndef APP-PLUS */
  height: 100vh;
  backdrop-filter: blur(2px);
  /* #endif */
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  .closeBtn {
    width: 710rpx;
    height: 80rpx;
    margin-bottom: 80rpx;
    border-radius: 20rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    transition: all 200ms ease-in-out;
    &:active {
      background-color: #dcdcdc;
    }
    .closeText {
      font-size: 24rpx;
      color: #333;
      line-height: 24rpx;
    }
  }
}
.scrollList {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 710rpx;
  margin-bottom: 30rpx;
  border-radius: 20rpx;
  overflow: hidden;
  .menuSelectItem {
    width: 710rpx;
    min-height: 80rpx;
    padding: 15rpx 0;
    background-color: #fff;
    transition: all 200ms ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &.tl {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    &.i-s {
      border-radius: 20rpx 20rpx 0 0;
    }
    &.i-e {
      border-radius: 0 0 20rpx 20rpx;
    }
    &:active {
      background-color: #dcdcdc;
    }
    .menuSelectText {
      font-size: 24rpx;
      line-height: 24rpx;
      color: #333;
    }
    .menuSelectMsg {
      font-size: 20rpx;
      line-height: 20rpx;
      margin-top: 10rpx;
      color: #999999;
    }
  }
}
</style>
