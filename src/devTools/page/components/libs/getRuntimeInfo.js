/**
 * 获取当前运行时环境信息
 */
export default function getRuntimeInfo() {
  return new Promise(async (yes) => {
    let data = {
      系统信息: uni.getSystemInfoSync(),
      设备基础信息: uni.getDeviceInfo ? uni.getDeviceInfo() : null,
      窗口信息: uni.getWindowInfo ? uni.getWindowInfo() : null,
      APP基础信息: uni.getAppBaseInfo ? uni.getAppBaseInfo() : null,
      APP授权设置: uni.getAppAuthorizeSetting ? uni.getAppAuthorizeSetting() : null,
      设备设置: uni.getSystemSetting ? uni.getSystemSetting() : null,
      网络状态: await getNetworkType(),
      启动参数: uni.getLaunchOptionsSync(),
      // #ifdef APP-PLUS
      其他信息: await getAppOtherInfo(),
      // #endif
    };
    yes(data)
  })
}



/**
 * 获取网络状态
 */
function getNetworkType() {
  return new Promise((yes, err) => {
    if (!uni.getNetworkType) {
      return yes(null);
    }
    uni.getNetworkType({
      success(res) {
        yes(res.networkType);
      },
      fail() {
        yes("error");
      },
    });
  });
}
/**
 * 获取APP端设备其他信息
 */
function getAppOtherInfo() {
  return new Promise(async (yes) => {
    let info = {};

    let getDevice = () =>
      new Promise((yes) => {
        plus.device.getInfo({
          success: yes,
          fail() {
            yes("plus.device.getInfo() fail");
          },
        });
      });

    let getOAID = () =>
      new Promise((yes) => {
        plus.device.getOAID({
          success: yes,
          fail() {
            yes("plus.device.getOAID() fail");
          },
        });
      });

    let getAAID = () =>
      new Promise((yes) => {
        plus.device.getOAID({
          success: yes,
          fail() {
            yes("plus.device.getOAID() fail");
          },
        });
      });

    let getDeviceId = () =>
      new Promise((yes) => {
        try {
          let id = plus.device.getDeviceId();
          yes(id);
        } catch (error) {
          yes("plus.device.getDeviceId() fail");
        }
      });

    try {
      info.getDevice = await getDevice();
      info.getOAID = await getOAID();
      info.getAAID = await getAAID();
      info.getDeviceId = await getDeviceId();
      yes(info);
    } catch (error) {
      console.log("getDeviceInfoFail", error);
      yes("获取设备信息失败！");
    }

    plus.device.getInfo({
      success(e) {
        info = Object.assign(info, e);

        plus.device.getOAID({
          success(e) {
            info = Object.assign(info, e);

            plus.device.getVAID({
              success(e) { },
              fail() {
                yes(
                  Object.assign(info, {
                    errMsg: "plus.device.getVAID 获取失败！",
                  })
                );
              },
            });
          },
          fail() {
            yes(
              Object.assign(info, {
                errMsg: "plus.device.getOAID 获取失败！",
              })
            );
          },
        });
      },
      fail() {
        yes({ errMsg: "plus.device.getInfo 获取失败！" });
      },
    });
  });
}