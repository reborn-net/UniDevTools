<template>
  <view
    class="networkItem"
    :class="['type-' + item.type]"
    @longpress.stop="networkLongpress"
  >
    <view class="content">
      <view class="head">
        <view
          class="method"
          :class="'type-' + item.method"
        >
          <text
            class="methodText"
            :class="'type-' + item.method"
          >
            {{ item.method }}
          </text>
        </view>
        <view class="path">
          <text class="pageText">{{ getPath(item.url) }}</text>
        </view>
      </view>
      <objectAnalysis
        :data="getItem(item)"
        :width="710"
        :canLongpress="false"
        @onLongpress="networkLongpress"
      />
      <view class="msgBar">
        <text
          class="data"
          style="min-width: 90rpx"
        >
          {{ item.date }}
        </text>
        <text
          class="time"
          :style="{
            width: '100rpx',
            color: getTimeColor,
          }"
        >
          {{ item.useTime }}s
        </text>
        <text
          class="status"
          :class="'s-' + item.type"
          style="width: 120rpx"
        >
          {{ getTypeName(item.type) }}
        </text>
        <text
          v-if="item.type == 1"
          class="time"
          :style="{
            color: getSizeColor,
          }"
        >
          {{ getByteSize }}
        </text>
      </view>
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
     * console单行数据
     */
    item: {
      type: Object,
      default() {
        return {
          id: 0, //请求id
          type: 0, // 0发起请求中  1请求成功  2请求失败
          date: "", //请求日期
          sendTime: 0, //发送请求的时间
          responseTime: 0, //响应时间
          useTime: 0, //请求总耗时

          url: "", //请求地址
          header: "", //请求头
          method: "get", //请求方式
          data: "", //请求参数

          responseBody: "", //响应主体
          responseHeader: "", //响应头
          responseStatus: "", //响应编码
          responseMsg: "", //响应报错信息
          responseBodySize: 0, //请求主体大小
        };
      },
    },
  },
  computed: {
    /**
     * 获取请求时间的颜色
     */
    getTimeColor() {
      if (this.item.useTime == 0) {
        return "#eeeeee";
      } else if (this.item.useTime > 3) {
        return "#fa3534";
      } else if (this.item.useTime > 1) {
        return "#ff9900";
      } else {
        return "#909399";
      }
    },
    /**
     * 获取字节大小,b转kb mb
     */
    getByteSize() {
      let size = Number(this.item.responseBodySize);
      if (null == size || size == "") return "0.00 KB";
      var unitArr = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      var index = 0;
      var srcsize = parseFloat(size);
      index = Math.floor(Math.log(srcsize) / Math.log(1024));
      size = srcsize / Math.pow(1024, index);
      size = size.toFixed(2); //保留的小数位数
      if (Number(this.item.responseBodySize) < 1024) {
        return (size / 1000).toFixed(2) + "KB";
      }
      return size + unitArr[index];
    },
    /**
     * 获取响应大小的颜色
     */
    getSizeColor() {
      let size = this.item.responseBodySize;
      if (size == 0) {
        return "#fa3534";
      } else if (size > 256 * 1024) {
        return "#ff9900";
      } else if (size > 1024 * 1024) {
        return "#fa3534";
      } else {
        return "#909399";
      }
    },
  },
  methods: {
    /**
     * 通过url获取路径
     */
    getPath(url) {
      if (!url) return "无";
      function getPathFromUrl(url) {
        const pathStart = url.indexOf("//") + 2;
        const pathEnd = url.indexOf("?", pathStart) >= 0 ? url.indexOf("?", pathStart) : url.length;
        return url.substring(url.indexOf("/", pathStart), pathEnd);
      }
      return getPathFromUrl(url);
    },
    /**
     * 获取请求类型名称
     */
    getTypeName(type) {
      return ["请求中...", "请求完成", "请求失败"][Number(type)];
    },
    /**
     * 精简item
     */
    getItem(item) {
      return {
        data: item.data,
        responseMsg: item.responseMsg,
        responseStatus: item.responseStatus,
        method: item.method,
        url: item.url,
        header: item.header,
        responseBody: item.responseBody,
        responseHeader: item.responseHeader,
        responseBodySize: this.getByteSize,
      };
    },
    /**
     * 长按事件
     */
    networkLongpress() {
      let that = this;

      let menu = [
        {
          text: `重发此请求`,
          click() {
            that.$emit("goSendRequest", that.item);
          },
        },
        {
          text: `复制请求日志信息`,
          click() {
            uni.setClipboardData({
              data: JSON.stringify(that.item),
            });
          },
        },
        {
          text: `在请求构建工具中打开`,
          click() {
            that.$emit("goOpenRequest", that.item);
          },
        },
        {
          text: `删除此记录`,
          click() {
            uni.$emit("devTools_delNetworkItemById", that.item.id);
            uni.showToast({
              title: "删除成功！",
              icon: "success",
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
.networkItem:active {
  background-color: rgba(0, 0, 0, 0.03);
}
.networkItem {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 750rpx;
  padding: 10rpx 20rpx;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  &.type-0 {
    background-color: rgb(255, 251, 229);
  }
  &.type-2 {
    background-color: rgb(255, 240, 240);
  }
  .content {
    width: 710rpx;
    display: flex;
    flex-direction: column;
    .head {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 5rpx;
      .method {
        background-color: #e2e2e2;
        color: #333;
        border-radius: 4rpx;
        padding: 4rpx 6rpx;
        border-radius: 10rpx;
        &.type-get {
          background-color: rgba(168, 25, 197, 0.1);
        }
        &.type-post {
          background-color: rgba(255, 217, 0, 0.1);
        }
        .methodText {
          color: #333;
          font-size: 22rpx;
          line-height: 22rpx;
          max-width: 650rpx;
          &.type-get {
            // color: #fff;
          }
          &.type-post {
            // color: #fff;
          }
        }
      }
      .path {
        width: 620rpx;
        max-width: 620rpx;
        lines: 1;
        margin-left: 6rpx;
        overflow: hidden;
        /* #ifdef H5 */
        // 限制行数
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        /* #endif */
        .pageText {
          font-size: 24rpx;
          color: #333;
        }
      }
    }
    .context {
      font-size: 20rpx;
      color: #333;
      line-height: 24rpx;
    }
    .msgBar {
      display: flex;
      flex-direction: row;
      margin-top: 5rpx;
      .data {
        font-size: 16rpx;
        color: #888;
      }
      .time {
        font-size: 16rpx;
        color: #333;
        margin-left: 20rpx;
      }
      .status {
        margin-left: 20rpx;
        font-size: 16rpx;
        &.s-0 {
          color: #fa3534;
        }
        &.s-1 {
          color: #909399;
        }
        &.s-2 {
          color: #ff9900;
        }
      }
    }
  }
}
</style>
