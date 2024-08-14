<template>
  <div class="operate">
    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`${addOrEdit}角色`"
      @close="emit('closeOperate')">
      <el-form
        ref="formRef"
        :model="formData"
        label-position="right"
        label-width="auto"
        :rules="formRules"
        v-loading="loading">
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="formData.roleName" clearable placeholder="请输入" />
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
import type { IOperateType, IRole } from './const'
import type { FormRules } from 'element-plus'
import { ElMessage, type FormInstance } from 'element-plus'
import { addRoleApi, sameVerifyApi } from '@/apis/role'
import { cloneDeep } from 'lodash'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

type IProps = {
  operateType?: IOperateType
  initFormData?: IRole
}

const props = withDefaults(defineProps<IProps>(), {
  operateType: 'add'
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

// 表单数据
const formData = ref<IRole>(
  props.initFormData
    ? cloneDeep(props.initFormData)
    : {
        roleName: '',
        creator: userStore.userinfo?.username ?? '',
        createTime: ''
      }
)

// 表单验证
const formRules: FormRules<IRole> = {
  roleName: [
    { required: true, message: '请输入', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value) {
          if (props.operateType === 'add') {
            sameVerifyApi({ roleName: value }).then(
              () => {
                callback()
              },
              error => {
                console.error(error)
                callback(new Error('已存在相同角色名称！'))
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
  ]
}

// 提交
const loading = ref(false)
const formRef = ref<FormInstance>()
const onSubmit = () => {
  formRef.value?.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        await addRoleApi(formData.value)
        ElMessage.success(`${addOrEdit.value}台站成功！`)
        closeOperate(true)
      } catch (error: any) {
        console.error(error)
        ElMessage.warning(error.message ?? `${addOrEdit.value}台站失败！`)
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
    width: 400px;
  }
}
</style>
