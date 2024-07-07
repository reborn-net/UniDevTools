<template>
  <view
    class="errorItem"
    :class="['type-' + item.type]"
    @longpress.stop="errorLongpress"
  >
    <view class="content">
      <view
        v-for="(row, index) in [item.m, item.tr]"
        :key="index"
      >
        <template v-if="isObj(row)">
          <objectAnalysis
            :data="row"
            :width="610"
            :canLongpress="false"
            @onLongpress="errorLongpress"
          />
        </template>
        <template v-else>
          <view>
            <text class="context">{{ getText(row) }}</text>
          </view>
        </template>
      </view>

      <view class="msgBar">
        <text class="time">{{ item.date }}</text>
        <text
          class="logType"
          :class="['type-' + item.type]"
        >
          {{ getType(item.type) }}
        </text>
        <text class="page">{{ item.p }}</text>
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
import devCache from "../../../core/libs/devCache";
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
          m: "",
          tr: "",
          date: "", // 打印的日期
          p: "", // 打印的页面
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
      return typeof data == "object";
    },
    /**
     * 获取数据文字
     */
    getText(data) {
      switch (typeof data) {
        case "string":
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
      let that = this;
      uni.setClipboardData({
        data: JSON.stringify([that.item.m, that.item.tr]),
      });
    },
    /**
     * 获取类型
     */
    getType(type) {
      let t = {
        ve: "vue error",
        vw: "vue warn",
        oe: "App.vue onError",
        n: "unknown",
      };
      return t[type];
    },
    /**
     * 长按事件
     */
    errorLongpress() {
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
            uni.$emit("devTools_delError", that.item);
            let logs = devCache.get("errorReport");
            if (!logs) logs = [];
            let i = logs.findIndex(
              (x) =>
                x.type == that.item.type &&
                x.t == that.item.t &&
                x.m == that.item.m &&
                x.tr == that.item.tr &&
                x.p == that.item.p
            );
            if (i != -1) {
              logs.splice(i, 1);
              devCache.set("errorReport", logs);
            }
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
.errorItem:active {
  background-color: rgba(0, 0, 0, 0.03);
}
.errorItem {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 750rpx;
  padding: 10rpx 20rpx;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  &.type-vw {
    background-color: rgb(255, 251, 229);
  }
  &.type-ve {
    background-color: rgb(255, 240, 240);
  }
  &.type-oe {
    background-color: rgb(255, 240, 240);
  }
  .content {
    width: 670rpx;
    display: flex;
    flex-direction: column;
    .context {
      font-size: 20rpx;
      color: #333;
      line-height: 24rpx;
    }
    .msgBar {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .time {
        font-size: 16rpx;
        color: #888;
        min-width: 90rpx;
      }
      .page {
        font-size: 16rpx;
        color: #888;
        margin-left: 20rpx;
        lines: 1;
        max-width: 450rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .logType {
        margin-left: 20rpx;
        font-size: 16rpx;
        padding: 0px 6rpx;
        border-radius: 2px;
      }
      .type-ve {
        color: #fff;
        background-color: #fd0add;
      }
      .type-n {
        color: #fff;
        background-color: #82848a;
      }
      .type-vw {
        color: #fff;
        background-color: #ff9900;
      }
      .type-oe {
        color: #fff;
        background-color: #ff0000;
      }
    }
  }
  .tools {
    width: 40rpx;
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
