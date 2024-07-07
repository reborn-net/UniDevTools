export default {
  /**
   * 获取字节大小,b转kb mb 
   */
  getByteSize(size) {
    if (null == size || size == '') return "0 B";
    var unitArr = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    var index = 0;
    var srcsize = parseFloat(size);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    var size = srcsize / Math.pow(1024, index);
    size = size.toFixed(2);//保留的小数位数
    return size + unitArr[index];
  }
}