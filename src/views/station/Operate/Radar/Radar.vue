<template>
  <div class="radar">
    <el-dialog
      :modelValue="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="emit('closeRadar')"
      title="雷达型号管理">
      <el-input v-model="inputValue" @keyup.enter="addRadarType" @input="inputChange" clearable>
        <template #suffix>
          <el-icon @click="addRadarType"><Select /></el-icon>
        </template>
      </el-input>
      <p class="tip" :class="[tipStateOptions.find(item => item.tipState === tipState)?.className]">
        {{ tipStateOptions.find(item => item.tipState === tipState)?.msg }}
      </p>
      <h4 class="g-decorate">已有雷达型号（{{ filterRadarTypeOptions?.length }}）</h4>
      <ul v-loading="loading">
        <template v-if="filterRadarTypeOptions?.length">
          <li v-for="(item, index) in filterRadarTypeOptions" :key="`${index}_${item.radarId}`">
            <p>{{ item.radarType }}</p>
            <div>
              <img
                src="./images/top.png"
                @click="
                  editRadarType({ radarId: item.radarId, radarType: item.radarType, top: 1 }, true)
                " />
              <el-popover trigger="click" @before-enter="editValue = item.radarType">
                <template #reference>
                  <img src="./images/edit.png" />
                </template>
                <el-input
                  v-model="editValue"
                  @keyup.enter="
                    editRadarType({ radarId: item.radarId, radarType: editValue, top: item.top })
                  "
                  clearable />
              </el-popover>
              <el-popconfirm
                :title="`确定删除雷达类型：${item.radarType} ？（关联 ${stationNum} 个台站）`"
                @confirm="deleteRadarType({ radarId: item.radarId })"
                @show="getStationNumByRadarType(item.radarId)"
                @hide="stationNum = '-'">
                <template #reference>
                  <img src="./images/delete.png" />
                </template>
              </el-popconfirm>
            </div>
          </li>
        </template>
        <el-empty v-else description="暂无数据" :image-size="80" />
      </ul>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Select } from '@element-plus/icons-vue'
import { getStationNumByRadarTypeApi } from '@/apis/station'
import {
  addRadarTypeApi,
  deleteRadarTypeApi,
  editRadarTypeApi,
  getRadarTypeListApi
} from '@/apis/station'
import type { IPickResponse } from '@/common/axios'
import { repetitionKey, tipStateOptions, type ITipState } from './const'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  (e: 'closeRadar'): void
}>()

// 输入框
const inputValue = ref('')
const inputChange = () => {
  if (inputValue.value) {
    tipState.value = '0'
  } else {
    tipState.value = '1'
  }
}

// 提示状态
const tipState = ref<ITipState>('0')

// 列表
const radarTypeOptions = ref<IPickResponse<typeof getRadarTypeListApi>>()
const loading = ref(false)
const filterRadarTypeOptions = computed(() =>
  radarTypeOptions.value?.filter(item => new RegExp(inputValue.value).test(item.radarType))
)
const getRadarTypeList = async () => {
  loading.value = true
  try {
    const { data: res } = await getRadarTypeListApi()
    radarTypeOptions.value = res
  } catch (error: any) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
getRadarTypeList()

// 新增
const addRadarType = async () => {
  if (inputValue.value) {
    loading.value = true
    try {
      const { data: res } = await addRadarTypeApi({ radarType: inputValue.value })
      if (repetitionKey.test(res)) {
        tipState.value = '3'
        ElMessage.warning(res)
      } else {
        tipState.value = '2'
        ElMessage.success('新增雷达型号成功！')
      }
    } catch (error: any) {
      console.error(error)
      ElMessage.warning('新增雷达型号失败！')
    } finally {
      loading.value = false
      getRadarTypeList()
    }
  } else {
    ElMessage.warning('请输入雷达型号！')
  }
}

// 编辑
const editValue = ref('')
const editRadarType = async (data: Parameters<typeof editRadarTypeApi>[0], top?: boolean) => {
  loading.value = true
  try {
    const { data: res } = await editRadarTypeApi(data)
    if (repetitionKey.test(res)) {
      ElMessage.warning(res)
    } else {
      ElMessage.success(`${top ? '置顶' : '编辑'}雷达型号成功！`)
    }
  } catch (error: any) {
    console.error(error)
    ElMessage.warning(`${top ? '置顶' : '编辑'}雷达型号失败！`)
  } finally {
    loading.value = false
    getRadarTypeList()
  }
}

// 删除
const stationNum = ref<string | number>('-')
const getStationNumByRadarType = async (radarId: string) => {
  try {
    const { data: res } = await getStationNumByRadarTypeApi({ radarId })
    stationNum.value = res
  } catch (error: any) {
    console.error(error)
  }
}
const deleteRadarType = async (data: Parameters<typeof deleteRadarTypeApi>[0]) => {
  loading.value = true
  try {
    await deleteRadarTypeApi(data)
    ElMessage.success('删除雷达型号成功！')
  } catch (error: any) {
    console.error(error)
    ElMessage.warning('删除雷达型号失败！')
  } finally {
    loading.value = false
    getRadarTypeList()
  }
}
</script>

<style scoped lang="scss">
.radar {
  :deep(.el-dialog) {
    width: 460px;

    > .el-dialog__body {
      padding: 0 20px;
    }
  }

  .el-icon {
    cursor: pointer;
  }

  .tip {
    height: 30px;
    line-height: 30px;
  }

  .tip.success {
    color: var(--el-color-success);
  }

  .tip.error {
    color: var(--el-color-error);
  }

  .g-decorate {
    margin: 12px 0;
  }

  ul {
    height: 304px;
    overflow: auto;

    > li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 38px;
      padding: 0 12px;

      > div {
        > img {
          padding: 4px;
          pointer-events: initial;
          cursor: pointer;
        }
      }
    }

    > li:hover {
      background-color: var(--g-text-color-bg);
    }
  }
}
</style>
