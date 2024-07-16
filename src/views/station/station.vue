<template>
  <div class="station">
    <div class="top">
      <p class="g-decorate">{{ getLabel() }}</p>
      <ul class="filter">
        <li class="left">
          <span>雷达站选择：</span>
          <el-tree-select
            v-model="radarArea"
            :data="areaOptions"
            multiple
            collapse-tags
            collapse-tags-tooltip
            show-checkbox
            clearable />
          <span>生产情况：</span>
          <el-select v-model="proState" clearable>
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
          <span>雷达型号：</span>
          <el-select v-model="radarType" clearable>
            <el-option
              v-for="(item, index) in radarTypeOptions"
              :key="index"
              :label="item.radarType"
              :value="item.radarType" />
          </el-select>
        </li>
        <li>
          <el-button type="primary">查询</el-button>
          <el-button type="warning">重置</el-button>
        </li>
      </ul>
    </div>
    <div class="operate">
      <el-button type="primary" :icon="CirclePlus" @click="operateRef?.showDialog('add')"
        >新增站点</el-button
      >
      <el-button type="success">批量实时</el-button>
      <el-button type="warning">批量禁止</el-button>
    </div>
    <el-table :data="tableData" border>
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" />
  </div>
  <Operate ref="operateRef" />
</template>

<script setup lang="ts">
import { getLabel } from '@/components/Layout/Navigation/const'
import { areaOptions, type IProState, stateOptions, tableData } from './const'
import { CirclePlus } from '@element-plus/icons-vue'
import Operate from './Operate/Operate.vue'
import { getRadarTypeListApi } from '@/apis/station'
import type { IPickResponse } from '@/common/axios'

const radarArea = ref<string>()
const proState = ref<IProState>()
const radarType = ref<string>()
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

const total = ref(100)
const currentPage = ref(4)
const pageSize = ref(10)

// 新增/编辑
const operateRef = ref<InstanceType<typeof Operate>>()
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
