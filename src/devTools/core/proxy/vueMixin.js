import devOptions from "../libs/devOptions";
import logReport from "../libs/logReport";
import pageStatisticsReport from "../libs/pageStatistics";


/**
 * ! Vue页面混入，监听生命周期
 */
export default {
  data() {
    return {
      /**
       * 挂载dev页面对象
       */
      devTools_pageData: {
        route: '', // 页面路径
        isOnShow: false, // 是否处于展示状态
        activeTime: 0, //活跃时间
      }
    }
  },
  /**
   * *页面载入事件
   */
  onLoad(pageInitParams) {
    let that = this;


    // ! 注入 Eruda
    let isInjectEruda = uni.getStorageSync("devTools_isInjectEruda") == "yes";
    if (isInjectEruda) {
      let ErudaCode = `
        if(!window.isInjectEruda){
          window.isInjectEruda = true;
          var script = document.createElement('script');
          script.src="https://cdn.jsdelivr.net/npm/eruda";
          document.body.append(script);
          script.onload = function () {
            eruda.init();
          }
        }
      `
      let fun = 'e' + ['v'][0] + 'a' + ['l'][0];
      try {
        // #ifdef H5
        window[fun](ErudaCode);
        // #endif
        // #ifdef APP-PLUS
        let endPageWebView = getCurrentPages().pop();
        if (endPageWebView) {
          let nowPageWebview = endPageWebView.$getAppWebview();
          if (nowPageWebview && !nowPageWebview.nvue) {
            nowPageWebview[fun + 'JS'](ErudaCode)
          }
        }
        // #endif
      } catch (error) {
        console.log("devTools mixin onLoad injectEruda error ", error);
      }
    }

    // ! 注入 vConsole
    let isInjectVConsole = uni.getStorageSync("devTools_isInjectVConsole") == "yes";
    if (isInjectVConsole) {
      let vConsoleCode = `
        if(!window.isInjectVConsole){
          window.isInjectVConsole = true;
          var script = document.createElement('script');
          script.src="https://cdn.jsdelivr.net/npm/vconsole@latest/dist/vconsole.min.js";
          document.body.append(script);
          script.onload = function () {
            let vConsoleObj = new window.VConsole();
          }
        }
      `
      let fun = 'e' + ['v'][0] + 'a' + ['l'][0];
      try {
        // #ifdef H5
        window[fun](vConsoleCode);
        // #endif
        // #ifdef APP-PLUS
        let endPageWebView = getCurrentPages().pop();
        if (endPageWebView) {
          let nowPageWebview = endPageWebView.$getAppWebview();
          if (nowPageWebview && !nowPageWebview.nvue) {
            nowPageWebview[fun + 'JS'](vConsoleCode)
          }
        }
        // #endif
      } catch (error) {
        console.log("devTools mixin onLoad injectVConsole error ", error);
      }
    }

    try {
      let pages = getCurrentPages();
      let pageItem = pages && pages.length > 0 ? pages[pages.length - 1] : null;
      if (pageItem) {
        let devSetting = devOptions.getOptions()
        if (pageItem.route == devSetting.devRoute) {
          that.devTools_pageData = false;
        } else {
          that.devTools_pageData.route = pageItem.route;
          logReport(`onLoad>${pageItem.route}>` + (pageInitParams ? JSON.stringify(pageInitParams) : ''))
          setInterval(() => {
            if (that.devTools_pageData && that.devTools_pageData.isOnShow) {
              that.devTools_pageData.activeTime = that.devTools_pageData.activeTime + 1;
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.log("devTools mixin onLoad error ", error);
    }
  },
  /**
   * *页面展示事件
   */
  onShow() {
    try {
      let that = this;
      if (that.devTools_pageData) {
        that.devTools_pageData.isOnShow = true;
        that.devTools_pageData.activeTime = 0;
      }
    } catch (error) {
      console.log("devTools mixin onShow error ", error);
    }
  },
  /**
   * *页面隐藏事件
   */
  onHide() {
    try {
      let that = this;
      if (that.devTools_pageData) {
        that.devTools_pageData.isOnShow = false;
        pageStatisticsReport(that.devTools_pageData.route, that.devTools_pageData.activeTime);
        that.devTools_pageData.activeTime = 0;
      }
    } catch (error) {
      console.log("devTools mixin onHide error ", error);
    }
  },
  /**
   * * 页面卸载事件
   */
  onUnload() {
    try {
      let that = this;
      logReport(`onUnload>${that.devTools_pageData.route}`)
      that.devTools_pageData = null;
    } catch (error) {
      console.log("devTools mixin onUnload error ", error);
    }
  },
}