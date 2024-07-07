<template>
  <view class="devTools">
    <!-- #ifndef APP-PLUS -->
    <view class="navbar">
      <view
        class="navbarBody"
        :style="{
          marginTop: navbarStyle.statusBarHeightPx,
          height: navbarStyle.navbarHeightPx,
        }"
      >
        <view
          class="left"
          @click="back"
        >
          <image src="@/devTools/page/static/fold.png" />
          <text class="margin-left-sm">返回</text>
        </view>
        <view
          class="right"
          :style="{ 'margin-right': windowInfo.navbar.capsuleRightPx + 'px' }"
          v-if="tabList[tabIndex].canRefreshing"
          @click="getPage(true)"
        >
          <text :class="tabList[tabIndex].isRefreshing ? 'refreshing' : ''">
            {{ tabList[tabIndex].isRefreshing ? "刷新中" : "刷新" }}
          </text>
          <image src="@/devTools/page/static/refresh.png" />
        </view>
      </view>
    </view>
    <!-- #endif -->

    <view
      ref="mask"
      class="mask"
      @click="$devTools.hide()"
    ></view>

    <view
      @click.stop
      ref="panel"
      class="panel"
      :style="{
        height: panelHeight + 'px',
      }"
    >
      <view class="head">
        <scroll-view
          :scroll-x="true"
          class="tabList showScrollbars"
          :class="isDialog ? '' : 'tab-h5'"
          :show-scrollbar="false"
        >
          <view style="display: flex; flex-direction: row">
            <view
              v-for="(item, index) in tabList"
              :key="index"
              class="tabItem"
              @click="tabIndex = index"
            >
              <text
                class="tabText"
                :class="index == tabIndex ? 'active' : ''"
              >
                {{ item.title }}
              </text>
              <view
                class="tabLine"
                v-if="index == tabIndex"
              ></view>
            </view>
          </view>
        </scroll-view>
        <view
          v-if="isDialog"
          class="close"
          @click="$devTools.hide()"
        >
          <view class="line"></view>
          <text class="icon">×</text>
        </view>
      </view>

      <mobileSwiperScroll
        :scrollHeight="listHeight"
        :tabIndex="tabIndex"
        :tabList="tabList"
        @refresh="onrefresh"
        @pullingdown="onpullingdown"
        @tabIndexChange="tabIndex = $event"
        ref="mobileSwiperScroll"
      >
        <template #default="{ item, index }">
          <template v-if="item.title == 'Tools'">
            <cell>
              <tools
                ref="tools"
                @goOpenRequest="$refs.sendRequest.show()"
              />
            </cell>
          </template>
          <template v-if="item.title == 'Error'">
            <cell
              v-for="(_item, _index) in item.data"
              :key="_index"
            >
              <errorItem
                :item="_item"
                :key="_index"
              />
            </cell>
          </template>
          <template v-if="item.title == 'Console'">
            <cell
              v-for="(_item, _index) in item.data"
              :key="_index"
            >
              <consoleItem
                :item="_item"
                :key="_index"
              />
            </cell>
          </template>
          <template v-if="item.title == 'Network'">
            <cell
              v-for="(_item, _index) in item.data"
              :key="_index"
            >
              <networkItem
                :item="_item"
                :key="_index"
                @goSendRequest="$refs.sendRequest.show($event, true)"
                @goOpenRequest="$refs.sendRequest.show($event)"
              />
            </cell>
          </template>
          <template v-if="item.title == 'Storage'">
            <cell>
              <storageList ref="storageList" />
            </cell>
          </template>
          <template v-if="item.title == 'Pages'">
            <cell>
              <subTitleBar
                :isOpen="item.isShowPages"
                title="当前页面栈"
                @click="pagesShowChange('isShowPages')"
              />
            </cell>
            <cell>
              <pages
                ref="pages"
                :isShow="item.isShowPages"
              />
            </cell>
            <cell>
              <view class="cellDivisionLine"></view>
            </cell>
            <cell>
              <subTitleBar
                :isOpen="item.isShowRouteList"
                title="全部路由"
                @click="pagesShowChange('isShowRouteList')"
              />
            </cell>
            <template v-if="item.isShowRouteList">
              <cell
                v-for="_item in item.routeList"
                :key="_item.path"
              >
                <routeItem :item="_item" />
              </cell>
            </template>
            <cell>
              <view class="cellDivisionLine"></view>
            </cell>
            <cell>
              <subTitleBar
                :isOpen="item.isShowData"
                title="页面停留统计"
                @click="pagesShowChange('isShowData')"
              />
            </cell>
            <template v-if="item.isShowData">
              <cell
                v-for="(_item, _index) in item.data"
                :key="_item.route"
              >
                <pageItem
                  :item="_item"
                  :key="_index"
                />
              </cell>
            </template>
            <cell>
              <view class="cellDivisionLine"></view>
            </cell>
            <cell>
              <subTitleBar
                :isOpen="item.dayOnlineShow"
                title="日活跃时间统计"
                @click="pagesShowChange('dayOnlineShow')"
              />
            </cell>
            <template v-if="item.dayOnlineShow">
              <cell
                v-for="(_item, _index) in item.dayOnlineList"
                :key="_index"
              >
                <dayOnlineItem
                  @click="showOnlineDetailsDialog(_item)"
                  :item="_item"
                  :key="_index"
                />
              </cell>
            </template>
            <cell>
              <view class="cellDivisionLine"></view>
            </cell>
          </template>
          <template v-if="item.title == 'Vuex'">
            <cell>
              <vuexList
                ref="vuexList"
                :stateType="tabList[tabList.findIndex((x) => x.title == 'Vuex')].stateType"
              />
            </cell>
          </template>
          <template v-if="item.title == 'Logs'">
            <cell
              v-for="(_item, _index) in item.data"
              :key="_index"
            >
              <logItem
                :item="_item"
                :key="_index"
              />
            </cell>
          </template>
          <template v-if="item.title == 'Info'">
            <cell>
              <infoList ref="infoList" />
            </cell>
          </template>
          <template v-if="item.title == 'UniBus'">
            <cell>
              <subTitleBar
                :isOpen="item.isShowCount"
                title="事件统计"
                @click="pagesShowChange('isShowCount')"
              />
            </cell>
            <template v-if="item.isShowCount">
              <cell
                v-for="_item in item.countList"
                :key="_item.e"
              >
                <view
                  class="eventItem"
                  @longpress.stop="busCountMenu(_item)"
                >
                  <text class="eventName">name: {{ _item.e }}</text>
                  <view class="eventCount">
                    <text
                      v-if="item.filterType == '' || item.filterType == 'on'"
                      class="eventCountItem"
                    >
                      on: {{ _item.on }}
                    </text>
                    <text
                      v-if="item.filterType == '' || item.filterType == 'emit'"
                      class="eventCountItem"
                    >
                      emit: {{ _item.emit }}
                    </text>
                    <text
                      v-if="item.filterType == '' || item.filterType == 'once'"
                      class="eventCountItem"
                    >
                      once: {{ _item.once }}
                    </text>
                    <text
                      v-if="item.filterType == '' || item.filterType == 'off'"
                      class="eventCountItem"
                    >
                      off: {{ _item.off }}
                    </text>
                  </view>
                </view>
              </cell>
            </template>
            <cell>
              <view class="cellDivisionLine"></view>
            </cell>
            <cell>
              <subTitleBar
                :isOpen="item.isShowLog"
                title="执行记录"
                @click="pagesShowChange('isShowLog')"
              />
            </cell>
            <template v-if="item.isShowLog">
              <cell
                v-for="(_item, _index) in item.logList"
                :key="_index"
              >
                <view
                  class="eventLogItem"
                  @longpress.stop="busLogMenu(_item)"
                >
                  <text class="logText">{{ _item.e }}</text>
                  <text class="logTime">{{ _item.date }}</text>
                </view>
              </cell>
            </template>
            <cell>
              <view class="cellDivisionLine"></view>
            </cell>
          </template>
          <template v-if="item.title == 'FileSys'">
            <!-- #ifdef APP-PLUS || MP-WEIXIN -->
            <cell
              v-for="(_item, _index) in item.data"
              :key="_index"
            >
              <fileSysItem
                :item="_item"
                :key="_index"
                :dirType="item.dirType"
                :dirList="item.dirList"
                @goChildDir="goChildDir"
                @getPage="getPage"
                @editDirName="editDirName"
                @openEditFileDialog="($event) => $refs.textFileEditDialog.show($event)"
              />
            </cell>
            <cell v-if="item.data.length == 0 || (item.data.length == 1 && item.data[0].type == 'back')">
              <view class="devEmpty">
                <text class="devEmptyText">空空如也</text>
              </view>
            </cell>
            <!-- #endif -->
            <!-- #ifndef APP-PLUS || MP-WEIXIN -->
            <cell>
              <view class="listCenterView">
                <text class="listCenterText">该平台无FileSys文件管理</text>
              </view>
            </cell>
            <!-- #endif -->
          </template>
          <template v-if="item.title == 'Setting'">
            <cell>
              <settingView ref="settingView" />
            </cell>
          </template>

          <template v-if="item.title == 'JsRunner'">
            <!-- #ifdef APP-PLUS || H5 -->
            <cell
              v-for="(_item, _index) in item.data"
              :key="_index"
            >
              <jsRunnerItem
                :item="_item"
                :key="_index"
              />
            </cell>
            <cell v-if="item.data.length == 0">
              <view class="devEmpty">
                <text class="devEmptyText">动态执行JS代码</text>
              </view>
            </cell>
            <!-- #endif -->
            <!-- #ifndef APP-PLUS || H5 -->
            <cell>
              <view class="listCenterView">
                <text class="listCenterText">该平台不支持该功能</text>
              </view>
            </cell>
            <!-- #endif -->
          </template>

          <template v-if="item.isLongList">
            <cell v-if="!item.isLoadAll && item.data.length == 30">
              <view
                class="loadAll"
                @click="showListAll"
              >
                <image
                  class="loadAllFold"
                  src="@/devTools/page/static/unfold.png"
                />
                <text class="loadAllText">展示全部数据</text>
                <image
                  class="loadAllFold"
                  src="@/devTools/page/static/unfold.png"
                />
              </view>
            </cell>

            <cell v-if="item.type == 'success' && item.data.length == 0">
              <view class="devEmpty">
                <text class="devEmptyText">空空如也</text>
              </view>
            </cell>

            <cell v-if="(item.type == 'loading' || item.type == 'loading') && item.data.length == 0">
              <view class="devEmpty">
                <text class="devEmptyText">加载中</text>
              </view>
            </cell>
          </template>

          <cell>
            <view style="height: 300rpx"></view>
          </cell>
        </template>
      </mobileSwiperScroll>
    </view>

    <bottomTools
      :tabIndex="tabIndex"
      :tabTitle="tabTitle"
      :options="bottomToolsOptions"
      :isShow="isShowBottomTools"
      :stateType="tabList[tabList.findIndex((x) => x.title == 'Vuex')].stateType"
      @filterTypeChange="onFilterTypeChange"
      @goChildDir="goChildDir"
      @changeFileDirType="changeFileDirType"
      @changeStorageType="changeStorageType"
      @editDirName="editDirName"
      @getPage="getPage"
      @runJs="runJs"
      @emptyCodeHis="emptyCodeHis"
      @changeStateType="changeStateType"
    />

    <editDialog ref="editDialog" />

    <dayOnlinePageList ref="dayOnlinePageList" />

    <sendRequest ref="sendRequest" />

    <textFileEditDialog
      ref="textFileEditDialog"
      @getPage="getPage"
    />

    <createDir
      ref="createDir"
      :dirList="tabList[11].dirList"
      :dirType="tabList[11].dirType"
      @getPage="getPage"
    />

    <addStorage
      :storageType="tabList[5].storageType"
      @getPage="getPage"
    />

    <routeDialog />
  </view>
