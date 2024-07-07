<template>
  <view
    v-if="isShow"
    class="pagesList"
  >
    <!-- <objectAnalysis
      v-if="isLoaded"
      :data="pages"
      :isOpenFirst="true"
      :width="710"
    /> -->
    <template v-if="isLoaded">
      <view
        v-for="(item, index) in pages"
        :key="index"
        class="pageItem"
        @longpress.stop="longpress(item)"
      >
        <text
          v-if="pages.length == index + 1"
          class="t-red"
        >
          当前
        </text>

        <view class="routeInfo">
          <text class="path">{{ item.route }}</text>
          <text class="options">{{ item.options }}</text>
        </view>
      </view>
    </template>
    <view
      v-else
      class="dataLoading"
    >
      <text class="status">加载中</text>
    </view>
  </view>
</template>
<script>
import objectAnalysis from "./objectAnalysis.vue";
export default {
  components: {
    objectAnalysis,
  },
  props: {
    /**
     * 是否渲染
     */
    isShow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      /**
       * 是否完成加载
       */
      isLoaded: false,
      /**
       * 页面路由数据
       */
      pages: [],
    };
  },
  methods: {
    /**
     * 加载数据
     */
    getData() {
      let that = this;
      that.isLoaded = false;

      let pageList = getCurrentPages().map((x) => {
        let options = "";
        if (x.options) {
          Object.keys(x.options).map((key) => {
            options =
              options + (options == "" ? "" : "&") + key + "=" + x.options[key];
          });
        }
        return {
          route: x.route,
          options,
        };
      });
      pageList.pop();
      that.pages = pageList;

      that.isLoaded = true;
    },
    /**
     * 长按事件
     */
    longpress(item) {
      let that = this;

      let menu = [
        {
          text: `复制路径`,
          click() {
            uni.setClipboardData({
              data: item.route,
            });
          },
        },
        ...(item.options
          ? [
              {
                text: `复制参数`,
                click() {
                  uni.setClipboardData({
                    data: item.options,
                  });
                },
              },
              {
                text: `复制路径+参数`,
                click() {
                  uni.setClipboardData({
                    data: item.route + item.options ? "?" + item.options : "",
                  });
                },
              },
            ]
          : []),
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
.pagesList {
  width: 750rpx;
  display: flex;
  flex-direction: column;
  .pageItem {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 15rpx 20rpx;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    &:active {
      background-color: rgba(0, 0, 0, 0.05);
    }
    .t-red {
      font-size: 20rpx;
      color: #fff;
      padding: 3rpx 8rpx;
      background-color: #ff2d55;
      border-radius: 10rpx;
      margin-right: 10rpx;
      height: 34rpx;
    }
    .routeInfo {
      display: flex;
      flex-direction: column;
      width: 580rpx;
      .path {
        font-size: 26rpx;
        line-height: 30rpx;
        color: #333;
        width: 580rpx;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
      }
      .options {
        margin-top: 4rpx;
        font-size: 20rpx;
        line-height: 26rpx;
        color: #888;
        width: 580rpx;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
      }
    }
  }
}
.dataLoading {
  width: 750rpx;
  height: 100rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .status {
    font-size: 20rpx;
    color: #888;
    line-height: 20rpx;
  }
}
</style>
