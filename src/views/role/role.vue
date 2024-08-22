<template>
  <div class="role g-page" v-loading="loading">
    <div class="top">
      <p class="g-decorate">{{ getLabel() }}</p>
      <el-button type="primary" :icon="CirclePlus" @click="showOperate = true">新增角色</el-button>
    </div>
    <el-table :data="rolesList" border>
      <el-table-column label="序号" width="60" align="center">
        <template #default="{ row }">
          <span>{{
            (pageNum - 1) * pageSize +
            (rolesList?.findIndex(item => item.roleId === row.roleId) ?? 0) +
            1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色" align="center" />
      <el-table-column prop="creator" label="创建人" align="center" />
      <el-table-column label="创建时间" align="center" width="200">
        <template #default="{ row }: { row: IRole }">
          <span>{{ (row.createTime && dayjs(row.createTime).format(dateFormat2)) || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="{ row }: { row: IRole }">
          <el-button
            type="primary"
            link
            @click="
              operateAuthority(row.roleId ?? '', row.roleName ?? '', row.authoritiesList ?? [])
            ">
            <img class="button-icon" src="./images/branch.png" />
            <span>权限配置</span>
          </el-button>
          <el-button
            type="danger"
            link
            @click="deleteRole(row.roleId!, row.roleName)"
            :disabled="row.roleName === adminRoleName">
            <img class="button-icon" src="./images/delete.png" />
            <span>删除</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" />
  </div>
  <Operate v-if="showOperate" @closeOperate="closeOperate" />
  <Authority
    v-if="showAuthority"
    :roleId="currentRoleId"
    :roleName="currentRoleName"
    :initAuthority="initAuthority"
    @closeAuthority="closeAuthority" />
</template>

<script setup lang="ts">
import { deleteRoleApi, getRolesListApi } from '@/apis/role'
import type { IPickResponse } from '@/common/axios'
import { dateFormat2 } from '@/common/date'
import { getLabel } from '@/components/Layout/Navigation/const'
import { CirclePlus } from '@element-plus/icons-vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import Operate from './Operate/Operate.vue'
import type { IRole } from './Operate/const'
import Authority from './Authority/Authority.vue'
import { adminRoleName } from './const'

// 列表
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const rolesList = ref<IPickResponse<typeof getRolesListApi>['records']>()
const loading = ref(false)
watch([pageNum, pageSize], getRolesList, {
  immediate: true,
  deep: true
})
async function getRolesList() {
  loading.value = true
  try {
    const { data: res } = await getRolesListApi({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    total.value = res.total
    rolesList.value = res.records
  } catch (error: any) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 新增
const showOperate = ref(false)
const closeOperate = (refresh = false) => {
  refresh && getRolesList()
  setTimeout(() => {
    showOperate.value = false
  }, 200)
}

// 权限配置
const showAuthority = ref(false)
const currentRoleId = ref('')
const currentRoleName = ref('')
const initAuthority = ref<string[]>([])
const operateAuthority = (roleId: string, roleName: string, i_initAuthority: string[]) => {
  currentRoleId.value = roleId
  currentRoleName.value = roleName
  initAuthority.value = i_initAuthority
  showAuthority.value = true
}
const closeAuthority = (refresh = false) => {
  refresh && getRolesList()
  setTimeout(() => {
    showAuthority.value = false
  }, 200)
}

// 删除
const deleteRole = (roleId: string, roleName: string) => {
  ElMessageBox.confirm(`确定删除角色：${roleName} ？`, '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      loading.value = true
      try {
        await deleteRoleApi({ roleId })
        loading.value = false
        getRolesList()
        ElMessage.success('删除角色成功！')
      } catch (error: any) {
        ElMessage.warning('删除角色失败！')
        loading.value = false
        console.error(error)
      }
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss">
.role {
  display: flex;
  flex-direction: column;

  > .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    font-weight: 700;
    color: var(--g-text-color-2);
  }

  > .el-table {
    flex: 1;
    height: 0;
    margin: 8px 0;

    .button-icon {
      padding: 4px;
    }
  }

  > .el-pagination {
    position: relative;
    justify-content: flex-end;

    :deep(> .el-pagination__total) {
      position: absolute;
      left: 50%;
      transform: translateX(-100%);
    }

    :deep(> .el-pagination__sizes) {
      position: absolute;
      left: 50%;
    }
  }
}
</style>
