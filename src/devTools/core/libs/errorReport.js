import devCache from "./devCache";
import devOptions from "./devOptions";
import jsonCompress from "./jsonCompress";
/**
 * ! vue报错捕获
 */



/**
 * * vue错误日志上报
 * @param {'ve'|'vw'|'oe'|'n'} type 错误类型
 */
function errorReport(msg, trace, type = "n") {
  try {
    if (!msg) return false;

    if (msg instanceof Error) {
      msg = msg.message;
    }
    let options = devOptions.getOptions()
    if (!options.error.status) return;

    let page = "未知";
    try {
      let pages = getCurrentPages()
      let item = pages[pages.length - 1];
      if (item && item.route) {
        page = item.route;
      }
    } catch (error) { }

    let logs = devCache.get("errorReport");
    if (!logs) logs = [];
    if (logs.length >= options.error.cache.rowMax) {
      logs = logs.splice(0, options.error.cache.rowMax)
    }

    msg = String(msg)
    msg = jsonCompress.compressObject(msg, options.error.cache.rowSize / 2)
    trace = String(trace)
    trace = jsonCompress.compressObject(trace, options.error.cache.rowSize / 2)

    logs.unshift({
      t: new Date().getTime(),
      m: msg,
      tr: trace,
      p: page,
      type,
    });

    console.error("__ignoreReport__", msg, trace)

    logs = jsonCompress.compressArray(logs, "end", options.error.cache.size)

    devCache.set("errorReport", logs)
  } catch (error) {
    console.log("errorReport error: ", error);
  }
}



export default errorReport;