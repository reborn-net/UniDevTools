import devCache from "../libs/devCache";
import console from "./console";
import request from "./request";
import storage from "./storage";
import uniBus from "./uniBus";
import uniListen from "./uniListen";

/**
 * dev调试工具初始化
 */
export default function devToolsProxyInstall(options) {

  try {
    if (options.network && options.network.status) {
      request.install()
    }
    if (options.console && options.console.status) {
      console.install()
    }
    if (options.logs && options.logs.status) {
      uniListen.install()
    }

    storage.install()

    if (options.uniBus && options.uniBus.status) {
      uniBus.install()
    }

    devCache.syncLocalCache();

  } catch (error) {
    console.log("devToolsProxyInstall error", error);
  }

}