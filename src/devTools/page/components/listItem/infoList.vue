<template>
  <view class="storageList">
    <objectAnalysis
      v-if="isLoaded"
      :data="data"
      :isOpenFirst="true"
      :width="710"
    />
    <view
      v-else
      class="dataLoading"
    >
      <text class="status">加载中</text>
    </view>
  </view>
</template>
<script>
import objectAnalysis from "./objectAnalysis.vue";
import getRuntimeInfo from "../libs/getRuntimeInfo";
export default {
  components: {
    objectAnalysis,
  },
  data() {
    return {
      /**
       * 是否完成加载
       */
      isLoaded: false,
      /**
       * 缓存里的数据
       */
      data: {},
    };
  },
  methods: {
    /**
     * 加载数据
     */
    async getData() {
      let that = this;
      that.isLoaded = false;
      let data = await getRuntimeInfo();
      setTimeout(() => {
        that.data = data;
        that.isLoaded = true;
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
.storageList {
  padding: 20rpx;
  width: 750rpx;
}
.dataLoading {
  width: 750rpx;
  height: 400rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .status {
    font-size: 20rpx;
    color: #888;
    line-height: 20rpx;
  }
}
</style>
