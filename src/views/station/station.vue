<template>
  <div class="station" v-loading="loading">
    <div class="top">
      <p class="g-decorate">{{ getLabel() }}</p>
      <ul class="filter">
        <li class="left">
          <span>雷达站选择：</span>
          <el-tree-select
            v-model="filterData.radarAreaList"
            :data="radarAreaList"
            multiple
            collapse-tags
            collapse-tags-tooltip
            show-checkbox
            clearable />
          <span>生产情况：</span>
          <el-select v-model="filterData.proState" clearable>
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
          <span>雷达型号：</span>
          <el-select
            v-model="filterData.radarModelIdList"
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip>
            <el-option
              v-for="(item, index) in radarModelOptions"
              :key="index"
              :label="item.radarModel"
              :value="item.radarModelId" />
          </el-select>
        </li>
        <li>
          <el-button type="primary" @click="getStationList">查询</el-button>
          <el-button type="warning" @click="resetFilter">重置</el-button>
        </li>
      </ul>
    </div>
    <div class="operate">
      <el-button type="primary" :icon="CirclePlus" @click="addStation">新增台站</el-button>
      <el-button type="success" @click="batchChangeProState(1)">批量实时</el-button>
      <el-button type="warning" @click="batchChangeProState(0)">批量禁止</el-button>
    </div>
    <el-table :data="stationList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" width="60" align="center">
        <template #default="{ row }">
          <span>{{
            (pageNum - 1) * pageSize +
            (stationList?.findIndex(item => item.stationId === row.stationId) ?? 0) +
            1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stationNo" label="站号" />
      <el-table-column prop="stationName" label="站名" />
      <el-table-column prop="area" label="区域" />
      <el-table-column prop="province" label="省份" />
      <el-table-column prop="longitude" label="经度(°)" />
      <el-table-column prop="latitude" label="纬度(°)" />
      <el-table-column prop="altitude" label="高度(km)" />
      <el-table-column label="雷达型号">
        <template #default="{ row }">
          <span>{{
            radarModelOptions?.find(item => item.radarModelId === row.radarModelId)?.radarModel
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否实时生产" width="200">
        <template #default="{ row }">
          <el-radio-group
            :modelValue="row.proState"
            @change="changeProState(row.stationId, $event as IProState)">
            <el-radio v-for="item in stateOptions" :key="item.value" :value="item.value">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="primary" link @click="editStation(row)">编辑</el-button>
          <el-button type="danger" link @click="deleteStation(row.stationId, row.stationName)"
            >删除</el-button
          >
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
import { getLabel } from '@/components/Layout/Navigation/const'
import type { IProState } from './const'
import { initFilterData, stateOptions } from './const'
import { CirclePlus } from '@element-plus/icons-vue'
import Operate from './Operate/Operate.vue'
import { getRadarAreaListApi } from '@/apis/station'
import {
  changeProStateApi,
  deleteStationApi,
  getRadarModelListApi,
  getStationListApi
} from '@/apis/station'
import type { IPickResponse } from '@/common/axios'
import type { IOperateType, IStation } from './Operate/const'
import { ElMessage, ElMessageBox } from 'element-plus'

// 筛选区
const filterData = ref(initFilterData())
const radarAreaList = ref<IPickResponse<typeof getRadarAreaListApi>>()
const radarModelOptions = ref<IPickResponse<typeof getRadarModelListApi>>()
const getRadarAreaList = async () => {
  try {
    const { data: res } = await getRadarAreaListApi()
    radarAreaList.value = res
  } catch (error: any) {
    console.error(error)
  }
}
getRadarAreaList()
const getRadarModelList = async () => {
  try {
    const { data: res } = await getRadarModelListApi()
    radarModelOptions.value = res
  } catch (error: any) {
    console.error(error)
  }
}
getRadarModelList()
const resetFilter = () => {
  filterData.value = initFilterData()
  getStationList()
}

// 列表
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const stationList = ref<IPickResponse<typeof getStationListApi>['records']>()
const loading = ref(false)
watch([pageNum, pageSize], getStationList, {
  immediate: true,
  deep: true
})
async function getStationList() {
  loading.value = true
  try {
    const { data: res } = await getStationListApi({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      radarAreaList: filterData.value.radarAreaList,
      proState: filterData.value.proState,
      radarModelIdList: filterData.value.radarModelIdList
    })
    total.value = res.total
    stationList.value = res.records
  } catch (error: any) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 新增、编辑
const initFormData = ref<IStation>()
const operateType = ref<IOperateType>('add')
const showOperate = ref(false)
const addStation = () => {
  operateType.value = 'add'
  showOperate.value = true
}
const editStation = (i_initFormData: IStation) => {
  initFormData.value = i_initFormData
  operateType.value = 'edit'
  showOperate.value = true
}
const closeOperate = (refresh = false) => {
  refresh && getStationList()
  setTimeout(() => {
    showOperate.value = false
  }, 200)
}

// 改变生产情况
const changeProState = async (stationId: string, proState: IProState) => {
  loading.value = true
  try {
    await changeProStateApi({ stationIdList: [stationId], proState })
    loading.value = false
    getStationList()
    ElMessage.success('改变台站生产情况成功！')
  } catch (error: any) {
    ElMessage.warning('改变台站生产情况失败！')
    console.error(error)
    loading.value = false
  }
}

// 批量改变生产情况
let selectedStationIdList: string[]
const handleSelectionChange = (
  i_stationList: IPickResponse<typeof getStationListApi>['records']
) => {
  selectedStationIdList = i_stationList.map(item => item.stationId ?? '')
}
const batchChangeProState = async (proState: IProState) => {
  loading.value = true
  try {
    await changeProStateApi({ stationIdList: selectedStationIdList, proState })
    loading.value = false
    getStationList()
    ElMessage.success('改变台站生产情况成功！')
  } catch (error: any) {
    ElMessage.warning('改变台站生产情况失败！')
    loading.value = false
    console.error(error)
  }
}

// 删除
const deleteStation = (stationId: string, stationName: string) => {
  ElMessageBox.confirm(`确定删除站台：${stationName} ？`, 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      loading.value = true
      try {
        await deleteStationApi({ stationId })
        loading.value = false
        getStationList()
        ElMessage.success('删除台站成功！')
      } catch (error: any) {
        ElMessage.warning('删除台站失败！')
        loading.value = false
        console.error(error)
      }
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss">
/* stylelint-disable no-descending-specificity */
.station {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background-color: var(--g-bg-2);

  > .top {
    display: flex;
    align-items: center;
    padding: 8px 0;

    > .filter {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      width: 0;
      margin-left: 12px;

      > .left {
        display: flex;
        align-items: center;

        > span {
          margin: 0 10px 0 24px;
        }

        > .el-select {
          width: 200px;
          height: 32px;
        }
      }
    }
  }

  > .operate {
    padding: 16px 0;
  }

  > .el-table {
    flex: 1;
    height: 0;
    margin-bottom: 8px;
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
