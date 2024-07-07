<template>
  <view class="jsRunnerItem">
    <view class="codeInput">
      <image
        src="@/devTools/page/static/fold.png"
        class="fold-left"
      />
      <view class="codeView">
        <text class="codeText">{{ item.code }}</text>
      </view>
    </view>
    <view class="codeResult">
      <image
        src="@/devTools/page/static/fold.png"
        class="fold-right"
      />
      <view class="codeResultView">
        <template v-if="item.isEnd">
          <template v-if="isObj(item.result)">
            <objectAnalysis
              :data="item.result"
              :showObjProto="true"
              :width="610"
              :canLongpress="false"
            />
          </template>
          <template v-else>
            <view>
              <text
                class="context"
                :class="[getTypeClass(item.result)]"
                selectable
              >
                {{ getText(item.result) }}
              </text>
            </view>
          </template>
        </template>
        <text
          v-else
          class="loadingOutput"
        >
          ...
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
     * 单行数据
     */
    item: {
      type: Object,
      default() {
        return {
          id: "",
          code: "",
          result: "",
          isEnd: false,
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
        } else if (type == "function") {
          return "t-function";
        }
        return "t-" + type;
      } catch (error) {}
      return "t-string";
    },
    /**
     * 获取数据文字
     */
    getText(data) {
      if (data === null) {
        return "null";
      }
      switch (typeof data) {
        case "string":
          // return data.replace(/\n/g, "");
          return data;
        case "boolean":
          return data ? "true" : "false";
        case "undefined":
          return "undefined";
        case "function":
          return data.toString();
        case "symbol":
          return "js:symbol";
        default:
          return data;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.jsRunnerItem:active {
  // background-color: rgba(0, 0, 0, 0.03);
}
.jsRunnerItem {
  display: flex;
  flex-direction: column;
  width: 750rpx;
  padding: 10rpx 20rpx;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  .codeInput {
    width: 710rpx;
    display: flex;
    flex-direction: row;
    margin-bottom: 10rpx;
    .codeView {
      margin-left: 10rpx;
      width: 670rpx;
      display: flex;
      flex-direction: column;
      .codeText {
        font-size: 20rpx;
        color: #777;
        line-height: 26rpx;
      }
    }
  }
  .codeResult {
    width: 710rpx;
    display: flex;
    flex-direction: row;
    border-top: 1px solid rgba(0, 0, 0, 0.02);
    padding-top: 10rpx;
    .codeResultView {
      margin-left: 10rpx;
      width: 670rpx;
      display: flex;
      flex-direction: column;
      .loadingOutput {
        font-size: 20rpx;
        color: rgba(0, 0, 0, 0.1);
        line-height: 26rpx;
      }
      .context {
        font-size: 20rpx;
        color: rgb(227, 54, 46);
        line-height: 26rpx;
        &.t-number {
          color: rgb(8, 66, 160);
        }
        &.t-boolean {
          color: rgb(133, 2, 255);
        }
        &.t-string {
          color: rgb(227, 54, 46);
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
        &.t-function {
          color: rgb(121, 38, 117);
        }
      }
    }
  }
}
.fold-left {
  transform: rotate(90deg);
  width: 24rpx;
  height: 24rpx;
}
.fold-right {
  transform: rotate(-90deg);
  width: 24rpx;
  height: 24rpx;
}
</style>