</template>
<script>
import init from "../../index";
import consoleItem from "./listItem/consoleItem.vue";
import infoList from "./listItem/infoList.vue";
import storageList from "./listItem/storageList.vue";
import tools from "./listItem/tools.vue";
import vuexList from "./listItem/vuexList.vue";
import animationControl from "./mixins/animationControl";
import { timeFormat, timeFromNow } from "../../core/libs/timeFormat";
import devCache from "../../core/libs/devCache";
import networkItem from "./listItem/networkItem.vue";
import pages from "./listItem/pages.vue";
import logItem from "./listItem/logItem.vue";
import pageItem from "./listItem/pageItem.vue";
import errorItem from "./listItem/errorItem.vue";
import mobileSwiperScroll from "./ui/mobileSwiperScroll.vue";
import subTitleBar from "./ui/subTitleBar.vue";
import dayOnlineItem from "./listItem/dayOnlineItem.vue";
import dayOnlinePageList from "./dialog/dayOnlinePageList.vue";
import sendRequest from "./dialog/sendRequest.vue";
import bottomTools from "./bottomTools.vue";
import dirReader from "./libs/dirReader";
import fileSysItem from "./listItem/fileSysItem.vue";
import fileSize from "./libs/fileSize";
import textFileEditDialog from "./dialog/textFileEditDialog.vue";
import createDir from "./dialog/createDir.vue";
import editDialog from "./dialog/editDialog.vue";
import addStorage from "./dialog/addStorage.vue";
import settingView from "./listItem/setting.vue";
import mp from "./mixins/mp";
import jsRunnerItem from "./listItem/jsRunnerItem.vue";
import routeItem from "./listItem/routeItem.vue";
import routeDialog from "./dialog/routeDialog.vue";

