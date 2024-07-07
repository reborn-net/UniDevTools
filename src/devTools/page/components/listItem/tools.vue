<template>
  <view>
    <subTitleBar
      :isOpen="isShowSetting"
      @click="changeStatus('isShowSetting')"
      title="DevTools扩展配置项"
    />
    <template v-if="isShowSetting">
      <!-- #ifdef APP-PLUS || H5 -->
      <view class="settingItem">
        <view class="settingHead">
          <text class="settingTitle">页面自动注入Eruda调试工具</text>
          <text class="settingSubtitle">(强大的节点选择等工具；重启APP后生效)</text>
        </view>
        <switch
          :checked="isInjectEruda"
          @change="switchChange($event, 'isInjectEruda')"
          color="#ff2d55"
        />
      </view>
      <view class="settingItem">
        <view class="settingHead">
          <text class="settingTitle">页面自动注入vConsole调试工具</text>
          <text class="settingSubtitle">(腾讯开源的h5调试工具；重启APP后生效)</text>
        </view>
        <switch
          :checked="isInjectVConsole"
          @change="switchChange($event, 'isInjectVConsole')"
          color="#ff2d55"
        />
      </view>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <view class="settingItem">
        <view class="settingHead">
          <text class="settingTitle">小程序VConsole开关</text>
          <text class="settingSubtitle">设置是否打开调试开关。此开关对正式版也能生效。</text>
        </view>
        <switch
          :checked="isOpenMpDevTag"
          @change="switchChange($event, 'isOpenMpDevTag')"
          color="#ff2d55"
        />
      </view>
      <!-- #endif -->
    </template>
    <subTitleBar
      :isOpen="isShowBtnPanel"
      @click="changeStatus('isShowBtnPanel')"
      title="常用工具"
    />
    <view
      v-if="isShowBtnPanel"
      class="btnPanel"
    >
      <!-- #ifdef APP-PLUS || H5 -->
      <view
        class="btnItem btn-def"
        @click="restart"
      >
        <text class="btnText">重启APP</text>
      </view>
      <!-- #endif -->

      <view
        class="btnItem btn-def"
        @click="goPage"
      >
        <text class="btnText">跳转指定页面</text>
      </view>

      <view
        class="btnItem btn-def"
        @click="$emit('goOpenRequest')"
      >
        <text class="btnText">发起网络请求</text>
      </view>

      <view
        class="btnItem btn-def"
        @click="delLocalStorage"
      >
        <text class="btnText">清空localStorage缓存</text>
      </view>
    </view>
    <subTitleBar
      :isOpen="isShowDiyTools"
      @click="changeStatus('isShowDiyTools')"
      title="自定义Tools"
    />
    <tools
      v-if="isShowDiyTools"
      ref="tools"
    />
  </view>
</template>
<script>
import tools from "../../../tools.vue";
import subTitleBar from "../ui/subTitleBar.vue";
export default {
  components: {
    tools,
    subTitleBar,
  },
  data() {
    return {
      /**
       * 是否显示系统工具栏
       */
      isShowSetting: false,
      /**
       * 是否自动注入Eruda
       */
      isInjectEruda: uni.getStorageSync("devTools_isInjectEruda") == "yes",
      /**
       * 是否自动注入vConsole
       */
      isInjectVConsole: uni.getStorageSync("devTools_isInjectVConsole") == "yes",
      /**
       * 是否显示 用户自定义tools
       */
      isShowDiyTools: true,
      /**
       * 是否打开小程序调试工具
       */
      isOpenMpDevTag: uni.getStorageSync("devTools_isOpenMpDevTag") == "yes",
      /**
       * 常用工具栏开关
       */
      isShowBtnPanel: true,
    };
  },
  methods: {
    /**
     * 更改选中状态
     */
    changeStatus(key) {
      this[key] = !this[key];
    },
    /**
     * 开关选择器改变事件
     */
    switchChange(e, key) {
      let status = e.detail.value;
      this[key] = status;
      uni.setStorageSync("devTools_" + key, status ? "yes" : "no");

      if (key == "isOpenMpDevTag") {
        wx.setEnableDebug({
          enableDebug: status,
        });
      }
    },
    /**
     * 重启APP
     */
    restart() {
      // #ifdef APP-PLUS
      plus.runtime.restart();
      // #endif
      // #ifdef H5
      location.href = "/";
      // #endif
    },
    /**
     * 跳转指定页面
     */
    goPage() {
      uni.$emit("devTools_showRouteDialog");
    },
    /**
     * 清空LocalStorage
     */
    delLocalStorage() {
      uni.showModal({
        title: "操作确认",
        content: "是否确认清空LocalStorage缓存？",
        success(res) {
          if (res.confirm) {
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
            for (let i = 0; i < localStorage.length; i++) {
              let key = String(localStorage.key(i));
              if (key.indexOf("devTools_") == 0) {
                continue;
              }
              setTimeout(() => {
                localStorage.removeItem(key);
              }, i * 2 + 1);
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
            uni.showToast({
              icon: "success",
              title: "清空成功！",
            });
          }
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.padding-sm {
  padding: 20rpx;
}
.settingItem:active {
  background-color: rgba(0, 0, 0, 0.05);
}
.settingItem {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 750rpx;
  padding: 15rpx 0;
  .settingHead {
    display: flex;
    flex-direction: column;
    margin-left: 20rpx;
    .settingTitle {
      font-size: 24rpx;
      line-height: 28rpx;
      color: #333;
    }
    .settingSubtitle {
      margin-top: 4rpx;
      font-size: 20rpx;
      line-height: 26rpx;
      color: #777;
    }
  }
}
.btnPanel {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 20rpx;
  padding-right: 20rpx;
  padding-top: 20rpx;

  .btnItem {
    margin-right: 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    min-width: 120rpx;
    height: 60rpx;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background-color: rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 15rpx;
    .btnText {
      font-size: 20rpx;
      line-height: 30rpx;
      color: #333;
    }
  }
  .btn-red:active {
    background-color: rgba(255, 45, 85, 0.5);
  }
  .btn-red {
    border: 1px solid rgba(255, 45, 85, 1);
    background-color: rgba(255, 45, 85, 1);
    .btnText {
      color: #fff;
    }
  }
  .btn-def:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .btn-def {
    border: 1px solid rgba(0, 0, 0, 0.1);
    background-color: rgba(0, 0, 0, 0.04);
    .btnText {
      color: #333;
    }
  }
}
</style>
