<template>
	<tm-app>
		<tm-sheet>
			<tm-text
				:font-size="24"
				_class="text-weight-b"
				label="这里只展示部分，更多请见Echarts官网示例，官网所有示例均可用。为了包大小可以自行裁剪。
            以下示例，为官网复制过来，未作任何调试，因此可能样例中的属性未按照手机端调整。
            同时这个组件也是适配了PC端的。在PC页面也可以使用。
            "
			></tm-text>
		</tm-sheet>
		<tm-chart :height="600" @onInit="chartInit"></tm-chart>
	</tm-app>
</template>
<script lang="ts" setup>
/**
 * 由于采用了es6 import，所以按需裁剪变得更为简单，无需去官网下载压缩包，想要用到什么就导入什么。
 * 按需裁剪包大小见官网配置：https://echarts.apache.org/zh/api.html#echarts.use
 */
import { ref, getCurrentInstance, onMounted } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import tmApp from '@/tmui/components/tm-app/tm-app.vue'
import tmSheet from '@/tmui/components/tm-sheet/tm-sheet.vue'
import tmText from '@/tmui/components/tm-text/tm-text.vue'
import tmChart from '@/tmui/components/tm-chart/tm-chart.vue'
import { ECharts } from 'echarts'
import { chartdata } from './chartdata'
const dkey = ref('')
onLoad((obj: any) => {
	if (obj?.key !== '' && typeof obj?.key != 'undefined') {
		dkey.value = obj?.key ?? 'lineChart'
	}
})
function chartInit(chart: ECharts) {
	chart.setOption(chartdata[dkey.value])
}
</script>
