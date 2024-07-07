import devCache from "../libs/devCache";


export default {
  /**
   * 挂载缓存监听
   */
  install() {
    try {
      // #ifdef MP
      let that = this;

      let _setStorage = uni.setStorage;
      uni.setStorage = setStorage;
      function setStorage() {
        try {
          if (
            arguments[0]
            && arguments[0].key
            && arguments[0].key.indexOf("devTools_") != 0
          ) {
            that.addCacheKey(arguments[0].key)
          }
        } catch (error) { }
        return _setStorage(...arguments)
      }

      let _setStorageSync = uni.setStorageSync;
      uni.setStorageSync = setStorageSync;
      function setStorageSync() {
        try {
          if (
            arguments[0]
            && arguments[0].indexOf("devTools_") != 0
          ) {
            that.addCacheKey(arguments[0])
          }
        } catch (error) { }
        return _setStorageSync(...arguments)
      }

      let _removeStorage = uni.removeStorage;
      uni.removeStorage = removeStorage;
      function removeStorage() {
        try {
          if (
            arguments[0]
            && arguments[0].key
            && arguments[0].key.indexOf("devTools_") != 0
          ) {
            that.delCacheKey(arguments[0].key)
          }
        } catch (error) { }
        return _removeStorage(...arguments)
      }

      let _removeStorageSync = uni.removeStorageSync;
      uni.removeStorageSync = removeStorageSync;
      function removeStorageSync() {
        try {
          if (
            arguments[0]
            && arguments[0].indexOf("devTools_") != 0
          ) {
            that.delCacheKey(arguments[0])
          }
        } catch (error) { }
        return _removeStorageSync(...arguments)
      }

      // #endif
    } catch (error) {
      console.log("devTools storage.install error", error);
    }
  },
  /**
   * 添加缓存key
   */
  addCacheKey(key) {
    try {
      if (key && typeof key == "string") {

        let storageList = devCache.get("storage")
        if (!storageList) storageList = [];
        if (storageList.indexOf(key) == -1) {
          storageList.push(key)
          devCache.set("storage", storageList)
        }

      }
    } catch (error) {
      console.log("devTools storage.addCacheKey error", error);
    }
  },
  /**
   * 删除指定缓存key
   */
  delCacheKey(key) {
    try {
      if (key && typeof key == "string") {
        let storageList = devCache.get("storage")
        if (!storageList) storageList = [];
        let index = storageList.indexOf(key);
        if (index > -1) {
          storageList.splice(index, 1)
          devCache.set("storage", storageList)
        }
      }
    } catch (error) {
      console.log("devTools storage.delCacheKey error", error);
    }
  },
}