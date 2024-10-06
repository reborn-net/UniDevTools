import devCache from "./devCache";

/**
 * 设置各端大小 kb
 */
const defSize = (h5, app, mp) => {
  let r = 0;
  // #ifdef H5
  r = h5;
  // #endif
  // #ifdef MP
  r = mp;
  // #endif
  // #ifdef APP-PLUS || APP-NVUE
  r = app;
  // #endif
  return Math.ceil(r * 1024);
}



/**
 * 获取配置
 */
export default {
  /**
   * 配置缓存key
   */
  cacheKey: "options_v8",
  /**
   * 默认配置项
   */
  defaultOptions: {
    version: 3.6,
    status: false, //调试工具总开关
    route: "/devTools/page/index", // 调试页面的路由，不建议更改
    bubble: { //调试弹窗气泡设置
      status: false, // 气泡标签是否显示，生产环境建议关闭
      text: "调试工具", // 气泡上展示的文字
      color: "#ffffff", // 气泡文字颜色
      bgColor: "rgba(250, 53, 52,0.7)", // 气泡背景颜色
    },
    console: {
      status: true, // 开关
      isOutput: true, //打印的日志是否对外输出到浏览器调试界面，建议在生产环境时开启
      cache: {
        status: true, //是否启用console缓存
        size: defSize(512, 1024 * 2, 512),
        rowSize: defSize(5.12, 20, 10),
      },
    },
    error: {
      status: true,
      cache: {
        status: true,
        size: defSize(512, 1024 * 2, 512),
        rowSize: defSize(5.12, 20, 10),
      },
    },
    network: {
      status: true,
      cache: {
        status: true,
        size: defSize(512, 1024 * 2, 512),
        rowSize: defSize(5.12, 20, 10),
      },
    },
    logs: {
      status: true,
      cache: {
        status: true,
        size: defSize(512, 1024 * 2, 512),
        rowSize: defSize(0.4, 0.4, 0.4),
      },
    },
    // 页面统计开关
    pageStatistics: {
      status: true, // 统计状态开关
      size: defSize(200, 1024 * 2, 512),
      // #ifdef H5
      dayOnlineRowMax: 30, // 日活跃时间的保存条数
      // #endif
      // #ifdef APP-PLUS || APP-NVUE
      dayOnlineRowMax: 90, // 日活跃时间的保存条数
      // #endif
      // #ifdef MP-WEIXIN
      dayOnlineRowMax: 60, // 日活跃时间的保存条数
      // #endif
    },
    // uni event bus 监听设置
    uniBus: {
      status: true,
      cache: {
        status: true,
        size: defSize(512, 1024 * 2, 512),
        rowSize: defSize(5.12, 20, 10),
        countMaxSize: defSize(512, 1024 * 2, 512), // bus统计上限 kb
      },
    },
  },
  /**
   * 获取配置信息
   */
  getOptions() {
    try {
      let options = devCache.get(this.cacheKey)
      if (!options) {
        return {
          status: false, //默认关闭调试工具
        }
      }
      let r = String(options.route)
      // ! 增加 devRoute 参数
      options.devRoute = r.substring(1, r.length)
      return options;
    } catch (error) {
      console.log("devOptions.getOptions error: ", error);
      return {
        status: false, //默认关闭调试工具
      }
    }
  },
  /**
   * 保存配置项
   */
  setOptions(options) {
    try {
      if (!options) {
        options = this.defaultOptions;
      }

      if (options.status) {
        if (
          !options.route
          || typeof options.route != "string"
          || options.route.indexOf("/") != 0
        ) {
          return this.outputError(`devTools 调试工具配置出错: [route] 参数配置错误！`)
        }
      }

      let data = deepMerge(this.defaultOptions, options)

      devCache.set(this.cacheKey, data)
    } catch (error) {
      console.log("devOptions.setOptions error: ", error);
    }
  },
  /**
   * 弹出错误信息
   */
  outputError(msg) {
    console.log('%c' + msg, `
      padding: 4px;
      background-color: red;
      color: #fff;
      font-size: 15px;
    `)
  },
}






/**
 * 深度合并对象
 */
function deepMerge(target, ...sources) {
  try {
    if (!sources.length) return target; // 如果没有源对象则直接返回目标对象

    const source = sources[0];

    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && typeof target[key] !== undefined) {
          target[key] = deepMerge({}, target[key], source[key]); // 若属性值为对象类型且目标对象已存在该属性，则递归调用deepMerge函数进行合并
        } else {
          target[key] = source[key]; // 否则将源对象的属性赋值到目标对象上
        }
      }
    }

    return deepMerge(target, ...sources.slice(1)); // 处理完第一个源对象后再次调用deepMerge函数处理其他源对象
  } catch (error) {
    console.log("deepMerge error", error);
    return {}
  }
}