<template>
  <div class="toolbar" :class="[props.position]">
    <el-tooltip
      v-for="(item, index) in operateList"
      :key="index"
      :content="item.tooltip"
      placement="top">
      <el-button
        :type="item.type"
        :icon="item.icon"
        circle
        size="small"
        @click="endShot(item.operate)" />
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import { operateList, type IPosition } from './const'
import { ElLoading, ElMessage, ElButton, ElTooltip, dayjs } from 'element-plus'

type IProps = {
  windowRef?: HTMLDivElement // window引用
  position?: IPosition // 工具栏位置
}

const props = withDefaults(defineProps<IProps>(), {})
const emit = defineEmits<{
  (e: 'stopShot'): void
}>()

// 结束截屏
const endShot = (operate: (typeof operateList)[0]['operate']) => {
  emit('stopShot')
  if (operate !== 'exit') {
    const { x = 0, y = 0, width = 0, height = 0 } = props.windowRef?.getBoundingClientRect() || {}
    nextTick(async () => {
      const loading = ElLoading.service({
        lock: true,
        text: '截屏中，请勿离开窗口……'
      })
      try {
        const blob = await getBlob(x, y, width, height)
        if (operate === 'copy') {
          await window.navigator.clipboard.write([
            new window.ClipboardItem({
              [blob.type]: blob
            })
          ])
          ElMessage.success('复制到剪切板成功！')
        } else if (operate === 'save') {
          saveAs(blob, `screenshot_${dayjs().format('YYYY-MM-DD')}.png`)
          ElMessage.success('保存到文件成功！')
        }
      } catch (error: any) {
        console.error(error)
        ElMessage.warning(
          error?.message === 'Document is not focused.' ? '截屏时，请勿离开窗口！' : '操作失败！'
        )
      } finally {
        loading.close()
      }
    })
  }
}
// 获取截图blob数据
const getBlob = (x: number, y: number, width: number, height: number): Promise<Blob> =>
  new Promise((resolve, reject) => {
    html2canvas(document.body, {
      x: document.documentElement.scrollLeft + x,
      y: document.documentElement.scrollTop + y,
      width: width,
      height: height
    })
      .then(canvas => {
        canvas.toBlob(blob => {
          blob === null ? reject() : resolve(blob)
        })
      })
      .catch(error => {
        console.error(error)
        reject()
      })
  })
</script>

<style scoped lang="scss">
.toolbar {
  position: absolute;
  right: 0;
  bottom: -10px;
  width: max-content;
  padding: 4px;
  background-color: #fff;
  border-radius: 4px;
  transform: translateY(100%);
}

.toolbar.top {
  top: -10px;
  bottom: unset;
  transform: translateY(-100%);
}

.toolbar.inside {
  right: 10px;
  bottom: 10px;
  transform: unset;
}
</style>
