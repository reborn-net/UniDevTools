<template>
	<tm-app>
		<tm-cropimg></tm-cropimg>
	</tm-app>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import tmApp from '@/tmui/components/tm-app/tm-app.vue'
import tmCropimg from '@/tmui/components/tm-cropimg/tm-cropimg.vue'
</script>
