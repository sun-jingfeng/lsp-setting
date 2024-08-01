<template>
  <div class="content2">
    <el-date-picker
      :modelValue="dateTimeRange"
      @update:modelValue="dateTimeRange = $event ?? ['', '']"
      type="datetimerange"
      range-separator="至"
      :format="dateFormat2"
      :value-format="dateFormat1"
      start-placeholder="开始时间"
      :prefix-icon="Calendar"
      end-placeholder="结束时间" />
  </div>
</template>

<script setup lang="ts">
import { dateFormat1, dateFormat2 } from '@/common/date'
import { Calendar } from '@element-plus/icons-vue'
import { dayjs, ElMessage } from 'element-plus'

const dateTimeRange = ref<[string, string]>(['', ''])
watch(
  dateTimeRange,
  () => {
    if (dateTimeRange.value.every(item => Boolean(item))) {
      if (dayjs(dateTimeRange.value[0]).add(12, 'hour').isBefore(dayjs(dateTimeRange.value[1]))) {
        ElMessage.warning('最多支持12小时范围内的历史回算！')
        dateTimeRange.value = ['', '']
      }
      if (dayjs(dateTimeRange.value[0]).isAfter(dayjs(dateTimeRange.value[1]))) {
        ElMessage.warning('结束时间不得早于开始时间！')
        dateTimeRange.value = ['', '']
      }
    }
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  dateTimeRange
})
</script>

<style scoped lang="scss">
.content2 {
  padding: 18px 0;
}
</style>
