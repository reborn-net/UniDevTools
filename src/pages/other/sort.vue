<template>
	<tm-app>
		<tm-sheet :width="662">
			<tm-text
				label="宫格排序，在nvue上： 截止3.6.18 uni sdk 的movable有bug,具体来说是动态修改宽和高时，可移动范围会跑上面去。 理论上是支持nvue，只有当uni修复此bug才可使用，否则，请使用vue页面。"
			></tm-text>
			<tm-divider></tm-divider>
		</tm-sheet>
		<tm-sort @end="enddrage" :list="testList" :height="460" :item-height="150"></tm-sort>
	</tm-app>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import tmApp from '@/tmui/components/tm-app/tm-app.vue'
import tmSheet from '@/tmui/components/tm-sheet/tm-sheet.vue'
import tmText from '@/tmui/components/tm-text/tm-text.vue'
import tmRadio from '@/tmui/components/tm-radio/tm-radio.vue'
import tmRadioGroup from '@/tmui/components/tm-radio-group/tm-radio-group.vue'
import tmDivider from '@/tmui/components/tm-divider/tm-divider.vue'
import tmSort from '@/tmui/components/tm-sort/tm-sort.vue'
const testList: Ref<object[]> = ref([])
testList.value = [
	{ icon: 'tmicon-google', text: '谷歌' },
	{ icon: 'tmicon-paypal', text: 'paypal' },
	{ icon: 'tmicon-md-planet', text: '星球' },
	{ icon: 'tmicon-ios-rose', text: '玫瑰花' },
	{ icon: 'tmicon-ios-cafe', text: '咖啡' },
	{ icon: 'tmicon-ios-leaf', text: '绿色健康' },
	{ icon: 'tmicon-ios-umbrella', text: '安全' }
]
function enddrage(newdata: any, olddata: any) {
	console.log('排序后：', newdata, '排序前：', olddata)
}
</script>
