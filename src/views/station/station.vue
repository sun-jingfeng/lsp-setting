<template>
  <div class="station">
    <div class="top">
      <p class="g-decorate">{{ getLabel() }}</p>
      <ul class="filter">
        <li class="left">
          <span>雷达站选择：</span>
          <el-tree-select
            v-model="area"
            :data="areaOptions"
            multiple
            collapse-tags
            collapse-tags-tooltip
            show-checkbox
            clearable />
          <span>生产情况：</span>
          <el-select v-model="state" clearable>
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
          <span>雷达型号：</span>
          <el-select v-model="model" clearable>
            <el-option
              v-for="item in modelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </li>
        <li class="right">
          <el-button type="primary">查询</el-button>
          <el-button type="danger">重置</el-button>
        </li>
      </ul>
    </div>
    <div class="operate">
      <el-button type="primary" :icon="CirclePlus">新增站点</el-button>
      <el-button type="success">批量实时</el-button>
      <el-button type="danger">批量禁止</el-button>
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
</template>

<script setup lang="ts">
import { getLabel } from '@/components/Layout/Navigation/const'
import {
  areaOptions,
  type IModel,
  type IState,
  modelOptions,
  stateOptions,
  tableData
} from './const'
import { CirclePlus } from '@element-plus/icons-vue'

const area = ref<string>()
const state = ref<IState>()
const model = ref<IModel>()

const total = ref(100)
const currentPage = ref(4)
const pageSize = ref(10)
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
          --el-fill-color-blank: var(--g-color-4);
          --el-border-color: var(--g-color-4);
          --el-text-color-regular: var(--g-text-color);
          --el-color-info-light-9: var(--g-color-7);
          --el-color-info: var(--g-text-color);

          width: 200px;
          height: 32px;
        }
      }

      > .right {
        > .el-button:nth-child(1) {
          --el-button-border-color: var(--g-color);
          --el-button-bg-color: var(--g-color);
        }

        > .el-button:nth-child(2) {
          --el-button-border-color: var(--g-color-6);
          --el-button-bg-color: var(--g-color-6);
        }
      }
    }
  }

  > .operate {
    padding: 8px 0;

    > .el-button:nth-child(1) {
      --el-button-border-color: var(--g-color);
      --el-button-bg-color: var(--g-color);
    }

    > .el-button:nth-child(2) {
      --el-button-border-color: var(--g-color-5);
      --el-button-bg-color: var(--g-color-5);
    }

    > .el-button:nth-child(3) {
      --el-button-border-color: var(--g-color-6);
      --el-button-bg-color: var(--g-color-6);
    }
  }

  > .el-table {
    --el-bg-color: var(--g-bg-2);
    --el-table-border-color: var(--g-color-8);
    --el-table-row-hover-bg-color: var(--g-color-8);
    --el-table-text-color: var(--g-text-color);
    --el-table-header-text-color: var(--g-text-color);

    flex: 1;
    height: 0;
    margin-bottom: 8px;
  }

  > .el-pagination {
    --el-text-color-regular: var(--g-text-color);
    --el-fill-color-blank: var(--g-bg-2);
    --el-border-color: var(--g-color-4);
    --el-text-color-primary: var(--g-text-color);

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
