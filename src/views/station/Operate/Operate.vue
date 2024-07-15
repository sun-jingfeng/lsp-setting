<template>
  <div class="operate-dialog">
    <el-dialog v-model="dialogVisible" :title="`${currentOperate === 'add' ? '新增' : '编辑'}站点`">
      <el-form :model="formData" label-position="left" label-width="auto">
        <el-form-item label="站号：">
          <el-input v-model="formData.stationId" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="站名：">
          <el-input v-model="formData.stationName" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="区域：">
          <el-select v-model="formData.area" clearable>
            <el-option
              v-for="item in areaList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="省份：">
          <el-select v-model="formData.province" clearable>
            <el-option
              v-for="item in provinceList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="经度：">
          <el-input
            :modelValue="formData.longitude"
            @update:modelValue="formData.longitude = formatNum($event)"
            clearable
            placeholder="请输入">
            <template #append>°</template>
          </el-input>
        </el-form-item>
        <el-form-item label="纬度：">
          <el-input
            :modelValue="formData.latitude"
            @update:modelValue="formData.latitude = formatNum($event)"
            clearable
            placeholder="请输入">
            <template #append>°</template>
          </el-input>
        </el-form-item>
        <el-form-item label="高度：">
          <el-input
            :modelValue="formData.altitude"
            @update:modelValue="formData.altitude = formatNum($event)"
            clearable
            placeholder="请输入">
            <template #append>km</template>
          </el-input>
        </el-form-item>
        <el-form-item label="雷达型号：">
          <el-input v-model="formData.model" clearable placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="warning" @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { areaList, type IType } from './const'
import { formatNum } from '@/common/utils'

const dialogVisible = ref(false)
const currentOperate = ref<IType>('add')
const showDialog = (operate: IType) => {
  currentOperate.value = operate
  dialogVisible.value = true
}

const formData = ref({
  stationId: '',
  stationName: '',
  area: '',
  province: '',
  longitude: '',
  latitude: '',
  altitude: '',
  model: ''
})
const provinceList = computed(
  () => areaList.find(item => item.value === formData.value.area)?.provinceList ?? []
)
watch(
  () => formData.value.area,
  () => {
    if (!provinceList.value.find(item => item.value === formData.value.province)) {
      formData.value.province = ''
    }
  }
)

defineExpose({
  showDialog
})
</script>

<style scoped lang="scss">
.operate-dialog {
  :deep(.el-dialog) {
    width: 400px;
  }

  .el-form {
    margin: 0 20px;
  }
}
</style>
