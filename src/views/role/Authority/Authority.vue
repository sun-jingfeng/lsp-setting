<template>
  <div class="authority">
    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="角色权限配置"
      @close="emit('closeAuthority')">
      <el-tree
        ref="treeRef"
        :data="treeData"
        show-checkbox
        node-key="value"
        :default-checked-keys="props.initAuthority"
        :default-expanded-keys="[treeData?.[0].value ?? '']"
        v-loading="loading" />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="warning" @click="closeAuthority()">取消</el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="editRole"
            :disabled="props.roleName === adminRoleName"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, type TreeInstance } from 'element-plus'
import { addAllAuthoritiesApi, editRoleApi, getAllAuthoritiesApi } from '@/apis/role'
import { adminRoleName } from '../const'
import type { IAuthorityTree } from '@/apis/role.const'

type IProps = {
  roleId: string
  roleName: string
  initAuthority: string[]
}

const props = withDefaults(defineProps<IProps>(), {})
const emit = defineEmits<{
  (e: 'closeAuthority', refresh?: boolean): void
}>()

// 显示/隐藏
const dialogVisible = ref(true)
const closeAuthority = (refresh = false) => {
  dialogVisible.value = false
  emit('closeAuthority', refresh)
}

// 权限数据
const treeData = ref<IAuthorityTree>()
const getAllAuthorities = async () => {
  try {
    const { data: res } = await getAllAuthoritiesApi()
    treeData.value = res
    adminForbidden(treeData.value)
  } catch (error: any) {
    console.error(error)
  }
}
getAllAuthorities()

// 管理员账户禁止权限配置
const adminForbidden = (data: IAuthorityTree) => {
  if (props.roleName === adminRoleName) {
    data.forEach(item => {
      item.disabled = true
      if (item.children?.length) {
        adminForbidden(item.children)
      }
    })
  }
}

// 管理员自动添加全部权限
const addAllAuthorities = async () => {
  try {
    await addAllAuthoritiesApi({ roleId: props.roleId })
  } catch (error: any) {
    console.error(error)
  }
}
if (props.roleName === adminRoleName) {
  addAllAuthorities()
}

// 树
const loading = ref(false)
const treeRef = ref<TreeInstance>()
const editRole = async () => {
  loading.value = true
  try {
    await editRoleApi({
      roleId: props.roleId,
      authoritiesList: (treeRef.value?.getCheckedKeys(true) ?? []) as string[]
    })
    closeAuthority(true)
    ElMessage.success('权限配置成功！')
  } catch (error: any) {
    console.error(error)
    ElMessage.warning('权限配置失败！')
  } finally {
    loading.value = true
  }
}
</script>

<style scoped lang="scss">
.authority {
  :deep(.el-dialog) {
    width: 600px;
  }
}
</style>
