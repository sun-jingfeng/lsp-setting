<template>
  <div class="operate">
    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`${addOrEdit}用户`"
      @close="emit('closeOperate')">
      <el-form
        ref="formRef"
        :model="formData"
        label-position="right"
        label-width="auto"
        :rules="formRules"
        v-loading="loading">
        <el-form-item label="用户名：" prop="username" :class="{ 'g-disabled': onlyPassword }">
          <el-input
            v-model="formData.username"
            clearable
            placeholder="请输入"
            :disabled="onlyPassword" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            clearable
            placeholder="请输入"
            show-password />
        </el-form-item>
        <el-form-item label="角色类型：" prop="roleId" :class="{ 'g-disabled': onlyPassword }">
          <el-select v-model="formData.roleId" clearable :disabled="onlyPassword">
            <el-option
              v-for="item in rolesList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId!" />
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
import type { IOperateType, IUser } from './const'
import type { FormRules } from 'element-plus'
import { ElMessage, type FormInstance } from 'element-plus'
import { addOrEditUserApi, sameVerifyApi } from '@/apis/manage'
import { getRolesListApi } from '@/apis/role'
import type { IPickResponse } from '@/common/axios'
import { cloneDeep } from 'lodash'
import { adminUserName } from '../const'
import { useUserStore } from '@/stores/user'

type IProps = {
  operateType?: IOperateType
  initFormData?: IUser
}

const props = withDefaults(defineProps<IProps>(), {
  operateType: 'add',
  initFormData: () => ({
    username: '',
    password: '',
    roleId: ''
  })
})
const emit = defineEmits<{
  (e: 'closeOperate', refresh?: boolean): void
}>()

const userStore = useUserStore()

// 新增/编辑文字描述
const addOrEdit = computed(() => (props.operateType === 'add' ? '新增' : '编辑'))

// 显示/隐藏
const dialogVisible = ref(true)
const closeOperate = (refresh = false) => {
  dialogVisible.value = false
  emit('closeOperate', refresh)
}

// 角色类型
const rolesList = ref<IPickResponse<typeof getRolesListApi>['records']>()
const getRolesList = async () => {
  try {
    const { data: res } = await getRolesListApi({
      pageNum: 1,
      pageSize: 99999
    })
    rolesList.value = res.records
  } catch (error: any) {
    console.error(error)
  }
}
getRolesList()

// 只能改密码
const onlyPassword = computed(
  () =>
    props.operateType === 'edit' &&
    (props.initFormData.username === adminUserName ||
      userStore.userinfo?.username !== adminUserName)
)

// 表单数据
const formData = ref<IUser>(cloneDeep(props.initFormData))

// 表单验证
const formRules: FormRules<IUser> = {
  username: [
    { required: true, message: '请输入', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value) {
          if (props.operateType === 'add') {
            sameVerifyApi({ username: value }).then(
              () => {
                callback()
              },
              error => {
                console.error(error)
                callback(new Error('已存在相同用户名称！'))
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
  password: [{ required: true, message: '请输入', trigger: ['change', 'blur'] }],
  roleId: [{ required: true, message: '请输入', trigger: ['change', 'blur'] }]
}

// 提交
const loading = ref(false)
const formRef = ref<FormInstance>()
const onSubmit = () => {
  formRef.value?.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        await addOrEditUserApi(props.operateType, formData.value)
        ElMessage.success(`${addOrEdit.value}用户成功！`)
        closeOperate(true)
      } catch (error: any) {
        console.error(error)
        ElMessage.warning(error.message ?? `${addOrEdit.value}用户失败！`)
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
