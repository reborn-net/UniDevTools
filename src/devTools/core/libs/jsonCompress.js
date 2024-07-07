/**
 * json压缩工具
 */
export default {
  /**
   * 压缩js对象成json字符串，并控制json字节大小，多余部分裁剪
   */
  compressObject(obj = {}, maxSize = 1024 * 10.24) {
    try {
      let t = new Date().getTime()
      if (obj === undefined || obj === null) return obj;
      if (typeof obj == "string") {
        return this.truncateStrBySize(obj, maxSize);
      }
      if (typeof obj != "object") {
        return obj;
      }
      if (maxSize < 2) return {};

      let addEndOut = false;
      if (maxSize > 50) {
        let objSize = this.calculateStringByteSize(obj);
        if (objSize > maxSize) {
          maxSize = maxSize - 50;
          addEndOut = true;
        }
      }

      let sizeCount = 2;
      let str = this.safeJsonStringify(obj, (key, value) => {
        let keySize = this.calculateStringByteSize(key)
        if (typeof value == "object") {
          if (sizeCount + keySize + 6 > maxSize) {
            return;
          }
          sizeCount = sizeCount + keySize + 6;
          return value;
        }
        let valueSize = this.calculateStringByteSize(value)
        let rowSize = keySize + valueSize + 6;
        if (rowSize + sizeCount > maxSize) return;
        sizeCount = sizeCount + rowSize;
        return value;
      })
      let outPut = JSON.parse(str)
      if (addEndOut) {
        if (Array.isArray(outPut)) {
          outPut.push('(已截断其余部分)')
        } else if (typeof outPut == "object") {
          outPut["*注意"] = "(已截断其余部分)";
        }
      }
      // console.log("compressObject use time: " + (new Date().getTime() - t));
      return outPut;
    } catch (error) {
      console.log("compressObject error", error);
      return "";
    }
  },
  /**
   * 压缩数组不超过特定大小
   * @param {any[]} [arr=[]] 需要处理的数组
   * @param {string} [delType='start'] 数组超出后删除的开始位置
   * @param {number} [maxSize=1024 * 972] 数组最大字节数
   */
  compressArray(arr = [], delType = "start", maxSize = 1024 * 972) {
    let t = new Date().getTime()
    try {
      if (!arr || arr.length == 0 || !arr[0]) return [];
      let i = 0;
      while (true) {
        i = i + 1;
        if (i > 999999) return arr;
        if (!arr || arr.length == 0) {
          return [];
        }
        if (this.calculateStringByteSize(arr) <= maxSize) {
          // consoleLog("compressArray t=>" + (new Date().getTime() - t) + "    i=>" + i)
          return arr;
        }
        if (delType == "start") {
          arr.splice(0, 1);
        } else {
          arr.splice(arr.length - 1, 1);
        }
      }
    } catch (error) {
      console.log("compressArray error", error);
      return [];
    }
  },
  /**
   * 计算对象或字符串占用的字节大小，传入对象将自动转json
   */
  calculateStringByteSize(str) {
    try {
      let type = typeof str;
      if (
        type == "bigint"
        || type == "number"
        || type == "boolean"
      ) {
        return str.toString().length;
      } else if (type == "function") {
        str = str.toString().length
      } else if (str === null || str === undefined) {
        return 0;
      } else {
        try {
          str = this.safeJsonStringify(str);
          if (str && str.hasOwnProperty) {
            return str.length;
          } else {
            return 1024 * 20;
          }
        } catch (error) {
          console.log("calculateStringByteSize error", error);
          return 1024 * 20;
        }
      }
      let size = 0;
      for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode < 0x0080) {
          size += 1;
        } else if (charCode < 0x0800) {
          size += 2;
        } else if (charCode >= 0xD800 && charCode <= 0xDFFF) {
          size += 4;
          i++;
        } else {
          size += 3;
        }
      }
      return size;
    } catch (error) {
      console.log("calculateStringByteSize error", error);
      return 1024 * 1024;
    }
  },
  /**
   * 安全的js对象转字符串
   */
  safeJsonStringify(obj, handleValue) {
    if (!obj) return "{}";
    try {
      if (handleValue) {
        return JSON.stringify(obj, (key, value) => {
          return handleValue(key, value)
        })
      } else {
        return JSON.stringify(obj, (key, value) => {
          return value;
        })
      }
    } catch (error) {
      // 尝试解析json失败，可能是变量循环引用的问题，继续尝试增加WeakSet解析
    }

    try {
      let seen = new WeakSet();
      let jsonStr = JSON.stringify(obj, (key, value) => {
        if (typeof value == "object") {
          try {
            if (value instanceof File) {
              value = "js:File";
            }
            if (value && value.constructor && value.constructor.name && typeof value.constructor.name == "string") {
              let className = value.constructor.name;
              if (className == "VueComponent") {
                return "js:Object:VueComponent";
              }
            }
          } catch (error) { }
        }
        if (typeof value == "function") {
          try {
            value = value.toString();
          } catch (error) {
            value = "js:function";
          }
        }
        if (typeof value === "object" && value !== null) {
          // 处理循环引用问题
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        if (handleValue && typeof handleValue == "function") {
          try {
            return handleValue(key, value);
          } catch (error) {
            console.log("handleValue error", error);
          }
          return;
        }
        return value;
      });
      seen = null;
      return jsonStr;
    } catch (error) {
      return "{}";
    }
  },
  /**
   * 根据限制的字节大小截取字符串
   */
  truncateStrBySize(str = "", size = 20 * 1024) {
    try {
      if (size < 1) return "";
      if (this.calculateStringByteSize(str) <= size) return str;
      let endStr = "";
      if (size > 30) {
        endStr = "(已截断多余部分)"
        size = size - 30;
      }
      let low = 0, high = str.length, mid;
      while (low < high) {
        mid = Math.floor((low + high) / 2);
        let currentSize = this.calculateStringByteSize(str.substring(0, mid));
        if (currentSize > size) {
          // 如果大于限制值，减小高边界
          high = mid;
        } else {
          // 如果小于或等于限制值，增加低边界
          low = mid + 1;
        }
      }
      // 返回截断的字符串，注意low-1是因为low是最后一次检查超出大小时的位置
      return str.substring(0, low - 1) + endStr;
    } catch (error) {
      console.log("truncateStrBySize error", error);
      return "";
    }
  }
}