const iconConfig = [
  {
    type: ["", undefined, null],
    mime: "",
    icon: "/devTools/page/static/fileSys/weizhiwenjian.png",
  },
  {
    type: ["dwg"],
    mime: "dwg",
    icon: "/devTools/page/static/fileSys/DWG.png",
  },
  {
    type: ["xls", "xlsx", "csv"],
    mime: "xls",
    icon: "/devTools/page/static/fileSys/excel.png",
  },
  {
    type: ["exe"],
    mime: "exe",
    icon: "/devTools/page/static/fileSys/EXE.png",
  },
  {
    type: ["gif"],
    mime: "gif",
    icon: "/devTools/page/static/fileSys/GIF.png",
  },
  {
    type: ["html"],
    mime: "html",
    icon: "/devTools/page/static/fileSys/HTML.png",
  },
  {
    type: ["pdf"],
    mime: "pdf",
    icon: "/devTools/page/static/fileSys/pdf.png",
  },
  {
    type: ["ppt"],
    mime: "ppt",
    icon: "/devTools/page/static/fileSys/pptl.png",
  },
  {
    type: ["psd"],
    mime: "psd",
    icon: "/devTools/page/static/fileSys/PSD.png",
  },
  {
    type: ["rvt"],
    mime: "rvt",
    icon: "/devTools/page/static/fileSys/RVT.png",
  },
  {
    type: [
      "mp4",
      "avi",
      "wmv",
      "mpg",
      "mpeg",
      "mov",
      "flv",
      "3gp",
      "mp3gp",
      "mkv",
      "rmvb",
    ],
    mime: "mp4",
    icon: "/devTools/page/static/fileSys/shipin.png",
  },
  {
    type: ["skp"],
    mime: "skp",
    icon: "/devTools/page/static/fileSys/SKP.png",
  },
  {
    type: ["svg"],
    mime: "svg",
    icon: "/devTools/page/static/fileSys/SVG.png",
  },
  {
    type: ["png", "jpeg", "jpg", "webp", "bmp"],
    mime: "img",
    icon: "/devTools/page/static/fileSys/tupian.png",
  },
  {
    type: ["txt", "sql", "js", "css", "log", "json"],
    mime: "txt",
    icon: "/devTools/page/static/fileSys/txt.png",
  },
  {
    type: ["word"],
    mime: "word",
    icon: "/devTools/page/static/fileSys/word.png",
  },
  {
    type: ["zip", "rar", "gz", "7z"],
    mime: "zip",
    icon: "/devTools/page/static/fileSys/yasuo.png",
  },
  {
    type: ["mp3", "wma", "wav", "aac", "flac"],
    mime: "",
    icon: "/devTools/page/static/fileSys/yinpin.png",
  },
];


export default {
  /**
   * 获取文件和目录列表
   */
  getDirFileList(path) {
    return new Promise((yes) => {
      // #ifdef APP-PLUS
      plus.io.resolveLocalFileSystemURL(path, function (entry) {
        if (entry.isDirectory) {
          let reader = entry.createReader();
          reader.readEntries(
            async (entries) => {
              let dirList = [];
              let fileList = [];
              for (let i = 0; i < entries.length; i++) {
                /**
                 * @type {PlusIoDirectoryEntry}
                 */
                const item = entries[i];
                let meta = await getMetaData(item)
                let row = {
                  type: item.isDirectory ? 'dir' : 'file',
                  name: item.name,
                  fileType: getFileType(item.name),
                  ...meta,
                }
                if (item.isDirectory) {
                  dirList.push(row)
                } else {
                  fileList.push(row)
                }
              }

              dirList = dirList.sort((a, b) => a.time > b.time)
              fileList = fileList.sort((a, b) => a.time > b.time)

              yes([
                ...dirList,
                ...fileList,
              ])
            },
            (e) => {
              console.log("readEntries error", e);
              uni.showToast({
                title: "文件读取失败: " + e.message,
                icon: "none",
              });
              yes([])
            }
          );
        } else {
          uni.showToast({
            title: "路径读取失败_b",
            icon: "none",
          });
          yes([])
        }
      }, () => {
        uni.showToast({
          title: "路径读取失败_a",
          icon: "none",
        });
        yes([])
      });
      // #endif
    })
  },
  /**
   * 获取文件图片
   */
  getFileIcon(type) {
    for (let i = 0; i < iconConfig.length; i++) {
      const item = iconConfig[i];
      for (let _i = 0; _i < item.type.length; _i++) {
        const typeName = item.type[_i];
        if (type == typeName) {
          return item.icon;
        }
      }
    }
    return "/devTools/page/static/fileSys/weizhiwenjian.png";
  }
}

/**
 * @param {PlusIoDirectoryEntry} entry 
 */
function getMetaData(entry) {
  return new Promise((yes) => {
    entry.getMetadata(function (metadata) {
      yes({
        size: metadata.size,
        time: metadata.modificationTime.getTime(),
        fileCount: metadata.fileCount,
        directoryCount: metadata.directoryCount,
      })
    }, function () {
      yes({
        size: 0,
        time: 0,
        fileCount: 0,
        directoryCount: 0,
      })
    });
  })
}

function getFileType(name) {
  if (typeof name == "string") {
    let tList = name.split(".");
    if (tList.length > 1) {
      return tList.pop().toLocaleLowerCase()
    } else {
      return ""
    }
  } else {
    return ""
  }
}