<template>
  <view
    class="objectAnalysis"
    :style="{
      width: width + 'rpx',
    }"
  >
    <view
      class="objectTitle"
      :class="canLongpress ? 'objectTitleActive' : ''"
      @click="titleClick"
      @longpress.stop="faLongpress"
    >
      <image class="foldItem" v-if="isOpen" src="@/devTools/page/static/fold.png" />
      <image class="foldItem" v-else src="@/devTools/page/static/unfold.png" />
      <text
        class="title"
        :style="{
          width: width - 50 + 'rpx',
        }"
      >
        {{ title }}
      </text>
    </view>

    <view
      class="objectList"
      v-if="isOpen"
      :style="{
        width: width + 'rpx',
      }"
    >
      <view
        v-for="(item, index) in list"
        :key="item.i"
        class="listItem"
        :style="{
          marginLeft: item.l + 'rpx',
        }"
        @click="rowClick(item, index)"
        @longpress.stop="rowLongpress($event, item, index)"
      >
        <template v-if="item.t == 'array' || item.t == 'object'">
          <image class="foldItem" v-if="item.o" src="@/devTools/page/static/fold.png" />
          <image class="foldItem" v-else src="@/devTools/page/static/unfold.png" />
        </template>
        <view
          v-else
          class="emptyFold"
        ></view>
        <text
          class="objKey"
          :class="'t-' + item.t"
          :style="{
            maxWidth: (width - item.l - 40) / 2 + 'rpx',
          }"
        >
          {{ item.k }}:
        </text>
        <text
          class="objValue"
          :class="'t-' + item.t"
        >
          {{ item.vt }}
        </text>
      </view>
    </view>
  </view>
