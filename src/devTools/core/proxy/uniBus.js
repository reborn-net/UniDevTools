import devCache from "../libs/devCache";
import devOptions from "../libs/devOptions";
import jsonCompress from "../libs/jsonCompress";


export default {
  logList: [],
  busCount: [],

  options: null,
  /**
   * 挂载打印拦截器
   */
  install() {
    try {
      let that = this;

      this.options = devOptions.getOptions()
      if (!this.options.uniBus.status) return;

      this.logList = devCache.get("uniBus");
      if (!this.logList) this.logList = [];

      this.busCount = devCache.get("busCount");
      if (!this.busCount) this.busCount = [];


      this.syncReqData(); //同步缓存

      let now = () => new Date().getTime();

      const _on = uni.$on;
      uni.$on = function () {
        try {
          let n = arguments[0];
          if (n && typeof n == "string" && n.length < 200 && n.indexOf("devTools_") == -1) {
            that.logList.unshift({
              t: now(),
              e: jsonCompress.compressObject(`on>${n}`, that.options.uniBus.cache.rowMax)
            })
            addCount(n, "on")
          }
        } catch (error) {
          console.error("uni.$on出错", error);
        }
        _on(...arguments)
      }

      const _once = uni.$once;
      uni.$once = function () {
        try {
          let n = arguments[0];
          if (n && typeof n == "string" && n.length < 200 && n.indexOf("devTools_") == -1) {
            that.logList.unshift({
              t: now(),
              e: jsonCompress.compressObject(`once>${n}`, that.options.uniBus.cache.rowMax)
            })
            addCount(n, "once")
          }
        } catch (error) {
          console.error("uni.$once出错", error);
        }
        _once(...arguments)
      }

      const _emit = uni.$emit;
      uni.$emit = function () {
        try {
          let n = arguments[0];
          let p = arguments[1];
          if (n && typeof n == "string" && n.length < 200 && n.indexOf("devTools_") == -1) {
            that.logList.unshift({
              t: now(),
              e: jsonCompress.compressObject(`emit>${n}` + (p ? ('>' + JSON.stringify(p)) : ''), that.options.uniBus.cache.rowMax)
            })
            addCount(n, "emit")
          }
        } catch (error) {
          console.error("uni.$emit出错", error);
        }
        _emit(...arguments)
      }

      const _off = uni.$off;
      uni.$off = function () {
        try {
          let n = arguments[0];
          if (n && typeof n == "string" && n.length < 200 && n.indexOf("devTools_") == -1) {
            that.logList.unshift({
              t: now(),
              e: jsonCompress.compressObject(`off>${n}` + arguments[0], that.options.uniBus.cache.rowMax)
            })
            addCount(n, "off")
          }
        } catch (error) {
          console.error("uni.$off出错", error);
        }
        _off(...arguments)
      }

      /**
       * 统计总次数
       */
      function addCount(name, type = "on") {
        let i = that.busCount.findIndex(x => x.e == name)
        if (i == -1) {
          let item = {
            e: name,
            on: 0,
            off: 0,
            emit: 0,
            once: 0,
          };
          item[type] = item[type] + 1;
          that.busCount.push(item)
        } else {
          that.busCount[i][type] = that.busCount[i][type] + 1;
        }
      }

      // ! 清空全部记录
      uni.$on("devTools_delUniBusAll", () => {
        that.logList = []
        that.busCount = []
        devCache.clearItem("uniBus");
        devCache.clearItem("busCount");
      })
    } catch (error) {
      console.log("devTools uniBus.install error", error);
    }


  },
  /**
   * 同步请求信息到缓存数据中
   */
  syncReqData() {
    let that = this;
    setTimeout(() => {
      try {

        that.logList = jsonCompress.compressArray(that.logList, "end", that.options.uniBus.cache.rowMax)
        devCache.set("uniBus", that.logList)

        that.busCount = jsonCompress.compressArray(that.busCount, "end", that.options.uniBus.cache.countMaxSize)
        devCache.set("busCount", that.busCount)
      } catch (error) {
        console.log("devTools uniBus.syncReqData error", error);
      }
      that.syncReqData()
    }, 5000);
  },
}