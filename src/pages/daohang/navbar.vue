<template>
	<tm-app>
		<tm-navbar title="标题导航栏" color="primary" linear="right" linearDeep="accent">
			<template v-slot:right>
				<tm-icon _class="px-32" name="tmicon-plus"></tm-icon>
			</template>
		</tm-navbar>
		<tm-sheet>
			<tm-text
				:fontSize="24"
				_class="text-weight-b"
				label="使用时必须放置在页面的顶部
			它有非多的属性,请行配置其属性,当为渐变背景时,背景磨砂效果将会消失.
			"
			></tm-text>
		</tm-sheet>
	</tm-app>
</template>
<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import tmApp from '@/tmui/components/tm-app/tm-app.vue'
import tmSheet from '@/tmui/components/tm-sheet/tm-sheet.vue'
import tmText from '@/tmui/components/tm-text/tm-text.vue'
import tmIcon from '@/tmui/components/tm-icon/tm-icon.vue'
import tmNavbar from '@/tmui/components/tm-navbar/tm-navbar.vue'

const list = ref([{ title: '开始' }, { title: '投放中' }, { title: '审核' }, { title: '最后审查' }, { title: '完成' }])
const list2 = ref([{ title: '开始' }, { title: '投放中' }, { title: '审核' }])
</script>
