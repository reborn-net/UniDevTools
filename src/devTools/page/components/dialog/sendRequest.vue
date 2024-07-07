<template>
  <view>
    <view
      class="dialogMask"
      v-if="isShow"
      :style="{
        height: height + 'px',
      }"
      @click.stop
    >
      <view
        class="dialogContent"
        @click.stop
      >
        <view
          class="dialogHead"
          @click="hide(2)"
        >
          <view>
            <text class="title">请求构建工具</text>
          </view>
          <view>
            <image
              src="@/devTools/page/static/unfold.png"
              class="fold"
            />
          </view>
        </view>
        <scroll-view
          @click.stop
          scroll-y
          class="scrollList"
          :style="{
            height: dialogHeight + 'px',
          }"
        >
          <subTitleBar
            title="请求地址(url)："
            :showArrow="false"
          />
          <view class="inputRow">
            <input
              type="text"
              placeholder="请输入url地址"
              class="input"
              v-model="request.url"
              maxlength="-1"
            />
            <text
              class="del"
              @click="request.url = ''"
            >
              x
            </text>
          </view>

          <subTitleBar
            title="请求方式[method]："
            :showArrow="false"
          />
          <view class="inputRow">
            <picker
              @change="request.method = requestMethods[$event.detail.value]"
              :value="requestMethods.findIndex((x) => x == request.method)"
              :range="requestMethods"
            >
              <view class="method">
                <text class="methodName">{{ request.method }}</text>
                <image
                  class="unfold"
                  src="@/devTools/page/static/unfold.png"
                />
              </view>
            </picker>
          </view>

          <subTitleBar
            title="请求参数[data]：(json对象)"
            :showArrow="false"
          />
          <view class="inputRow">
            <textarea
              placeholder="请输入JSON对象"
              class="textarea"
              v-model="request.data"
              maxlength="-1"
            />
            <text
              class="del"
              @click="request.data = ''"
            >
              x
            </text>
          </view>

          <subTitleBar
            title="请求头(header)："
            :showArrow="false"
          />
          <view class="inputRow">
            <textarea
              placeholder="请输入JSON对象"
              class="textarea"
              v-model="request.header"
              maxlength="-1"
            />
            <text
              class="del"
              @click="request.header = ''"
            >
              x
            </text>
          </view>

          <view
            :class="[send.status ? 'loading' : '']"
            class="sendBtn"
            @click="sendRequest"
          >
            <text
              v-if="send.status"
              class="sendBtnText"
            >
              发送中[{{ send.t }}ms]
              <text class="msg">(点击可取消)</text>
            </text>
            <text
              v-else
              class="sendBtnText"
            >
              发送
            </text>
          </view>

          <template v-if="ajaxHasRes">
            <subTitleBar
              title="响应结果："
              :showArrow="false"
            />
            <view class="inputRow">
              <objectAnalysis
                :data="ajaxRes"
                :width="710"
                :isOpenFirst="true"
              />
            </view>
          </template>

          <view style="height: 100rpx"></view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>
<script>
import objectAnalysis from "../listItem/objectAnalysis.vue";
import subTitleBar from "../ui/subTitleBar.vue";
let success, error;

/**
 * 转json字符串并格式化
 */
function toJsonStr(obj) {
  return JSON.stringify(obj, null, 2);
}

