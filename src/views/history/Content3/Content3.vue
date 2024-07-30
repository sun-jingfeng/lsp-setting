<template>
  <div class="content3">
    <el-select v-model="selectValue" clearable filterable multiple>
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :label="item.label"
        :value="item.value" />
    </el-select>
    <OperateList type="disaster" />
  </div>
</template>

<script setup lang="ts">
import OperateList from '@/components/OperateList/OperateList.vue'

const selectValue = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
]
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
