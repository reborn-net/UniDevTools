<template>
	<view class="settingView">
		<view v-if="loading" class="loading">
			<text class="loadingText">加载中</text>
		</view>
		<template v-else>
			<subTitleBar :isOpen="exportIsShow" @click="exportIsShow = !exportIsShow" title="导出全部日志" />
			<template v-if="exportIsShow">
				<view class="delBtn" @click="exportJsonFile">
					<text class="delBtnText">导出日志文件(.json)</text>
				</view>
			</template>
			<view class="divisionLine"></view>

			<subTitleBar :isOpen="cacheListIsShow" title="清空全部缓存" @click="cacheListIsShow = !cacheListIsShow" />
			<template v-if="cacheListIsShow">
				<view v-for="(item, index) in cacheSelectList" :key="index" @click.stop="doSelectCache(index)" class="checkboxItem">
					<checkbox :value="item.check ? '1' : '0'" :checked="item.check" color="#ff2d55" />
					<text
						class="name"
						:style="{
							color: item.count ? '#333' : '#888'
						}"
					>
						{{ item.name }}
					</text>

					<text v-if="item.key == 'file'"></text>
					<text v-else-if="item.count" class="count"> ({{ item.count }}) </text>
					<text v-else class="empty"> (空) </text>
				</view>
				<view class="delBtn" @click="delCache">
					<text class="delBtnText">清空选中</text>
				</view>
			</template>
			<view class="divisionLine"></view>

			<subTitleBar :isOpen="configIsShow" title="DevTools当前配置参数" @click="configIsShow = !configIsShow" />
			<view v-if="configIsShow" class="objectAnalysisView">
				<objectAnalysis :isOpenFirst="true" :data="config" :width="710" />
			</view>
			<view class="divisionLine"></view>

			<subTitleBar :showArrow="false" title="关于" />

			<view class="about">
				<view>
					<text class="row">Copyright©2024 福州重塑网络科技有限公司 前端团队</text>
				</view>
				<view @click="goUrl('https://dev.api0.cn')" style="display: flex; flex-direction: row">
					<text class="row">在线文档：</text>
					<text class="row" style="color: #ff2d55">https://dev.api0.cn</text>
				</view>
				<view>
					<text class="row">当前版本：v{{ config.version }}</text>
				</view>
			</view>

			<view style="height: 100rpx"></view>
		</template>
	</view>
