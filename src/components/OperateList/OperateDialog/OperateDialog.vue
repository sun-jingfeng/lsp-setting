<template>
  <div class="operate-dialog">
    <el-dialog
      :modelValue="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="emit('closeRadar')"
      :title="`${getPageName(props.pageType)}管理`">
      <div class="content">
        <el-input
          v-model="inputValue"
          @keyup.enter="addRadarModel"
          @input="inputChange"
          :validate-event="false">
          <template #suffix>
            <el-icon v-if="inputValue" @click="addRadarModel"><Select /></el-icon>
          </template>
        </el-input>
        <p
          class="tip"
          :class="[
            getTipStateOptions(props.pageType).find(item => item.tipState === tipState)?.className
          ]">
          {{ getTipStateOptions(props.pageType).find(item => item.tipState === tipState)?.msg }}
        </p>
        <h4 class="g-decorate">
          已有{{ getPageName(props.pageType) }}（{{ filteredDataList?.length }}）
        </h4>
        <ul v-loading="loading">
          <template v-if="filteredDataList?.length">
            <li
              v-for="(item, index) in filteredDataList"
              :key="`${index}_${item.dataId}_${item.dataContent}`">
              <p>{{ item.dataContent }}</p>
              <div>
                <el-tooltip effect="light" content="置顶">
                  <img
                    :src="getImgSrc(imgPath, systemStore.dark ? 'top-dark' : 'top')"
                    @click="
                      editData({ dataId: item.dataId, dataContent: item.dataContent, top: 1 }, true)
                    " />
                </el-tooltip>
                <el-tooltip effect="light" content="编辑">
                  <img
                    :src="getImgSrc(imgPath, systemStore.dark ? 'edit-dark' : 'edit')"
                    @click="onEditData(item)" />
                </el-tooltip>
                <el-tooltip effect="light" content="删除">
                  <img
                    :src="getImgSrc(imgPath, systemStore.dark ? 'delete-dark' : 'delete')"
                    @click="onDeleteData(item)" />
                </el-tooltip>
              </div>
            </li>
          </template>
          <Empty v-else />
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Select } from '@element-plus/icons-vue'
import {
  addRadarModelApi,
  deleteRadarModelApi,
  editRadarModelApi,
  getRadarModelListApi,
  getNumByRadarModelApi
} from '@/apis/station'
import type { IPickResponse } from '@/common/axios'
import type { IPageType } from './const'
import { getPageName, repetitionKey, getTipStateOptions, type ITipState, imgPath } from './const'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  addDisasterTagApi,
  deleteDisasterTaglApi,
  editDisasterTaglApi,
  getDisasterTaglListApi,
  getNumByDisasterTaglApi
} from '@/apis/history'
import { getImgSrc } from '@/common/utils'
import { useSystemStore } from '@/stores/system'
import Empty from '@/components/Empty/Empty.vue'

type IProps = {
  pageType?: IPageType
}

const props = withDefaults(defineProps<IProps>(), {
  pageType: 'radar'
})
const emit = defineEmits<{
  (e: 'closeRadar'): void
}>()

const systemStore = useSystemStore()

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

// 数据列表
const dataList = ref<
  IPickResponse<typeof getRadarModelListApi> | IPickResponse<typeof getDisasterTaglListApi>
>([])
const loading = ref(false)
const filteredDataList = computed(() =>
  dataList.value?.filter(item => new RegExp(inputValue.value).test(item.dataContent))
)
const getDataList = async () => {
  loading.value = true
  try {
    const { data: res } = await (props.pageType === 'radar'
      ? getRadarModelListApi
      : getDisasterTaglListApi)()
    dataList.value = res
  } catch (error: any) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
getDataList()

// 新增
const addRadarModel = async () => {
  if (inputValue.value) {
    loading.value = true
    try {
      const { data: res } = await (props.pageType === 'radar'
        ? addRadarModelApi
        : addDisasterTagApi)({ dataContent: inputValue.value })
      if (repetitionKey.test(res)) {
        tipState.value = '3'
        ElMessage.warning(res)
      } else {
        tipState.value = '2'
        ElMessage.success(`新增${getPageName(props.pageType)}成功！`)
      }
    } catch (error: any) {
      console.error(error)
      ElMessage.warning(`新增${getPageName(props.pageType)}失败！`)
    } finally {
      loading.value = false
      getDataList()
    }
  } else {
    ElMessage.warning(`请输入${getPageName(props.pageType)}！`)
  }
}

// 编辑
const onEditData = (
  originalData: Parameters<typeof editRadarModelApi>[0] | Parameters<typeof editDisasterTaglApi>[0]
) => {
  ElMessageBox.prompt(`请输入新的${getPageName(props.pageType)}`, '编辑', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: originalData.dataContent,
    inputValidator: value => {
      if (value) {
        return true
      } else {
        return `请输入${getPageName(props.pageType)}`
      }
    }
  })
    .then(({ value }) => {
      editData({ ...originalData, dataContent: value })
    })
    .catch(() => {})
}
const editData = async (
  originalData: Parameters<typeof editRadarModelApi>[0] | Parameters<typeof editDisasterTaglApi>[0],
  top?: boolean
) => {
  loading.value = true
  try {
    const { data: res } = await (props.pageType === 'radar'
      ? editRadarModelApi
      : editDisasterTaglApi)(originalData)
    if (repetitionKey.test(res)) {
      ElMessage.warning(res)
    } else {
      ElMessage.success(`${top ? '置顶' : '编辑'}${getPageName(props.pageType)}成功！`)
    }
  } catch (error: any) {
    console.error(error)
    ElMessage.warning(`${top ? '置顶' : '编辑'}${getPageName(props.pageType)}失败！`)
  } finally {
    loading.value = false
    getDataList()
  }
}

// 删除
const onDeleteData = async (
  originalData: Parameters<typeof editRadarModelApi>[0] | Parameters<typeof editDisasterTaglApi>[0]
) => {
  const num = await getNumByData(originalData.dataId)
  ElMessageBox.confirm(
    `确定删除${getPageName(props.pageType)}：${originalData.dataContent} ？（已关联 ${num} 个${
      props.pageType === 'radar' ? '台站' : '回算'
    }）`,
    '删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      deleteData({ dataId: originalData.dataId })
    })
    .catch(() => {})
}
const getNumByData = async (dataId: string) => {
  try {
    const { data: res } = await (props.pageType === 'radar'
      ? getNumByRadarModelApi
      : getNumByDisasterTaglApi)({ dataId })
    return res
  } catch (error: any) {
    console.error(error)
    return '-'
  }
}
const deleteData = async (
  targetId: Parameters<typeof deleteRadarModelApi>[0] | Parameters<typeof deleteDisasterTaglApi>[0]
) => {
  loading.value = true
  try {
    await (props.pageType === 'radar' ? deleteRadarModelApi : deleteDisasterTaglApi)(targetId)
    ElMessage.success(`删除${getPageName(props.pageType)}成功！`)
  } catch (error: any) {
    console.error(error)
    ElMessage.warning(`删除${getPageName(props.pageType)}失败！`)
  } finally {
    loading.value = false
    getDataList()
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
        background-color: var(--hover-bg);
      }
    }
  }
}

:root .operate-dialog {
  --hover-bg: #fff;
}

:root.dark .operate-dialog {
  --hover-bg: #1d3c5f;
}
</style>
