<template>
  <div class="empty">
    <img src="./images/empty.png" />
    <p>{{ props.description }}</p>
  </div>
</template>

<script setup lang="ts">
type IProps = {
  description?: string
}

const props = withDefaults(defineProps<IProps>(), {
  description: '暂无数据'
})
</script>

<style scoped lang="scss">
.empty {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > p {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
