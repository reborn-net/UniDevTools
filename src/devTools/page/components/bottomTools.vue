<template>
  <view
    v-if="isShow"
    class="bottomTools"
    :style="{
      'padding-bottom': pb,
    }"
  >
    <!-- Error -->
    <template v-if="tabTitle == 'Error'">
      <view
        class="miniBtn mr warn"
        @click="emptyLogs('error')"
      >
        <text class="miniBtnText">清空 x</text>
      </view>
      <btnTabs
        :list="errorTypeList"
        :value="errorTypeIndex"
        @indexChange="errorTypeIndexChange"
      />
    </template>

    <!-- Console -->
    <template v-if="tabTitle == 'Console'">
      <view
        class="miniBtn mr warn"
        @click="emptyLogs('console')"
      >
        <text class="miniBtnText">清空 x</text>
      </view>
      <btnTabs
        :list="consoleTypeList"
        :value="consoleTypeListIndex"
        @indexChange="consoleTypeIndexChange"
      />
    </template>

    <!-- Network -->
    <template v-if="tabTitle == 'Network'">
      <view
        class="miniBtn mr warn"
        @click="emptyLogs('network')"
      >
        <text class="miniBtnText">清空 x</text>
      </view>
      <btnTabs
        :list="networkFilterType"
        :value="networkTypeListIndex"
        @indexChange="networkTypeIndexChange"
      />
    </template>

    <!-- Pages -->
    <template v-if="tabTitle == 'Pages'">
      <view
        class="miniBtn mr warn"
        @click="emptyLogs('pages_1')"
      >
        <text class="miniBtnText">清空停留统计</text>
      </view>
      <view
        class="miniBtn mr warn"
        @click="emptyLogs('pages_2')"
      >
        <text class="miniBtnText">清空日活统计</text>
      </view>
      <view
        class="miniBtn mr primary"
        @click="goPage"
      >
        <text class="miniBtnText">跳转页面</text>
      </view>
    </template>

    <!-- Logs -->
    <template v-if="tabTitle == 'Logs'">
      <view
        class="miniBtn mr warn"
        @click="emptyLogs('logs')"
      >
        <text class="miniBtnText">清空 x</text>
      </view>
    </template>

    <!-- Storage -->
    <template v-if="tabTitle == 'Storage'">
      <view
        class="miniBtn mr warn"
        @click="emptyLogs('storage')"
      >
        <text class="miniBtnText">清空 x</text>
      </view>
      <!-- #ifdef H5 -->
      <btnTabs
        :list="storageFilterTypeList"
        :value="storageTypeListIndex"
        @indexChange="storageTypeIndexChange"
      />
      <!-- #endif -->
      <view
        class="miniBtn primary ml"
        @click="addStorage"
      >
        <text class="miniBtnText">新增数据+</text>
      </view>
    </template>

    <!-- UniBus -->
    <template v-if="tabTitle == 'UniBus'">
      <view
        class="miniBtn mr warn"
        @click="emptyLogs('UniBus')"
      >
        <text class="miniBtnText">清空 x</text>
      </view>
      <btnTabs
        :list="busFilterType"
        :value="busTypeListIndex"
        @indexChange="busTypeIndexChange"
      />
    </template>

    <!-- FileSys -->
    <template v-if="tabTitle == 'FileSys'">
      <!-- #ifdef APP-PLUS || MP-WEIXIN -->
      <scroll-view
        scroll-x
        class="dirList"
      >
        <view class="dirScrollItem">
          <text
            class="dirName"
            style="color: #999"
            @click="$emit('goChildDir', '_goIndex_0')"
          >
            {{ options.fileSysDirType }}
          </text>
          <text class="delimiter">/</text>
          <view
            v-for="(item, index) in options.fileSysDirList"
            :key="index"
            class="dirItem"
          >
            <text
              v-if="index != 0"
              class="delimiter"
            >
              /
            </text>
            <text
              class="dirName"
              @click="$emit('goChildDir', '_goIndex_' + (index + 1))"
            >
              {{ item }}
            </text>
          </view>
        </view>
      </scroll-view>
      <view
        class="miniBtn mr warn"
        @click="emptyFolder"
      >
        <text class="miniBtnText">清空 x</text>
      </view>
      <!-- #ifdef APP-PLUS -->
      <btnTabs
        :list="dirTypeList"
        :value="fileTypeListIndex"
        @indexChange="$emit('changeFileDirType', dirTypeList[$event].type)"
      />
      <view style="width: 20rpx"></view>
      <!-- #endif -->
      <view
        class="miniBtn primary"
        @click="createDir"
      >
        <text class="miniBtnText">新建文件(夹)</text>
      </view>
      <!-- #endif -->
    </template>

    <!-- JsRunner -->
    <template v-if="tabTitle == 'JsRunner'">
      <view class="jsRunnerTools">
        <view class="runOptions">
          <view class="radiusList">
            <text class="runType">运行环境:</text>
            <radio-group
              @change="jsRunType = $event.detail.value"
              class="radiusList"
              style="display: flex;flex-direction: row;"
            >
              <view
                v-for="(item, index) in jsRunTypeList"
                :key="index"
                class="radiusItem"
                @click="jsRunType = item"
              >
                <radio
                  class="radiusRadio"
                  :value="item"
                  :checked="jsRunType == item"
                  color="#ff2d55"
                />
                <text
                  class="radiusText"
                  :style="{
                    color: jsRunType == item ? '#ff2d55' : '#333',
                  }"
                >
                  {{ item }}
                </text>
              </view>
            </radio-group>
          </view>
          <view
            class="hisEmpty"
            @click="$emit('emptyCodeHis')"
            v-if="options.codeHisLength > 0"
          >
            <image
              class="hisEmptyIcon"
              src="@/devTools/page/static/delete.png"
            />
            <text class="hisEmptyText">清空记录</text>
          </view>
          <view
            class="logList"
            @click="showHisCode"
          >
            <text class="hisText">历史代码</text>
            <image
              class="unfold"
              src="@/devTools/page/static/unfold.png"
            />
          </view>
        </view>
        <view class="code">
          <textarea
            v-model="waitSendCode"
            class="codeInput"
            placeholder="js code ..."
            maxlength="-1"
          />
          <view
            class="codeSend"
            @click="runJs"
          >
            <text class="codeSendText">run</text>
          </view>
        </view>
      </view>
    </template>

    <!-- Vuex -->
    <template v-if="tabTitle == 'Vuex'">
      <btnTabs
        :list="stateTypeList"
        :value="stateTypeListIndex"
        @indexChange="stateTypeIndexChange"
      />
    </template>


    <codeHisPicker ref="codeHisPicker" />
  </view>