</template>
<script>
import jsonCompress from "../../../core/libs/jsonCompress";
function getType(v) {
  return Object.prototype.toString.call(v).slice(8, -1).toLocaleLowerCase();
}
function randId() {
  return Math.ceil(Math.random() * 1000000000000000);
}
export default {
  props: {
    /**
     * 需要解析的对象数据
     */
    data: "",
    /**
     * 组件宽度 rpx
     */
    width: {
      type: Number,
      default: 610,
    },
    /**
     * 是否默认展开第一层
     */
    isOpenFirst: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否自定义长按的菜单
     */
    isDiyMenu: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否响应最外层的长按事件
     */
    canLongpress: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否展示完整的对象类型
     */
    showObjProto: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      /**
       * 对象类型 array object map unknown
       */
      type: "unknown",
      /**
       * 对象标题
       */
      title: "",
      /**
       * 是否为开启节点状态
       */
      isOpen: false,
      /**
       * 渲染的列表
       */
      list: [
        {
          t: "text", // 类型
          k: "键名", // key
          v: "名称", // value
          vt: "", //view层渲染的文字
          i: "s", //节点id
          p: "0", //父节点id
          o: true, //是否开启下级
          l: 0, // 距离左侧长度
          d: null, //原对象
        },
      ],
    };
  },
  mounted() {
    let that = this;

    try {
      let { title } = that.getObjType(this.data);
      that.list = [];
      that.title = title;
      if (that.isOpenFirst) {
        that.titleClick();
      }
    } catch (error) {
      console.log("objectAnalysis error", error);
    }
  },
  methods: {
    /**
     * 标题点击事件
     */
    titleClick() {
      if (this.isOpen) {
        this.isOpen = false;
      } else {
        if (this.list.length == 0) {
          this.analysisData(this.data);
        }
        this.isOpen = true;
      }
    },
    /**
     * 解析渲染数组
     */
    analysisData(data, pid = 0) {
      let list = [];
      let l = this.getParentNum(pid);

      let keys = [];
      keys = Reflect.ownKeys(data);

      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = data[key];

        if (key == "__proto__" || key == "__ob__") {
          continue;
        }

        let o = {
          t: typeof value,
          k: key,
          v: value,
          vt: "",
          i: randId(),
          p: pid,
          o: false,
          l: l * 5,
          d: value,
        };

        try {
          let t = typeof value;
          if (t == "function") {
            try {
              o.vt = value.toString();
            } catch (error) {
              if (error && error.message) {
                o.vt = "[js:function]" + error.message;
              } else {
                o.vt = "[js:function]";
              }
            }
            o.v = o.vt;
            o.d = "";
          } else if (t == "object") {
            if (this.showObjProto) {
              let str = "unknown";
              if (value === null) {
                o.t = "null";
                str = "null";
              } else if (Array.isArray(value)) {
                o.t = "array";
                let l = 0;
                try {
                  l = value.length;
                } catch (error) {}
                str = Object.prototype.toString.call(value).slice(8, -1) + (l > 0 ? ` (${l})[...]` : " (0)[]");
              } else {
                o.t = "object";
                let childList = [];
                try {
                  childList = Reflect.ownKeys(value);
                } catch (error) {}
                str = Object.prototype.toString.call(value).slice(8, -1) + (childList.length == 0 ? " {}" : " {...}");
              }
              o.vt = str;
            } else {
              let type = getType(value);
              let title = "";
              try {
                title = JSON.stringify(value);
                if (title.length > 50) {
                  title = title.slice(0, 50) + "...";
                }
                if (type == "array" && value.length > 0) {
                  title = "(" + value.length + ")" + title;
                }
              } catch (error) {
                title = "对象解析失败：" + error;
              }
              o.t = type;
              o.vt = title;
              o.v = value;
            }
          } else if (t == "symbol") {
            o.t = "symbol";
            try {
              if (value.toString) {
                o.vt = value.toString();
              } else {
                o.vt = "[js:symbol]";
              }
            } catch (error) {
              let msg = "";
              if (error && error.message) {
                msg = error.message;
              } else {
                msg = "[js:symbol解析失败]";
              }
              o.vt = msg;
            }
          } else if (t == "string") {
            if (value.length > 200) {
              o.vt = `"` + value.slice(0, 200) + "..." + '"';
            } else {
              o.vt = `"${value}"`;
            }
          } else if (t == "number") {
            if (Number.isFinite(value)) {
              o.vt = value.toString();
            } else {
              o.vt = isNaN(value) ? "NaN" : "Infinity";
            }
          } else if (t == "boolean") {
            o.vt = value ? "true" : "false";
          } else if (t == "undefined") {
            o.vt = "undefined";
          } else {
            o.vt = "[js:unknown type]";
          }
        } catch (error) {
          let msg = "";
          if (error && error.message) {
            msg = error.message;
          } else {
            msg = "[js对象解析失败]";
          }
          o.vt = msg;
        }
        list.push(o);
      }

      if (pid == 0) {
        this.list = list;
      } else {
        let faIndex = this.list.findIndex((x) => x.i == pid) + 1;
        for (let i = 0; i < list.length; i++) {
          this.list.splice(faIndex, 0, list[i]);
          faIndex++;
        }
      }
    },
    /**
     * 获取节点的父类数量
     */
    getParentNum(pid) {
      let that = this;
      let count = 0;
      if (pid == 0) {
        return count;
      } else {
        let p = Number(pid);
        while (true) {
          count = count + 1;
          let fa = that.list.find((x) => x.i == p);
          if (!fa || fa.i == 0) {
            break;
          } else {
            p = Number(fa.p);
          }
        }
      }
      return count;
    },
    /**
     * 行对象点击事件
     */
    rowClick(item, index) {
      let that = this;
      const nodeItem = that.list[index];
      if (item.t == "object" || item.t == "array") {
        if (item.o) {
          nodeItem.o = false;
          that.hideListByPid(item.i);
        } else {
          nodeItem.o = true;
          that.analysisData(nodeItem.d, item.i);
        }
      } else if (item.t == "string" && item.v.length > 100) {
        // 长文本点击时默认打开文本编辑器
        uni.$emit("devTools_showTextEditDialog", {
          title: item.k,
          canSave: false,
          isFileEdit: false,
          value: item.v,
        });
      }
    },
    /**
     * 根据父类id删除数组内元素
     */
    hideListByPid(pid = 0) {
      let that = this;
      while (true) {
        let i = that.list.findIndex((x) => x.p == pid);
        if (i == -1) {
          break;
        }
        if (that.list[i].o) {
          that.hideListByPid(that.list[i].i);
        }
        that.list.splice(i, 1);
      }
    },
    /**
     * 长按事件
     */
    rowLongpress(e, item, index) {
      // #ifdef APP-PLUS
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      // #endif
      let that = this;
      if (that.isDiyMenu) {
        that.$emit("diyMenu", { item, index });
      } else {
        let k = this.toString(item.k);
        if (k.length > 20) {
          k = k.slice(0, 20) + "...";
        }
        let v = this.toString(item.v);
        if (v.length > 20) {
          v = v.slice(0, 20) + "...";
        }
        uni.showActionSheet({
          itemList: [`复制键(${k})`, `复制值(${v})`],
          success({ tapIndex }) {
            if (tapIndex == 0) {
              uni.setClipboardData({
                data: that.toString(item.k),
              });
            } else {
              uni.setClipboardData({
                data: that.toString(item.v),
              });
            }
          },
        });
      }
    },
    /**
     * 尝试转字符串
     */
    toString(data) {
      try {
        if (data === undefined) return "undefined";
        if (data === null) return "null";
        if (typeof data == "boolean") return data ? "true" : "false";
        if (typeof data == "object") {
          return JSON.stringify(data);
        }
        return data.toString();
      } catch (error) {
        return "尝试解析失败！" + error;
      }
    },
    /**
     * 获取列表
     */
    getList() {
      return this.list;
    },
    /**
     * 获取父级key类别
     */
    getFaKeyList(itemId) {
      let keyList = [];
      let item = this.list.find((x) => x.i == itemId);
      if (!item) return keyList;
      keyList = [item.k];
      if (item.p == 0) return keyList;

      while (true) {
        item = this.list.find((x) => x.i == item.p);
        if (!item) break;
        keyList.unshift(item.k);
        if (item.p == 0) {
          break;
        }
      }

      return keyList;
    },
    /**
     * 长按复制一整个对象
     */
    faLongpress(e) {
      // #ifdef APP-PLUS
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      // #endif
      let that = this;
      if (that.canLongpress) {
        uni.setClipboardData({
          data: JSON.stringify(that.data),
        });
      } else {
        that.$emit("onLongpress");
      }
    },
    /**
     * 获取对象单行数据
     */
    getObjType(obj) {
      try {
        let title = "unknown";
        let type = typeof obj;
        let data = obj;
        switch (typeof data) {
          case "symbol":
            title = "[js:symbol]";
            try {
              if (data.toString) {
                title = data.toString();
              } else {
                title = "[js:symbol]";
              }
            } catch (error) {
              let msg = "";
              if (error && error.message) {
                msg = error.message;
              } else {
                msg = "[js:symbol解析失败]";
              }
              title = msg;
            }
            break;
          case "string":
            title = data;
            break;
          case "object":
            if (this.showObjProto) {
              try {
                let objType = Object.prototype.toString.call(data).slice(8, -1);
                title = {};
                let keys = Reflect.ownKeys(data);

                for (let i = 0; i < keys.length; i++) {
                  let key = keys[i];
                  if (key == "__proto__" || key == "__ob__") {
                    continue;
                  }
                  try {
                    let value = data[key];
                    let t = typeof value;
                    if (t == "function") {
                      continue;
                    }
                    if (t == "object") {
                      let str = "unknown";
                      if (value === null) {
                        str = "null";
                      } else if (Array.isArray(value)) {
                        str = Object.prototype.toString.call(value).slice(8, -1) + " [...]";
                      } else {
                        str = Object.prototype.toString.call(value).slice(8, -1) + " {...}";
                      }
                      title[key] = str;
                      continue;
                    }
                    title[key] = data[key];
                  } catch (error) {
                    if (error && error.message) {
                      title[key] = error.message;
                    } else {
                      title[key] = "[js对象解析失败]";
                    }
                  }
                }

                for (let i = 0; i < keys.length; i++) {
                  let key = keys[i];
                  try {
                    let value = data[key];
                    let t = typeof value;
                    if (t == "function") {
                      try {
                        title[key] = value.toString();
                      } catch (error) {
                        if (error && error.message) {
                          title[key] = "[js:function]" + error.message;
                        } else {
                          title[key] = "[js:function]";
                        }
                      }
                    }
                  } catch (error) {
                    if (error && error.message) {
                      title[key] = error.message;
                    }
                  }
                }
                if (title.toJSON) {
                  title.toJSON = "[js:function]";
                }

                if (objType == "Array") {
                  title = objType + " " + jsonCompress.safeJsonStringify(title);
                } else {
                  title = objType + " " + jsonCompress.safeJsonStringify(title);
                }

                if (Array.isArray(data)) {
                  type = "array";
                } else {
                  type = "object";
                }
              } catch (error) {
                let msg = "unknown";
                if (error && error.message) {
                  msg = error.message;
                }
                title = "对象解析出错:" + msg;
              }
            } else {
              try {
                title = JSON.stringify(data);
                if (title.length > 50) {
                  title = title.slice(0, 50) + "...";
                }
              } catch (error) {
                title = "对象解析失败：" + error;
              }
            }

            break;
          case "function":
            try {
              title = data.toString();
            } catch (error) {
              title = "[js:function]";
            }
            break;
          default:
            title = data;
            break;
        }
        return { title, type };
      } catch (error) {
        console.log("getObjType error", error);
        return {
          title: "unknown",
          type: "unknown",
        };
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.objectAnalysis {
  display: flex;
  flex-direction: column;
  .objectTitle {
    display: flex;
    flex-direction: row;
    align-items: center;
    .title {
      font-size: 20rpx;
      line-height: 20rpx;
      color: rgb(89, 74, 154);
      lines: 1;
      overflow: hidden;
      /* #ifdef H5 */
      // 限制行数
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      /* #endif */
    }
  }
  .objectTitleActive:active {
    background-color: rgba(0, 0, 0, 0.08);
  }
  .objectList {
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: 8rpx;
    /* #ifndef APP-PLUS */
    min-height: 50rpx;
    /* #endif */
    padding: 10rpx;
    .listItem:active {
      background-color: rgba(0, 0, 0, 0.08);
    }
    .listItem {
      display: flex;
      flex-direction: row;
      align-items: center;
      .emptyFold {
        width: 20rpx;
        height: 20rpx;
        margin-right: 6rpx;
      }
      .objKey {
        font-size: 20rpx;
        line-height: 28rpx;
        color: rgb(121, 38, 117);
        lines: 1;
        overflow: hidden;
        /* #ifdef H5 */
        // 限制行数
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        /* #endif */
      }
      .objValue {
        line-height: 28rpx;
        margin-left: 5rpx;
        color: #333;
        font-size: 20rpx;
        lines: 1;
        overflow: hidden;
        /* #ifdef H5 */
        // 限制行数
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        /* #endif */
        &.t-number {
          color: rgb(8, 66, 160);
        }
        &.t-boolean {
          color: rgb(133, 2, 255);
        }
        &.t-string {
          color: rgb(227, 54, 46);
        }
        &.t-array {
          color: rgba(0, 0, 0, 0.5);
        }
        &.t-object {
          color: rgba(0, 0, 0, 0.5);
        }
        &.t-undefined {
          color: rgba(0, 0, 0, 0.2);
        }
        &.t-null {
          color: rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
}
.foldItem {
  width: 20rpx;
  height: 20rpx;
  background-color: #eee;
  border-radius: 4rpx;
  margin-right: 6rpx;
}
</style>
