import devCache from "./devCache";
import devOptions from "./devOptions";
import jsonCompress from "./jsonCompress";
/**
 * ! 运行日志提交工具
 */



/**
 * 日志上报
 */
function logReport(msg) {
  try {
    if (!msg) return false;
    let options = devOptions.getOptions()
    if (!options.status) {
      console.error("日志上报失败！dev工具未启用 msg:" + msg);
      return;
    }
    if (!options.logs.status) {
      console.error("日志上报失败！dev logs未启用 msg:" + msg);
      return;
    }

    try {
      let pages = getCurrentPages()
      if (pages[pages.length - 1].route == options.devRoute) {
        // 不记录调试工具报出的日志
        return false;
      }
    } catch (error) { }

    if (typeof msg == "object") {
      try {
        msg = JSON.stringify(msg)
      } catch (error) {
        msg = "logReport:error"
      }
    }

    let log = {
      t: new Date().getTime(),
      m: "",
    }
    let logSize = jsonCompress.calculateStringByteSize(log)

    msg = String(msg);
    msg = jsonCompress.compressObject(msg, options.logs.cache.rowSize - logSize)
    log.m = msg;

    let logs = devCache.get("logReport");
    if (!logs) logs = [];

    logs.unshift(log);

    logs = jsonCompress.compressArray(logs, "end", options.logs.cache.size)

    devCache.set("logReport", logs)
  } catch (error) {
    console.log("logReport error", error);
  }
}



export default logReport;