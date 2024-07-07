<template>
	<tm-app>
		<tm-sheet>
			<tm-text :font-size="24" _class="text-weight-b" label="长按图标开始拖动"></tm-text>
		</tm-sheet>
		<tm-drag-list :list="list"></tm-drag-list>
	</tm-app>
</template>
<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import tmApp from '@/tmui/components/tm-app/tm-app.vue'
import tmSheet from '@/tmui/components/tm-sheet/tm-sheet.vue'
import tmText from '@/tmui/components/tm-text/tm-text.vue'
import tmDragList from '@/tmui/components/tm-drag-list/tm-drag-list.vue'
import tmFilterMenu from '@/tmui/components/tm-filterMenu/tm-filterMenu.vue'
import tmFilterMenuItem from '@/tmui/components/tm-filterMenu-item/tm-filterMenu-item.vue'
const showWin = ref(false)
const pos = ref('bottom')
const list = ref([{ text: '测试项目1-1' }, { text: '测试项目2-1' }, { text: '测试项目3-1' }, { text: '测试项目4-1' }, { text: '测试项目5-1' }])
</script>
