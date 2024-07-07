# UniDevTools - UniApp调试工具

><b>在线文档 - 完整版使用教程:<br>
><a href="https://dev.api0.cn" target="_blank">https://dev.api0.cn</a><br>
>QQ群: 894584115 <a href="https://qm.qq.com/q/ynnDQGZ248" target="_blank">加入群聊</a></b>

----

不知道大家是否和我一样已经受够了使用Uniapp开发APP时需要插USB线连着HbuilderX才能看到console打印，各项指标数据全是黑盒，开发APP时无法选择调试节点等各类头疼问题。Uniapp官方一直没有一个标准的调试工具，为什么不能像Chrome调试工具一样调试App呢？为此我们开发了一个插件，把这些痛点问题依次解决！

UniDevTools是一个UniApp工具库，包含console打印日志、request请求记录、storage缓存管理、vuex状态管理、框架报错记录、文件管理等多功能调试工具合集:
- `Tools` 常用工具(重启、请求构建、跳转指定页面、注入VConsole、Eruda)、自定义工具页
- `Error` 全局报错拦截：vue模板报错、uniapp框架报错
- `Console` 打印日志记录
- `Network` request请求记录、重发请求
- `JsRunner` 执行js代码、支持App和H5端
- `Storage` 缓存管理，支持localStorage、cookie、sessionStorage
- `Pages` 路由页面管理、日活时间记录
- `Vuex` 状态管理,支持`Vuex`、`Pinia`、`globalData`
- `Logs` 框架运行日志、框架api调用日志、自定义上报的日志记录
- `Info` 当前设备参数、App启动参数、运行时信息、权限列表
- `UniBus` uni框架事件总线调用记录
- `FileSys` 本地文件管理系统
- `Setting` DevTools工具设置、清空全部缓存、导出全部日志

兼容框架：
| Vue2+js+vuex | Vue3+ts+vuex(pinia)|
| -- | -- |
| √ | √ |

兼容平台：
| H5 | APP |  微信小程序 | APP-NVUE  |  其他小程序 |  UniAppX |
| -- | -- | -- | -- | -- | -- |
| √| √ | √ | √(大部分功能支持) | 未测试 | × (待办中) |

><b>本工具支持在<span style="color: red;">生产环境</span>中使用</b><br>
><span style="font-size: 13px;">生产环境使用时建议隐藏调试浮窗，可设置通过特定方法进入调试页</span>






## 下载运行本示例项目使用说明：

>注意该项目使用Cli模式搭建，请勿导入HBuilderX中运行<br>
>开始前请先准备好环境：`node18` + `pnpm` 

1. 克隆项目到本地:
```cmd
git clone https://github.com/1615958039/UniDevTools.git
```
2. 进入项目
```cmd
cd ./UniDevTools
```
3. 安装依赖
```
pnpm i
```
4. 启动预览H5
```
pnpm run dev:h5
```

说明：示例基于UniApp+Vue3+ts+Vite，UI框架为TM-UI3.1



## 把调试工具引入自己项目：
1. 下载最新源码包`v3.4.5`
  >GitHub: [releases](https://github.com/1615958039/UniDevTools/releases) <br>
  >Gitee: [releases](https://gitee.com/t1zf/UniAppDevTools/releases/) <br>
  >备用：[v3.4.5_r.zip](https://dev.api0.cn/releases/v3.4.5_r.zip)
1. 引入项目(请移步至在线文档)：[https://dev.api0.cn/guide/install](https://dev.api0.cn/guide/install)

----





### 示例项目
>《斗图助手APP》表情包制作工具<br>
>该项目基于Uniapp+Vue2，已集成DevTools工具<br>
>打开APP后在搜索页输入` __devtools__ `即可打开调试弹窗查看请求和日志数据
<div class="qrCodeList" style="display: flex;flex-direction: row; align-items: center;gap: 30px;flex-wrap: wrap;">
  <div class="codeItem">
    <img src="https://dev.api0.cn/qrCode/iosAppStore.png" style="width: 160px;height: 160px;">
    <div class="codeTitle">苹果AppStore</div>
  </div>
  <div class="codeItem">
    <img src="https://dev.api0.cn/qrCode/androidYYB.png" style="width: 160px;height: 160px;">
    <div class="codeTitle">安卓应用宝</div>
  </div>
  <div class="codeItem">
    <img src="https://dev.api0.cn/qrCode/wxmp.jpg" style="width: 160px;height: 160px;">
    <div class="codeTitle">微信小程序</div>
  </div>
  <div class="codeItem">
    <img src="https://dev.api0.cn/qrCode/web.png" style="width: 160px;height: 160px;">
    <div class="codeTitle">H5</div>
  </div>
</div>


