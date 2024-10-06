<template>
	<view class="storageList">
		<objectAnalysis
			v-if="isLoaded"
			:data="storageData"
			:isOpenFirst="true"
			:width="710"
			:isDiyMenu="true"
			@diyMenu="diyMenu"
			ref="objectAnalysis"
		/>
		<view v-else class="dataLoading">
			<text class="status">加载中</text>
		</view>

		<text v-if="isLoaded" class="tipsText"> 长按非对象类型的数据可编辑 </text>
	</view>
</template>
<script>
import objectAnalysis from './objectAnalysis.vue'
export default {
	components: {
		objectAnalysis
	},
	props: {
		/**
		 * 全局变量类型
		 */
		stateType: {
			type: String,
			default: 'vuex'
		}
	},
	data() {
		return {
			/**
			 * 是否完成加载
			 */
			isLoaded: false,
			/**
			 * 缓存里的数据
			 */
			storageData: {}
		}
	},
	methods: {
		/**
		 * 加载数据
		 */
		getData() {
			let that = this
			let data = {}
			if (that.stateType == 'vuex') {
				try {
					data = JSON.parse(JSON.stringify(that.$store.state))
				} catch (error) {}
			} else if (that.stateType == 'pinia') {
				try {
					if (uni.Pinia) {
						data = JSON.parse(JSON.stringify(uni.Pinia.getActivePinia().state.value))
					} else if (that.$pinia) {
						data = JSON.parse(JSON.stringify(that.$pinia.state.value))
					}
				} catch (error) {}
			} else if (that.stateType == 'globalData') {
				try {
					data = JSON.parse(JSON.stringify(getApp().globalData))
				} catch (error) {}
			}
			that.isLoaded = false
			setTimeout(() => {
				that.storageData = data
				that.isLoaded = true
			}, 500)
		},
		/**
		 * 自定义长按事件
		 */
		diyMenu({ item, index }) {
			let that = this

			let menu = [
				{
					text: `复制键(key)`,
					click() {
						uni.setClipboardData({
							data: that.toString(item.k)
						})
					}
				},
				{
					text: `复制值(value)`,
					click() {
						uni.setClipboardData({
							data: that.toString(item.v)
						})
					}
				}
			]

			if (typeof item.v != 'object') {
				menu.push({
					text: '编辑值',
					click() {
						let keyList = that.$refs.objectAnalysis.getFaKeyList(item.i)
						let title = ''
						if (keyList.length == 0) {
							title = 'key'
						} else {
							keyList.map((x) => {
								title = (title == '' ? '' : title + '.') + x
							})
						}

						let isBool = typeof item.v == 'boolean'
						if (isBool) {
							item.v = item.v ? 'true' : 'false'
						}
						if (item.v === undefined || item.v === null) {
							item.v = ''
						}

						uni.$emit('devTools_showEditDialog', {
							title,
							value: item.v
						})

						uni.$on('devTools_editDialogClose', () => {
							uni.$off('devTools_editDialogSaveSuccess')
							uni.$off('devTools_editDialogClose')
						})

						uni.$on('devTools_editDialogSaveSuccess', (val) => {
							uni.$off('devTools_editDialogSaveSuccess')
							uni.$off('devTools_editDialogClose')
							if (isBool && (val == 'true' || val == 'false')) {
								val = val == 'true'
							}
							let data
							if (that.stateType == 'vuex') {
								data = that.$store.state
							} else if (that.stateType == 'pinia') {
								if (uni.Pinia) {
									data = uni.Pinia.getActivePinia().state.value
								} else if (that.$pinia) {
									data = that.$pinia.state.value
								}
							} else if (that.stateType == 'globalData') {
								data = getApp().globalData
							}
							let lastKey = keyList.pop()
							keyList.map((x) => {
								data = data[x]
							})
							that.$set(data, lastKey, val)
							that.getData()
						})
					}
				})
			}

			uni.showActionSheet({
				itemList: menu.map((x) => x.text),
				success({ tapIndex }) {
					menu[tapIndex].click()
				}
			})
		},
		getFaKeyList() {}
	}
}
</script>
<style lang="scss" scoped>
.storageList {
	padding: 20rpx;
	width: 750rpx;
}
.dataLoading {
	width: 750rpx;
	height: 400rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	.status {
		font-size: 20rpx;
		color: #888;
		line-height: 20rpx;
	}
}
.tipsText {
	font-size: 20rpx;
	color: #8799a3;
	margin-top: 40rpx;
}
</style>
