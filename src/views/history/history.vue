<template>
  <div class="history">
    <p class="g-decorate">历史回算</p>
    <div class="content">
      <Step
        v-model="activeStep"
        :stepsNum="3"
        :titlesList="titlesList"
        @confirm="submit"
        v-loading="loading">
        <template #content1>
          <Content1 :key="contentKey" ref="content1Ref" />
        </template>
        <template #content2>
          <Content2 :key="contentKey" ref="content2Ref" />
        </template>
        <template #content3>
          <Content3 :key="contentKey" ref="content3Ref" />
        </template>
      </Step>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { titlesList } from './const'
import Content1 from './Content1/Content1.vue'
import Content2 from './Content2/Content2.vue'
import Content3 from './Content3/Content3.vue'
import Step from './Step/Step.vue'
import { addHistoryApi } from '@/apis/history'

// 进度条
const activeStep = ref(1)

// 内容1
const contentKey = ref(1)
const content1Ref = ref<InstanceType<typeof Content1>>()
const stations = computed(() => content1Ref.value?.stations)
const radarProducts = computed(() => content1Ref.value?.radarProducts)

// 内容2
const content2Ref = ref<InstanceType<typeof Content2>>()
const dateTimeRange = computed(() => content2Ref.value?.dateTimeRange)

// 内容3
const content3Ref = ref<InstanceType<typeof Content3>>()
const disasterTags = computed(() => content3Ref.value?.disasterTags)

// 提交
const loading = ref(false)
const submit = () => {
  ElMessageBox.confirm('确定新增历史回算？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      if (
        stations.value?.size &&
        radarProducts.value?.length &&
        dateTimeRange.value?.every(item => Boolean(item)) &&
        disasterTags.value?.length
      ) {
        loading.value = true
        try {
          await addHistoryApi({
            stations: stations.value,
            radarProducts: radarProducts.value,
            dateTimeRange: dateTimeRange.value,
            disasterTags: disasterTags.value
          })
          ElMessage.success('新增历史回算成功！')
          contentKey.value++
          activeStep.value = 1
        } catch (error: any) {
          ElMessage.error('新增历史回算失败！')
          console.error(error)
        } finally {
          loading.value = false
        }
      } else {
        ElMessage.warning('请将信息填写完整后重试！')
      }
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss">
.history {
  display: flex;
  flex-direction: column;
  width: max-content;
  height: 100%;
  margin-left: 18%;

  > .g-decorate {
    margin: 8px 0 20px;
  }

  > .content {
    flex: 1;
    height: 0;
    overflow: auto;
  }
}
</style>
