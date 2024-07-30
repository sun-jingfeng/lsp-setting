<template>
  <div class="content3">
    <el-select v-model="selectValue" clearable filterable multiple>
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :label="item.label"
        :value="item.value" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
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
  padding: 12px 0;

  > .el-select {
    width: 400px;
  }
}
</style>