// #ifndef APP-PLUS
import h5Cell from "./ui/h5Cell.vue";
// #endif

/**
 * 时间戳转时间文字
 */
function getTime(t) {
  let c = "0s";
  if (t < 60) {
    c = t + "秒";
  } else if (t < 60 * 60) {
    c = Math.ceil(t / 60) + "分钟";
  } else {
    c = Math.ceil(t / 60 / 60) + "小时" + Math.ceil((t % (60 * 60)) / 60) + "分钟";
  }
  return c;
}

export default {
  mixins: [animationControl, mp],
  components: {
    mobileSwiperScroll,
    consoleItem,
    storageList,
    vuexList,
    tools,
    infoList,
    networkItem,
    pages,
    logItem,
    pageItem,
    errorItem,
    subTitleBar,
    dayOnlinePageList,
    dayOnlineItem,
    sendRequest,
    bottomTools,
    fileSysItem,
    textFileEditDialog,
    createDir,
    editDialog,
    addStorage,
    settingView,
    jsRunnerItem,
    routeItem,
    routeDialog,
    // #ifndef APP-PLUS
    cell: h5Cell,
    // #endif
  },
  data() {
    return {
      /**
       * 是否处于弹窗状态
       */
      isDialog: true,

      tabLoading: true,
      tabIndex: 0,
      tabList: [
        {
          title: "Tools", //标题
          hasLoad: false,
        },
        {
          title: "Error", //标题
          canRefreshing: true, //是否允许下拉刷新
          isRefreshing: false, //下拉刷新状态
          refreshType: "waitPullUp", //刷新状态 'waitPullUp','waitRelease','refreshing'
          type: "init", //列表状态
          data: [], //数据条数
          hasLoad: false,
          isLongList: true, // 是否长列表
          isLoadAll: false, //是否加载全部
          filterType: "", //过滤类型
          isShowBottomTools: true, //显示底部工具栏
        },
        {
          title: "Console", //标题
          canRefreshing: true, //是否允许下拉刷新
          isRefreshing: false, //下拉刷新状态
          refreshType: "waitPullUp", //刷新状态 'waitPullUp','waitRelease','refreshing'
          type: "init", //列表状态
          data: [], //数据条数
          hasLoad: false,
          isLongList: true, // 是否长列表
          isLoadAll: false, //是否加载全部
          filterType: "", //过滤类型
          isShowBottomTools: true, //显示底部工具栏
        },
        {
          title: "Network", //标题
          canRefreshing: true, //是否允许下拉刷新
          isRefreshing: false, //下拉刷新状态
          refreshType: "waitPullUp", //刷新状态 'waitPullUp','waitRelease','refreshing'
          type: "init", //列表状态
          data: [], //数据条数
          hasLoad: false,
          isLongList: true, // 是否长列表
          isLoadAll: false, //是否加载全部
          filterType: "", //过滤类型
          isShowBottomTools: true, //显示底部工具栏
        },
        {
          title: "JsRunner", //标题
          canRefreshing: false, //是否允许下拉刷新
          isRefreshing: false, //下拉刷新状态
          refreshType: "waitPullUp", //刷新状态 'waitPullUp','waitRelease','refreshing'
          type: "init", //列表状态
          data: [], //数据条数
          hasLoad: false,
          // #ifdef APP-PLUS || H5
          isShowBottomTools: true, //显示底部工具栏
          // #endif
        },
        {
          title: "Storage", //标题
          canRefreshing: true, //是否允许下拉刷新
          isRefreshing: false, //下拉刷新状态
          refreshType: "waitPullUp", //刷新状态 'waitPullUp','waitRelease','refreshing'
          hasLoad: false,
          storageType: "localStorage", //缓存类型默认为localStorage
          isShowBottomTools: true, //显示底部工具栏
        },
        {
          title: "Pages", //标题
          canRefreshing: true, //是否允许下拉刷新
          isRefreshing: false, //下拉刷新状态
          refreshType: "waitPullUp", //刷新状态 'waitPullUp','waitRelease','refreshing'
          hasLoad: false,
          isShowPages: true, //是否展示页面堆栈列表
          data: [],
          isShowData: false, //是否展示页面全部统计数据
          dayOnlineList: [], //日浏览量日志
          dayOnlineShow: false,
          isShowBottomTools: true, //显示底部工具栏
          isShowRouteList: false, // 是否显示路由列表
          routeList: [], //全部路由列表
        },
        {
          title: "Vuex", //标题
          canRefreshing: true, //是否允许下拉刷新
          isRefreshing: false, //下拉刷新状态
          refreshType: "waitPullUp", //刷新状态 'waitPullUp','waitRelease','refreshing'
          hasLoad: false,
          stateType: "vuex", //全局变量类型 vuex pinia globalData
          isShowBottomTools: true, //显示底部工具栏
        },
        {
          title: "Logs", //标题
          canRefreshing: true, //是否允许下拉刷新
          isRefreshing: false, //下拉刷新状态
          refreshType: "waitPullUp", //刷新状态 'waitPullUp','waitRelease','refreshing'
          type: "init", //列表状态
          data: [], //数据条数
          page: 0, //当前页码
          hasLoad: false,
          isLoadAll: false, //是否加载全部
          isLongList: true, // 是否长列表
          isShowBottomTools: true, //显示底部工具栏
        },
        {
          title: "Info", //标题
          canRefreshing: true, //是否允许下拉刷新
          isRefreshing: false, //下拉刷新状态
          refreshType: "waitPullUp", //刷新状态 'waitPullUp','waitRelease','refreshing'
          hasLoad: false,
        },
        {
          title: "UniBus", //标题
          canRefreshing: true, //是否允许下拉刷新
          isRefreshing: false, //下拉刷新状态
          refreshType: "waitPullUp", //刷新状态 'waitPullUp','waitRelease','refreshing'
          type: "init", //列表状态
          isShowCount: true,
          countList: [],
          isShowLog: false,
          logList: [],
          filterType: "", //过滤类型
          hasLoad: false,
          isShowBottomTools: true, //显示底部工具栏
        },
        {
          title: "FileSys", //标题
          canRefreshing: true, //是否允许下拉刷新
          isRefreshing: false, //下拉刷新状态
          refreshType: "waitPullUp", //刷新状态 'waitPullUp','waitRelease','refreshing'
          type: "init", //列表状态
          // #ifdef APP-PLUS
          dirType: "PRIVATE_DOC", //文件类型 wx, PRIVATE_WWW, PRIVATE_DOC PUBLIC_DOCUMENTS PUBLIC_DOWNLOADS
          // #endif
          // #ifdef MP
          dirType: "wx", //文件类型 wx, PRIVATE_WWW, PRIVATE_DOC
          // #endif
          data: [], //文件列表
          dirList: [], //目录列表
          hasLoad: false,
          isShowBottomTools: true, //显示底部工具栏
        },
        {
          title: "Setting", //标题
          canRefreshing: true, //是否允许下拉刷新
          isRefreshing: false, //下拉刷新状态
          refreshType: "waitPullUp", //刷新状态 'waitPullUp','waitRelease','refreshing'
          type: "init", //列表状态
          data: [], //数据条数
          page: 0, //当前页码
          hasLoad: false,
        },
      ],
    };
  },
  watch: {
    /**
     * 监听tab改变事件
     */
    tabIndex(index) {
      if (!this.tabList[index].hasLoad) {
        this.getPage();
      }
    },
  },
  computed: {
    /**
     * 挂载dev对象
     */
    $devTools() {
      return init;
    },
    /**
     * 面板高度
     */
    panelHeight() {
      // #ifndef APP-PLUS
      if (1) return this.windowInfo.system.windowHeight - this.windowInfo.navbar.heightPx;
      // #endif
      return Math.ceil(this.windowInfo.system.windowHeight * 0.8);
    },
    /**
     * 滚动列表的高度
     */
    listHeight() {
      let sys = uni.getSystemInfoSync();
      // #ifdef H5
      if (1) return sys.windowHeight - 50 - uni.upx2px(80) - 1;
      // #endif
      // #ifdef MP-WEIXIN
      if (1) return sys.windowHeight - this.windowInfo.navbar.heightPx - uni.upx2px(80) - 1;
      // #endif
      return this.panelHeight - uni.upx2px(80) - 1;
    },
    /**
     * 当前tab栏的标题
     */
    tabTitle() {
      return this.tabList[this.tabIndex].title;
    },
    /**
     * 获取底部栏需要的参数
     */
    bottomToolsOptions() {
      let that = this;
      const getTabItemByTitle = (title) => {
        let i = that.tabList.findIndex((x) => x.title == title);
        return that.tabList[i];
      };
      return {
        errorFilterType: getTabItemByTitle("Error").filterType,
        consoleFilterType: getTabItemByTitle("Console").filterType,
        networkFilterType: getTabItemByTitle("Network").filterType,
        busFilterType: getTabItemByTitle("UniBus").filterType,
        fileSysDirList: getTabItemByTitle("FileSys").dirList,
        fileSysDirType: getTabItemByTitle("FileSys").dirType,
        storageType: getTabItemByTitle("Storage").storageType,
        codeHisLength: getTabItemByTitle("JsRunner").data.length,
      };
    },
    /**
     * 是否显示底部工具栏
     */
    isShowBottomTools() {
      // [1, 2, 3, 4, 5, 7, 9, 10].indexOf(tabIndex) != -1
      let item = this.tabList[this.tabIndex];
      return item.isShowBottomTools === true;
    },
  },
  mounted() {
    let that = this;
    this.getPage();
    // #ifndef APP-PLUS
    this.isDialog = false;
    // #endif

    // ! 刷新当前列表
    uni.$on("devTools_listGetPage", () => {
      that.getPage();
    });

    // ! 删除指定请求记录
    uni.$on("devTools_delNetworkItemById", (id) => {
      let tabIndex = that.tabList.findIndex((x) => x.title == "Network");
      let i = that.tabList[tabIndex].data.findIndex((x) => x.id == id);
      if (i != -1) {
        that.tabList[tabIndex].data.splice(i, 1);
      }
    });

    // ! 删除日志
    uni.$on("devTools_delLog", (item) => {
      let tabIndex = that.tabList.findIndex((x) => x.title == "Logs");
      let i = that.tabList[tabIndex].data.findIndex((x) => x.date == item.date && x.t == item.t);
      if (i != -1) {
        that.tabList[tabIndex].data.splice(i, 1);
      }
    });

    // ! 删除错误记录
    uni.$on("devTools_delError", (item) => {
      let tabIndex = that.tabList.findIndex((x) => x.title == "Error");
      let i = that.tabList[tabIndex].data.findIndex(
        (x) => x.type == item.type && x.t == item.t && x.m == item.m && x.tr == item.tr && x.p == item.p
      );
      if (i != -1) {
        that.tabList[tabIndex].data.splice(i, 1);
      }
    });

    // ! 删除打印日志
    uni.$on("devTools_delConsoleItem", (item) => {
      let tabIndex = that.tabList.findIndex((x) => x.title == "Console");
      let i = that.tabList[tabIndex].data.findIndex((x) => {
        let t = JSON.stringify(x.list);
        return t == JSON.stringify(item.list) && x.time == item.time && x.page == item.page && x.type == item.type;
      });
      if (i != -1) {
        that.tabList[tabIndex].data.splice(i, 1);
      }
    });

    // !初始化Vuex，自动推断全局变量类型
    let vIndex = that.tabList.findIndex((x) => x.title == "Vuex");
    let vType = "globalData";
    if (that.$store) {
      vType = "vuex";
    } else if (uni.Pinia || that.$pinia) {
      vType = "pinia";
    }
    // console.log("vType", vType);
    that.tabList[vIndex].stateType = vType;
  },
  methods: {
    /**
     * 页面加载事件
     */
    pageOnLoad(options) {
      let that = this;
      that.$nextTick(() => {
        // #ifdef APP-PLUS
        that.panelShow();
        // #endif
      });
      uni.$once("devTools_closeDevToolsPanel", () => {
        that.panelHide();
      });
    },
    /**
     * 加载列表
     */
    async getPage() {
      let that = this;
      const index = Number(that.tabIndex);
      let item = that.tabList[index];
      if (item.isRefreshing) return;

      await that.awaitNextTick();

      if (item.title == "Storage") {
        that.refreshStorage();
      } else if (item.title == "Vuex") {
        that.refreshVuex();
      } else if (item.title == "Info") {
        that.refreshInfo();
      } else if (item.title == "Pages") {
        that.getPages();
      } else if (item.title == "Console") {
        that.getConsole();
      } else if (item.title == "Network") {
        that.getNetwork();
      } else if (item.title == "Logs") {
        that.getLogs();
      } else if (item.title == "Error") {
        that.getError();
      } else if (item.title == "UniBus") {
        that.getUniBus();
      } else if (item.title == "FileSys") {
        that.getDirList();
      } else if (item.title == "Setting") {
        let tabIndex = that.tabList.findIndex((x) => x.title == "Setting");
        that.tabList[tabIndex].isRefreshing = true;
        that.tabList[tabIndex].type = "loading";
        that.$refs.settingView.getPage();
        setTimeout(() => {
          that.tabList[tabIndex].isRefreshing = false;
          that.tabList[tabIndex].refreshType = "success";
          that.tabList[tabIndex].type = "success";
          setTimeout(() => {
            that.tabList[tabIndex].refreshType = "waitRelease";
          }, 1000);
        }, 500);
      }
      that.tabList[index].hasLoad = true;
    },
    /**
     * 等待渲染完成
     */
    awaitNextTick() {
      let that = this;
      return new Promise((yes) => {
        // #ifdef APP-PLUS
        setTimeout(() => {
          yes();
        }, 200);
        // #endif
        // #ifndef APP-PLUS
        that.$nextTick(() => {
          setTimeout(() => {
            yes();
          }, 200);
        });
        // #endif
      });
    },
    /**
     * 隐藏弹窗
     */
    hide() {
      init.hide();
    },
    /**
     * 下拉刷新事件
     */
    onrefresh() {
      if (!this.tabList[this.tabIndex].canRefreshing || this.tabList[this.tabIndex].type == "loading") return false;
      this.getPage(true);
    },
    /**
     * 下拉过程触发
     */
    onpullingdown(args) {
      let e = args.event;
      if (this.tabList[this.tabIndex].refreshType == "refreshing") return false;
      if (e.pullingDistance > e.viewHeight) {
        this.tabList[this.tabIndex].refreshType = "waitRelease";
      } else {
        this.tabList[this.tabIndex].refreshType = "waitPullUp";
      }
    },
    /**
     * 刷新缓存数据
     */
    refreshStorage() {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "Storage");
      that.tabList[tabIndex].isRefreshing = true;
      that.tabList[tabIndex].refreshType = "refreshing";
      that.$refs.storageList.getData(that.tabList[tabIndex].storageType);

      setTimeout(() => {
        that.tabList[tabIndex].isRefreshing = false;
        that.tabList[tabIndex].refreshType = "success";

        setTimeout(() => {
          that.tabList[tabIndex].refreshType = "waitRelease";
        }, 1000);
      }, 500);
    },
    /**
     * 刷新vuex数据
     */
    refreshVuex() {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "Vuex");
      that.tabList[tabIndex].isRefreshing = true;
      that.tabList[tabIndex].refreshType = "refreshing";
      that.$refs.vuexList.getData();

      setTimeout(() => {
        that.tabList[tabIndex].isRefreshing = false;
        that.tabList[tabIndex].refreshType = "success";

        setTimeout(() => {
          that.tabList[tabIndex].refreshType = "waitRelease";
        }, 1000);
      }, 500);
    },
    /**
     * 刷新pages
     */
    getPages() {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "Pages");
      that.tabList[tabIndex].isRefreshing = true;
      that.tabList[tabIndex].refreshType = "refreshing";
      that.tabList[tabIndex].data = [];

      that.$refs.pages.getData();

      let data = devCache.get("pageCount");
      if (!data) data = [];

      data = data.map((x) => {
        x.timeCount = getTime(x.activeTimeCount);
        return x;
      });

      let onlineList = devCache.get("dayOnline");
      if (!onlineList) onlineList = [];
      onlineList = onlineList.map((x) => {
        x.timeCount = getTime(x.activeTimeCount);
        x.page = x.page.map((v) => {
          v.timeCount = getTime(v.t);
          return v;
        });
        return x;
      });

      let pages = [];
      // #ifdef H5 || APP-PLUS
      try {
        pages = __uniRoutes.map((item) => {
          if (item.alias) {
            item.path = item.alias;
          }
          return item;
        });
      } catch (error) {
        pages = [];
      }
      // #endif
      // #ifdef MP-WEIXIN
      try {
        let wxPages = __wxConfig.pages;
        pages = wxPages.map((item) => {
          return {
            path: "/" + item,
          };
        });
      } catch (error) {
        pages = [];
      }
      // #endif

      setTimeout(() => {
        that.tabList[tabIndex].data = data;
        that.tabList[tabIndex].routeList = pages;
        that.tabList[tabIndex].dayOnlineList = onlineList;
        that.tabList[tabIndex].refreshType = "success";
        that.tabList[tabIndex].isRefreshing = false;
        setTimeout(() => {
          that.tabList[tabIndex].refreshType = "waitRelease";
        }, 1000);
      }, 500);
    },
    /**
     * 改变pages列表展示状态
     */
    pagesShowChange(key) {
      this.tabList[this.tabIndex][key] = !this.tabList[this.tabIndex][key];
    },
    /**
     * 打开在线统计详情弹窗
     */
    showOnlineDetailsDialog(item) {
      this.$refs.dayOnlinePageList.show(item);
    },
    /**
     * 刷新info
     */
    refreshInfo() {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "Info");
      that.tabList[tabIndex].isRefreshing = true;
      that.tabList[tabIndex].isRefreshing = true;
      that.tabList[tabIndex].refreshType = "refreshing";
      that.$refs.infoList.getData();

      setTimeout(() => {
        that.tabList[tabIndex].isRefreshing = false;
        that.tabList[tabIndex].refreshType = "success";

        setTimeout(() => {
          that.tabList[tabIndex].refreshType = "waitRelease";
        }, 1000);
      }, 500);
    },
    /**
     * 加载数据
     */
    getConsole() {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "Console");
      that.tabList[tabIndex].isRefreshing = true;
      that.tabList[tabIndex].type = "loading";
      let data = devCache.get("console");
      if (!data) data = [];
      data = data.map((item) => {
        // item.date = timeFormat(item.time);
        item.date = timeFromNow(item.time);
        return item;
      });
      let filterType = that.tabList[tabIndex].filterType;
      if (filterType != "") {
        data = data.filter((x) => x.type == filterType);
      }
      if (data.length > 30 && that.tabList[tabIndex].isLongList && !that.tabList[tabIndex].isLoadAll) {
        data.splice(30, data.length - 1);
      }
      that.tabList[tabIndex].data = data;

      setTimeout(() => {
        that.tabList[tabIndex].refreshType = "success";
        that.tabList[tabIndex].isRefreshing = false;
        that.tabList[tabIndex].type = "success";
        setTimeout(() => {
          that.tabList[tabIndex].refreshType = "waitRelease";
        }, 1000);
      }, 500);
    },
    /**
     * 加载请求数据
     */
    getNetwork() {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "Network");
      that.tabList[tabIndex].isRefreshing = true;
      that.tabList[tabIndex].type = "loading";

      let data = devCache.get("request");
      if (!data) data = [];
      data = data.map((item) => {
        item.date = timeFromNow(item.sendTime);
        return item;
      });
      let filterType = that.tabList[tabIndex].filterType;
      if (filterType != "") {
        if (filterType == "请求失败") {
          data = data.filter((x) => x.type == 2 || (x.type == 1 && x.responseStatus != 200));
        } else if (filterType == "其他") {
          data = data.filter((x) => x.method != "get" && x.method != "post");
        } else if (filterType == "10s+") {
          data = data.filter((x) => x.type != 0 && x.useTime > 10);
        } else if (filterType == "500KB+") {
          data = data.filter((x) => x.type == 1 && x.responseBodySize > 1024 * 500);
        } else {
          data = data.filter((x) => x.method == filterType);
        }
      }
      if (data.length > 30 && that.tabList[tabIndex].isLongList && !that.tabList[tabIndex].isLoadAll) {
        data.splice(30, data.length - 1);
      }
      that.tabList[tabIndex].data = data;

      setTimeout(() => {
        that.tabList[tabIndex].isRefreshing = false;
        that.tabList[tabIndex].refreshType = "success";
        that.tabList[tabIndex].type = "success";
        setTimeout(() => {
          that.tabList[tabIndex].refreshType = "waitRelease";
        }, 1000);
      }, 500);
    },
    /**
     * 获取日志
     */
    getLogs() {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "Logs");
      that.tabList[tabIndex].isRefreshing = true;
      that.tabList[tabIndex].type = "loading";
      let data = devCache.get("logReport");
      if (!data) data = [];
      data = data.map((x) => {
        x.date = timeFromNow(x.t);
        return x;
      });
      if (data.length > 30 && that.tabList[tabIndex].isLongList && !that.tabList[tabIndex].isLoadAll) {
        data.splice(30, data.length - 1);
      }
      that.tabList[tabIndex].data = data;

      setTimeout(() => {
        that.tabList[tabIndex].isRefreshing = false;
        that.tabList[tabIndex].refreshType = "success";
        that.tabList[tabIndex].type = "success";
        setTimeout(() => {
          that.tabList[tabIndex].refreshType = "waitRelease";
        }, 1000);
      }, 500);
    },
    /**
     * 获取错误列表
     */
    getError() {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "Error");
      that.tabList[tabIndex].isRefreshing = true;
      that.tabList[tabIndex].type = "loading";
      let data = devCache.get("errorReport");
      if (!data) data = [];
      data = data.map((x) => {
        x.date = timeFromNow(x.t);
        return x;
      });
      let filterType = that.tabList[tabIndex].filterType;
      if (filterType != "") {
        data = data.filter((x) => x.type == filterType);
      }
      if (data.length > 30 && that.tabList[tabIndex].isLongList && !that.tabList[tabIndex].isLoadAll) {
        data.splice(30, data.length - 1);
      }
      that.tabList[tabIndex].data = data;

      setTimeout(() => {
        that.tabList[tabIndex].isRefreshing = false;
        that.tabList[tabIndex].refreshType = "success";
        that.tabList[tabIndex].type = "success";
        setTimeout(() => {
          that.tabList[tabIndex].refreshType = "waitRelease";
        }, 1000);
      }, 500);
    },
    /**
     * 加载全部列表
     */
    showListAll() {
      let that = this;
      that.tabList[that.tabIndex].isLoadAll = true;
      that.tabList[that.tabIndex].data = [];
      that.tabList[that.tabIndex].type = "loading";
      that.getPage();
    },
    /**
     * 加载eventBus日志列表
     */
    getUniBus() {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "UniBus");
      that.tabList[tabIndex].isRefreshing = true;
      that.tabList[tabIndex].refreshType = "refreshing";

      let logList = devCache.get("uniBus");
      if (!logList) logList = [];

      let busCount = devCache.get("busCount");
      if (!busCount) busCount = [];

      logList = logList.map((x) => {
        x.date = timeFormat(x.t);
        return x;
      });

      let filterType = that.tabList[tabIndex].filterType;
      if (filterType != "") {
        logList = logList.filter((x) => x.e.indexOf(`${filterType}>`) == 0);
      }

      setTimeout(() => {
        that.tabList[tabIndex].logList = logList;
        that.tabList[tabIndex].countList = busCount;
        that.tabList[tabIndex].refreshType = "success";
        that.tabList[tabIndex].isRefreshing = false;
        setTimeout(() => {
          that.tabList[tabIndex].refreshType = "waitRelease";
        }, 1000);
      }, 500);
    },
    /**
     * 长按BUS事件
     */
    busCountMenu(item) {
      let that = this;

      let menu = [
        {
          text: `复制名称`,
          click() {
            uni.setClipboardData({
              data: item.e,
            });
          },
        },
        {
          text: `复制完整日志`,
          click() {
            uni.setClipboardData({
              data: JSON.stringify(item),
            });
          },
        },
      ];

      uni.showActionSheet({
        itemList: menu.map((x) => x.text),
        success({ tapIndex }) {
          menu[tapIndex].click();
        },
      });
    },
    /**
     * 长按BUS log事件
     */
    busLogMenu(item) {
      let that = this;
      let menu = [
        {
          text: `复制名称`,
          click() {
            uni.setClipboardData({
              data: item.e,
            });
          },
        },
        {
          text: `复制完整日志`,
          click() {
            uni.setClipboardData({
              data: JSON.stringify(item),
            });
          },
        },
      ];
      uni.showActionSheet({
        itemList: menu.map((x) => x.text),
        success({ tapIndex }) {
          menu[tapIndex].click();
        },
      });
    },
    /**
     * 列表过滤类型改变事件
     */
    onFilterTypeChange(type) {
      this.tabList[this.tabIndex].filterType = type;
      this.getPage();
    },
    /**
     * 加载文件列表
     */
    async getDirList() {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "FileSys");
      // #ifndef APP-PLUS || MP-WEIXIN
      if (1) return;
      // #endif

      that.tabList[tabIndex].isRefreshing = true;
      that.tabList[tabIndex].type = "loading";

      let path = "";
      let data = [];
      // #ifdef APP-PLUS
      if (that.tabList[tabIndex].dirType == "PRIVATE_DOC") {
        path = "_doc";
      } else if (that.tabList[tabIndex].dirType == "PRIVATE_WWW") {
        path = "_www";
      } else if (that.tabList[tabIndex].dirType == "PUBLIC_DOCUMENTS") {
        path = "_documents";
      } else if (that.tabList[tabIndex].dirType == "PUBLIC_DOWNLOADS") {
        path = "_downloads";
      }

      if (that.tabList[tabIndex].dirList) {
        that.tabList[tabIndex].dirList.forEach((item) => {
          path = path + "/" + item;
        });
      }

      data = await dirReader.getDirFileList(path);

      // #endif

      // #ifdef MP-WEIXIN
      let fs = wx.getFileSystemManager();
      path = wx.env.USER_DATA_PATH;
      if (that.tabList[tabIndex].dirList) {
        that.tabList[tabIndex].dirList.forEach((item) => {
          path = path + "/" + item;
        });
      }
      let fileList = [];
      let dirList = [];
      let list = fs.readdirSync(path + "/");
      for (let i = 0; i < list.length; i++) {
        let name = list[i];
        let stats = fs.statSync(path + "/" + name);
        let row = {
          type: stats.isFile() ? "file" : "dir",
          size: stats.size,
          time: stats.lastModifiedTime,
          name,
          fileType: name.split(".").pop(),
        };
        if (stats.isFile()) {
          fileList.push(row);
        } else {
          dirList.push(row);
        }
      }
      data = [...dirList, ...fileList];
      // #endif

      data = data.map((x) => {
        x.date = timeFormat(x.time, "yyyy-mm-dd hh:MM");
        x.sizeText = fileSize.getByteSize(x.size);
        x.icon = x.type == "dir" ? "/devTools/page/static/fileSys/wenjianjia.png" : dirReader.getFileIcon(x.fileType);
        return x;
      });

      if (that.tabList[tabIndex].dirList.length > 0) {
        data.unshift({
          type: "back",
          name: "返回上一级",
        });
      }

      that.tabList[tabIndex].data = data;

      setTimeout(() => {
        that.tabList[tabIndex].isRefreshing = false;
        that.tabList[tabIndex].refreshType = "success";
        that.tabList[tabIndex].type = "success";
        setTimeout(() => {
          that.tabList[tabIndex].refreshType = "waitRelease";
        }, 1000);
      }, 500);
    },
    /**
     * 打开文件夹
     */
    goChildDir(dirName) {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "FileSys");
      if (typeof dirName == "string" && dirName.indexOf("_goIndex_") == 0) {
        let i = Number(dirName.replace("_goIndex_", ""));
        that.tabList[tabIndex].dirList.splice(i, 99999);
      } else if (dirName == "__back__") {
        if (that.tabList[tabIndex].dirList.length > 0) {
          that.tabList[tabIndex].dirList.splice(that.tabList[tabIndex].dirList.length - 1, 1);
        }
      } else {
        that.tabList[tabIndex].dirList.push(dirName);
      }
      that.getPage();
    },
    /**
     * 更改文件管理器地址
     */
    changeFileDirType(type) {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "FileSys");
      this.tabList[tabIndex].dirType = type;
      this.tabList[tabIndex].dirList = [];
      this.tabList[tabIndex].data = [];
      this.getPage();
    },
    /**
     * 编辑文件夹或创建文件夹
     */
    editDirName(options) {
      this.$refs.createDir.show(options);
    },
    /**
     * 更改缓存类型
     */
    changeStorageType(type) {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "Storage");
      this.tabList[tabIndex].storageType = type;
      this.getPage();
    },
    /**
     * 运行js代码
     */
    runJs({ code, type }) {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "JsRunner");
      let id = new Date().getTime() + "_" + Math.random();
      this.tabList[tabIndex].data.push({
        id,
        code,
        result: "",
        isEnd: false,
      });
      let logIndex = this.tabList[tabIndex].data.findIndex((x) => x.id == id);
      let context;
      try {
        // #ifdef H5
        context = window;
        // #endif
        // #ifdef APP-PLUS
        context = globalThis;
        // #endif
      } catch (error) {}
      let result = undefined;
      uni.hideKeyboard();
      if (type == "h5" || type == "nvue") {
        try {
          let fun = ("ev" + "__混淆__" + "al").replace("__混淆__", "");
          if (context && context[fun]) {
            result = context[fun](code);
          } else {
            result = "当前环境不支持运行js!";
          }
        } catch (error) {
          if (error && error.message) {
            result = error.message;
          }
        }
      } else {
        setTimeout(() => {
          try {
            uni.$once("devTools_jsRunnerCallback", (result) => {
              console.log("result", result);
              this.$set(this.tabList[this.tabIndex].data[logIndex], "result", result);
              this.$set(this.tabList[this.tabIndex].data[logIndex], "isEnd", true);
              this.$refs.mobileSwiperScroll.scrollToBottom();
            });
            uni.$emit("devTools_jsRunner", code);
          } catch (error) {}
        }, 1);
      }

      let his = devCache.get("codeRunHis");
      if (!his) his = [];
      let i = his.indexOf(code);
      if (i > -1) {
        his.splice(i, 1);
      }
      his.unshift(code);
      if (his.length > 100) {
        his.splice(100, 9999999);
      }
      devCache.set("codeRunHis", his);

      this.$set(this.tabList[this.tabIndex].data[logIndex], "result", result);
      this.$set(this.tabList[this.tabIndex].data[logIndex], "isEnd", true);
      this.$refs.mobileSwiperScroll.scrollToBottom();
    },
    /**
     * 清空js运行记录
     */
    emptyCodeHis() {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "JsRunner");
      uni.showToast({
        title: "清空成功！",
        icon: "success",
      });
      that.tabList[tabIndex].data = [];
    },
    /**
     * Vuex变量类型改变事件
     */
    changeStateType(type) {
      let that = this;
      let tabIndex = that.tabList.findIndex((x) => x.title == "Vuex");
      this.tabList[tabIndex].stateType = type;
      this.getPage();
    },
  },
};
</script>
<style lang="scss" scoped>
view,
text {
  box-sizing: border-box;
}

