<template>
  <view>
    <view
      class="dialogMask"
      v-if="isShow"
      :style="{
        height: height + 'px',
      }"
    >
      <view
        class="dialogContent"
        @click.stop
      >
        <view
          class="dialogHead"
          @click="hide"
        >
          <view>
            <text class="title">{{ title }}</text>
          </view>
          <view>
            <image
              src="@/devTools/page/static/unfold.png"
              class="fold"
            />
          </view>
        </view>
        <scroll-view
          scroll-y
          class="scrollList"
          :style="{
            height: dialogHeight + 'px',
          }"
        >
          <textarea
            :style="{
              height: dialogHeight - (canSave ? 90 : 40) + 'px',
            }"
            v-model="value"
            type="text"
            placeholder="请输入..."
            class="fileEditInput"
            maxlength="-1"
          />
          <view
            class="saveBtn"
            v-if="canSave"
            @click="saveFile"
          >
            <text class="saveBtnText">保存</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>
<script>
let success, error;
export default {
  data() {
    return {
      /**
       * 是否展示
       */
      isShow: false,
      /**
       * 屏幕高度
       */
      height: uni.getSystemInfoSync().windowHeight,
      dialogHeight: uni.getSystemInfoSync().windowHeight * 0.8,
      /**
       * 弹窗标题
       */
      title: "",
      /**
       * 文本内容
       */
      value: "",
      /**
       * 是否为文件编辑模式
       */
      isFileEdit: true,
      /**
       * 文件路径
       */
      path: "",
      /**
       * 是否允许保存
       */
      canSave: false,
      /**
       * 是否为新建文件
       */
      isNewFile: false,
    };
  },
  mounted() {
    let that = this;
    uni.$on("devTools_showTextEditDialog", (options) => {
      that
        .show(options)
        .then((val) => {
          uni.$emit("devTools_showTextEditDialogSave", val);
        })
        .catch(() => {
          uni.$emit("devTools_showTextEditDialogHide");
        });
    });
  },
  unmounted() {
    uni.$off("devTools_showTextEditDialog");
  },
  methods: {
    /**
     * 展示弹窗
     */
    show(options) {
      let that = this;
      return new Promise((yes, err) => {
        success = yes;
        error = err;
        that.title = options.title;
        that.canSave = Boolean(options.canSave);
        that.isShow = true;

        if (options.isFileEdit === false) {
          // 仅为文件编辑模式
          that.isFileEdit = false;
          try {
            that.value = JSON.stringify(JSON.parse(options.value), null, 2);
          } catch (error) {
            that.value = options.value;
          }
          return;
        }
        that.isFileEdit = true;
        that.value = "文件读取中...";
        that.path = options.path;
        that.isNewFile = Boolean(options.isNewFile);

        // #ifdef APP-PLUS
        if (that.isNewFile) {
          that.value = "";
        } else {
          plus.io.resolveLocalFileSystemURL(
            that.path,
            (entry) => {
              // 可通过entry对象操作test.html文件
              entry.file((file) => {
                var fileReader = new plus.io.FileReader();
                fileReader.readAsText(file, "utf-8");
                fileReader.onloadend = function (evt) {
                  let res = "";
                  try {
                    res = JSON.stringify(JSON.parse(evt.target.result), null, 2);
                  } catch (error) {
                    res = evt.target.result;
                  }
                  that.value = res;
                };
                fileReader.onerror = function () {
                  that.value = `[${that.path}]文件读取失败！_code_2`;
                };
              });
            },
            function (e) {
              that.value = `[${that.path}]文件读取失败！` + e.message;
            }
          );
        }
        // #endif

        // #ifdef MP-WEIXIN
        let fs = wx.getFileSystemManager();
        if (options.size != 0) {
          fs.readFile({
            filePath: that.path,
            encoding: "utf8",
            position: 0,
            length: options.size,
            success({ data }) {
              try {
                that.value = JSON.stringify(JSON.parse(data), null, 2);
              } catch (error) {
                that.value = data;
              }
            },
            fail(e) {
              console.log(e);
              that.value = `[${that.path}]文件读取失败！` + e;
            },
          });
        } else {
          that.value = "";
        }
        // #endif
      });
    },
    /**
     * 关闭弹窗
     */
    hide() {
      this.isShow = false;
      error();
    },
    /**
     * 保存
     */
    save() {
      this.isShow = false;
      success(this.value);
    },
    /**
     * 保存文件
     */
    saveFile() {
      let that = this;

      if (!that.isFileEdit) {
        // 非文件编辑模式

        that.isShow = false;
        success(that.value);

        return;
      }

      uni.showLoading({
        title: "保存中",
      });

      // #ifdef APP-PLUS

      let fileName = that.path.split("/").pop();
      let path = that.path.substring(0, that.path.length - fileName.length);

      plus.io.resolveLocalFileSystemURL(
        path,
        (entry) => {
          entry.getFile(
            fileName,
            {
              create: true,
            },
            (fileEntry) => {
              fileEntry.createWriter((writer) => {
                writer.onwrite = (e) => {
                  uni.hideLoading();
                  uni.showToast({
                    title: "文件保存成功！",
                    icon: "success",
                  });
                  that.isShow = false;
                  that.$emit("getPage");
                };
                writer.onerror = () => {
                  uni.hideLoading();
                  uni.showToast({
                    title: "文件保存失败！_写入文件失败",
                    icon: "none",
                  });
                };
                writer.write(that.value);
              });
            }
          );
        },
        () => {
          uni.hideLoading();
          uni.showToast({
            title: "文件保存失败！_打开目录失败",
            icon: "none",
          });
        }
      );
      // #endif

      // #ifdef MP-WEIXIN

      let fs = wx.getFileSystemManager();
      fs.writeFile({
        filePath: that.path,
        encoding: "utf-8",
        data: that.value,
        success() {
          uni.hideLoading();
          uni.showToast({
            title: "文件保存成功！",
            icon: "success",
          });
          that.isShow = false;
          that.$emit("getPage");
        },
        fail() {
          uni.hideLoading();
          uni.showToast({
            title: "文件保存失败！_打开目录失败",
            icon: "none",
          });
        },
      });

      // #endif
    },
  },
};
</script>
<style lang="scss" scoped>
.dialogMask {
  display: flex;
  flex-direction: column-reverse;
  background-color: rgba(0, 0, 0, 0.3);
  width: 750rpx;
  flex: 1;
  /* #ifndef APP-PLUS */
  height: 100vh;
  backdrop-filter: blur(1px);
  /* #endif */
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  .dialogContent {
    display: flex;
    flex-direction: column;
    width: 750rpx;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    .dialogHead {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 80rpx;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      width: 750rpx;
      .title {
        margin-left: 20rpx;
        font-size: 24rpx;
        line-height: 24rpx;
        color: #333;
      }
      .fold {
        width: 20rpx;
        height: 20rpx;
        margin-right: 20rpx;
      }
    }
    .scrollList {
      width: 750rpx;
      padding: 20rpx;
      .fileEditInput {
        font-size: 20rpx;
      }
      .saveBtn {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 20rpx;
        height: 35px;
        width: 710rpx;
        border-radius: 10rpx;
        background-color: #ff2d55;
        .saveBtnText {
          color: #fff;
          font-size: 24rpx;
          line-height: 24rpx;
        }
      }
    }
  }
}
</style>
