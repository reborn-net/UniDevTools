<template>
	<tm-app ref="app">
		<demoIndex />

		<view>
			<view>
				<tm-sheet
					:text="false"
					:linear="store.tmStore.dark ? '' : 'bottom'"
					:linear-color="headerBgColor"
					:margin="[0, 0]"
					:followTheme="true"
				>
					<view :style="{ height: sysinfo.statusBarHeight + 'px' }"></view>
					<view class="flex-row flex-row-center-start pb-10">
						<tm-image :width="108" :height="67.5" :src="logoimg"></tm-image>
						<view class="pl-16 flex-1" style="width: 0px">
							<tm-text :folow-theme="false" _class="text-weight-b" :font-size="36" :label="tmuiVer"></tm-text>
							<tm-text :folow-theme="false" _class="opacity-6" :label="language('index.search.subtext')"></tm-text>
						</view>
					</view>

					<view class="px-0 pt-12">
						<tm-input
							focus-color="white"
							:text="false"
							color="white"
							:round="16"
							:transprent="store.tmStore.dark"
							:placeholder="language('index.search.tips')"
							showClear
							prefix="tmicon-search"
							v-model="str"
							@confirm="search"
						></tm-input>
					</view>
				</tm-sheet>
			</view>
			<tm-sheet :shadow="6" :margin="[24]" :padding="[24]" :round="6">
				<view class="flex flex-row flex-around">
					<tm-button
						:round="8"
						:width="100"
						color="yellow"
						size="small"
						@click="setTheme('yellow')"
						:label="language('index.com.themeGreen')"
					></tm-button>
					<tm-button
						:round="8"
						:width="100"
						color="blue"
						size="small"
						@click="setTheme('blue')"
						:label="language('index.com.themeBlue')"
					></tm-button>
					<tm-button
						:round="8"
						:width="100"
						color="red"
						size="small"
						@click="setTheme('red')"
						:label="language('index.com.themeRed')"
					></tm-button>
					<tm-button
						:round="8"
						color="brown"
						:width="100"
						size="small"
						@click="showCustom = true"
						:label="language('index.com.themeCustText')"
					>
					</tm-button>
					<tm-button :round="8" :width="160" size="small" @click="setTheme('')" :label="language('index.com.themeDefault')"> </tm-button>
				</view>
			</tm-sheet>

			<view class="mx-24">
				<tm-row :width="702" :column="3" :round="6" :transprent="false">
					<tm-col :transprent="true" @click="toLinks(item.url)" :height="190" v-for="(item, index) in category" :key="index">
						<tm-icon :color="item.color" _class="pb-10" :font-size="52" :name="item.icon"></tm-icon>
						<tm-text :font-size="28" _class="text-weight-b" :label="language(item.title)"></tm-text>
						<tm-text color="grey" :font-size="22" :label="language(item.label)"></tm-text>
					</tm-col>
				</tm-row>
			</view>

			<view class="py-24">
				<!-- #ifdef MP-WEIXIN -->
				<tm-cell
					url="../wxaccount/user"
					:margin="[24, 0, 24, 16]"
					showAvatar
					:round="4"
					:titleFontSize="30"
					:title="language('index.com.love')"
					label="可登录模板市场"
					:rightText="language('index.com.loveSub')"
				>
					<template v-slot:avatar>
						<tm-icon color="orange" :font-size="38" name="tmicon-heart-fill"></tm-icon>
					</template>
				</tm-cell>
				<!-- #endif -->
				<tm-cell
					:margin="[24, 0, 24, 16]"
					@click="seLocal"
					showAvatar
					:round="4"
					:titleFontSize="30"
					:title="language('index.com.setLocal')"
					:rightText="language('language')"
				>
					<template v-slot:avatar>
						<tm-icon color="primary" :font-size="38" name="tmicon-resource"></tm-icon>
					</template>
				</tm-cell>
				<tm-cell :margin="[24, 0]" showAvatar :round="4" :titleFontSize="30" :title="language('index.com.autoDark')">
					<template v-slot:avatar>
						<tm-icon color="pink" :font-size="38" name="tmicon-ios-color-palette"></tm-icon>
					</template>
					<template v-slot:right>
						<tm-checkbox @change="autoDarkChange" :round="24" v-model="autoDark"></tm-checkbox>
					</template>
				</tm-cell>
			</view>

			<!-- #ifdef MP-WEIXIN -->
			<view class="px-24">
				<ad unit-id="adunit-8077b1c992ae8c8b"></ad>
			</view>
			<!-- #endif -->

			<view class="py-32 flex flex-row flex-row-center-center">
				<view style="width: 300rpx">
					<tm-divider color="grey-2" :label="language('index.com.bottom')"></tm-divider>
				</view>
			</view>
		</view>

		<view style="height: 100px"></view>

		<!-- <tm-float-button @click="onChangeDark" :btn="{ icon: 'tmicon-ios-sunny' }"> </tm-float-button> -->

		<tm-message ref="msg"></tm-message>
		<tm-drawer v-model:show="showCustom" placement="center" hideHeader :height="450" :width="600">
			<view class="pa-32 flex flex-col">
				<view class="text-align-center py-24">
					<tm-text _class="text-weight-b" :font-size="32" label="自定义主题"></tm-text>
				</view>
				<tm-input
					:round="16"
					prefixLabel="颜色值"
					placeholder="请输入颜色值,比如:#FF00FF"
					:border="1"
					showClear
					v-model="showCustomColor"
				></tm-input>
				<tm-input
					:round="16"
					prefixLabel="颜色名称"
					:margin="[0, 24]"
					placeholder="字母,如:darkGreen"
					:border="1"
					showClear
					v-model="showCustomName"
				></tm-input>
				<tm-button :round="16" @click="changeCustomColor" block label="确认切换"></tm-button>
			</view>
		</tm-drawer>
	</tm-app>
