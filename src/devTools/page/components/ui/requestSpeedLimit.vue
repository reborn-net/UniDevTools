<template>
  <view>
    <MenuBtn
      :list="typeList"
      :value="index"
      @indexChange="change"
      title="网速:"
    />
  </view>
</template>
<script>
import MenuBtn from "./menuBtn.vue";
export default {
  components: {
    MenuBtn,
  },
  data() {
    return {
      /**
       * 弱网模拟状态
       */
      typeList: [
        { title: "不限", type: "", msg: "正常响应请求" },
        { title: "2G龟速", type: "2g", msg: "随机延迟30~60秒后响应" },
        { title: "3G慢速", type: "3g-", msg: "随机延迟10~30秒后响应" },
        { title: "3G略快", type: "3g", msg: "随机延迟3~10秒后响应" },
        { title: "4G弱网", type: "4g", msg: "随机延迟0.5~3秒后响应" },
      ],
      /**
       * 当前选中的索引
       */
      index: 0,
    };
  },
  mounted() {
    let cache = uni.getStorageSync("devtools_uniResLimitType");
    let index = this.typeList.findIndex((x) => x.type == cache);
    if (index == -1) index = 0;
    this.index = index;
  },
  methods: {
    /**
     * 选项发生改变事件
     */
    change(index) {
      uni.setStorageSync("devtools_uniResLimitType", this.typeList[index].type);
      this.index = index;
    },
  },
};
</script>
<style lang="scss"></style>
