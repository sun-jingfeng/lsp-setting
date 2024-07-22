<template>
  <div class="operate-dialog">
    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`${addOrEdit}台站`"
      @close="emit('closeOperate')">
      <el-form
        ref="formRef"
        :model="formData"
        label-position="left"
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
            <template #append>km</template>
          </el-input>
        </el-form-item>
        <el-form-item label="雷达型号：" prop="radarId">
          <el-select v-model="formData.radarId" clearable filterable>
            <el-option
              v-for="(item, index) in radarTypeOptions"
              :key="index"
              :label="item.radarType"
              :value="item.radarId" />
          </el-select>
          <img class="tag" src="./images/tag.png" @click="showRadar = true" />
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
  <Radar v-if="showRadar" @closeRadar="closeRadar" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IStation } from './const'
import { areaList, repetitionKey, type IOperateType } from './const'
import { formatNum } from '@/common/utils'
import Radar from './Radar/Radar.vue'
import { addOrEditStationApi, getRadarTypeListApi, sameVerifyApi } from '@/apis/station'
import type { IPickResponse } from '@/common/axios'
import type { FormRules } from 'element-plus'
import { ElMessage, type FormInstance } from 'element-plus'

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
    radarId: ''
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
const formData = ref<IStation>(props.initFormData)
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
        sameVerifyApi({ stationNo: value }).then(
          ({ data: res }) => {
            if (res && props.operateType === 'add') {
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
      },
      trigger: 'blur'
    }
  ],
  stationName: [
    { required: true, message: '请输入', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        sameVerifyApi({ stationName: value }).then(
          ({ data: res }) => {
            if (res && props.operateType === 'add') {
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
      },
      trigger: 'blur'
    }
  ],
  area: [{ required: true, message: '请选择', trigger: 'change' }],
  province: [{ required: true, message: '请选择', trigger: 'change' }],
  longitude: [{ required: true, message: '请输入', trigger: 'change' }],
  latitude: [{ required: true, message: '请输入', trigger: 'change' }],
  altitude: [{ required: true, message: '请输入', trigger: 'change' }],
  radarId: [{ required: true, message: '请选择', trigger: 'change' }]
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

// 雷达型号管理弹窗
const showRadar = ref(false)
const closeRadar = () => {
  setTimeout(() => {
    showRadar.value = false
  }, 200)
}
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
      width: 200px;
      margin-right: 10px;
    }

    .tag {
      padding: 2px;
      pointer-events: initial;
      cursor: pointer;
    }
  }

  .el-button.el-button--primary {
    margin-right: 54px;
  }
}
</style>
