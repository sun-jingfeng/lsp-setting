<template>
  <el-input
    class="async-input"
    v-model="inputValue"
    @keyup.enter="emit('update:modelValue', inputValue)"
    @blur="emit('update:modelValue', inputValue)" />
</template>

<script setup lang="ts">
type IProps = {
  modelValue?: string
}

const props = withDefaults(defineProps<IProps>(), {})
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputValue = ref(props.modelValue ?? '')
watch(
  () => props.modelValue,
  () => {
    props.modelValue && (inputValue.value = props.modelValue)
  }
)
</script>

<style scoped lang="scss">
.async-input {
  // 样式
}
</style>
