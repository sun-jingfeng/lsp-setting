<template>
  <div class="operate-dialog">
    <el-dialog
      :modelValue="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="emit('closeRadar')"
      :title="props.pageType === 'radar' ? '雷达型号管理' : '灾害标签管理'">
      <div class="content">
        <el-input
          v-model="inputValue"
          @keyup.enter="addRadarModel"
          @input="inputChange"
          clearable
          :validate-event="false">
          <template #suffix>
            <el-icon @click="addRadarModel"><Select /></el-icon>
          </template>
        </el-input>
        <p
          class="tip"
          :class="[tipStateOptions.find(item => item.tipState === tipState)?.className]">
          {{ tipStateOptions.find(item => item.tipState === tipState)?.msg }}
        </p>
        <h4 class="g-decorate">已有雷达型号（{{ filterRadarModelOptions?.length }}）</h4>
        <ul v-loading="loading">
          <template v-if="filterRadarModelOptions?.length">
            <li
              v-for="(item, index) in filterRadarModelOptions"
              :key="`${index}_${item.radarModelId}`">
              <p>{{ item.radarModel }}</p>
              <div>
                <img
                  src="./images/top.png"
                  @click="
                    editRadarModel(
                      { radarModelId: item.radarModelId, radarModel: item.radarModel, top: 1 },
                      true
                    )
                  " />
                <el-popover trigger="click" @before-enter="editValue = item.radarModel">
                  <template #reference>
                    <img src="./images/edit.png" />
                  </template>
                  <el-input
                    v-model="editValue"
                    @keyup.enter="
                      editRadarModel({
                        radarModelId: item.radarModelId,
                        radarModel: editValue,
                        top: item.top
                      })
                    "
                    clearable />
                </el-popover>
                <el-popconfirm
                  :title="`确定删除雷达型号：${item.radarModel} ？（关联 ${stationNum} 个台站）`"
                  @confirm="deleteRadarModel({ radarModelId: item.radarModelId })"
                  @show="getStationNumByRadarModel(item.radarModelId)"
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
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Select } from '@element-plus/icons-vue'
import { getStationNumByRadarModelApi } from '@/apis/station'
import {
  addRadarModelApi,
  deleteRadarModelApi,
  editRadarModelApi,
  getRadarModelListApi
} from '@/apis/station'
import type { IPickResponse } from '@/common/axios'
import type { IPageType } from './const'
import { repetitionKey, tipStateOptions, type ITipState } from './const'
import { ElMessage } from 'element-plus'

type IProps = {
  pageType?: IPageType
}

const props = withDefaults(defineProps<IProps>(), {
  pageType: 'radar'
})
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
const radarModelOptions = ref<IPickResponse<typeof getRadarModelListApi>>()
const loading = ref(false)
const filterRadarModelOptions = computed(() =>
  radarModelOptions.value?.filter(item => new RegExp(inputValue.value).test(item.radarModel))
)
const getRadarModelList = async () => {
  loading.value = true
  try {
    const { data: res } = await getRadarModelListApi()
    radarModelOptions.value = res
  } catch (error: any) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
getRadarModelList()

// 新增
const addRadarModel = async () => {
  if (inputValue.value) {
    loading.value = true
    try {
      const { data: res } = await addRadarModelApi({ radarModel: inputValue.value })
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
      getRadarModelList()
    }
  } else {
    ElMessage.warning('请输入雷达型号！')
  }
}

// 编辑
const editValue = ref('')
const editRadarModel = async (data: Parameters<typeof editRadarModelApi>[0], top?: boolean) => {
  loading.value = true
  try {
    const { data: res } = await editRadarModelApi(data)
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
    getRadarModelList()
  }
}

// 删除
const stationNum = ref<string | number>('-')
const getStationNumByRadarModel = async (radarModelId: string) => {
  try {
    const { data: res } = await getStationNumByRadarModelApi({ radarModelId })
    stationNum.value = res
  } catch (error: any) {
    console.error(error)
  }
}
const deleteRadarModel = async (data: Parameters<typeof deleteRadarModelApi>[0]) => {
  loading.value = true
  try {
    await deleteRadarModelApi(data)
    ElMessage.success('删除雷达型号成功！')
  } catch (error: any) {
    console.error(error)
    ElMessage.warning('删除雷达型号失败！')
  } finally {
    loading.value = false
    getRadarModelList()
  }
}
</script>

<style scoped lang="scss">
.operate-dialog {
  :deep(.el-dialog) {
    width: 460px;

    > .el-dialog__body {
      padding: 0 20px;
    }
  }

  .content {
    .el-icon {
      cursor: pointer;
    }

    > .tip {
      height: 30px;
      line-height: 30px;
    }

    > .tip.success {
      color: var(--el-color-success);
    }

    > .tip.error {
      color: var(--el-color-error);
    }

    > .g-decorate {
      margin: 12px 0;
    }

    > ul {
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
}
</style>
