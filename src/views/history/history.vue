<template>
  <div class="history">
    <p class="g-decorate">历史回算</p>
    <div class="content">
      <Step v-model="activeStep" :stepsNum="3" :titlesList="titlesList">
        <template #content1>
          <Content1 ref="content1Ref" />
        </template>
        <template #content2>
          <Content2 ref="content2Ref" />
        </template>
        <template #content3>
          <Content3 ref="content3Ref" />
        </template>
      </Step>
    </div>
  </div>
</template>

<script setup lang="ts">
import { titlesList } from './const'
import Content1 from './Content1/Content1.vue'
import Content2 from './Content2/Content2.vue'
import Content3 from './Content3/Content3.vue'
import Step from './Step/Step.vue'

// 进度条
const activeStep = ref(2)

// 内容1
const content1Ref = ref<InstanceType<typeof Content1>>()

// 内容2
const content2Ref = ref<InstanceType<typeof Content2>>()

// 内容3
const content3Ref = ref<InstanceType<typeof Content3>>()
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