</template>

<script lang="ts" setup>
import demoIndex from '../../demo/index.vue'

import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
counter.count++
// 自动补全！ ✨
counter.$patch({ count: counter.count + 1 })
// 或使用 action 代替
counter.increment()

function add() {
	counter.count++
}

import { ref, getCurrentInstance, computed, inject } from 'vue'
import { onShow, onLoad, onInit } from '@dcloudio/uni-app'
import { language } from '@/tmui/tool/lib/language'
import { useTmpiniaStore } from '@/tmui/tool/lib/tmpinia'
import tmApp from '@/tmui/components/tm-app/tm-app.vue'
import tmSheet from '@/tmui/components/tm-sheet/tm-sheet.vue'
import tmButton from '@/tmui/components/tm-button/tm-button.vue'
import tmFloatButton from '@/tmui/components/tm-float-button/tm-float-button.vue'
import tmMessage from '@/tmui/components/tm-message/tm-message.vue'
import tmInput from '@/tmui/components/tm-input/tm-input.vue'
import tmDivider from '@/tmui/components/tm-divider/tm-divider.vue'
import tmIcon from '@/tmui/components/tm-icon/tm-icon.vue'
import tmDrawer from '@/tmui/components/tm-drawer/tm-drawer.vue'
import tmCheckbox from '@/tmui/components/tm-checkbox/tm-checkbox.vue'
import tmSticky from '@/tmui/components/tm-sticky/tm-sticky.vue'
import tmRow from '@/tmui/components/tm-row/tm-row.vue'
import tmCol from '@/tmui/components/tm-col/tm-col.vue'
import tmImage from '@/tmui/components/tm-image/tm-image.vue'
import tmText from '@/tmui/components/tm-text/tm-text.vue'
import tmCell from '@/tmui/components/tm-cell/tm-cell.vue'
import logoimg from '@/static/logo.png'
import { text } from 'stream/consumers'

const proxy = getCurrentInstance()?.proxy ?? null
const proxyw = getCurrentInstance()

