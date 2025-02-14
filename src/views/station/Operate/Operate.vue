<template>
  <div class="operate">
    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`${addOrEdit}台站`"
      @close="emit('closeOperate')">
      <el-form
        ref="formRef"
        :model="formData"
        label-position="right"
        label-width="auto"
        :rules="formRules"
        v-loading="loading">
        <el-form-item label="站号：" prop="stationNo">
          <el-input v-model="formData.stationNo" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="站名：" prop="stationName">
          <el-input v-model="formData.stationName" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="区域：" prop="area">
          <el-select v-model="formData.area" clearable>
            <el-option
              v-for="item in areaList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="省份：" prop="province">
          <el-select v-model="formData.province" clearable>
            <el-option
              v-for="item in children"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="经度：" prop="longitude">
          <el-input
            :modelValue="formData.longitude"
            @update:modelValue="formData.longitude = formatNum($event)"
            clearable
            placeholder="请输入">
            <template #append>°</template>
          </el-input>
        </el-form-item>
        <el-form-item label="纬度：" prop="latitude">
          <el-input
            :modelValue="formData.latitude"
            @update:modelValue="formData.latitude = formatNum($event)"
            clearable
            placeholder="请输入">
            <template #append>°</template>
          </el-input>
        </el-form-item>
        <el-form-item label="高度：" prop="altitude">
          <el-input
            :modelValue="formData.altitude"
            @update:modelValue="formData.altitude = formatNum($event)"
            clearable
            placeholder="请输入">
            <template #append>m</template>
          </el-input>
        </el-form-item>
        <el-form-item label="雷达型号：" prop="radarModelId">
          <el-select v-model="formData.radarModelId" clearable filterable>
            <el-option
              v-for="(item, index) in radarModelOptions"
              :key="index"
              :label="item.dataContent"
              :value="item.dataId" />
          </el-select>
          <OperateList />
        </el-form-item>
        <el-form-item label="雷达类型：" prop="radarType">
          <el-select v-model="formData.radarType" clearable>
            <el-option
              v-for="(item, index) in radatTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="warning" @click="closeOperate()">取消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="loading">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { IStation } from './const'
import { areaList, repetitionKey, type IOperateType } from './const'
import { formatNum } from '@/common/utils'
import { addOrEditStationApi, getRadarModelListApi, sameVerifyApi } from '@/apis/station'
import type { IPickResponse } from '@/common/axios'
import type { FormRules } from 'element-plus'
import { ElMessage, type FormInstance } from 'element-plus'
import { radatTypeOptions } from '../const'
import OperateList from '@/components/OperateList/OperateList.vue'
import { cloneDeep } from 'lodash'

type IProps = {
  operateType: IOperateType
  initFormData?: IStation
}

const props = withDefaults(defineProps<IProps>(), {
  initFormData: () => ({
    stationNo: '',
    stationName: '',
    area: '',
    province: '',
    longitude: '',
    latitude: '',
    altitude: '',
    radarModelId: '',
    radarType: ''
  })
})
const emit = defineEmits<{
  (e: 'closeOperate', refresh?: boolean): void
}>()

// 新增/编辑文字描述
const addOrEdit = computed(() => (props.operateType === 'add' ? '新增' : '编辑'))

// 显示/隐藏
const dialogVisible = ref(true)
const closeOperate = (refresh = false) => {
  dialogVisible.value = false
  emit('closeOperate', refresh)
}

// 雷达型号
const radarModelOptions = ref<IPickResponse<typeof getRadarModelListApi>>()
const getRadarModelList = async () => {
  try {
    const { data: res } = await getRadarModelListApi()
    radarModelOptions.value = res
  } catch (error: any) {
    console.error(error)
  }
}
getRadarModelList()

// 表单数据
const formData = ref<IStation>(cloneDeep(props.initFormData))
const children = computed(
  () => areaList.find(item => item.value === formData.value.area)?.children ?? []
)
watch(
  () => formData.value.area,
  () => {
    if (!children.value.find(item => item.value === formData.value.province)) {
      formData.value.province = ''
    }
  }
)

// 表单验证
const formRules: FormRules<IStation> = {
  stationNo: [
    { required: true, message: '请输入', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value) {
          if (props.operateType === 'add') {
            sameVerifyApi({ stationNo: value }).then(
              ({ data: res }) => {
                if (res) {
                  callback(new Error('已存在相同站号！'))
                } else {
                  callback()
                }
              },
              error => {
                console.error(error)
                callback()
              }
            )
          } else {
            callback()
          }
        } else {
          callback(new Error('请输入'))
        }
      },
      trigger: 'blur'
    }
  ],
  stationName: [
    { required: true, message: '请输入', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value) {
          if (props.operateType === 'add') {
            sameVerifyApi({ stationName: value }).then(
              ({ data: res }) => {
                if (res) {
                  callback(new Error('已存在相同站名！'))
                } else {
                  callback()
                }
              },
              error => {
                console.error(error)
                callback()
              }
            )
          } else {
            callback()
          }
        } else {
          callback(new Error('请输入'))
        }
      },
      trigger: 'blur'
    }
  ],
  area: [{ required: true, message: '请选择', trigger: ['change', 'blur'] }],
  province: [{ required: true, message: '请选择', trigger: ['change', 'blur'] }],
  longitude: [
    { required: true, message: '请输入', trigger: ['change', 'blur'] },
    {
      validator: (rule, value, callback) => {
        const verify = () => callback(new Error('请输入10进制经度，-180~180'))
        if (value === '') {
          verify()
          return
        }
        const numValue = +value
        if (isNaN(numValue) || numValue < -180 || numValue > 180) {
          verify()
          return
        }
        callback()
      },
      trigger: ['change', 'blur']
    }
  ],
  latitude: [
    { required: true, message: '请输入', trigger: ['change', 'blur'] },
    {
      validator: (rule, value, callback) => {
        const verify = () => callback(new Error('请输入10进制纬度，-90~90'))
        if (value === '') {
          verify()
          return
        }
        const numValue = +value
        if (isNaN(numValue) || numValue < -90 || numValue > 90) {
          verify()
          return
        }
        callback()
      },
      trigger: ['change', 'blur']
    }
  ],
  altitude: [{ required: true, message: '请输入', trigger: ['change', 'blur'] }],
  radarModelId: [{ required: true, message: '请选择', trigger: ['change', 'blur'] }],
  radarType: [{ required: true, message: '请选择', trigger: ['change', 'blur'] }]
}

// 提交
const loading = ref(false)
const formRef = ref<FormInstance>()
const onSubmit = () => {
  formRef.value?.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        const { data: res } = await addOrEditStationApi(formData.value)
        if (repetitionKey.test(res)) {
          ElMessage.warning(res)
        } else {
          ElMessage.success(`${addOrEdit.value}台站成功！`)
          closeOperate(true)
        }
      } catch (error: any) {
        console.error(error)
        ElMessage.warning(`${addOrEdit.value}台站失败！`)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.operate {
  :deep(.el-dialog) {
    width: 410px;
  }

  .el-form {
    margin: 0 20px;

    .el-input,
    .el-select {
      width: 200px;
      margin-right: 10px;
    }
  }

  .el-button.el-button--primary {
    margin-right: 54px;
  }
}
</style>
