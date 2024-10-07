import devCache from "../libs/devCache";
import devOptions from "../libs/devOptions";
import jsonCompress from "../libs/jsonCompress";

export default {
  /**
   * 请求日志示例
   */
  ajaxLogData: {
    id: 0, //请求id
    type: 0, // 0发起请求中  1请求成功  2请求失败
    sendTime: 0, //发送请求的时间
    responseTime: 0, //响应时间
    useTime: 0, //请求总耗时

    url: "", //请求地址
    header: "", //请求头
    method: "get", //请求方式
    data: "", //请求参数

    responseBody: "", //响应主体
    responseHeader: "", //响应头
    responseStatus: "", //响应编码
    responseMsg: "", //响应报错信息
  },
  options: null,
  /**
   * 请求的数据列表
   */
  ajaxData: [],
  /**
   * 挂载请求拦截器
   */
  install() {
    let that = this;

    try {
      this.options = devOptions.getOptions()
      if (!this.options.network.status) return;

      this.ajaxData = devCache.get("request");
      if (!this.ajaxData) this.ajaxData = [];
      this.syncReqData(); //同步缓存

      uni.addInterceptor('request', {
        /**
         * 入参
         */
        invoke(args) {

          try {
            args._id_ = new Date().getTime() + '_' + Number(Math.random().toString().replace("0.", ""));

            let copyData = JSON.parse(JSON.stringify(that.ajaxLogData))
            copyData.id = args._id_;
            copyData.sendTime = new Date().getTime();
            copyData.url = that.dataCopy(args.url);
            copyData.header = that.dataCopy(args.header);
            if (!args.method) {
              copyData.method = "get"
            } else {
              copyData.method = that.dataCopy(args.method);
            }

            let cSize = jsonCompress.calculateStringByteSize(copyData)
            if (cSize > that.options.network.cache.rowSize) {

              copyData = jsonCompress.compressObject(copyData, that.options.network.cache.rowSize)

            } else {

              let data = jsonCompress.compressObject(args.data, that.options.network.cache.rowSize - cSize)
              try {
                data = JSON.parse(data)
              } catch (error) { }
              copyData.data = data;

            }
            that.ajaxData.unshift(copyData)

          } catch (error) {
            console.error("request拦截器invoke出错", error)
          }

        },
        success(response, request) {
          return new Promise(async (yes, err) => {

            //! 延迟请求返回，模拟弱网环境
            let speedLimit = uni.getStorageSync("devtools_uniResLimitType");
            if (speedLimit) {
              let delayDuration = {
                "2g": [30, 60],
                "3g-": [10, 30],
                "3g": [3, 10],
                "4g": [0.5, 3],
              }
              let sleepParam = delayDuration[speedLimit];
              if (sleepParam) {
                let sleepTime = rNum(sleepParam[0], sleepParam[1]);
                await sleep(sleepTime * 1000)
                response.errMsg = response.errMsg + ` | [devtools模拟弱网延迟:${sleepTime}s]`
              }
            }

            // ! 随机响应失败概率
            let resTimeout = uni.getStorageSync("devtools_uniResTimeout");
            let isFail = false
            if (resTimeout && resTimeout > 1) {
              let targetPro = Number(resTimeout);
              let randPro = rNum(0, 100);
              if (randPro < targetPro) {
                // 命中失败
                response.statusCode = rNum(400, 600); //生成随机400 ~ 600之间的状态码
                response.errMsg = response.errMsg + ` | [devtools随机超时报错，当前命中的概率阶层为:${targetPro}%，生成的随机数为：${randPro}]`
                response.data = "[devTools]模拟请求失败结果！"
                isFail = true
              }
            }


            // ! 记录响应内容
            try {
              let item = that.ajaxData.find(x => x.id == request._id_);
              if (!item) return;

              item.responseBodySize = jsonCompress.calculateStringByteSize(response.data);
              item.responseMsg = response.errMsg;
              item.responseStatus = response.statusCode;
              item.responseHeader = response.header;
              item.type = 1;
              item.responseTime = new Date().getTime();
              item.useTime = ((item.responseTime - item.sendTime) / 1000).toFixed(3);

              let size = jsonCompress.calculateStringByteSize(item)
              if (size > that.options.network.cache.rowSize) {

                item.responseBody = "[内容太长已截断多余部分]"
                let data = jsonCompress.compressObject(item, that.options.network.cache.rowSize)
                that.ajaxData[that.ajaxData.findIndex(x => x.id == request._id_)] = data;

              } else {

                let json = response.data;
                try {
                  json = JSON.parse(JSON.stringify(json))
                } catch (error) { }
                item.responseBody = jsonCompress.compressObject(json, that.options.network.cache.rowSize - size)

              }

            } catch (error) {
              console.error("request拦截器success出错", error)
            }

            if (isFail) {
              err(response.data)
            } else {
              yes(response)
            }

          })
        },
        fail(err, request) {
          try {
            let item = that.ajaxData.find(x => x.id == request._id_);
            if (!item) return;

            item.type = 2;
            item.responseTime = new Date().getTime();
            item.useTime = ((item.responseTime - item.sendTime) / 1000).toFixed(3);

            item.responseMsg = err.errMsg;
          } catch (error) {
            console.error("request拦截器fail出错", error)
          }
        },
        complete(res) {

        }
      })

      // ! 删除指定请求记录
      uni.$on("devTools_delNetworkItemById", (id) => {
        let i = this.ajaxData.findIndex(x => x.id == id)
        if (i != -1) {
          this.ajaxData.splice(i, 1)
        }
        this.saveData()
      })

      // ! 清空请求记录
      uni.$on("devTools_delNetworkAll", () => {
        this.ajaxData = []
        this.saveData()
      })
    } catch (error) {
      console.log("request.install error", error);
    }

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
        console.log("request.syncReqData", error);
      }
      that.syncReqData()
    }, 4000);
  },
  /**
   * 保存数据到缓存中
   */
  saveData() {
    let that = this;
    that.ajaxData = jsonCompress.compressArray(that.ajaxData, that.options.network.cache.size)
    devCache.set("request", that.ajaxData)
  },
  /**
   * 复制对象
   */
  dataCopy(data) {
    try {
      if (typeof data == "object") {
        return JSON.parse(JSON.stringify([data]))[0]
      } else {
        return data;
      }
    } catch (error) {
      console.log("request.dataCopy", error);
      return ""
    }
  }
}





/**
 * 随机生成n~m的数，支持两位小数
 */
function rNum(n, m) {
  return Number((Math.random() * (m - n) + n).toFixed(2));
}

/**
 * 休眠指定时长
 */
function sleep(t) {
  return new Promise((y) => {
    setTimeout(y, t);
  })
}