</template>
<script>
import devCache from '../../../core/libs/devCache'
import devOptions from '../../../core/libs/devOptions'
import jsonCompress from '../../../core/libs/jsonCompress'
import appDelDir from '../libs/appDelDir'
import subTitleBar from '../ui/subTitleBar.vue'
import objectAnalysis from './objectAnalysis.vue'
import getRuntimeInfo from '../libs/getRuntimeInfo'
export default {
	components: {
		subTitleBar,
		objectAnalysis
	},
	data() {
		return {
			/**
			 * 是否加载中
			 */
			loading: false,
			/**
			 * 缓存列表是否展示
			 */
			cacheListIsShow: false,
			/**
			 * 缓存列表
			 */
			cacheSelectList: [],
			/**
			 * 配置文件是否显示
			 */
			configIsShow: false,
			/**
			 * 当前配置
			 */
			config: devOptions.getOptions(),
			/**
			 * 是否显示导出日志按钮
			 */
			exportIsShow: false
		}
	},
	methods: {
		/**
		 * 加载页面
		 */
		async getPage() {
			let that = this
			that.loading = true
			that.cacheSelectList = await that.countCache()
			that.loading = false
		},
		/**
		 * 统计缓存信息
		 */
		countCache() {
			let that = this
			return new Promise(async (yes) => {
				let cacheSelectList = []

				// dev 工具日志
				let keys = {
					errorReport: 'Error错误日志',
					console: 'Console打印日志',
					request: 'Request请求日志',
					logReport: 'Logs日志',
					uniBus: 'UniBus函数日志'
				}
				Object.keys(keys).map((key) => {
					let logs = devCache.get(key)
					cacheSelectList.push({
						name: keys[key],
						check: logs.length > 0,
						count: logs.length,
						key
					})
				})
				// #ifdef H5
				let indexDBList = await this.getIndexDBList()
				let cookieLength = document.cookie.split(';').length
				if (document.cookie == '') {
					cookieLength = 0
				}
				// #endif

				cacheSelectList = cacheSelectList.concat([
					that.countStorageCache(),
					// #ifdef H5
					{
						key: 'sessionStorage',
						name: 'SessionStorage临时缓存',
						check: sessionStorage.length > 0,
						count: sessionStorage.length
					},
					// #endif
					// #ifdef APP-PLUS
					{
						key: 'file',
						name: 'FileSys本地文件(_doc)',
						check: false,
						count: '未知 // TODO'
					},
					// #endif
					// #ifdef MP-WEIXIN
					{
						name: 'FileSys本地文件(FileSystemManager)',
						check: false,
						key: 'file',
						count: '未知 // TODO'
					},
					// #endif
					{
						key: 'pageCount',
						name: 'Pages页面停留统计',
						check: devCache.get('pageCount').length > 0,
						count: devCache.get('pageCount').length
					},
					{
						key: 'dayOnline',
						name: 'Pages日活时间统计',
						check: devCache.get('dayOnline').length > 0,
						count: devCache.get('dayOnline').length
					},
					// #ifdef H5
					{
						key: 'cookie',
						name: 'Cookie',
						check: cookieLength > 0,
						count: cookieLength
					},
					{
						key: 'IndexDB',
						name: 'IndexDB',
						check: indexDBList.length > 0,
						count: indexDBList.length
					}
					// #endif
				])

				yes(cacheSelectList)
			})
		},
		/**
		 * 统计本地缓存
		 */
		countStorageCache() {
			let n = 0
			// #ifdef APP-PLUS
			let keys = plus.storage.getAllKeys()
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i]
				if (key.indexOf('devTools_') == 0) {
					// 忽略以 devTools_ 开头的key
					continue
				}
				n++
			}
			// #endif
			// #ifdef H5
			for (let i = 0; i < localStorage.length; i++) {
				let key = localStorage.key(i)
				if (key.indexOf('devTools_') == 0) {
					continue
				}
				n++
			}
			// #endif
			// #ifdef MP
			let keyList = devCache.get('storage')
			if (!keyList) keyList = []
			for (let i = 0; i < keyList.length; i++) {
				const key = keyList[i]
				if (key.indexOf('devTools_') == 0) {
					continue
				}
				n++
			}
			// #endif
			return {
				key: 'localStorage',
				name: 'localStorage本地缓存',
				check: n > 0,
				count: n
			}
		},
		/**
		 * 获取indexDB列表
		 */
		getIndexDBList() {
			return new Promise((yes) => {
				try {
					indexedDB.databases().then((list) => {
						yes(list)
					})
				} catch (error) {
					console.log('getIndexDBList error', error)
					yes([])
				}
			})
		},
		/**
		 * 选择清空的缓存项目
		 */
		doSelectCache(index) {
			this.cacheSelectList[index].check = !this.cacheSelectList[index].check
		},
		/**
		 * 清空缓存
		 */
		delCache() {
			let that = this

			let selectedKey = []
			that.cacheSelectList.map((item) => {
				if (item.check) {
					selectedKey.push(item.key)
				}
			})

			let keyDelFun = {
				errorReport() {
					devCache.set('errorReport', [])
				},
				console() {
					uni.$emit('devTools_delConsoleAll')
				},
				request() {
					uni.$emit('devTools_delNetworkAll')
				},
				logReport() {
					devCache.set('logReport', [])
				},
				uniBus() {
					uni.$emit('devTools_delUniBusAll')
				},
				localStorage() {
					// #ifdef APP-PLUS
					let keys = plus.storage.getAllKeys()
					for (let i = 0; i < keys.length; i++) {
						const key = String(keys[i])
						if (key.indexOf('devTools_') == 0) {
							continue
						}
						uni.removeStorageSync(key)
					}
					// #endif

					// #ifdef H5
					for (let i = 0; i < localStorage.length; i++) {
						let key = String(localStorage.key(i))
						if (key.indexOf('devTools_') == 0) {
							continue
						}
						setTimeout(() => {
							localStorage.removeItem(key)
						}, i * 2 + 1)
					}
					// #endif

					// #ifdef MP
					let keyList = devCache.get('storage')
					if (!keyList) keyList = []
					for (let i = 0; i < keyList.length; i++) {
						const key = keyList[i]
						if (key.indexOf('devTools_') == 0) {
							continue
						}
						uni.removeStorageSync(key)
					}
					// #endif
				},
				sessionStorage() {
					for (let i = 0; i < sessionStorage.length; i++) {
						let key = String(sessionStorage.key(i))
						if (key.indexOf('devTools_') == 0) {
							continue
						}
						sessionStorage.removeItem(key)
					}
				},
				file() {
					// #ifdef APP-PLUS
					appDelDir('_doc/')
					// #endif
					// #ifdef MP-WEIXIN
					let fs = wx.getFileSystemManager()
					fs.rmdir({
						dirPath: wx.env.USER_DATA_PATH + '/',
						recursive: true
					})
					// #endif
				},
				pageCount() {
					devCache.set('pageCount', [])
				},
				dayOnline() {
					devCache.set('dayOnline', [])
				},
				cookie() {
					let keys = []
					document.cookie.split(';').forEach((cookieStr) => {
						const [name, value] = cookieStr.trim().split('=')
						keys.push(name)
					})
					keys.map((k) => {
						document.cookie = `${k}=;expires=` + new Date(new Date().getTime() + 200).toGMTString() + ';path=/'
					})
				},
				IndexDB() {
					indexedDB.databases().then((list) => {
						list.map((item) => {
							indexedDB.deleteDatabase(item.name)
						})
					})
				}
			}

			if (selectedKey.length == 0) {
				return uni.showToast({
					title: '请先勾选需要清空的项目!',
					icon: 'none'
				})
			}
			uni.showLoading({
				title: '清空中...',
				mask: true
			})

			setTimeout(() => {
				uni.hideLoading()
				uni.showToast({
					title: '清空成功！',
					icon: 'success'
				})
				that.getPage()
			}, 5100)

			selectedKey.map((key) => {
				keyDelFun[key]()
			})
		},
		/**
		 * 导出日志文件到json
		 */
		async exportJsonFile() {
			let that = this

			// #ifdef MP
			if (1) {
				uni.showToast({
					title: '小程序平台不支持导出日志，建议直接上传至服务器！',
					icon: 'none'
				})
				return
			}
			// #endif

			uni.showLoading({
				title: '打包中...'
			})

			try {
				let devOp = devOptions.getOptions()
				let waitExportObject = {
					exportOptions: {
						version: devOp.version,
						config: devOp,
						exportTime: new Date().getTime(),
						// #ifdef APP-PLUS
						platform: 'app',
						// #endif
						// #ifdef H5
						platform: 'h5',
						// #endif
						// #ifdef MP
						platform: 'mp',
						// #endif
						// #ifdef MP-WEIXIN
						platform: 'wx',
						// #endif
						// #ifdef MP-QQ
						platform: 'qq'
						// #endif
					},
					error: devCache.get('errorReport'),
					console: devCache.get('console'),
					network: devCache.get('request'),
					pageCount: devCache.get('pageCount'),
					dayOnline: devCache.get('dayOnline'),
					logs: devCache.get('logReport'), // ! 运行日志
					info: await getRuntimeInfo(), // ! 当前运行的系统信息
					uniBus: devCache.get('uniBus'),
					busCount: devCache.get('busCount'),
					storage: {},
					sessionStorage: {},
					cookie: {},
					...that.getCache()
				}

				try {
					if (that.$store.state) {
						waitExportObject.vuex = that.$store.state
					}
				} catch (error) {}
				try {
					if (uni.Pinia) {
						waitExportObject.pinia = uni.Pinia.getActivePinia().state.value
					} else if (that.$pinia.state.value) {
						waitExportObject.pinia = that.$pinia.state.value
					}
				} catch (error) {}
				try {
					if (getApp().globalData) {
						waitExportObject.globalData = getApp().globalData
					}
				} catch (error) {}

				let data = jsonCompress.safeJsonStringify(waitExportObject)
				data = JSON.parse(data)
				data = JSON.stringify(data, null, 2)
				let t = new Date().getTime()
				let exportFileName = `export_devtools_log_${t}.json`

				// #ifdef H5
				const blob = new Blob([data], { type: 'application/json' })
				const url = URL.createObjectURL(blob)
				const a = document.createElement('a')
				a.style = 'display: none'
				a.download = exportFileName
				a.href = url
				document.body.appendChild(a)
				a.click()
				uni.showToast({
					title: '导出成功！',
					icon: 'success'
				})
				// #endif

				// #ifdef APP-PLUS
				plus.io.resolveLocalFileSystemURL(
					'_downloads/',
					(entry) => {
						entry.getFile(
							exportFileName,
							{
								create: true
							},
							(fileEntry) => {
								fileEntry.createWriter((writer) => {
									writer.onwrite = (e) => {
										uni.hideLoading()
										uni.showModal({
											title: '导出成功',
											content: '文件导出成功！已保存至公共下载路径，文件名称：' + exportFileName
										})
									}
									writer.onerror = () => {
										uni.hideLoading()
										uni.showToast({
											title: '日志导出失败！_写入文件失败',
											icon: 'none'
										})
									}
									writer.write(data)
								})
							}
						)
					},
					(err) => {
						console.log('err', err)
						uni.hideLoading()
						uni.showToast({
							title: '文件保存失败！_打开目录失败',
							icon: 'none'
						})
					}
				)
				// #endif

				uni.hideLoading()
			} catch (error) {
				if (error && error.message) {
					console.log('导出失败！', error.message)
				} else {
					console.log('导出失败！', error)
				}

				uni.hideLoading()
				uni.showToast({
					title: '导出失败！',
					icon: 'error'
				})
			}
		},
		/**
		 * 获取缓存数据
		 */
		getCache() {
			let data = {
				storage: {},
				sessionStorage: {},
				cookie: {}
			}

			// #ifdef APP-PLUS
			let keys = plus.storage.getAllKeys()
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i]
				if (key.indexOf('devTools_') == 0) {
					// 忽略以 devTools_ 开头的key
					continue
				}
				data.storage[key] = uni.getStorageSync(key)
			}
			// #endif

			// #ifdef H5

			for (let i = 0; i < localStorage.length; i++) {
				let key = localStorage.key(i)
				if (key.indexOf('devTools_') == 0) {
					continue
				}
				let value = uni.getStorageSync(key)
				data.storage[key] = value
			}

			for (let i = 0; i < sessionStorage.length; i++) {
				let key = sessionStorage.key(i)
				if (key.indexOf('devTools_') == 0) {
					continue
				}
				let value = sessionStorage.getItem(key)
				data.sessionStorage[key] = value
			}

			document.cookie.split(';').forEach((cookieStr) => {
				const [name, value] = cookieStr.trim().split('=')
				data.cookie[name] = value
			})
			// #endif

			// #ifdef MP
			let keyList = devCache.get('storage')
			if (!keyList) keyList = []
			for (let i = 0; i < keyList.length; i++) {
				const key = keyList[i]
				if (key.indexOf('devTools_') == 0) {
					continue
				}
				let value = uni.getStorageSync(key)
				if (value) {
					data.storage[key] = value
				}
			}
			// #endif

			return data
		},
		/**
		 * 跳转指定URL
		 */
		goUrl(url) {
			// #ifdef H5
			window.open(url)
			// #endif
			// #ifdef MP
			uni.setClipboardData({
				data: url
			})
			// #endif
			// #ifdef APP-PLUS
			plus.runtime.openURL(url)
			// #endif
		}
	}
}
</script>
<style lang="scss" scoped>
.settingView {
	display: flex;
	flex-direction: column;
	width: 750rpx;
	.loading {
		width: 750rpx;
		height: 300rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		.loadingText {
			font-size: 24rpx;
			color: #888;
		}
	}
	.divisionLine {
		width: 750rpx;
		height: 1px;
		background-color: rgba(0, 0, 0, 0.1);
	}
	.checkboxItem {
		display: flex;
		flex-direction: row;
		padding: 10rpx 20rpx;
		width: 750rpx;
		align-items: center;
		&:active {
			background-color: rgba(0, 0, 0, 0.05);
		}
		.name {
			font-size: 24rpx;
			margin-left: 5rpx;
		}
		.count {
			font-size: 20rpx;
			margin-left: 10rpx;
			color: #ff2d55;
		}
		.empty {
			font-size: 20rpx;
			margin-left: 10rpx;
			color: #999;
		}
	}
	.delBtn {
		width: 710rpx;
		margin-left: 20rpx;
		border-radius: 20rpx;
		height: 70rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: rgb(255, 45, 85);
		margin-top: 20rpx;
		margin-bottom: 30rpx;
		&:active {
			background-color: rgba(255, 45, 85, 0.8);
		}
		.delBtnText {
			font-size: 24rpx;
			color: #fff;
		}
	}
}
.objectAnalysisView {
	width: 710rpx;
	margin-left: 20rpx;
	margin-bottom: 20rpx;
}
.about {
	width: 710rpx;
	margin-left: 20rpx;
	display: flex;
	flex-direction: column;
	.row {
		margin-bottom: 10rpx;
		font-size: 24rpx;
		color: #888;
	}
}
</style>
