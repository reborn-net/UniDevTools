import devOptions from "./devOptions"
/**
 * dev工具缓存管理
 */
export default {
  /**
   * 存储的键开始名称
   */
  cacheKey: "devTools_v3_",
  options: null,
  /**
   * 临时缓存对象
   */
  tempCache: {
    errorReport: [],
    logReport: [],
    console: [],
    request: [],
    uniBus: [],
  },
  /**
   * 临时数据存放
   */
  tempData: {},
  /**
   * 向缓存内写入数据
   */
  set(key, value) {
    try {
      if (['errorReport', 'logReport', 'console', 'request', 'uniBus'].indexOf(key) != -1) {
        let setting = this.getLongListSetting(key)
        if (!setting.status) return;
        if (!setting.cache.status) {
          // !不使用缓存
          this.tempCache[key] = value;
          return;
        }
      }
      key = `${this.cacheKey}${key}`

      // #ifdef APP-NVUE
      let pages = getCurrentPages()
      if (pages[pages.length - 1].route == "devTools/page/index") {
        // devtools 页面直接走设置缓存
        return uni.setStorageSync(key, value);
      }
      // #endif

      this.tempData[key] = value;
    } catch (error) {
      console.log("devCache.set error", error);
    }
  },
  /**
   * 同步读取缓存数据
   */
  get(key) {
    try {
      if (['errorReport', 'logReport', 'console', 'request', 'uniBus'].indexOf(key) != -1) {
        let setting = this.getLongListSetting(key)
        if (!setting.status) return [];
        if (!setting.cache.status) {
          // !不使用缓存
          return this.tempCache[key];
        }
      }
      key = `${this.cacheKey}${key}`

      // #ifdef APP-NVUE
      let pages = getCurrentPages()
      if (pages[pages.length - 1].route == "devTools/page/index") {
        // devtools 页面直接走设置缓存
        return uni.getStorageSync(key);
      }
      // #endif

      if (this.tempData.hasOwnProperty(key)) {
        return this.tempData[key];
      } else {
        let value = uni.getStorageSync(key);
        this.tempData[key] = value;
        return value;
      }
    } catch (error) {
      console.log("devCache.get error", error);
      return "";
    }
  },
  /**
   * 向缓存内写入数据
   */
  clearItem(key) {
    try {
      if (['errorReport', 'logReport', 'console', 'request', 'uniBus'].indexOf(key) != -1) {
        let setting = this.getLongListSetting(key)
        if (!setting.status) return [];
        if (!setting.cache.status) {
          // !不使用缓存
          delete this.tempData[key];
          uni.removeStorageSync(key);
        }
      }
      key = `${this.cacheKey}${key}`;
      delete this.tempData[key];
      uni.removeStorageSync(key);
    } catch (error) {
      console.log("devCache.clearItem error", JSON.stringify(error));
    }
  },
  getLongListSetting(key) {
    let optionsKey = {
      errorReport: 'error',
      logReport: 'logs',
      console: 'console',
      request: 'network',
      uniBus: 'uniBus',
    }
    if (this.options) return this.options[optionsKey[key]];
    this.options = devOptions.getOptions()
    return this.options[optionsKey[key]];
  },
  /**
   * 同步本地缓存
   */
  syncLocalCache() {
    let that = this;
    setTimeout(() => {
      try {
        let waitSetKeys = Object.keys(that.tempData);
        for (let i = 0; i < waitSetKeys.length; i++) {
          const key = waitSetKeys[i];
          uni.setStorage({
            key,
            data: that.tempData[key],
            success() {
              // console.log("set " + key + " success,length=" + that.tempData[key].length);
              delete that.tempData[key];
            }
          });
        }
      } catch (error) {
        console.log("devCache error: ", error);
      }
      setTimeout(() => {
        that.syncLocalCache();
      }, 500);
    }, Math.round(Math.random() * 3 * 1000) + 2000);
  },
}

