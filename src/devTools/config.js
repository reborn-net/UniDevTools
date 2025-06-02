let config = {
  status: true, //调试工具总开关
  route: "/devTools/page/index", // 调试页面的路由，不建议更改
  bubble: { //调试弹窗气泡设置
    status: true, // 气泡标签是否显示，生产环境建议关闭
    text: "DevTools", // 气泡上展示的文字
    color: "#ffffff", // 气泡文字颜色
    bgColor: "rgba(250, 53, 52,0.7)", // 气泡背景颜色
  },

  // 注意： 以下配置不建议更改

  pageStatistics: {// 页面统计开关
    status: true, // 统计状态开关
    size: 1024 * 100, // 缓存上限，单位byte
    dayOnlineRowMax: 30, // 活跃数据缓存天数
  },
  console: { //console日志配置
    status: true, //功能总开关
    isOutput: true, //打印的日志是否对外输出到浏览器调试界面，建议在生产环境时关闭
    cache: {
      status: true, //是否启用本地缓存
      size: 512 * 1024, //缓存上限，单位byte
      rowSize: 1024 * 4,//单条记录缓存上限，单位byte
    },
  },
  uniBus: { // uni event bus 监听设置
    status: true,
    cache: {
      status: true,
      size: 1024 * 512, // bus调用日志上限 byte
      rowSize: 1024 * 10,
      countMaxSize: 1024 * 10, // bus统计上限 byte
    },
  },
  error: { //报错拦截配置
    status: true,
    cache: {
      status: true,
      size: 512 * 1024,
      rowSize: 1024 * 4,
    },
  },
  network: { //请求拦截配置
    status: true,
    cache: {
      status: true,
      size: 512 * 1024,
      rowSize: 1024 * 4,
    },
  },
  logs: { //运行日志
    status: true,
    cache: {
      status: true,
      size: 512 * 1024,
      rowSize: 1024 * 4,
    },
  },
  stat: { // 统计上报
    status: true,
    api: "https://stat.api0.cn/v1/abcdefghijklmnopqrstuvwxyz0123456789",
  }
};

export default config;