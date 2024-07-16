<template>
  <div class="operate-dialog">
    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`${currentOperate === 'add' ? '新增' : '编辑'}站点`">
      <el-form :model="formData" label-position="left" label-width="auto" :rules="rules">
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
          <el-select v-model="formData.radarType" clearable filterable>
            <el-option
              v-for="(item, index) in radarTypeOptions"
              :key="index"
              :label="item.radarType"
              :value="item.radarType" />
          </el-select>
          <img class="tag" src="./images/tag.png" @click="showRadar = true" />
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
  <Radar v-if="showRadar" @closeDialog="closeDialog" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { areaList, type IType } from './const'
import { formatNum } from '@/common/utils'
import Radar from './Radar/Radar.vue'
import { getRadarTypeListApi } from '@/apis/station'
import type { IPickResponse } from '@/common/axios'
import { FormRules } from 'element-plus'

// 当前操作
const dialogVisible = ref(false)
const currentOperate = ref<IType>('add')
const showDialog = (operate: IType) => {
  currentOperate.value = operate
  dialogVisible.value = true
  getRadarTypeList()
}

// 雷达型号
const radarTypeOptions = ref<IPickResponse<typeof getRadarTypeListApi>>()
const getRadarTypeList = async () => {
  try {
    const { data: res } = await getRadarTypeListApi()
    radarTypeOptions.value = res
  } catch (error: any) {
    console.error(error)
  }
}
getRadarTypeList()

// 表单数据
const formData = ref({
  stationId: '',
  stationName: '',
  area: '',
  province: '',
  longitude: '',
  latitude: '',
  altitude: '',
  radarType: ''
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

// 表单验证
const rules = ref<FormRules<typeof formData>>({})

// 雷达型号管理弹窗
const showRadar = ref(false)
const closeDialog = () => {
  setTimeout(() => {
    showRadar.value = false
  }, 1000)
}

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

    .el-input,
    .el-select {
      width: 210px;
      margin-right: 10px;
    }

    .tag {
      padding: 2px;
      pointer-events: initial;
      cursor: pointer;
    }
  }
}
</style>
