<template>
  <div class="not-found">
    <el-empty :image-size="200" :description="`页面未找到， ${countDown} 秒后跳转到主页……`" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const countDown = ref(3)
let timer = -1
onMounted(() => {
  timer = setInterval(() => {
    countDown.value > 0 && countDown.value--
  }, 1000)
})
onBeforeUnmount(() => {
  clearInterval(timer)
})
watch(countDown, () => {
  countDown.value <= 0 && router.push('/')
})
</script>

<style scoped lang="scss">
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  :deep(.el-empty__description > p) {
    font-size: 26px;
  }
}
</style>