.devTools {
  /* #ifdef APP-PLUS */
  flex: 1;
  /* #endif */
  /* #ifndef APP-PLUS */
  height: 100vh;
  /* #endif */
  width: 750rpx;
  position: relative;

  .mask {
    position: fixed;
    z-index: 1;
    width: 750rpx;
    flex: 1;
    /* #ifndef APP-PLUS */
    height: 100vh;
    /* #endif */
    background-color: rgba(0, 0, 0, 0.3);
    opacity: 0;
  }
  .panel {
    position: fixed;
    z-index: 2;
    bottom: 0px;
    left: 0px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    width: 750rpx;
    color: #333;
    /* #ifdef APP-PLUS */
    border-radius: 20rpx 20rpx 0 0;
    /* #endif */
    .head {
      width: 750rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 80rpx;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      .tabList {
        height: 80rpx;
        width: 670rpx;
        display: flex;
        flex-direction: row;
        white-space: nowrap;
        &.tab-h5 {
          width: 750rpx !important;
        }
        .uni-scroll-view-content {
          display: flex !important;
          flex-direction: row !important;
        }
        .tabItem {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          height: 80rpx;
          padding: 0 20rpx;
          min-width: 90rpx;
          position: relative;
          .tabText {
            font-size: 28rpx;
            color: #888;
            line-height: 80rpx;
          }
          .tabText.active {
            font-size: 28rpx;
            color: #ff2d55;
            font-weight: bold;
          }
          .tabLine {
            position: absolute;
            bottom: -1px;
            height: 2px;
            width: 100rpx;
            background-color: #ff2d55;
          }
        }
      }
      .close {
        height: 80rpx;
        width: 80rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: relative;
        .icon {
          font-size: 40rpx;
          line-height: 40rpx;
          text-align: center;
          color: #ff2d55;
        }
        .line {
          position: absolute;
          left: 0;
          height: 40rpx;
          width: 1px;
          background-color: rgba(0, 0, 0, 0.05);
        }
      }
    }
  }
}
.cellDivisionLine {
  height: 1px;
  width: 750rpx;
  background-color: rgba(0, 0, 0, 0.1);
}

