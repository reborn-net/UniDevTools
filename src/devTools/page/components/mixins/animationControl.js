// #ifdef APP-PLUS
const animation = weex.requireModule('animation')
// #endif
export default {
  methods: {
    /**
     * 显示面板
     */
    panelShow() {
      let that = this;

      let sys = uni.getSystemInfoSync();

      animation.transition(
        that.$refs.mask,
        {
          styles: {
            opacity: 1,
            height: sys.windowHeight + 'px'
          },
          duration: 200, //ms
          timingFunction: 'linear',
          delay: 0 //ms
        }
      )

      let height = Math.ceil(sys.windowHeight * 0.8);

      animation.transition(
        that.$refs.panel,
        {
          styles: {
            opacity: 1,
            transform: `transform: translate(0px,${height}px)`
          },
          duration: 1, //ms
          timingFunction: 'linear',
          delay: 0 //ms
        },
        (res) => {

          animation.transition(
            that.$refs.panel,
            {
              styles: {
                transform: `transform: translate(0px,0px)`
              },
              duration: 200, //ms
              timingFunction: 'linear',
              delay: 0 //ms
            }
          )

        }
      )
    },
    /**
     * 关闭面板
     */
    panelHide() {
      let that = this;

      animation.transition(
        that.$refs.mask,
        {
          styles: {
            opacity: 0,
          },
          duration: 200, //ms
          timingFunction: 'linear',
          delay: 0 //ms
        }
      )
      let height = uni.upx2px(1000);
      animation.transition(
        that.$refs.panel,
        {
          styles: {
            transform: `transform: translate(0px,${height}px)`
          },
          duration: 200, //ms
          timingFunction: 'linear',
          delay: 0 //ms
        },
        () => {
          uni.$emit("devTools_panelHideSuccess")
        }
      )
    },
  }
}