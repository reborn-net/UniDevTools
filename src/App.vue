<template>
</template>

<script lang="ts">
export default {
  globalData: {
    test: {
      a: 1,
      b: [1,2,3,4]
    },
    b: "红红火火恍恍惚惚",
    c: Math.random(),
    t: new Date().getTime(),
    testArray: [
      Math.random(),
      [Math.random(),Math.random(),Math.random(),Math.random(),],
      Math.random(),Math.random(),Math.random(),
      {
        [Math.random()]: 123
      },
      {
        a: [
          {
            b: [
              {
                c: [
                  {
                    d: [
                      {
                        e: [
                          
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
  }
}
</script>

<script  lang="ts" setup>
import { onError, onLaunch } from '@dcloudio/uni-app';
onError((err)=>{
  try {
    // 挂载devTools全局报错拦截
    uni.$dev.errorReport(err, "at App.vue onError", "oe");
  } catch (error) {}
})
onLaunch((ctx) => {
  try {
    // 挂载APP启动日志提交
    uni.$dev.logReport("appOnLaunch>" + JSON.stringify(ctx));
  } catch (error) {}
})


</script>
<style>
	/* #ifdef APP-PLUS-NVUE */
	@import './tmui/scss/nvue.css';
	/* #endif */
	/* #ifndef APP-PLUS-NVUE */
	@import './tmui/scss/noNvue.css';
	/* #endif */



</style>