export default {
  components: {
    subTitleBar,
    objectAnalysis,
  },
  data() {
    return {
      /**
       * 是否展示
       */
      isShow: false,
      /**
       * 屏幕高度
       */
      height: uni.getSystemInfoSync().windowHeight,
      dialogHeight: Math.ceil(uni.getSystemInfoSync().windowHeight * 0.85),

      requestMethods: ["get", "post", "put", "delete", "connect", "head", "options", "trace"],
      /**
       * 请求构建对象
       */
      request: {
        url: "", //请求地址
        header: "", //请求头
        method: "get", //请求方式
        data: "", //请求参数
      },
      /**
       * 是否有响应结果
       */
      ajaxHasRes: false,
      /**
       * 响应结果对象
       */
      ajaxRes: {},

      /**
       * 是否状态
       */
      send: {
        status: false, //是否处于发送中状态
        t: 0, //等待时间 ms
        time: 0, //发送时的时间
      },
    };
  },
  mounted() {
    let that = this;
    setInterval(() => {
      if (that.send.status) {
        that.send.t = new Date().getTime() - that.send.time;
      }
    }, 1000 / 24);
  },
  methods: {
    /**
     * 展示弹窗
     */
    show(item, needSend = false) {
      let that = this;

      if (that.send.status) {
        that.send.status = false;
      }
      if (that.ajaxHasRes) {
        that.ajaxHasRes = false;
      }

      return new Promise((yes, err) => {
        success = yes;
        error = err;
        if (item && item.url && item.method) {
          that.request.url = item.url;
          if (typeof item.method == "string") {
            that.request.method = item.method.toLocaleLowerCase();
          } else {
            that.request.method = "get";
          }

          try {
            let data = toJsonStr(item.data);
            if (Object.keys(data).length == 0) {
              data = "";
            } else {
              that.request.data = data;
            }
          } catch (error) {
            that.request.data = "";
          }
          try {
            that.request.header = toJsonStr(item.header);
          } catch (error) {
            that.request.header = toJsonStr({
              "content-type": "application/x-www-form-urlencoded",
            });
          }
        } else {
          that.request.url = "";
          that.request.data = "";
          that.request.method = "get";
          that.ajaxHasRes = false;
          that.request.header = toJsonStr({
            "content-type": "application/x-www-form-urlencoded",
          });
        }
        that.send.status = false;
        that.isShow = true;
        if (needSend) {
          that.sendRequest();
        }
      });
    },
    /**
     * 关闭弹窗
     */
    hide() {
      this.isShow = false;
      error();
    },
    /**
     * 发送请求
     */
    sendRequest() {
      let that = this;

      if (that.send.status) {
        return uni.showModal({
          title: "提示",
          content: "请求还在进行，是否确认取消请求？",
          success(res) {
            if (res.confirm) {
              if (that.send.status) {
                that.send.status = false;
                that.ajaxHasRes = false;
              }
            }
          },
        });
      }
      let tw = (m) =>
        uni.showToast({
          icon: "none",
          title: m,
        });
      if (that.request.url == "" || typeof that.request.url != "string") return tw("请输入url");
      if (that.request.url.indexOf("http") != 0) return tw("请输入正确的url地址");
      if (that.request.url.indexOf("://") == -1) return tw("请输入正确的url地址");
      if (that.request.url.length < 10) return tw("请输入正确的url地址");

      let data = {};
      if (that.request.data != "") {
        try {
          data = JSON.parse(that.request.data);
        } catch (error) {
          return tw("请求参数json解析失败！");
        }
      }

      let header = {};
      if (that.request.header != "") {
        try {
          header = JSON.parse(that.request.header);
        } catch (error) {
          return tw("请求头json解析失败！");
        }
      }

      that.send.t = 0;
      that.send.time = new Date().getTime();
      that.send.status = true;
      that.ajaxHasRes = false;

      uni.request({
        url: that.request.url,
        method: that.request.method,
        data,
        header,
        success(res) {
          if (!that.send.status || !that.isShow) return;
          that.send.status = false;
          res["请求用时"] = new Date().getTime() - that.send.time + "ms";
          that.$set(that, "ajaxRes", res);
          that.ajaxHasRes = true;
          uni.showToast({
            title: "请求响应成功",
            icon: "success",
          });
        },
        fail(msg, request) {
          if (!that.send.status || !that.isShow) return;
          let res = {
            fail: msg,
            request,
            请求用时: new Date().getTime() - that.send.time + "ms",
          };
          that.send.status = false;
          that.$set(that, "ajaxRes", res);
          that.ajaxHasRes = true;
          uni.showToast({
            title: "请求响应失败",
            icon: "error",
          });
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dialogMask {
  display: flex;
  flex-direction: column-reverse;
  background-color: rgba(0, 0, 0, 0.3);
  width: 750rpx;
  flex: 1;
  /* #ifndef APP-PLUS */
  height: 100vh;
  backdrop-filter: blur(1px);
  /* #endif */
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  .dialogContent {
    display: flex;
    flex-direction: column;
    width: 750rpx;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    .dialogHead {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 80rpx;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      width: 750rpx;
      .title {
        margin-left: 20rpx;
        font-size: 24rpx;
        line-height: 28rpx;
        height: 28rpx;
        color: #333;
      }
      .fold {
        width: 20rpx;
        height: 20rpx;
        margin-right: 20rpx;
      }
    }
    .scrollList {
      width: 750rpx;
      .inputRow {
        width: 750rpx;
        padding: 0rpx 20rpx;
        position: relative;
        .input {
          width: 710rpx;
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding-left: 5rpx;
          padding-top: 5rpx;
          padding-bottom: 5rpx;
          padding-right: 50rpx;
          font-size: 24rpx;
          border-radius: 6rpx;
          height: 60rpx;
        }
        .textarea {
          width: 710rpx;
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding-left: 5rpx;
          padding-top: 5rpx;
          padding-bottom: 5rpx;
          padding-right: 50rpx;
          font-size: 24rpx;
          border-radius: 6rpx;
          height: 140rpx;
        }
        .del {
          position: absolute;
          right: 24rpx;
          top: 10rpx;
          height: 40rpx;
          background-color: #fff;
          padding: 0 10rpx;
          font-size: 24rpx;
          color: #999;
          line-height: 40rpx;
        }
        .method {
          display: flex;
          flex-direction: row;
          align-items: center;
          .methodName {
            font-size: 24rpx;
            color: #333;
          }
          .unfold {
            margin-left: 10rpx;
            width: 24rpx;
            height: 24rpx;
          }
        }
      }
      .sendBtn {
        width: 710rpx;
        margin-left: 20rpx;
        margin-top: 30rpx;
        margin-bottom: 30rpx;
        height: 60rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 10rpx;
        background-color: rgb(255, 45, 85);
        &.loading {
          background-color: rgba(255, 45, 85, 0.5);
        }
        .sendBtnText {
          color: #fff;
          font-size: 26rpx;
        }
        .msg {
          color: #fff;
          font-size: 20rpx;
          margin-left: 20rpx;
        }
      }
    }
  }
}
</style>
