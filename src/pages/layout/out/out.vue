<template>
	<tm-app ref="app" color="grey-5">
		<tm-form @submit="confirm" ref="form" v-model="show">
			<tm-form-item
				label="身份证号码"
				field="nameuser.a"
				:rules="[{ required: true, message: '请输入66', validator: (val:string) => val == '66' }]"
			>
				<tm-input :inputPadding="[0, 0]" v-model="show.nameuser.a" :transprent="true" :showBottomBotder="false"> </tm-input>
			</tm-form-item>
			<tm-form-item label="选择日期" field="cale" :rules="[{ required: true, message: '请选择日期哦' }]">
				<tm-input
					:inputPadding="[0, 0]"
					:model-value.sync="show.cale[0]"
					@click="showCal = !showCal"
					suffix="tmicon-angle-right"
					placeholder="请选择有效日期"
					disabled
					:transprent="true"
					:showBottomBotder="false"
				></tm-input>
			</tm-form-item>
			<tm-form-item label="选择地区" field="city" :rules="[{ required: true, message: '请选择地区' }]">
				<tm-input
					:inputPadding="[0, 0]"
					:model-value.sync="show.cityStr"
					@click="showCity = !showCity"
					suffix="tmicon-angle-right"
					placeholder="请选择所在地区地址"
					disabled
					:transprent="true"
					:showBottomBotder="false"
				></tm-input>
			</tm-form-item>
			<tm-form-item label="时间选择" field="time" :rules="[{ required: true, message: '请选择时间' }]">
				<tm-input
					:inputPadding="[0, 0]"
					v-model="show.timeStr"
					@click="showTimePickerView = !showTimePickerView"
					suffix="tmicon-angle-right"
					placeholder="请选择时间"
					disabled
					:transprent="true"
					:showBottomBotder="false"
				></tm-input>
			</tm-form-item>
			<tm-form-item label="弹出选择" field="time" :rules="[{ required: true, message: '请选择水果种类' }]">
				<tm-input
					:inputPadding="[0, 0]"
					:model-value.sync="show.pickerStr"
					@click="showPicker = !showPicker"
					suffix="tmicon-angle-right"
					placeholder="请选择你的水果种类"
					disabled
					:transprent="true"
					:showBottomBotder="false"
				></tm-input>
			</tm-form-item>
			<tm-form-item label="选择水果" field="radio" :rules="[{ required: true, message: '请选择水果' }]">
				<tm-radio-group v-model="show.radio">
					<tm-radio label="苹果" value="apple"></tm-radio>
					<tm-radio label="香焦" value="bonaer"></tm-radio>
				</tm-radio-group>
			</tm-form-item>

			<tm-form-item label="多选水果种类" field="checkbox" :rules="[{ required: true, message: '请选择' }]">
				<tm-checkbox-group v-model="show.checkbox">
					<tm-checkbox label="苹果" value="apple"></tm-checkbox>
					<tm-checkbox label="香焦" value="bonaer"></tm-checkbox>
					<tm-checkbox label="香焦" value="bonaer2"></tm-checkbox>
					<tm-checkbox label="香焦" value="bonaer3"></tm-checkbox>
					<tm-checkbox label="香焦" value="bonaer4"></tm-checkbox>
				</tm-checkbox-group>
			</tm-form-item>

			<tm-form-item label="评分" field="rate" :rules="[{ required: true, message: '请选择' }]">
				<tm-rate v-model="show.rate"></tm-rate>
			</tm-form-item>

			<tm-form-item
				label="价格选择"
				field="slider"
				:rules="[
					{
						required: true,
						message: '请选择',
						validator: (val:number[]) => val.reduce((a:number, b:number) => Math.abs(a - b)) !== 0
					}
				]"
			>
				<tm-slider :width="450" v-model="show.slider" :default-value="show.slider"></tm-slider>
			</tm-form-item>

			<tm-form-item label="分割选择" field="segtab" :rules="[{ required: true, message: '请选择' }]">
				<tm-segtab :width="420" :list="[{ text: '苹果' }, { text: '香蕉' }]" v-model="show.segtab" :default-value="show.segtab"></tm-segtab>
			</tm-form-item>

			<tm-form-item label="开关" field="switch" :rules="{ required: true, message: '请选择' }">
				<tm-switch v-model="show.switch"></tm-switch>
			</tm-form-item>

			<tm-form-item label="上传截图" field="upload" :rules="{ required: true, message: '请上传' }">
				<tm-upload
					:rows="3"
					:width="420"
					url="https://mockapi.eolink.com/tNYKNA7ac71aa90bcbe83c5815871a5b419601e96a5524d/upload"
					v-model="show.upload"
				></tm-upload>
			</tm-form-item>

			<tm-form-item :border="false">
				<view class="flex flex-row">
					<view class="flex-1 mr-32">
						<tm-button form-type="submit" label="提交表单" block></tm-button>
					</view>
					<view class="flex-1">
						<tm-button :shadow="0" text form-type="reset" label="重置表单" block></tm-button>
					</view>
				</view>
			</tm-form-item>
		</tm-form>
		<tm-calendar v-model="show.cale" v-model:show="showCal" :default-value="show.cale"></tm-calendar>
		<tm-city-picker v-model="show.city" v-model:model-str="show.cityStr" v-model:show="showCity" :default-value="show.city"></tm-city-picker>
		<tm-time-picker
			v-model="show.time"
			v-model:model-str="show.timeStr"
			v-model:show="showTimePickerView"
			:default-value="show.timeStr"
		></tm-time-picker>
		<tm-picker
			:columns="pickerlist"
			v-model="show.pickerIndex"
			v-model:model-str="show.pickerStr"
			v-model:show="showPicker"
			:default-value="show.pickerIndex"
		></tm-picker>
	</tm-app>