const store = useTmpiniaStore()
const app = ref<InstanceType<typeof tmApp> | null>(null)
const msg = ref<InstanceType<typeof tmMessage> | null>(null)
const showf = ref(false)
const sysinfo = uni.$tm.u.getWindow()
const str = ref('')
const showCustomColor = ref('#60ab41')
const showCustomName = ref('darkGreen')
const showCustom = ref(false)
const autoDark = ref(store.tmuiConfig.autoDark)
const headerBgColor = computed(() => {
	if (store.tmStore.dark) {
		return []
	}
	return store.tmStore.color ? [] : ['#f5f5f5', '#f5f5f5']
})
const tmuiVer = 'TMUI 3.1.1'

const category = [
	{ url: '../changyong/index', color: 'primary', icon: 'tmicon-layergroup-fill', title: 'index.com.tongyong', label: 'index.com.tongyongSub' },

	{ url: '../layout/index', color: 'yellow', icon: 'tmicon-map-fill', title: 'index.com.row', label: 'index.com.rowSub' },

	{ url: '../showdata/index', color: 'pink', icon: 'tmicon-paperplane-fill', title: 'index.com.show', label: 'index.com.showSub' },

	{ url: '../form/index', color: 'cyan', icon: 'tmicon-commentdots-fill', title: 'index.com.form', label: 'index.com.formSub' },

	{ url: '../fankui/index', color: 'red', icon: 'tmicon-lightbulb-fill', title: 'index.com.fd', label: 'index.com.fdSub' },

	{ url: '../daohang/index', color: 'orange', icon: 'tmicon-flag-fill', title: 'index.com.nav', label: 'index.com.navSub' },

	{ url: '../yewu/index', color: 'purple', icon: 'tmicon-box-fill', title: 'index.com.yewu', label: 'index.com.yewuSub' },

	{ url: '../other/index', color: 'blue-grey', icon: 'tmicon-smile-fill', title: 'index.com.other', label: 'index.com.otherSub' },

	{ url: '../pag/index', color: 'indigo', icon: 'tmicon-ios-ice-cream', title: 'index.com.pag', label: 'index.com.pagSub' },

	{ url: '../render/index', color: 'lime', icon: 'tmicon-ios-rose', title: 'index.com.render', label: 'index.com.renderSub' },

	{ url: '../chart/index', color: 'brown', icon: 'tmicon-borderbottom-fill', title: 'index.com.tubiao', label: 'index.com.tubiaoSub' }
]
function toLinks(url: string) {
	uni.navigateTo({ url: url })
}
function onChangeDark() {
	app.value?.setDark()
}
function search() {
	if (str.value.trim() === '') {
		msg.value?.show({
			model: 'error',
			text: '不能为空',
			mask: true
		})
		return
	}
	uni.navigateTo({
		url: 'search?key=' + str.value
	})
}

function seLocal() {
	if (language('language') == 'English-US') {
		uni.setLocale('zh-Hans')
	} else {
		uni.setLocale('en')
	}
}

function setTheme(colorname: string) {
	app.value?.setTheme(colorname)
}

function changeCustomColor() {
	if (!showCustomColor.value || !showCustomName.value) {
		msg.value?.show({
			model: 'error',
			text: '必填内容',
			mask: true
		})
		return
	}
	showCustom.value = false
	store.setTmVuetifyAddTheme(showCustomName.value, showCustomColor.value)
}

onLoad(() => {
	// #ifdef MP-WEIXIN

	// 在页面中定义插屏广告
	let interstitialAd = null

	// 在页面onLoad回调事件中创建插屏广告实例
	if (wx.createInterstitialAd) {
		interstitialAd = wx.createInterstitialAd({
			adUnitId: 'adunit-197d1e1914ce88ec'
		})
		interstitialAd.onLoad(() => {})
		interstitialAd.onError((err) => {})
		interstitialAd.onClose(() => {})
	}
	// 在适合的场景显示插屏广告
	if (interstitialAd) {
		interstitialAd.show().catch((err) => {
			console.error(err)
		})
	}

	// #endif
})
function test() {
	console.log(99)
}
function autoDarkChange(e: boolean) {
	store.setTmAutoDark(e)

	// store.setTmVuetifyDark(e)
	autoDark.value = e
}
function sendReq() {
	uni.request({
		url: 'https://www.baidu.com/?q=test'
	})
	uni.showToast({
		title: '操作成功！',
		icon: 'success'
	})
}
</script>
