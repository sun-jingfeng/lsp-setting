<template>
  <div class="manage g-page" v-loading="loading">
    <div class="top">
      <p class="g-decorate">{{ getLabel() }}</p>
      <el-button type="primary" :icon="CirclePlus" @click="addUser">新增用户</el-button>
    </div>
    <el-table :data="usersList" border>
      <el-table-column label="序号" width="60" align="center">
        <template #default="{ row }">
          <span>{{
            (pageNum - 1) * pageSize +
            (usersList?.findIndex(item => item.userId === row.userId) ?? 0) +
            1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="roleName" label="角色类型" align="center" />
      <el-table-column label="创建时间" align="center" width="200">
        <template #default="{ row }: { row: IUser }">
          <span>{{ (row.createTime && dayjs(row.createTime).format(dateFormat2)) || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="{ row }: { row: IUser }">
          <el-button type="primary" link @click="editUser(row)">
            <img class="button-icon" src="./images/edit.png" />
            <span>编辑</span>
          </el-button>
          <el-button type="danger" link @click="deleteUser(row.userId!, row.username)">
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
  <Operate
    v-if="showOperate"
    :operateType="operateType"
    :initFormData="initFormData"
    @closeOperate="closeOperate" />
</template>

<script setup lang="ts">
import { deleteUserApi, getUsersListApi } from '@/apis/manage'
import type { IPickResponse } from '@/common/axios'
import { dateFormat2 } from '@/common/date'
import { getLabel } from '@/components/Layout/Navigation/const'
import { CirclePlus } from '@element-plus/icons-vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import Operate from './Operate/Operate.vue'
import type { IOperateType, IUser } from './Operate/const'

// 列表
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const usersList = ref<IPickResponse<typeof getUsersListApi>['records']>()
const loading = ref(false)
watch([pageNum, pageSize], getUsersList, {
  immediate: true,
  deep: true
})
async function getUsersList() {
  loading.value = true
  try {
    const { data: res } = await getUsersListApi({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    total.value = res.total
    usersList.value = res.records
  } catch (error: any) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 新增、编辑
const initFormData = ref<IUser>()
const operateType = ref<IOperateType>('add')
const showOperate = ref(false)
const addUser = () => {
  initFormData.value = undefined
  operateType.value = 'add'
  showOperate.value = true
}
const editUser = (i_initFormData: IUser) => {
  initFormData.value = i_initFormData
  operateType.value = 'edit'
  showOperate.value = true
}
const closeOperate = (refresh = false) => {
  refresh && getUsersList()
  setTimeout(() => {
    showOperate.value = false
  }, 200)
}

// 删除
const deleteUser = (userId: string, username: string) => {
  ElMessageBox.confirm(`确定删除用户：${username} ？`, '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      loading.value = true
      try {
        await deleteUserApi({ userId })
        loading.value = false
        getUsersList()
        ElMessage.success('删除用户成功！')
      } catch (error: any) {
        ElMessage.warning('删除用户失败！')
        loading.value = false
        console.error(error)
      }
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss">
.manage {
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
