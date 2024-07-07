<template>
  <view
    class="consoleItem"
    :class="['type-' + item.type]"
    @longpress.stop="consoleLongpress"
  >
    <view class="content">
      <view
        v-for="(row, index) in item.list"
        :key="index"
      >
        <template v-if="isObj(row)">
          <objectAnalysis
            :data="row"
            :width="610"
            :canLongpress="false"
            @onLongpress="consoleLongpress"
          />
        </template>
        <template v-else>
          <view>
            <text
              class="context"
              :class="[getTypeClass(row)]"
            >
              {{ getText(row) }}
            </text>
          </view>
        </template>
      </view>

      <view class="msgBar">
        <text class="time">{{ item.date }}</text>
        <text
          class="logType"
          :class="'type-' + item.type"
        >
          {{ item.type }}
        </text>
        <text class="page">{{ item.page }}</text>
      </view>
    </view>
    <view class="tools">
      <view
        class="copyBtn"
        @click="copyList"
      >
        <image
          src="@/devTools/page/static/copy.png"
          class="copyIcon"
        />
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
          list: [],
          date: "", // 打印的日期
          page: "", // 打印的页面
          type: "", // 打印类型
        };
      },
    },
  },
  methods: {
    /**
     * 是否为对象类型
     */
    isObj(data) {
      return typeof data == "object" && data != null && data != undefined;
    },
    /**
     * 获取对应的类型样式
     */
    getTypeClass(obj) {
      try {
        let type = typeof obj;

        if (type == "string") {
          if (obj.indexOf("at ") == 0) {
            return "t-line";
          } else if (obj === undefined || obj == "undefined") {
            return "t-undefined";
          } else if (obj === null || obj == "null") {
            return "t-null";
          } else if (obj == "true" || obj == "false") {
            return "t-boolean";
          } else if (Number.isFinite(Number(obj))) {
            return "t-number";
          }
        }
        return "t-" + type;
      } catch (error) {}
      return "t-string";
    },
    /**
     * 获取数据文字
     */
    getText(data) {
      switch (typeof data) {
        case "string":
          // return data.replace(/\n/g, "");
          return data;
        case "boolean":
          return data ? "true" : "false";
        case "undefined":
          return "undefined";
        case "function":
          return "js:function";
        case "symbol":
          return "js:symbol";
        default:
          return data;
      }
    },
    /**
     * 复制列表
     */
    copyList() {
      uni.setClipboardData({
        data: JSON.stringify(this.item.list),
      });
    },
    /**
     * 长按事件
     */
    consoleLongpress() {
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
        {
          text: `删除此记录`,
          click() {
            uni.$emit("devTools_delConsoleItem", that.item);
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
.consoleItem:active {
  background-color: rgba(0, 0, 0, 0.03);
}
.consoleItem {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 750rpx;
  padding: 10rpx 20rpx;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  &.type-warn {
    background-color: rgb(255, 251, 229);
  }
  &.type-error {
    background-color: rgb(255, 240, 240);
  }
  &.type-info {
    background-color: rgba(0, 0, 0, 0.02);
  }
  .content {
    width: 610rpx;
    display: flex;
    flex-direction: column;
    .context {
      font-size: 20rpx;
      color: #333;
      line-height: 24rpx;
      &.t-number {
        color: rgb(8, 66, 160);
      }
      &.t-boolean {
        color: rgb(133, 2, 255);
      }
      &.t-string {
        color: #333;
      }
      &.t-undefined {
        color: rgba(0, 0, 0, 0.2);
      }
      &.t-null {
        color: rgba(0, 0, 0, 0.2);
      }
      &.t-line {
        color: rgba(0, 0, 0, 0.5);
      }
    }
    .msgBar {
      display: flex;
      flex-direction: row;
      margin-top: 4rpx;
      .time {
        font-size: 16rpx;
        color: #888;
        min-width: 90rpx;
      }
      .page {
        font-size: 16rpx;
        color: #888;
        margin-left: 20rpx;
      }
      .logType {
        margin-left: 20rpx;
        font-size: 16rpx;
        padding: 0px 6rpx;
        border-radius: 2px;
      }
      .type-log {
        color: #fff;
        background-color: #a8abb3;
      }
      .type-info {
        color: #fff;
        background-color: #747474;
      }
      .type-warn {
        color: #fff;
        background-color: #ff9900;
      }
      .type-error {
        color: #fff;
        background-color: #fa3534;
      }
    }
  }
  .tools {
    width: 100rpx;
    display: flex;
    flex-direction: row-reverse;
    margin-top: 6rpx;
    .copy {
      font-size: 20rpx;
      color: #333;
      line-height: 24rpx;
    }
    .copy:active {
      background-color: red;
    }
  }
}
.copyBtn:active {
  background-color: rgba(103, 194, 58, 0.6);
}
.copyBtn {
  padding: 5rpx;
  border-radius: 999rpx;
  overflow: hidden;
  background-color: #67c23a;
  .copyIcon {
    width: 20rpx;
    height: 20rpx;
  }
}
</style>
