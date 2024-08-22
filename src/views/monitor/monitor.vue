<template>
  <div class="monitor g-page" v-loading="loading">
    <div class="top">
      <p class="g-decorate">{{ getLabel() }}</p>
      <ul class="filter">
        <li class="left">
          <span>生产情况：</span>
          <el-select v-model="filterData.business">
            <el-option
              v-for="item in businessOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
          <span>雷达台站：</span>
          <el-tree-select
            v-model="filterData.stationNoList"
            :data="stationNoOptions"
            multiple
            collapse-tags
            collapse-tags-tooltip
            show-checkbox
            clearable
            :default-expanded-keys="['全部']" />
          <template v-if="filterData.business === '1'">
            <span>个例开始时间：</span>
            <el-date-picker
              v-model="filterData.startTime"
              type="datetime"
              :format="dateFormat2"
              :value-format="dateFormat1"
              placeholder="请选择" />
            <span>个例结束时间：</span>
            <el-date-picker
              v-model="filterData.endTime"
              type="datetime"
              :format="dateFormat2"
              :value-format="dateFormat1"
              placeholder="请选择" />
          </template>
        </li>
        <li class="right">
          <el-button type="primary" @click="getDataList">查询</el-button>
          <el-button type="warning" @click="resetFilter">重置</el-button>
        </li>
      </ul>
    </div>
    <el-table :data="dataList" border>
      <el-table-column label="序号" width="60" align="center">
        <template #default="{ row }: { row: IMonitor }">
          <span>{{
            (pageNum - 1) * pageSize +
            (dataList?.findIndex(item => item.monitorId === row.monitorId) ?? 0) +
            1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务类型" align="center">
        <template #default>
          <span>{{ currentBusiness === '1' ? '历史回算' : '实时' }}</span>
        </template>
      </el-table-column>
      <template v-if="currentBusiness === '1'">
        <el-table-column prop="disasterTag" label="灾害标签" align="center" />
        <el-table-column prop="monitorId" label="个例ID" align="center" />
      </template>
      <el-table-column prop="stationName" label="站名" align="center" />
      <el-table-column prop="stationNo" label="站号" align="center" />
      <el-table-column prop="province" label="省份" align="center" />
      <el-table-column prop="area" label="区域" align="center" />
      <template v-if="currentBusiness === '1'">
        <el-table-column label="个例开始时间" align="center" width="120">
          <template #default="{ row }: { row: IMonitor }">
            <span>{{
              (row.caseStartTime && dayjs(row.caseStartTime).format(dateFormat2)) || ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="个例结束时间" align="center" width="120">
          <template #default="{ row }: { row: IMonitor }">
            <span>{{ (row.caseEndTime && dayjs(row.caseEndTime).format(dateFormat2)) || '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产开始时间" align="center" width="120">
          <template #default="{ row }: { row: IMonitor }">
            <span>{{
              (row.productionStartTime && dayjs(row.productionStartTime).format(dateFormat2)) || ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产结束时间" align="center" width="120">
          <template #default="{ row }: { row: IMonitor }">
            <span>{{
              (row.productionEndTime && dayjs(row.productionEndTime).format(dateFormat2)) || ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单提交时间" align="center" width="120">
          <template #default="{ row }: { row: IMonitor }">
            <span>{{
              (row.orderSubmitTime && dayjs(row.orderSubmitTime).format(dateFormat2)) || ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="进度" align="center" width="160">
          <template #default="{ row }: { row: IMonitor }">
            <span v-if="(row.progress ?? 0) >= 100">{{
              row.progress === 404 ? '暂无数据' : '完成'
            }}</span>
            <el-progress v-else :percentage="row.progress" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }: { row: IMonitor }">
            <el-button type="danger" link @click="deleteData(row.monitorId!)">
              <img class="button-icon" src="./images/delete.png" />
              <span>删除</span>
            </el-button>
          </template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column label="订单提交时间" align="center" width="200">
          <template #default="{ row }: { row: IMonitor }">
            <span>{{
              (row.orderSubmitTime2 && dayjs(row.orderSubmitTime2).format(dateFormat2)) || ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据最新时间" align="center" width="200">
          <template #default="{ row }: { row: IMonitor }">
            <span>{{ (row.latestTime && dayjs(row.latestTime).format(dateFormat2)) || '' }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" />
  </div>
</template>

<script setup lang="ts">
import type { IPickResponse } from '@/common/axios'
import { dateFormat1, dateFormat2 } from '@/common/date'
import { getLabel } from '@/components/Layout/Navigation/const'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import type { IBusiness, IMonitor } from './const'
import { businessOptions, initFilterData } from './const'
import { getStationNoOptionsApi } from '@/apis/station'
import { deleteDataApi, getDataListApi } from '@/apis/monitor'

// 筛选区
const filterData = ref(initFilterData())
const stationNoOptions = ref<IPickResponse<typeof getStationNoOptionsApi>>()
const getRadarAreaList = async () => {
  try {
    const { data: res } = await getStationNoOptionsApi()
    stationNoOptions.value = res
  } catch (error: any) {
    console.error(error)
  }
}
getRadarAreaList()
const resetFilter = () => {
  filterData.value = initFilterData()
  getDataList()
}

// 列表
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const dataList = ref<IPickResponse<typeof getDataListApi>['records']>()
const currentBusiness = ref<IBusiness>()
const loading = ref(false)
watch([pageNum, pageSize], getDataList, {
  immediate: true,
  deep: true
})
async function getDataList() {
  loading.value = true
  try {
    const { data: res } = await getDataListApi({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      ...filterData.value
    })
    total.value = res.total
    dataList.value = res.records
    currentBusiness.value = res.business
  } catch (error: any) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 删除
const deleteData = (monitorId: string) => {
  ElMessageBox.confirm(`确定删除历史回算：${monitorId} ？`, '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      loading.value = true
      try {
        await deleteDataApi({ monitorId })
        loading.value = false
        getDataList()
        ElMessage.success('删除历史回算成功！')
      } catch (error: any) {
        ElMessage.warning('删除历史回算失败！')
        loading.value = false
        console.error(error)
      }
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss">
.monitor {
  display: flex;
  flex-direction: column;

  > .top {
    display: flex;
    align-items: center;
    padding: 8px 0;
    font-weight: 700;
    color: var(--g-text-color-2);

    > .filter {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      width: 0;
      margin-left: 12px;

      > .left {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: -8px;

        > span {
          margin: 6px 10px 8px 24px;
        }

        > .el-select {
          width: 200px;
          height: 32px;
          margin-bottom: 8px;
        }
      }

      > .right {
        flex-shrink: 0;
      }
    }
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
