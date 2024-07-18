<template>
  <div class="station" v-loading="loading">
    <div class="top">
      <p class="g-decorate">{{ getLabel() }}</p>
      <ul class="filter">
        <li class="left">
          <span>雷达站选择：</span>
          <el-tree-select
            v-model="filterData.radarArea"
            :data="areaOptions"
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
          <el-select v-model="filterData.radarType" clearable>
            <el-option
              v-for="(item, index) in radarTypeOptions"
              :key="index"
              :label="item.radarType"
              :value="item.id" />
          </el-select>
        </li>
        <li>
          <el-button type="primary" @click="getStationList">查询</el-button>
          <el-button type="warning" @click="filterData = {}">重置</el-button>
        </li>
      </ul>
    </div>
    <div class="operate">
      <el-button type="primary" :icon="CirclePlus" @click="addStation">新增台站</el-button>
      <el-button type="success">批量实时</el-button>
      <el-button type="warning">批量禁止</el-button>
    </div>
    <el-table :data="stationList" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="stationNo" label="站号" />
      <el-table-column prop="stationName" label="站名" />
      <el-table-column prop="area" label="区域" />
      <el-table-column prop="province" label="省份" />
      <el-table-column prop="longitude" label="经度(°)" />
      <el-table-column prop="latitude" label="纬度(°)" />
      <el-table-column prop="altitude" label="高度(km)" />
      <el-table-column prop="radarType" label="雷达型号" />
      <el-table-column label="是否实时生产" width="200">
        <template #default="{ row }">
          <el-radio-group :modelValue="row.proState">
            <el-radio v-for="item in stateOptions" :key="item.value" :value="item.value">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <el-button type="primary" link>编辑</el-button>
        <el-button type="danger" link>删除</el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" />
  </div>
  <Operate v-if="showOperate" :operateType="operateType" @closeOperate="closeOperate" />
</template>

<script setup lang="ts">
import { getLabel } from '@/components/Layout/Navigation/const'
import { areaOptions, type IProState, stateOptions } from './const'
import { CirclePlus } from '@element-plus/icons-vue'
import Operate from './Operate/Operate.vue'
import { getRadarTypeListApi, getStationListApi } from '@/apis/station'
import type { IPickResponse } from '@/common/axios'
import type { IOperateType } from './Operate/const'

// 筛选区
const filterData = ref<{
  radarArea?: string
  proState?: IProState
  radarType?: string
}>({})
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

// 列表
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const stationList = ref<IPickResponse<typeof getStationListApi>['records']>()
const loading = ref(false)
watch([filterData, pageNum, pageSize], getStationList, {
  immediate: true,
  deep: true
})
async function getStationList() {
  loading.value = true
  try {
    const { data: res } = await getStationListApi({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      proState: filterData.value.proState,
      radarType: filterData.value.radarType
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
const operateType = ref<IOperateType>('add')
const showOperate = ref(false)
const addStation = () => {
  operateType.value = 'add'
  showOperate.value = true
}
const editStation = () => {
  operateType.value = 'edit'
  showOperate.value = true
}
const closeOperate = (refresh = false) => {
  refresh && getStationList()
  setTimeout(() => {
    showOperate.value = false
  }, 200)
}

// 删除
</script>

<style scoped lang="scss">
/* stylelint-disable no-descending-specificity */
.station {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
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
          margin: 0 10px;
        }

        > .el-select {
          width: 200px;
          height: 32px;
        }
      }
    }
  }

  > .operate {
    padding: 8px 0;
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