</template>
<script>
import devCache from "../../core/libs/devCache";
import appDelDir from "./libs/appDelDir";
import btnTabs from "./ui/btnTabs.vue";
import codeHisPicker from "./ui/codeHisPicker.vue";
export default {
  components: {
    btnTabs,
    codeHisPicker,
  },
  props: {
    /**
     * 列表索引
     */
    tabIndex: {
      type: Number,
      default: 0,
    },
    /**
     * 当前标题
     */
    tabTitle: {
      type: String,
      default: "",
    },
    /**
     * 配置项
     */
    options: {
      type: Object,
      default: () => ({
        errorFilterType: "",
        consoleFilterType: "",
        networkFilterType: "",
        busFilterType: "",
        fileSysDirList: [],
        fileSysDirType: "",
        storageType: "",
      }),
    },
    /**
     * 是否渲染
     */
    isShow: {
      type: Boolean,
      default: false,
    },
    /**
     * Vuex变量类型
     */
    stateType: {
      type: String,
      default: "vuex"
    },
  },
  data() {
    let pb = "20px";
    // #ifdef H5
    pb = "8px";
    // #endif
    let sys = uni.getSystemInfoSync();
    if (sys.platform == "ios") {
      pb = "40px";
    }
    let jsRunTypeList = [];
    // #ifdef H5
    jsRunTypeList = ["h5"];
    // #endif
    // #ifdef APP-PLUS
    jsRunTypeList = ["nvue", "webview"];
    // #endif
    return {
      /**
       * 底部边距
       */
      pb,
      /**
       * 错误类型列表
       */
      errorTypeList: [
        { title: "全部", type: "" },
        { title: "error", type: "ve" },
        { title: "warn", type: "vw" },
        { title: "jsError", type: "oe" },
        { title: "unknown", type: "n" },
      ],
      /**
       * console过滤类型
       */
      consoleTypeList: [
        { title: "全部", type: "" },
        { title: "log", type: "log" },
        { title: "info", type: "info" },
        { title: "warn", type: "warn" },
        { title: "error", type: "error" },
      ],
      /**
       * 请求过滤类型
       */
      networkFilterType: [
        { title: "全部", type: "" },
        { title: "请求失败", type: "请求失败" },
        { title: "10s+", type: "10s+" },
        { title: "500KB+", type: "500KB+" },
        { title: "get", type: "get" },
        { title: "post", type: "post" },
        { title: "other", type: "other" },
      ],
      /**
       * uni bus 过滤类型
       */
      busFilterType: [
        { title: "全部", type: "" },
        { title: "on", type: "on" },
        { title: "once", type: "once" },
        { title: "emit", type: "emit" },
        { title: "off", type: "off" },
      ],
      /**
       * 文件类型
       */
      dirTypeList: [
        { title: "_doc", type: "PRIVATE_DOC" },
        { title: "_www", type: "PRIVATE_WWW" },
        { title: "公共文档", type: "PUBLIC_DOCUMENTS" },
        { title: "公共下载", type: "PUBLIC_DOWNLOADS" },
      ],
      /**
       * 缓存类型
       */
      storageFilterTypeList: [
        { title: "localStorage", type: "localStorage" },
        { title: "sessionStorage", type: "sessionStorage" },
        { title: "cookie", type: "cookie" },
      ],
      /**
       * 等待执行的js代码
       */
      waitSendCode: "",
      /**
       * js运行类型
       */
      jsRunType: jsRunTypeList[0],
      jsRunTypeList,
      /**
       * Vuex变量类型
       */
      stateTypeList: [
        { title: "vuex", type: "vuex" },
        { title: "pinia", type: "pinia" },
        { title: "globalData", type: "globalData" },
      ],
    };
  },
  computed: {
    /**
     * 错误筛选分类index
     */
    errorTypeIndex() {
      return this.errorTypeList.findIndex((x) => x.type == this.options.errorFilterType);
    },
    /**
     * 日志分类索引
     */
    consoleTypeListIndex() {
      return this.consoleTypeList.findIndex((x) => x.type == this.options.consoleFilterType);
    },
    /**
     * 网络筛选索引
     */
    networkTypeListIndex() {
      return this.networkFilterType.findIndex((x) => x.type == this.options.networkFilterType);
    },
    /**
     * bus分类索引
     */
    busTypeListIndex() {
      return this.busFilterType.findIndex((x) => x.type == this.options.busFilterType);
    },
    /**
     * 文件分类索引
     */
    fileTypeListIndex() {
      return this.dirTypeList.findIndex((x) => x.type == this.options.fileSysDirType);
    },
    /**
     * 缓存类型索引
     */
    storageTypeListIndex() {
      return this.storageFilterTypeList.findIndex((x) => x.type == this.options.storageType);
    },
    /**
     * Vuex变量类型
     */
    stateTypeListIndex(){
      return this.stateTypeList.findIndex(x=>x.type == this.stateType)
    },
  },
  methods: {
    /**
     * 过滤类型改变
     */
    filterTypeChange(type) {
      this.$emit("filterTypeChange", type);
    },
    /**
     * 错误类型索引改变
     */
    errorTypeIndexChange(e) {
      this.filterTypeChange(this.errorTypeList[e].type);
    },
    /**
     * 日志分类索引改变
     */
    consoleTypeIndexChange(e) {
      this.filterTypeChange(this.consoleTypeList[e].type);
    },
    /**
     * 网络状态筛选改变事件
     */
    networkTypeIndexChange(e) {
      this.filterTypeChange(this.networkFilterType[e].type);
    },
    /**
     * bus筛选改变事件
     */
    busTypeIndexChange(e) {
      this.filterTypeChange(this.busFilterType[e].type);
    },
    /**
     * 文件分类改变事件
     */
    fileTypeIndexChange(e) {
      this.$emit("changeFileDirType", this.dirTypeList[e].type);
    },
    /**
     * 缓存类型改变事件
     */
    storageTypeIndexChange(e) {
      this.$emit("changeStorageType", this.storageFilterTypeList[e].type);
    },
    /**
     * Vuex变量类型改变事件
     */
    stateTypeIndexChange(e) {
      this.$emit("changeStateType", this.stateTypeList[e].type);
    },
    /**
     * 清空日志
     */
    emptyLogs(type) {
      let that = this;
      let title = {
        error: "报错记录",
        console: "console",
        network: "请求日志",
        pages_1: "页面停留统计",
        pages_2: "页面日活统计",
        logs: "Logs",
        UniBus: "UniBus",
        storage: "Storage",
      };
      // #ifdef H5
      if (type == "storage") {
        title[type] = this.options.storageType;
      }
      // #endif

      uni.showModal({
        title: "警告",
        content: `是否确认清空${title[type]}全部数据？`,
        success(e) {
          if (e.confirm) {
            uni.showLoading({
              title: "处理中...",
            });

            if (type == "error") {
              devCache.set("errorReport", []);
            } else if (type == "console") {
              uni.$emit("devTools_delConsoleAll");
            } else if (type == "network") {
              uni.$emit("devTools_delNetworkAll");
            } else if (type == "logs") {
              devCache.set("logReport", []);
            } else if (type == "UniBus") {
              uni.$emit("devTools_delUniBusAll");
            } else if (type == "pages_1") {
              devCache.set("pageCount", []);
            } else if (type == "pages_2") {
              devCache.set("dayOnline", []);
            } else if (type == "storage") {
              that.delStorage();
            }

            setTimeout(() => {
              that.$emit("getPage");
            }, 5500);
            setTimeout(() => {
              uni.hideLoading();
              uni.showToast({
                title: "清空成功！",
                icon: "success",
              });
            }, 5000);
          }
        },
      });
    },
    /**
     * 清空全部缓存
     */
    delStorage() {
      // #ifdef APP-PLUS
      let keys = plus.storage.getAllKeys();
      for (let i = 0; i < keys.length; i++) {
        const key = String(keys[i]);
        if (key.indexOf("devTools_") == 0) {
          continue;
        }
        uni.removeStorageSync(key);
      }
      // #endif

      // #ifdef H5
      if (this.options.storageType == "localStorage") {
        for (let i = 0; i < localStorage.length; i++) {
          let key = String(localStorage.key(i));
          if (key.indexOf("devTools_") == 0) {
            continue;
          }
          uni.removeStorageSync(key);
        }
      } else if (this.options.storageType == "sessionStorage") {
        for (let i = 0; i < sessionStorage.length; i++) {
          let key = String(sessionStorage.key(i));
          if (key.indexOf("devTools_") == 0) {
            continue;
          }
          sessionStorage.removeItem(key);
        }
      } else if (this.options.storageType == "cookie") {
        let keys = [];
        document.cookie.split(";").forEach((cookieStr) => {
          const [name, value] = cookieStr.trim().split("=");
          keys.push(name);
        });
        keys.map((k) => {
          document.cookie = `${k}=;expires=` + new Date(new Date().getTime() + 200).toGMTString() + ";path=/";
        });
      }

      // #endif

      // #ifdef MP
      let keyList = devCache.get("storage");
      if (!keyList) keyList = [];
      for (let i = 0; i < keyList.length; i++) {
        const key = keyList[i];
        if (key.indexOf("devTools_") == 0) {
          continue;
        }
        uni.removeStorageSync(key);
      }
      // #endif
    },
    /**
     * 清空文件夹
     */
    emptyFolder() {
      let that = this;
      if (that.options.fileSysDirType == "PRIVATE_WWW") {
        return uni.showToast({
          title: "该目录不可删除",
          icon: "none",
        });
      }
      uni.showModal({
        title: "提示",
        content: "是否确认清空全部文件?",
        success(res) {
          if (res.confirm) {
            uni.showLoading({
              title: "清空中",
            });
            let path = "";
            switch (that.options.fileSysDirType) {
              case "wx":
                path = wx.env.USER_DATA_PATH;
                break;
              case "PRIVATE_DOC":
                path = "_doc";
                break;
              case "PUBLIC_DOCUMENTS":
                path = "_documents";
                break;
              case "PUBLIC_DOWNLOADS":
                path = "_downloads";
                break;
              default:
                break;
            }
            // #ifdef APP-PLUS
            appDelDir(path + "/", false)
              .then(() => {
                uni.hideLoading();
                uni.showToast({
                  title: "清空成功！",
                  icon: "success",
                });
                that.$emit("getPage");
              })
              .catch(() => {
                uni.hideLoading();
                uni.showToast({
                  title: "清空失败！",
                  icon: "none",
                });
              });
            // #endif
            // #ifdef MP-WEIXIN
            let fs = wx.getFileSystemManager();
            fs.rmdir({
              dirPath: path + "/",
              recursive: true,
              success() {
                uni.hideLoading();
                uni.showToast({
                  title: "清空成功！",
                  icon: "success",
                });
                that.$emit("getPage");
              },
              fail() {
                uni.hideLoading();
                uni.showToast({
                  title: "清空失败！",
                  icon: "none",
                });
              },
            });
            // #endif
          }
        },
      });
    },
    /**
     * 创建文件夹
     */
    createDir() {
      let that = this;
      let menu = [
        {
          text: `新建文件`,
          click() {
            that.$emit("editDirName", {
              isEdit: false,
              isDir: false,
            });
          },
        },
        {
          text: `新建文件夹`,
          click() {
            that.$emit("editDirName", {
              isEdit: false,
              isDir: true,
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
    /**
     * 新增缓存
     */
    addStorage() {
      uni.$emit("devTools_showAddStorageDialog");
    },
    /**
     * 执行js
     */
    runJs() {
      let that = this;
      if (this.waitSendCode == "") {
        return uni.showToast({
          title: "请先输入需要执行的js代码",
          icon: "none",
        });
      } else {
        let code = String(this.waitSendCode);
        this.$emit("runJs", { code, type: that.jsRunType });
        this.waitSendCode = "";
      }
    },
    /**
     * 获取历史代码运行记录
     */
    showHisCode() {
      let that = this;
      let his = devCache.get("codeRunHis");
      if (!his) his = [];
      if (his.length == 0) {
        return uni.showToast({
          title: "暂无记录！",
          icon: "none",
        });
      }
      that.$refs.codeHisPicker.show(his).then((res) => {
        that.waitSendCode = res;
      });
    },
    /**
     * 跳转指定页面
     */
    goPage() {
      uni.$emit("devTools_showRouteDialog");
    },
  },
};
</script>
<style lang="scss" scoped>
.bottomTools {
  position: fixed;
  z-index: 3;
  bottom: 0;
  left: 0;
  width: 750rpx;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background-color: #fff;
  padding-top: 15rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  .mr {
    margin-right: 20rpx;
  }
  .mt {
    margin-left: 20rpx;
  }
  .ml {
    margin-left: 20rpx;
  }
  .miniBtn {
    height: 40rpx;
    border-radius: 8rpx;
    padding: 0 10rpx;
    border: 1px solid rgba(0, 0, 0, 0.05);
    &.warn {
      background-color: rgb(255, 251, 229);
    }
    &.primary {
      background-color: #ecf5ff;
    }
    .miniBtnText {
      font-size: 20rpx;
      height: 40rpx;
      line-height: 40rpx;
    }
  }
}
.dirList {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 710rpx;
  height: 34rpx;
  margin-bottom: 10rpx;
  white-space: nowrap;
  .dirScrollItem {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    height: 34rpx;
  }
  .dirItem {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .delimiter {
    color: #999;
    margin: 0 6rpx;
    font-size: 22rpx;
    line-height: 34rpx;
  }
  .dirName {
    color: #333;
    font-size: 22rpx;
    line-height: 34rpx;
    height: 34rpx;
    padding: 0 6rpx;
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 6rpx;
  }
}
.jsRunnerTools {
  display: flex;
  flex-direction: column;
  width: 710rpx;
  .runOptions {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 710rpx;
    justify-content: space-between;
    padding-bottom: 10rpx;
    .radiusList {
      display: flex;
      flex-direction: row;
      align-items: center;
      .runType {
        font-size: 20rpx;
        line-height: 24rpx;
        color: #333;
      }
      .radiusItem {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 10rpx;
        .radiusText {
          font-size: 20rpx;
          line-height: 24rpx;
          color: #333;
        }
        .radiusRadio {
          transform: scale(0.5);
        }
      }
    }
    .hisEmpty {
      display: flex;
      flex-direction: row;
      align-items: center;
      .hisEmptyIcon {
        width: 16rpx;
        height: 16rpx;
      }
      .hisEmptyText {
        font-size: 20rpx;
        margin-left: 5rpx;
        color: #ff2d55;
      }
    }
    .logList {
      // margin-right: 120rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      .hisText {
        font-size: 20rpx;
        color: #777;
        list-style: 24rpx;
        margin-right: 5rpx;
      }
      .unfold {
        width: 24rpx;
        height: 24rpx;
      }
    }
  }
  .code {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 710rpx;
    .codeInput {
      width: 590rpx;
      height: 100rpx;
      font-size: 20rpx;
      line-height: 28rpx;
      color: #333;
      padding: 10rpx;
      background-color: rgba(0, 0, 0, 0.03);
      border-radius: 15rpx;
    }
    .codeSend {
      width: 100rpx;
      height: 100rpx;
      border-radius: 15rpx;
      border: 1px solid #ff2d55;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .codeSendText {
        color: #ff2d55;
        font-size: 24rpx;
        font-weight: bold;
      }
    }
    .codeSend:active {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }
}
</style>
