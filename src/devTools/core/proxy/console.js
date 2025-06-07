import devCache from "../libs/devCache";
import devOptions from "../libs/devOptions";
import jsonCompress from "../libs/jsonCompress";

export default {
  logList: [],
  options: null,
  /**
   * 挂载打印拦截器
   */
  install() {
    let that = this;

    this.options = devOptions.getOptions()
    if (!this.options.console.status) return;

    this.logList = devCache.get("console");
    if (!this.logList) this.logList = [];
    this.syncReqData(); //同步缓存

    if (uni.__log__) {
      // ! VUE3在app端时有这个特殊的方法
      that.mountUniConsole()
    } else {
      that.mountJsConsole()
    }

    //! 删除指定记录
    uni.$on("devTools_delConsoleItem", (item) => {
      let i = that.logList.findIndex(
        (x) => {
          let t = JSON.stringify(x.list)
          return t == JSON.stringify(item.list) &&
            x.time == item.time &&
            x.page == item.page &&
            x.type == item.type
        }
      );
      if (i != -1) {
        that.logList.splice(i, 1);
      }
      that.saveData()
    });

    //! 清空console日志
    uni.$on("devTools_delConsoleAll", () => {
      that.logList = []
      devCache.clearItem("console");
    });
  },
  /**
   * 同步请求信息到缓存数据中
   */
  syncReqData() {
    let that = this;
    setTimeout(() => {
      try {
        that.saveData()
      } catch (error) {
        console.log("console.syncReqData error", error);
      }
      that.syncReqData()
    }, 3000);
  },
  /**
   * 同步数据到缓存
   */
  saveData() {
    let that = this;
    that.logList = jsonCompress.compressArray(that.logList, 'end', that.options.console.cache.size)
    devCache.set("console", that.logList)
  },
  /**
   * 挂载监听js自带的console函数
   */
  mountJsConsole() {
    let that = this;
    try {

      let l = console.log;
      try {
        globalThis.consoleLog = function () {
          console.log(...arguments)
        };
      } catch (error) { }
      try {
        window.consoleLog = function () {
          console.log(...arguments)
        };
      } catch (error) { }
      console.log = function () {
        replaceConsole("log", arguments)
      };
      let e = console.error;
      function _error() {
        try {
          let args = [...arguments]
          if (
            args[0]
            && typeof args[0] == "string"
            && (
              args[0] == "__ignoreReport__" //! 忽略错误日志上报
              || args[0].indexOf("__ignoreReport__") == 0
            )
          ) {
            let _args = []
            if (args.length > 1) {
              for (let i = 0; i < args.length; i++) {
                if (i != 0) {
                  _args.push(args[i])
                }
              }
            } else {
              _args[0] = args[0];
              _args[0] = _args[0].replace("__ignoreReport__", "");
            }
            if (that.options.console.isOutput) {
              e(..._args)
            }
            return;
          }
          replaceConsole("error", args)
        } catch (error) {
          e("监听console.error出错", error)
        }
      }
      console.error = _error;
      let w = console.warn;
      console.warn = function () {
        replaceConsole("warn", arguments)
      };
      let i = console.info;
      console.info = function () {
        replaceConsole("info", arguments)
      };


      /**
       * 替换系统打印函数
       */
      function replaceConsole(type, args) {
        try {
          let data = []
          if (args && args.length > 0) {

            let argList = args;

            // #ifdef APP-PLUS
            if (args.length == 1) {
              argList = args[0].split("---COMMA---");

              let endItem = argList[argList.length - 1];
              if (
                endItem
                && typeof endItem == "string"
                && endItem.indexOf(" at ") > -1
                && endItem.indexOf(":") > -1
              ) { // 可能包含路径信息
                let endList = endItem.split(" at ");
                if (endList.length == 2) {
                  argList.pop()
                  argList.push(endList[0])
                  argList.push("at " + endList[1])
                }
              }

              argList = argList.map((item, index) => {
                try {
                  if (typeof item == "string") {
                    if (item.indexOf("---BEGIN") > -1) {
                      let isJson = item.indexOf("---BEGIN:JSON---") > -1;
                      item = item.replace(/---BEGIN:.*?---/g, '')
                      item = item.replace(/---END:.*?---/g, '')
                      if (isJson) {
                        item = JSON.parse(item);
                      }
                    } else if (item == "---NULL---") {
                      item = null;
                    } else if (item == "---UNDEFINED---") {
                      item = undefined;
                    }
                  }
                } catch (error) {
                  console.log("replaceConsole 尝试解析对象出错:", error);
                }
                return item;
              })
            }
            // #endif

            let oneSize = that.options.console.cache.rowSize / argList.length;
            for (let i = 0; i < argList.length; i++) {
              let row = jsonCompress.compressObject(argList[i], oneSize)
              data.push(row)
            }
          } else {
            data = []
          }

          let page = "未知";
          try {
            let pages = getCurrentPages()
            let item = pages[pages.length - 1];
            if (item && item.route) {
              page = item.route;
            }
          } catch (error) { }
          that.logList.unshift({
            list: data,
            time: new Date().getTime(),
            page,
            type,
          })
          if (that.options.console.isOutput) {
            if (type == "error") {
              e(...args)
            } else if (type == "warn") {
              w(...args)
            } else if (type == "info") {
              i(...args)
            } else {
              l(...args)
            }
          }

        } catch (error) {
          if (that.options.console.isOutput) {
            e("监听console出错", error)
          }
        }
      }


    } catch (error) {
      console.log("console.install error", error);
    }
  },
  /**
   * 挂载监听uni自带的打印函数
   */
  mountUniConsole() {
    let that = this;
    try {

      let uniSysConsole = uni.__log__;
      try {
        globalThis.consoleLog = function () {
          uni.__log__("log", "未知来源", ...arguments)
        };
      } catch (error) { }
      try {
        window.consoleLog = function () {
          uni.__log__("log", "未知来源", ...arguments)
        };
      } catch (error) { }

      uni.__log__ = function (type, line, ...args) {
        try {

          // 处理特殊情况 "__ignoreReport__" 忽略错误日志上报
          if (type == "error") {
            if (
              args[0]
              && typeof args[0] == "string"
              && (
                args[0] == "__ignoreReport__" //! 忽略错误日志上报
                || args[0].indexOf("__ignoreReport__") == 0
              )
            ) {
              let _args = []
              if (args.length > 1) {
                for (let i = 0; i < args.length; i++) {
                  if (i != 0) {
                    _args.push(args[i])
                  }
                }
              } else {
                _args[0] = args[0];
                _args[0] = _args[0].replace("__ignoreReport__", "");
              }
              if (that.options.console.isOutput) {
                uniSysConsole(type, line, ..._args)
              }
              return;
            }
          }

          let data = []
          if (args && args.length > 0) {
            let argList = args;
            let oneSize = that.options.console.cache.rowSize / argList.length;
            for (let i = 0; i < argList.length; i++) {
              let row = jsonCompress.compressObject(argList[i], oneSize)
              data.push(row)
            }
          } else {
            data = []
          }

          let page = "未知";
          try {
            let pages = getCurrentPages()
            let item = pages[pages.length - 1];
            if (item && item.route) {
              page = item.route;
            }
          } catch (error) { }

          data.push(line)

          that.logList.unshift({
            list: data,
            time: new Date().getTime(),
            page,
            type,
          })
          if (that.options.console.isOutput) {
            uniSysConsole(type, line, ...data)
          }

        } catch (error) {
          if (that.options.console.isOutput) {
            uniSysConsole("error", "监听console出错", error)
          }
        }
      }


      /**
       * 替换系统打印函数
       */
      function replaceConsole(type, args) {
        try {
          let data = []
          if (args && args.length > 0) {

            let argList = args;

            // #ifdef APP-PLUS
            if (args.length == 1) {
              argList = args[0].split("---COMMA---");

              let endItem = argList[argList.length - 1];
              if (
                endItem
                && typeof endItem == "string"
                && endItem.indexOf(" at ") > -1
                && endItem.indexOf(":") > -1
              ) { // 可能包含路径信息
                let endList = endItem.split(" at ");
                if (endList.length == 2) {
                  argList.pop()
                  argList.push(endList[0])
                  argList.push("at " + endList[1])
                }
              }

              argList = argList.map((item, index) => {
                try {
                  if (typeof item == "string") {
                    if (item.indexOf("---BEGIN") > -1) {
                      let isJson = item.indexOf("---BEGIN:JSON---") > -1;
                      item = item.replace(/---BEGIN:.*?---/g, '')
                      item = item.replace(/---END:.*?---/g, '')
                      if (isJson) {
                        item = JSON.parse(item);
                      }
                    } else if (item == "---NULL---") {
                      item = null;
                    } else if (item == "---UNDEFINED---") {
                      item = undefined;
                    }
                  }
                } catch (error) {
                  console.log("replaceConsole 尝试解析对象出错:", error);
                }
                return item;
              })
            }
            // #endif

            let oneSize = that.options.console.cache.rowSize / argList.length;
            for (let i = 0; i < argList.length; i++) {
              let row = jsonCompress.compressObject(argList[i], oneSize)
              data.push(row)
            }
          } else {
            data = []
          }

          let page = "未知";
          try {
            let pages = getCurrentPages()
            let item = pages[pages.length - 1];
            if (item && item.route) {
              page = item.route;
            }
          } catch (error) { }
          that.logList.unshift({
            list: data,
            time: new Date().getTime(),
            page,
            type,
          })
          if (that.options.console.isOutput) {
            if (type == "error") {
              e(...args)
            } else if (type == "warn") {
              w(...args)
            } else if (type == "info") {
              i(...args)
            } else {
              l(...args)
            }
          }

        } catch (error) {
          if (that.options.console.isOutput) {
            e("监听console出错", error)
          }
        }
      }


    } catch (error) {
      console.log("console.install error", error);
    }
  },

}