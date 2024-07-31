<template>
  <div class="content3">
    <el-select v-model="disasterTags" clearable filterable multiple>
      <el-option
        v-for="(item, index) in disasterTaglList"
        :key="index"
        :label="item.dataContent"
        :value="item.dataId" />
    </el-select>
    <OperateList pageType="disaster" />
  </div>
</template>

<script setup lang="ts">
import { getDisasterTaglListApi } from '@/apis/history'
import type { IPickResponse } from '@/common/axios'
import OperateList from '@/components/OperateList/OperateList.vue'

// 选中
const disasterTags = ref<string[]>([])

// 列表
const disasterTaglList = ref<IPickResponse<typeof getDisasterTaglListApi>>([])
const getDisasterTaglList = async () => {
  try {
    const { data: res } = await getDisasterTaglListApi()
    disasterTaglList.value = res
  } catch (error: any) {
    console.error(error)
  }
}
getDisasterTaglList()

defineExpose({
  disasterTags
})
</script>

<style scoped lang="scss">
.content3 {
  display: flex;
  align-items: center;
  padding: 12px 0;

  > .el-select {
    width: 400px;
    margin-right: 10px;
  }
}
</style>
