<template>
  <div class="children">
    <el-button
      type="success"
      :icon="Plus"
      circle
      @click="emit('update:modelValue', props.modelValue + 1 * props.stept)" />
    <el-button
      type="primary"
      :icon="Minus"
      circle
      @click="emit('update:modelValue', props.modelValue - 1 * props.stept)" />
  </div>
</template>

<script setup lang="ts">
import { Plus, Minus } from '@element-plus/icons-vue'

type IChildrenProps = {
  modelValue: number
  stept?: number
}

const props = withDefaults(defineProps<IChildrenProps>(), {
  stept: 10
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()
const refresh = () => {
  emit('update:modelValue', 0)
}

defineExpose({
  refresh
})
</script>

<style scoped lang="scss">
.children {
  // 样式
}
</style>
