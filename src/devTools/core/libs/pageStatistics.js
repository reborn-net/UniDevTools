
/**
 * !页面统计：访问次数、停留时长
 */

import devCache from "./devCache"
import devOptions from "./devOptions";
import jsonCompress from "./jsonCompress";
import { timeFormat } from "./timeFormat";

/**
 * 页面注销时提交
 */
function pageStatisticsReport(
  route, activeTime,
) {
  try {
    if (!route) return false;
    let options = devOptions.getOptions()
    if (!options.pageStatistics.status) return; //! 配置文件关闭页面统计
    let logs = devCache.get("pageCount");
    if (!logs) logs = [];
    let pageIndex = logs.findIndex(x => x.route == route)
    if (pageIndex == -1) {
      logs.push({
        route,
        activeTimeCount: activeTime,
      })
    } else {
      logs[pageIndex].activeTimeCount = activeTime + logs[pageIndex].activeTimeCount;
    }
    logs = jsonCompress.compressArray(logs, "end", options.pageStatistics.size)
    devCache.set("pageCount", logs)

    let now = new Date().getTime();
    let date = timeFormat(now, "yyyy-mm-dd");
    let dayOnline = devCache.get("dayOnline");
    if (!dayOnline) dayOnline = [];
    let i = dayOnline.findIndex(x => x.date == date);
    if (i == -1) {
      dayOnline.unshift({
        date,
        activeTimeCount: activeTime,
        page: [
          {
            r: route,
            t: activeTime,
          }
        ]
      })
    } else {
      dayOnline[i].activeTimeCount = dayOnline[i].activeTimeCount + activeTime;
      let pi = dayOnline[i].page.findIndex(x => x.r == route);
      if (pi == -1) {
        dayOnline[i].page.push({
          r: route,
          t: activeTime,
        })
      } else {
        dayOnline[i].page[pi].t = dayOnline[i].page[pi].t + activeTime;
      }
    }
    if (dayOnline.length > options.pageStatistics.dayOnlineRowMax) {
      dayOnline = dayOnline.splice(0, options.pageStatistics.dayOnlineRowMax)
    }

    dayOnline = jsonCompress.compressArray(dayOnline, "end", options.pageStatistics.size)
    devCache.set("dayOnline", dayOnline)
  } catch (error) {
    console.log("pageStatistics error", error);
  }
}

export default pageStatisticsReport;