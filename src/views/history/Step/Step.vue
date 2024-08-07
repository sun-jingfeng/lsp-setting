<template>
  <ul class="step">
    <li
      v-for="(noUse, index) in new Array(props.stepsNum)"
      :key="index"
      :class="{ active: modelValue > index }">
      <div class="left">
        <div class="ball">
          <el-icon v-if="modelValue > index + 1"><Select /></el-icon>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div
          v-if="index !== props.stepsNum - 1"
          class="line"
          :class="[
            { finish: modelValue > index + 1 },
            { 'active-next': index + 1 === props.modelValue }
          ]" />
      </div>
      <div class="right">
        <div class="title">
          <p>{{ props.titlesList[index]?.title }}</p>
          <p v-if="props.titlesList[index]?.description">
            {{ props.titlesList[index]?.description }}
          </p>
        </div>
        <div v-show="modelValue === index + 1">
          <slot :name="`content${index + 1}`" />
        </div>
        <div v-if="modelValue === index + 1" class="control">
          <el-button
            v-if="index !== 0"
            type="warning"
            @click="emit('update:modelValue', props.modelValue - 1)"
            >上一步</el-button
          >
          <el-button
            v-if="index !== props.stepsNum - 1"
            type="primary"
            @click="emit('update:modelValue', props.modelValue + 1)"
            >下一步</el-button
          >
          <el-button v-if="index === props.stepsNum - 1" type="primary" @click="emit('confirm')"
            >确认</el-button
          >
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
type IProps = {
  modelValue: number
  stepsNum: number
  titlesList: { title: string; description?: string }[]
}

const props = withDefaults(defineProps<IProps>(), {})
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'confirm'): void
}>()
</script>

<style scoped lang="scss">
.step {
  > li {
    display: flex;

    > .left {
      display: flex;
      flex-direction: column;
      align-items: center;

      > .ball {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        font-size: 20px;
        color: var(--title-color);
        border: 2px solid var(--title-color);
        border-radius: 50%;
      }

      > .line {
        flex: 1;
        margin: 4px 0;
        border-right: 2px dashed #d4d6d9;
      }

      > .line.finish {
        border-right-color: #006aff;
        border-right-style: solid;
      }

      > .line.active-next {
        border-right-color: #006aff;
      }
    }

    > .right {
      margin-left: 8px;

      > .title {
        color: var(--title-color);

        > p:nth-child(1) {
          margin: 8px 0;
          font-size: 18px;
          font-weight: 500;
        }
      }

      > .control {
        padding: 8px 0 24px;

        > .el-button {
          width: 84px;
        }
      }
    }
  }

  > li.active {
    > .left {
      > .ball {
        color: #fff;
        background-color: #006aff;
        border-color: #006aff;
      }
    }

    > .right {
      > .title {
        color: var(--g-text-color-2);
      }
    }
  }

  > li:not(:last-child) {
    min-height: 120px;
  }
}

:root .step {
  --title-color: var(--g-text-color-3);
}

:root.dark .step {
  --title-color: #bbbdbf;
}
</style>
