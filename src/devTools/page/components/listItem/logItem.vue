<template>
  <view
    class="logItem"
    @longpress.stop="logLongpress"
  >
    <view class="content">
      <view>
        <text class="text-xs">{{ item.m }}</text>
      </view>
      <view class="msgBar">
        <text class="time">{{ item.date }}</text>
      </view>
    </view>
    <view class="tools">
      <view
        class="copyBtn"
        @click="copyItem"
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
export default {
  props: {
    /**
     * logs单行数据
     */
    item: {
      type: Object,
      default() {
        return {
          date: "",
          m: "", //日志内容
        };
      },
    },
  },
  methods: {
    /**
     * 复制
     */
    copyItem() {
      uni.setClipboardData({
        data: this.item.m,
      });
    },
    /**
     * 长按事件
     */
    logLongpress() {
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
            uni.$emit("devTools_delLog", that.item);
            let logs = devCache.get("logReport");
            if (!logs) logs = [];
            let i = logs.findIndex(
              (x) => x.m == that.item.m && x.t == that.item.t
            );
            if (i != -1) {
              logs.splice(i, 1);
              devCache.set("logReport", logs);
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
.logItem:active {
  background-color: rgba(0, 0, 0, 0.03);
}
.logItem {
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
    .msgBar {
      display: flex;
      flex-direction: row;
      .time {
        font-size: 16rpx;
        color: #888;
      }
      .page {
        font-size: 16rpx;
        color: #888;
        margin-left: 20rpx;
      }
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
.text-xs {
  font-size: 20rpx;
}
</style>
