<template>
  <view>
    <view
      class="editMask"
      v-if="isShow"
      :style="{
        height: height + 'px',
      }"
      @click.stop
    >
      <view
        class="editDialog"
        @click.stop
      >
        <text class="title">{{ title }}</text>
        <input
          type="text"
          placeholder="请输入"
          class="input"
          v-model="value"
        />
        <view class="btnGroup">
          <view
            class="btn left"
            @click="hide"
          >
            <text class="btnText">取消</text>
          </view>
          <view
            class="btn right"
            @click="save"
          >
            <text class="btnText">提交</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
let success, error;
export default {
  props: {
    /**
     * 路径列表
     */
    dirList: {
      type: Array,
      default: () => [],
    },
    /**
     * 路径类型
     */
    dirType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      /**
       * 是否展示
       */
      isShow: false,
      /**
       * 是否为操作文件夹
       */
      isDir: false,
      /**
       * 是否编辑模式
       */
      isEdit: true,
      /**
       * 输入框的值
       */
      value: "",
      /**
       * 屏幕高度
       */
      height: uni.getSystemInfoSync().windowHeight,
      /**
       * 更改前名称
       */
      oldValue: "",
    };
  },
  computed: {
    /**
     * 获取标题
     */
    title() {
      if (this.isEdit) {
        return this.isDir ? "更改文件夹名称" : "更改文件名称";
      } else {
        return this.isDir ? "创建文件夹" : "创建文件";
      }
    },
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

        this.isDir = options.isDir;
        this.isEdit = options.isEdit;
        this.value = String(options.name ? options.name : "");
        this.oldValue = String(options.name ? options.name : "");

        that.isShow = true;
      });
    },
    /**
     * 关闭弹窗
     */
    hide() {
      this.isShow = false;
    },
    /**
     * 获取当前文件绝对路径
     */
    getPath() {
      let that = this;
      let path = "";
      switch (that.dirType) {
        case "wx":
          path = wx.env.USER_DATA_PATH;
          break;
        case "PRIVATE_DOC":
          path = "_doc";
          break;
        case "PRIVATE_WWW":
          path = "_www";
          break;
        case "PUBLIC_DOCUMENTS":
          path = "_documents";
          break;
        case "PUBLIC_DOWNLOADS":
          path = "_downloads";
          break;
        default:
          break;
      }
      that.dirList.map((x) => {
        path += "/" + x;
      });
      return path + "/";
    },
    /**
     * 保存
     */
    save() {
      let that = this;
      that.value = that.value.replace(" ", "");
      if (that.value == "") {
        return uni.showToast({
          title: "请输入...",
          icon: "none",
        });
      }
      let path = that.getPath();

      function buildSuccess() {
        uni.showToast({
          title: "操作成功！",
          icon: "success",
        });
        that.isShow = false;
        that.$emit("getPage");
      }

      function buildError(e) {
        let msg = "";
        if (e && e.message) {
          msg = e.message;
        }
        uni.showToast({
          title: "重命名失败！" + msg,
          icon: "none",
        });
      }

      // #ifdef MP-WEIXIN
      if (1) {
        let fs = wx.getFileSystemManager();
        if (that.isEdit) {
          if (that.isDir) {
            // ! 重命名文件夹
            // ! 小程序不支持重命名文件夹
          } else {
            // ! 重命名文件
            fs.rename({
              oldPath: path + that.oldValue,
              newPath: path + that.value,
              success: buildSuccess,
              fail: buildError,
            });
          }
        } else {
          if (that.isDir) {
            // ! 创建目录
            fs.mkdir({
              dirPath: path + that.value,
              recursive: false,
              success: buildSuccess,
              fail: buildError,
            });
          } else {
            // ! 创建文件
            // fs.open({
            //   filePath: path + that.value,
            //   flag: "wx+",
            //   success({ fd }) {
            //     fs.closeSync({ fd });
            //     buildSuccess();
            //   },
            //   fail: buildError,
            // });
            fs.writeFile({
              filePath: path + that.value,
              data: "",
              encoding: "utf8",
              success() {
                buildSuccess();
              },
              fail: buildError,
            });
          }
        }

        return;
      }
      // #endif

      if (that.isEdit) {
        if (that.isDir) {
          // ! 重命名文件夹
          plus.io.resolveLocalFileSystemURL(
            path + that.oldValue,
            (entry) => {
              plus.io.resolveLocalFileSystemURL(
                path,
                (faEntry) => {
                  entry.moveTo(faEntry, that.value, buildSuccess, buildError);
                },
                buildError
              );
            },
            buildError
          );
        } else {
          // ! 重命名文件
          plus.io.resolveLocalFileSystemURL(
            path + that.oldValue,
            (entry) => {
              plus.io.resolveLocalFileSystemURL(
                path,
                (faEntry) => {
                  entry.moveTo(faEntry, that.value, buildSuccess, buildError);
                },
                buildError
              );
            },
            buildError
          );
        }
      } else {
        if (that.isDir) {
          // ! 创建文件夹
          plus.io.resolveLocalFileSystemURL(
            path,
            (entry) => {
              entry.getDirectory(that.value, { create: true, exclusive: false }, buildSuccess, buildError);
            },
            buildError
          );
        } else {
          // ! 创建文件
          plus.io.resolveLocalFileSystemURL(
            path,
            (entry) => {
              entry.getFile(that.value, { create: true }, buildSuccess, buildError);
            },
            buildError
          );
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.editMask {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  .editDialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 690rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 20rpx;
    margin-bottom: 300rpx;
    .title {
      font-size: 28rpx;
      line-height: 28rpx;
      color: #333;
    }
    .input {
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      width: 640rpx;
      height: 70rpx;
      padding: 5rpx;
      border-radius: 8rpx;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }
    .btnGroup {
      display: flex;
      flex-direction: row;
      width: 640rpx;
      justify-content: space-between;
      .btn {
        height: 64rpx;
        border-radius: 10rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .btnText {
          font-size: 24rpx;
          color: #fff;
        }
      }
      .left {
        width: 160rpx;
        background-color: #8799a3;
      }
      .right {
        width: 450rpx;
        background-color: #3cbb45;
      }
    }
  }
}
</style>
