<template>
  <div class="home">
    <p>我是home页😄</p>
    <span>内容：{{ number }}</span>
    <el-button type="warning" :icon="Refresh" circle @click="refresh" />
    <Children ref="childrenRef" v-model="number" />
  </div>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import Children from './Children/Children.vue'

const number = ref(0)
const childrenRef = ref<InstanceType<typeof Children>>()
const refresh = () => {
  childrenRef.value?.refresh()
}
</script>

<style scoped lang="scss">
.home {
  // 样式
}
</style>
