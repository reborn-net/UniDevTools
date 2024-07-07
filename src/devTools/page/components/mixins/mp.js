export default {
  data() {
    return {
      windowInfo: getWindowInfo(),
    }
  },
  computed: {
    /**
     * 小程序和H5的标题
     */
    navbarStyle() {
      let windowInfo = getWindowInfo();
      return {
        statusBarHeightPx: windowInfo.system.statusBarHeight + 'px',
        navbarHeightPx: windowInfo.navbar.bodyHeightPx + 'px',
      }
    },
  },
  methods: {
    back() {
      uni.navigateBack()
    }
  }
}








/**
 * 获取当前窗口数据
 * 
 */
function getWindowInfo() {
  let systemInfo = uni.getSystemInfoSync();
  systemInfo.pixelRatio = Math.round(systemInfo.pixelRatio * 100) / 100;

  let windowInfo = {
    system: systemInfo,
    capsule: {
      bottom: 78,
      height: 30,
      left: 283,
      right: 363,
      top: 48,
      width: 0,
    },
    navbar: {
      heightPx: uni.upx2px(100) + systemInfo.statusBarHeight,
      bodyHeightPx: uni.upx2px(100),
      bodyWidthPx: systemInfo.windowWidth,
      capsuleWidthPx: 0,
      capsuleRightPx: 0,
    },

    height: systemInfo.windowHeight * (750 / systemInfo.windowWidth),
    width: 750,
    statusBarHeight: systemInfo.statusBarHeight * (750 / systemInfo.windowWidth),
    safeBottom: systemInfo.windowHeight - systemInfo.safeArea.bottom,
    safeBottomRpx: (systemInfo.windowHeight - systemInfo.safeArea.bottom) * (750 / systemInfo.windowWidth),
    /**
     * 原生端 底部导航栏高度
     */
    footNavbarHeight: uni.upx2px(100) + (systemInfo.windowHeight - systemInfo.safeArea.bottom),
  }

  // #ifdef MP-QQ || MP-WEIXIN
  let capsuleInfo = uni.getMenuButtonBoundingClientRect();
  windowInfo.capsule = capsuleInfo;
  let capsuleToStatusBarPx = capsuleInfo.top - systemInfo.statusBarHeight; //胶囊和状态栏之间的高度
  windowInfo.navbar.bodyHeightPx = capsuleInfo.height + (capsuleToStatusBarPx * 2);
  windowInfo.navbar.heightPx = windowInfo.navbar.bodyHeightPx + systemInfo.statusBarHeight;
  let capsuleWidthPx = (systemInfo.windowWidth - capsuleInfo.right) * 2 + capsuleInfo.width;
  windowInfo.navbar.bodyWidthPx = systemInfo.windowWidth - capsuleWidthPx;
  windowInfo.navbar.capsuleWidthPx = capsuleWidthPx;
  windowInfo.navbar.capsuleRightPx = capsuleWidthPx - (systemInfo.windowWidth - capsuleInfo.right);
  // #endif

  return windowInfo;
}