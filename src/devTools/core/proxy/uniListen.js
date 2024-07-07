import logReport from "../libs/logReport";


export default {
  /**
   * 挂载uni大部分api监听器
   */
  install() {
    try {
      this.addDefUniApiListen()
      this.onNetworkStatusChange()
      this.scanCodeListen()
      this.onLocaleChange()
    } catch (error) {
      console.log("uniListen error", error);
    }
  },
  /**
   * 批量挂载api调用日志
   */
  addDefUniApiListen() {
    /**
     * 需要挂载监听的api列表
     */
    let diyListenApi = {
      downloadFile(args) {
        logReport("downloadFile>" + (args && args.url ? args.url : ''))
      },
      connectSocket(args) {
        logReport("connectSocket>" + args.url)
      },
      makePhoneCall(args) {
        logReport("makePhoneCall>" + args.phoneNumber)
      },
      addPhoneContact(args) {
        logReport("addPhoneContact>" + args.name)
      },
      showToast(args) {
        logReport("showToast>" + args.title)
      },
      showModal(args) {
        logReport("showModal>" + args.title + '>' + args.content)
      },
      setLocale(args) {
        logReport("setLocale>" + args)
      },
      saveFile(args) {
        logReport("saveFile>" + args.tempFilePath)
      },
      login(args) {
        logReport("login>" + JSON.stringify(args))
      },
      share(args) {
        logReport("share>" + JSON.stringify(args))
      },
      shareWithSystem(args) {
        logReport("shareWithSystem>" + JSON.stringify(args))
      },
      requestPayment(args) {
        logReport("requestPayment>" + JSON.stringify(args))
      },
      authorize(args) {
        logReport("requestPayment>" + args.scope)
      },
      navigateToMiniProgram(args) {
        logReport("navigateToMiniProgram>" + args.appId + '>' + args.path)
      },
      openDocument(args) {
        logReport("openDocument>" + args.filePath)
      }
    }
    /**
     * 需要监听打印日志的api名称列表
     */
    let waitListenApiNames = [
      "uploadFile",
      "closeSocket",
      "getLocation",
      "chooseLocation",
      "openLocation",
      "chooseImage",
      "previewImage",
      "saveImageToPhotosAlbum",
      "chooseFile",
      "chooseVideo",
      "chooseMedia",
      "saveVideoToPhotosAlbum",
      "openVideoEditor",
      "openAppAuthorizeSetting",
      "startAccelerometer",
      "startCompass",
      "startGyroscope",
      "setScreenBrightness",
      "vibrate",
      "vibrateLong",
      "vibrateShort",
      "openBluetoothAdapter",
      "startBeaconDiscovery",
      "startSoterAuthentication",
      "hideKeyboard",
      "showActionSheet",
      "startPullDownRefresh",
      "showShareMenu",
      "startFacialRecognitionVerify",
      "openSetting",
      "chooseAddress",
      "chooseInvoiceTitle",
      "openEmbeddedMiniProgram",

    ]

    for (const key in diyListenApi) {
      uni.addInterceptor(key, {
        invoke(_args) {
          try {
            diyListenApi[key](_args)
          } catch (error) {
            console.error("addInterceptor=>" + key, error);
          }
        }
      })
    }


    waitListenApiNames.map(key => {
      uni.addInterceptor(key, {
        invoke(args) {
          try {
            logReport(key)
          } catch (error) {
            console.error("addInterceptor>" + key, error);
          }
        }
      })
    })


  },
  /**
   * 添加网络状态监听
   */
  onNetworkStatusChange() {
    uni.onNetworkStatusChange((res) => {
      try {
        logReport("onNetworkStatusChange>isConnected:" + (res.isConnected ? 'true' : 'false') + '>networkType:' + res.networkType)
      } catch (error) {
        console.log("onNetworkStatusChange", error);
      }
    })
  },
  /**
   * 添加系统主题切换监听
   */
  onThemeChange() {
    uni.onThemeChange((res) => {
      try {
        logReport("onThemeChange>" + res.theme)
      } catch (error) {
        console.log("onThemeChange", error);
      }
    });
  },
  /**
   * 监听扫码结果
   */
  scanCodeListen() {
    uni.addInterceptor('scanCode', {
      success(res) {
        try {
          logReport("scanCodeSuccess>" + JSON.stringify({
            scanType: res.scanType,
            result: res.result,
          }))
        } catch (error) {
          console.log("scanCode", error);
        }
      }
    })
  },
  /**
   * 监听系统语言切换
   */
  onLocaleChange() {
    uni.onLocaleChange((locale) => {
      try {
        logReport("onLocaleChange>" + locale)
      } catch (error) {
        console.log("onLocaleChange", error);
      }
    })
  },
}