<template>
  <div class="operate-list">
    <img
      class="tag"
      :src="getImgSrc(imgPath, systemStore.dark ? 'tag-dark' : 'tag')"
      @click="showRadar = true" />
    <OperateDialog v-if="showRadar" @closeRadar="closeRadar" :pageType="props.pageType" />
  </div>
</template>

<script setup lang="ts">
import { getImgSrc } from '@/common/utils'
import type { IPageType } from './OperateDialog/const'
import OperateDialog from './OperateDialog/OperateDialog.vue'
import { imgPath } from './const'
import { useSystemStore } from '@/stores/system'

type IProps = {
  pageType?: IPageType
}

const props = withDefaults(defineProps<IProps>(), {
  pageType: 'radar'
})

const systemStore = useSystemStore()

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
    pointer-events: initial;
    cursor: pointer;
  }
}
</style>