</template>
<script lang="ts" setup>
import { ref, nextTick, getCurrentInstance } from 'vue'
const { proxy, ctx } = getCurrentInstance()
import tmApp from '@/tmui/components/tm-app/tm-app.vue'
import tmInput from '@/tmui/components/tm-input/tm-input.vue'
import tmSheet from '@/tmui/components/tm-sheet/tm-sheet.vue'
import tmRadioGroup from '@/tmui/components/tm-radio-group/tm-radio-group.vue'
import tmRadio from '@/tmui/components/tm-radio/tm-radio.vue'
import tmCheckboxGroup from '@/tmui/components/tm-checkbox-group/tm-checkbox-group.vue'
import tmCheckbox from '@/tmui/components/tm-checkbox/tm-checkbox.vue'
import tmRate from '@/tmui/components/tm-rate/tm-rate.vue'
import tmSlider from '@/tmui/components/tm-slider/tm-slider.vue'
import tmSegtab from '@/tmui/components/tm-segtab/tm-segtab.vue'
import tmSwitch from '@/tmui/components/tm-switch/tm-switch.vue'
import tmUpload from '@/tmui/components/tm-upload/tm-upload.vue'
import tmCalendar from '@/tmui/components/tm-calendar/tm-calendar.vue'
import tmCityPicker from '@/tmui/components/tm-city-picker/tm-city-picker.vue'
import tmTimePicker from '@/tmui/components/tm-time-picker/tm-time-picker.vue'
import tmPicker from '@/tmui/components/tm-picker/tm-picker.vue'
import tmImage from '@/tmui/components/tm-image/tm-image.vue'
import tmButton from '@/tmui/components/tm-button/tm-button.vue'
import tmText from '@/tmui/components/tm-text/tm-text.vue'
import tmIcon from '@/tmui/components/tm-icon/tm-icon.vue'
import tmFormItem from '@/tmui/components/tm-form-item/tm-form-item.vue'
import tmForm from '@/tmui/components/tm-form/tm-form.vue'

const showCal = ref(false)
const showCity = ref(false)
const showTimePickerView = ref(false)
const showPicker = ref(false)
const pickerlist = ref([
	{
		text: '苹果'
	},
	{
		text: '香蕉'
	},
	{
		text: '李子'
	},
	{
		text: '椰子'
	}
])
const show = ref({
	cale: ['2022-1-4'],
	time: '2022-1-9',
	timeStr: '2022-1-5',
	radio: '', //bonaer
	pickerIndex: [],
	pickerStr: '',
	checkbox: [],
	rate: 0,
	slider: [0, 50],
	segtab: '',
	switch: false,
	upload: [],
	city: [],
	cityStr: '',
	nameuser: {
		a: ''
	}
})
const confirm = (e) => {
	console.log(e)
}
</script>
