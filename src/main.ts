import { createSSRApp } from "vue";
import * as Pinia from 'pinia';
import tmui from "./tmui"
import App from "./App.vue";

import devTools from "./devTools/index.js";
import devToolsConfig from './devTools/config.js';
import mpDevBubble from './devTools/core/components/mpDevBubble.vue'
import devToolsVueMixin from "./devTools/core/proxy/vueMixin.js"


export function createApp() {
  const app = createSSRApp(App);

  app.mixin(devToolsVueMixin)

  //挂载Devtools
  app.use(devTools, devToolsConfig)
  //注册小程序端专用的拖动浮标组件
  app.component("mpDevBubble", mpDevBubble)
  app.use(Pinia.createPinia());

  app.use(tmui, { shareDisable: false } as Tmui.tmuiConfig)
  return {
    app,
    Pinia
  };
}
