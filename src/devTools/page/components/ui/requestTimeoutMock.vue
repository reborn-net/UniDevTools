<template>
  <view>
    <MenuBtn
      :list="typeList"
      :value="index"
      @indexChange="change"
      title="超时:"
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
       * 随机响应超时
       */
      typeList: [
        { title: "无", type: "", msg: "正常响应请求" },
        { title: "5%", type: "5", msg: "随机5%的概率请求响应超时或报错" },
        { title: "10%", type: "10", msg: "随机10%的概率请求响应超时或报错" },
        { title: "30%", type: "30", msg: "随机30%的概率请求响应超时或报错" },
        { title: "50%", type: "50", msg: "随机50%的概率请求响应超时或报错" },
        { title: "70%", type: "70", msg: "随机70%的概率请求响应超时或报错" },
        { title: "90%", type: "90", msg: "随机90%的概率请求响应超时或报错" },
        { title: "100%", type: "100", msg: "所有请求均响应超时或报错" },
      ],
      /**
       * 当前选中的索引
       */
      index: 0,
    };
  },
  mounted() {
    let cache = uni.getStorageSync("devtools_uniResTimeout");
    let index = this.typeList.findIndex((x) => x.type == cache);
    if (index == -1) index = 0;
    this.index = index;
  },
  methods: {
    /**
     * 选项发生改变事件
     */
    change(index) {
      uni.setStorageSync("devtools_uniResTimeout", this.typeList[index].type);
      this.index = index;
    },
  },
};
</script>
<style lang="scss"></style>
