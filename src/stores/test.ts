import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useTestStore = defineStore('test', ()=>{

  const example = reactive({
    random: Math.random(),
    time: new Date().getTime(),
  })

  const model = ref(Math.random() + "_" + Math.random())

  const list = ref([
    123,456,789,123,456,789,123,456,789,
    123,456,789,123,456,789,123,456,789,
    123,456,789,123,456,789,123,456,789,
    123,456,789,123,456,789,123,456,789,
  ])

  const obj = ref({
    p: Math.random(),
    p1: Math.random(),
    p2: Math.random(),
    p3: Math.random(),
    p4: Math.random(),
    p5: Math.random(),
    p6: Math.random(),
    p7: Math.random(),
    p8: Math.random(),
    p9: Math.random(),
    list,
    model,
    example,
  })

  return {
    example,
    model,
    list,
    obj,
  }
});