<template>
  <view
    class="fileItem"
    @click="fileClick"
    @longpress.stop="longpress"
  >
    <view class="icon">
      <image
        class="iconImg"
        :src="icon"
        mode="aspectFit"
      />
    </view>
    <view class="fileInfo">
      <text
        class="fileName"
        :style="{
          color: item.type == 'back' ? '#999' : '#333',
        }"
      >
        {{ item.name }}
      </text>
      <view
        v-if="item.type != 'back'"
        class="fileMeta"
      >
        <text class="textItem">{{ item.date }}</text>
        <text
          v-if="item.type == 'file'"
          class="textItem"
        >
          {{ item.sizeText }}
        </text>
      </view>
    </view>
  </view>
</template>
<script>
import appDelDir from "../libs/appDelDir";

export default {
  props: {
    /**
     * 当前文件路径类型
     */
    dirType: {
      type: String,
      default: "",
    },
    /**
     * 文件路径列表
     */
    dirList: {
      type: Array,
      default: () => [],
    },
    /**
     * 单个列表对象
     */
    item: {
      type: Object,
      default() {
        return {
          type: "", // 对象类型  dir back file
          name: "",
          fileType: "", // 文件后缀名称
          size: "", // 文件大小
          icon: "", //图标
          time: "", // 最后更改日期
          date: "",
          fileCount: 0, //文件夹下的文件数量
          directoryCount: 0, //文件夹下的目录数量
        };
      },
    },
  },
  computed: {
    icon() {
      // #ifdef APP-PLUS
      // IOS端直接访问本地图片会报跨域，所以仅支持安卓预览图片
      if (
        uni.getSystemInfoSync().platform == "android" &&
        this.item.type == "file" &&
        ["jpg", "jpeg", "png", "gif", "webp", "bmp"].indexOf(this.item.fileType) > -1
      ) {
        let path = this.getPath();
        return path;
      }
      // #endif
      return this.item.icon;
    },
  },
  data() {
    return {};
  },
  methods: {
    /**
     * 点击事件
     */
    fileClick() {
      let that = this;
      if (this.item.type == "dir") {
        this.$emit("goChildDir", this.item.name);
      } else if (this.item.type == "back") {
        this.$emit("goChildDir", "__back__");
      } else {
        if (
          //? 使用文本编辑器快捷打开文件
          ["txt", "sql", "js", "css", "html", "log", "json"].indexOf(this.item.fileType) != -1
        ) {
          this.openInEdit();
        } else if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].indexOf(this.item.fileType) != -1) {
          let path = that.getPath();
          uni.previewImage({
            urls: [path],
          });
        } else {
          this.longpress();
        }
      }
    },
    /**
     * 使用文本编辑器打开
     */
    openInEdit() {
      let that = this;
      let path = that.getPath();
      that.$emit("openEditFileDialog", {
        title: that.item.name,
        canSave: that.dirType != "PRIVATE_WWW",
        path,
        size: that.item.size,
      });
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
      path = path + "/" + that.item.name;
      return path;
    },
    /**
     * 长按事件
     */
    longpress() {
      let that = this;
      let path = that.getPath();

      let menu = [
        {
          text: `复制绝对路径`,
          click() {
            // #ifdef APP-PLUS
            path = plus.io.convertLocalFileSystemURL(path);
            // #endif
            uni.setClipboardData({
              data: path,
            });
          },
        },
        {
          text: `删除`,
          click() {
            uni.showModal({
              title: "警告",
              content: "是否确认删除" + (that.item.type == "dir" ? "文件夹:" : "文件:") + that.item.name + "?",
              success(res) {
                if (res.confirm) {
                  uni.showLoading({
                    title: "删除中",
                  });

                  function delSuccess() {
                    uni.hideLoading();
                    uni.showToast({
                      title: "删除成功！",
                      icon: "success",
                    });
                    that.$emit("getPage");
                  }
                  function delError() {
                    uni.hideLoading();
                    uni.showToast({
                      title: "删除失败",
                      icon: "none",
                    });
                  }

                  // #ifdef MP-WEIXIN
                  if (1) {
                    let fs = wx.getFileSystemManager();

                    if (that.item.type == "file") {
                      // ! 删除文件
                      fs.unlink({
                        filePath: path,
                        success: delSuccess,
                        fail: delError,
                      });
                    } else {
                      // ! 删除文件夹
                      fs.rmdir({
                        dirPath: path,
                        recursive: true,
                        success: delSuccess,
                        fail: delError,
                      });
                    }

                    return;
                  }
                  // #endif

                  if (that.item.type == "file") {
                    // ! 删除文件
                    plus.io.resolveLocalFileSystemURL(
                      path,
                      (entry) => {
                        // 可通过entry对象操作test.html文件
                        entry.remove(delSuccess, delError);
                      },
                      delError
                    );
                  } else {
                    // ! 删除文件夹
                    appDelDir(path + "/")
                      .then(delSuccess)
                      .catch(delError);
                  }
                }
              },
            });
          },
        },
      ];

      let isMp = false;
      // #ifdef MP-WEIXIN
      isMp = true;
      // #endif

      if (!isMp || that.item.type != "dir") {
        menu.push({
          text: "重命名",
          click() {
            that.$emit("editDirName", {
              isDir: that.item.type == "dir",
              isEdit: true,
              name: that.item.name,
            });
          },
        });
      }

      // #ifdef APP-PLUS
      if (that.item.type == "file") {
        menu.push({
          text: "调用外部程序打开此文件",
          click() {
            plus.runtime.openFile(path, null, (e) => {
              uni.showToast({
                title: "文档打开失败！" + e.message,
                icon: "none",
              });
            });
          },
        });
      }
      // #endif

      // #ifdef MP-WEIXIN
      if (["doc", "xls", "ppt", "pdf", "docx", "xlsx", "pptx"].indexOf(that.item.fileType) != -1) {
        menu.unshift({
          text: "打开该文档",
          click() {
            let path = that.getPath();
            uni.openDocument({
              filePath: path,
              fail() {
                uni.showToast({
                  title: "文档打开失败！",
                  icon: "none",
                });
              },
            });
          },
        });
      }
      // #endif

      if (that.item.type == "file") {
        menu.unshift({
          text: `用文本编辑器打开`,
          click() {
            that.openInEdit();
          },
        });
      }

      uni.showActionSheet({
        itemList: menu.map((x) => x.text),
        success({ tapIndex }) {
          menu[tapIndex].click();
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.fileItem {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0rpx 20rpx;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  width: 750rpx;
  min-height: 70rpx;
  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
  .icon {
    width: 50rpx;
    height: 50rpx;
    border-radius: 10rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.05);
    .iconImg {
      width: 40rpx;
      height: 40rpx;
    }
  }
  .fileInfo {
    margin-left: 10rpx;
    width: 650rpx;
    display: flex;
    flex-direction: column;
    .fileName {
      width: 650rpx;
      lines: 1;
      overflow: hidden;
      font-size: 24rpx;
      color: #333;
      line-height: 28rpx;
    }
    .fileMeta {
      margin-top: 5rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 650rpx;
      .textItem {
        margin-right: 20rpx;
        font-size: 20rpx;
        line-height: 26rpx;
        color: #999;
      }
    }
  }
}
</style>
