<template>
  <div class="operate-list">
    <img class="tag" src="./images/tag.png" @click="showRadar = true" />
    <OperateDialog v-if="showRadar" @closeRadar="closeRadar" :type="props.pageType" />
  </div>
</template>

<script setup lang="ts">
import type { IPageType } from './OperateDialog/const'
import OperateDialog from './OperateDialog/OperateDialog.vue'

type IProps = {
  pageType?: IPageType
}

const props = withDefaults(defineProps<IProps>(), {
  pageType: 'radar'
})

const showRadar = ref(false)
const closeRadar = () => {
  setTimeout(() => {
    showRadar.value = false
  }, 200)
}
</script>

<style scoped lang="scss">
.operate-list {
  > .tag {
    padding: 2px;
    pointer-events: initial;
    cursor: pointer;
  }
}
</style>
