<template>
  <div class="authority">
    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="角色权限分配"
      @close="emit('closeAuthority')">
      <el-tree
        ref="treeRef"
        :data="authorityTree"
        show-checkbox
        node-key="value"
        :default-checked-keys="props.initAuthority"
        :default-expanded-keys="['全部']" />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="warning" @click="closeAuthority()">取消</el-button>
          <el-button type="primary" @click="editRole">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { TreeInstance } from 'element-plus'
import { authorityTree } from './const'
import { editRoleApi } from '@/apis/role'

type IProps = {
  roleId: string
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

// 树
const treeRef = ref<TreeInstance>()
const editRole = async () => {
  try {
    await editRoleApi({
      roleId: props.roleId,
      authority: (treeRef.value?.getCheckedKeys() ?? []) as string[]
    })
    closeAuthority(true)
  } catch (error: any) {
    console.error(error)
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
