<template>
  <div class="content1">
    <div class="title">雷达台站选择</div>
    <div class="table-box">
      <div class="left" v-loading="loading">
        <div class="top">
          <span>待选列表</span>
          <span>{{ leftCheckedStations.length }}</span>
        </div>
        <el-input
          v-model="leftInputValue"
          placeholder="请输入雷达站名、站号"
          @keyup.enter="getLeftStationList">
          <template #suffix>
            <el-icon @click="getLeftStationList"><Search /></el-icon>
          </template>
        </el-input>
        <div class="content">
          <ul class="province">
            <li
              v-for="(item, index) in provinceList"
              :key="index"
              class="g-ellipsis"
              :class="{ active: currentProvince === item.value }"
              @click="currentProvince = item.value">
              {{ item.label }}
            </li>
          </ul>
          <div class="table">
            <ul>
              <li>
                <div class="selection">
                  <el-checkbox
                    v-model="checkAll"
                    :indeterminate="isIndeterminate"
                    @change="handleCheckAllChange" />
                </div>
                <div>雷达站名</div>
                <div>雷达站号</div>
              </li>
            </ul>
            <ul>
              <li
                v-for="(item, index) in leftStationList"
                :key="index"
                :class="{ checked: rightCheckedStations.has(item.stationNo!)}">
                <div class="selection">
                  <el-checkbox-group
                    v-model="leftCheckedStations"
                    @change="handleCheckedCitiesChange">
                    <el-checkbox :value="item.stationNo" />
                  </el-checkbox-group>
                </div>
                <div>{{ item.stationName }}</div>
                <div>{{ item.stationNo }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <el-button type="primary" :icon="ArrowRight" circle @click="transfer" />
      <div class="right">
        <div class="top">
          <div>
            <span class="g-mr-sm">已选列表</span>
            <span>{{ rightCheckedStations.size }}/{{ checkLimit }}</span>
          </div>
          <el-icon @click="rightCheckedStations = new Set()"><Delete /></el-icon>
        </div>
        <el-input
          v-model="rightInputValue"
          placeholder="请输入雷达站名、站号"
          @keyup.enter="getFilteredStationList">
          <template #suffix>
            <el-icon @click="getFilteredStationList"><Search /></el-icon>
          </template>
        </el-input>
        <div class="content">
          <div class="table">
            <ul>
              <li>
                <div>雷达站名</div>
                <div>雷达站号</div>
                <div>操作</div>
              </li>
            </ul>
            <ul>
              <li v-for="(item, index) in filteredStationList" :key="index">
                <div>{{ item.stationName }}</div>
                <div>{{ item.stationNo }}</div>
                <div>
                  <el-icon @click="rightCheckedStations.delete(item.stationNo!)"
                    ><CloseBold
                  /></el-icon>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="title">雷达产品选择</div>
    <el-cascader
      v-model="radarProducts"
      :options="radarProductOptions"
      :props="{ multiple: true, emitPath: false, expandTrigger: 'hover' }"
      clearable />
  </div>
</template>

<script setup lang="ts">
import { getProvinceListApi } from '@/apis/history'
import { getStationListApi } from '@/apis/station'
import type { IPickResponse } from '@/common/axios'
import type { IAreaList } from '@/views/station/Operate/const'
import { ArrowRight, Search } from '@element-plus/icons-vue'
import { checkLimit, radarProductOptions } from './const'
import { ElMessage } from 'element-plus'

// 左 - 开始
// 搜索框
const leftInputValue = ref('')

// 省份
const provinceList = ref<IAreaList>([])
const currentProvince = ref('')
const getProvinceList = async () => {
  try {
    const { data: res } = await getProvinceListApi()
    provinceList.value = res
    currentProvince.value = res[0].value ?? ''
  } catch (error: any) {
    console.error(error)
  }
}
getProvinceList()

// 表格
const leftStationList = ref<IPickResponse<typeof getStationListApi>['records']>([])
const loading = ref(false)
watch(currentProvince, getLeftStationList)
async function getLeftStationList() {
  loading.value = true
  try {
    const { data: res } = await getStationListApi({
      pageNum: 1,
      pageSize: 99999,
      radarAreaList: currentProvince.value ? [currentProvince.value] : undefined,
      nameOrNo: leftInputValue.value || undefined
    })
    leftStationList.value = res.records
    resetCheck()
  } catch (error: any) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 选择
const checkAll = ref(false)
const isIndeterminate = ref(false)
const leftCheckedStations = ref<string[]>([])
const resetCheck = () => {
  checkAll.value = false
  isIndeterminate.value = false
  leftCheckedStations.value = []
}
const handleCheckAllChange = (val: boolean) => {
  leftCheckedStations.value = val ? leftStationList.value.map(item => item.stationNo!) : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === leftStationList.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < leftStationList.value.length
}
// 左 - 结束

// 穿梭
const transfer = () => {
  const result = new Set([...rightCheckedStations.value, ...leftCheckedStations.value])
  if (result.size > checkLimit) {
    ElMessage.warning(`最多选择 ${checkLimit} 个雷达台站！`)
  } else {
    rightCheckedStations.value = result
    resetCheck()
  }
}

// 右 - 开始
// 搜索框
const rightInputValue = ref('')

// 选中
const rightCheckedStations = ref<Set<string>>(new Set())

// 表格
const rightStationList = ref<IPickResponse<typeof getStationListApi>['records']>([])
const filteredStationList = ref<IPickResponse<typeof getStationListApi>['records']>([])
watch(rightCheckedStations, getFilteredStationList, { deep: true, immediate: true })
function getFilteredStationList() {
  const regExp = new RegExp(rightInputValue.value, 'i')
  filteredStationList.value = [...rightCheckedStations.value]
    .map(item => rightStationList.value.find(item2 => item2.stationNo! === item))
    .filter(
      item => item && (regExp.test(item.stationName) || regExp.test(item.stationNo))
    ) as IPickResponse<typeof getStationListApi>['records']
}
async function getRightStationList() {
  try {
    const { data: res } = await getStationListApi({
      pageNum: 1,
      pageSize: 99999
    })
    rightStationList.value = res.records
  } catch (error: any) {
    console.error(error)
  }
}
getRightStationList()
// 右 - 结束

// 雷达产品
const radarProducts = ref<string[]>([])

defineExpose({
  stations: rightCheckedStations,
  radarProducts
})
</script>

<style scoped lang="scss">
.content1 {
  padding: 12px 0;

  > .title {
    margin: 8px 0;
    font-size: 18px;
    font-weight: 500;
  }

  > .table-box {
    display: flex;
    align-items: center;

    > .left,
    > .right {
      width: 430px;
      height: 530px;
      background: #0b2341;
      border: 1px solid #102c4e;
      border-radius: 4px;

      > .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        padding: 0 12px;
        background: #102c4e;
      }

      > .el-input {
        padding: 8px;
      }

      > .content {
        display: flex;
        height: 430px;

        > .province {
          width: 96px;
          overflow: auto;

          &::-webkit-scrollbar {
            width: 0;
            height: 0;
          }

          > li {
            height: 36px;
            padding-left: 16px;
            line-height: 36px;
            cursor: pointer;
          }

          > li.active {
            background-color: #006aff;
          }
        }

        > .table {
          flex: 1;
          width: 0;

          > ul {
            > li {
              display: flex;

              > div {
                display: flex;
                flex: 1;
                align-items: center;
                justify-content: center;
                height: 36px;
                background-color: #0a274a;
              }

              > div + div {
                margin-left: 2px;
              }

              > .selection {
                flex: initial;
                width: 50px;

                :deep(.el-checkbox__label) {
                  display: none;
                }
              }
            }

            > li.checked {
              color: #006aff;
            }
          }

          > ul:nth-child(2) {
            height: calc(100% - 36px);
            overflow: auto;

            &::-webkit-scrollbar {
              width: 0;
              height: 0;
            }
          }
        }
      }
    }

    > .el-button {
      margin: 0 50px;
    }

    .el-icon {
      cursor: pointer;
    }
  }

  :deep(> .el-cascader) {
    width: 992px;

    /* stylelint-disable-next-line no-descending-specificity */
    > .el-input {
      min-height: 36px;
    }
  }
}
</style>
