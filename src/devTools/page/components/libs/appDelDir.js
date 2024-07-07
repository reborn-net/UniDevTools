import dirReader from "./dirReader"

/**
 * 遍历删除整个文件夹，以“/”结尾
 */
export default function appDelDir(path, needDelSelf = true) {
  return new Promise(async (yes, err) => {
    let dirList = await dirReader.getDirFileList(path)
    for (let i = 0; i < dirList.length; i++) {
      let item = dirList[i];
      try {
        if (item.type == "dir") {
          let info = await getMeteInfo(path + item.name + "/")
          if (
            info.directoryCount > 0
            || info.fileCount > 0
          ) {
            await appDelDir(path + item.name + "/")
          } else {
            await delDir(path + item.name + "/")
          }
        } else {
          await delFile(path + item.name)
        }
      } catch (error) { }
    }
    try {
      if (needDelSelf) {
        await delDir(path)
      }
    } catch (error) { }
    yes()
  })
}

function delFile(path) {
  return new Promise((yes, err) => {
    plus.io.resolveLocalFileSystemURL(
      path,
      (entry) => {
        entry.remove(
          yes,
          err
        )
      },
      err
    );
  })
}

function delDir(path) {
  return new Promise((yes, err) => {
    plus.io.resolveLocalFileSystemURL(
      path,
      (entry) => {
        entry.remove(
          yes,
          err
        )
      },
      err
    );
  })
}

/**
 * 获取文件夹内信息
 * @returns {Promise<PlusIoMetadata>}
 */
function getMeteInfo(path) {
  return new Promise((yes, err) => {
    plus.io.resolveLocalFileSystemURL(
      path,
      (entry) => {
        if (entry.isDirectory) {
          entry.getMetadata((metadata) => {
            yes(metadata)
          }, err)
        } else {
          err()
        }
      },
      err
    );
  })
}