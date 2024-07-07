<template>
  <view class="storageList">
    <objectAnalysis
      v-if="isLoaded && !isEmpty"
      :data="storageData"
      :isOpenFirst="true"
      :width="710"
      :isDiyMenu="true"
      @diyMenu="diyMenu"
    />
    <view
      v-if="!isLoaded"
      class="dataLoading"
    >
      <text class="status">加载中</text>
    </view>
    <view
      v-if="isLoaded && isEmpty"
      class="dataLoading"
    >
      <text class="status">无缓存数据</text>
    </view>
    <view
      v-if="isLoaded && !isEmpty"
      class="moreTools"
    >
      <text class="tips">Tips：长按最外层key可复制、编辑或删除缓存</text>
    </view>
  </view>
</template>
<script>
// #ifdef MP
import devCache from "../../../core/libs/devCache";
// #endif
import objectAnalysis from "./objectAnalysis.vue";

export default {
  components: {
    objectAnalysis,
  },
  data() {
    return {
      /**
       * 是否完成加载
       */
      isLoaded: false,
      /**
       * 缓存里的数据
       */
      storageData: {},
      /**
       * 数据是否为空
       */
      isEmpty: false,
    };
  },
  methods: {
    /**
     * 加载数据
     */
    getData(storageType) {
      let that = this;
      that.isLoaded = false;

      let data = {};

      // #ifdef APP-PLUS
      let keys = plus.storage.getAllKeys();
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.indexOf("devTools_") == 0) {
          // 忽略以 devTools_ 开头的key
          continue;
        }
        data[key] = uni.getStorageSync(key);
      }
      // #endif

      // #ifdef H5
      if (storageType == "localStorage") {
        for (let i = 0; i < localStorage.length; i++) {
          let key = localStorage.key(i);
          if (key.indexOf("devTools_") == 0) {
            continue;
          }
          let value = uni.getStorageSync(key);
          data[key] = value;
        }
      } else if (storageType == "sessionStorage") {
        for (let i = 0; i < sessionStorage.length; i++) {
          let key = sessionStorage.key(i);
          if (key.indexOf("devTools_") == 0) {
            continue;
          }
          let value = sessionStorage.getItem(key);
          data[key] = value;
        }
      } else if (storageType == "cookie") {
        document.cookie.split(";").forEach((cookieStr) => {
          const [name, value] = cookieStr.trim().split("=");
          data[name] = value;
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
        let value = uni.getStorageSync(key);
        if (value) {
          data[key] = value;
        }
      }
      // #endif

      setTimeout(() => {
        that.storageData = data;
        if (Object.keys(data).length == 0) {
          that.isEmpty = true;
        } else {
          that.isEmpty = false;
        }
        that.isLoaded = true;
      }, 500);
    },
    /**
     * 自定义长按事件
     */
    diyMenu({ item, index }) {
      let that = this;

      let menu = [
        {
          text: `复制键(key)`,
          click() {
            uni.setClipboardData({
              data: item.k,
            });
          },
        },
        {
          text: `复制值(value)`,
          click() {
            uni.setClipboardData({
              data: item.v,
            });
          },
        },
      ];

      if (item.p == 0) {
        //点击第一层 key
        menu.unshift({
          text: "删除该键",
          click() {
            // #ifdef H5
            if (that.storageType == "localStorage") {
              uni.removeStorageSync(item.k);
            } else if (that.storageType == "sessionStorage") {
              sessionStorage.removeItem(item.k);
            } else if (that.storageType == "cookie") {
              document.cookie = `${item.k}=;expires=` + new Date(new Date().getTime() + 200).toGMTString() + ";path=/";
            }
            // #endif
            // #ifndef H5
            uni.removeStorageSync(item.k);
            // #endif
            uni.showToast({
              title: "删除成功!",
              icon: "success",
            });
            if (that.storageType == "cookie") {
              // cookie删除后需要等待一秒后生效
              setTimeout(() => {
                that.getData();
              }, 1500);
            } else {
              that.getData();
            }
          },
        });
        menu.unshift({
          text: "编辑值",
          click() {
            let key = item.k;
            let value = "";
            if (that.storageType == "sessionStorage") {
              value = sessionStorage.getItem(key);
            } else if (that.storageType == "cookie") {
              document.cookie.split(";").forEach((cookieStr) => {
                const [name, v] = cookieStr.trim().split("=");
                if (name == key) {
                  value = v;
                }
              });
            } else {
              value = uni.getStorageSync(key);
            }
            if (typeof value == "object") {
              value = JSON.stringify(value);
            } else if (value === false) {
              value = "false";
            } else if (value === true) {
              value = "true";
            } else if (!value) {
              value = "";
            }
            uni.$emit("devTools_showEditDialog", {
              title: `key:${key}`,
              value,
            });

            uni.$on("devTools_editDialogClose", () => {
              uni.$off("devTools_editDialogSaveSuccess");
              uni.$off("devTools_editDialogClose");
            });

            uni.$on("devTools_editDialogSaveSuccess", (val) => {
              uni.$off("devTools_editDialogSaveSuccess");
              uni.$off("devTools_editDialogClose");
              let oldValue = uni.getStorageSync(key);
              if (oldValue === false || oldValue === true) {
                if (val == "true" || val == "false") {
                  val = val == "true";
                }
              }
              // #ifdef H5
              if (that.storageType == "localStorage") {
                uni.setStorageSync(key, val);
              } else if (that.storageType == "sessionStorage") {
                sessionStorage.setItem(key, val);
              } else if (that.storageType == "cookie") {
                key = encodeURIComponent(key);
                val = encodeURIComponent(val);
                let cookie =
                  `${key}=${val}; path=/; expires=` + new Date(new Date().getTime() + 86400 * 1000 * 365).toGMTString();
                document.cookie = cookie;
              }
              // #endif
              // #ifndef H5
              uni.setStorageSync(key, val);
              // #endif
              uni.showToast({
                icon: "success",
                title: "保存成功",
              });
              setTimeout(() => {
                that.getData();
              }, 300);
            });
          },
        });
      }

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
.storageList {
  padding: 20rpx;
  width: 750rpx;
}
.dataLoading {
  width: 750rpx;
  height: 400rpx;
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
.moreTools {
  display: flex;
  flex-direction: column;
  .tips {
    font-size: 20rpx;
    color: #888;
    margin-top: 20rpx;
  }
  .delBtn {
    all: initial;
    margin-top: 50rpx;
    border-radius: 8rpx;
    padding: 10rpx;
    background-color: rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 375rpx;

    &:active {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .delBtnText {
      font-size: 20rpx;
      line-height: 20rpx;
      color: #f37b1d;
    }
  }
}
</style>