.navbar {
  position: fixed;
  background-color: #fff;
  width: 750rpx;
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  .navbarBody {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: #333;
    width: 710rpx;
    margin-left: 20rpx;
    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 26rpx;
      line-height: 26rpx;
      image {
        transform: rotate(-90deg);
        width: 30rpx;
        height: 30rpx;
      }
    }
    .right {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 26rpx;
      line-height: 26rpx;
      color: #ff2d55;
      image {
        width: 30rpx;
        height: 30rpx;
        margin-left: 5rpx;
      }
      .refreshing {
        color: #aaa !important;
      }
    }
  }
}
.navbarEmpty {
  position: fixed;
}
.loadAll:active {
  background-color: rgba(0, 0, 0, 0.03);
}
.loadAll {
  width: 750rpx;
  height: 80rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .loadAllFold {
    width: 30rpx;
    height: 30rpx;
  }
  .loadAllText {
    font-size: 26rpx;
    color: #333;
    margin: 0 10rpx;
  }
}
.cellDivisionLine {
  height: 1px;
  width: 750rpx;
  background-color: rgba(0, 0, 0, 0.1);
}
.cellDivisionLine {
  height: 1px;
  width: 750rpx;
  background-color: rgba(0, 0, 0, 0.1);
}
.devEmpty {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 200rpx;
  width: 750rpx;
  .devEmptyText {
    font-size: 26rpx;
    color: #888;
    line-height: 26rpx;
  }
}
.eventItem {
  display: flex;
  flex-direction: column;
  width: 750rpx;
  padding: 10rpx 20rpx;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
  .eventName {
    font-size: 20rpx;
    color: #333;
  }
  .eventCount {
    margin-top: 4rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .eventCountItem {
      width: 170rpx;
      max-width: 170rpx;
      font-size: 20rpx;
      color: #333;
    }
  }
}
.eventLogItem {
  display: flex;
  flex-direction: column;
  width: 750rpx;
  padding: 10rpx 20rpx;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
  .logText {
    font-size: 20rpx;
    color: #333;
  }
  .logTime {
    font-size: 20rpx;
    color: #999;
  }
}
.listCenterView {
  width: 750rpx;
  min-height: 200rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .listCenterText {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
