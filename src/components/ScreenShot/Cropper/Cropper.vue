<template>
  <div v-if="shotting" ref="cropperRef" class="cropper" @mouseup="resetMouseEvent">
    <div ref="maskRef" class="mask" @wheel.prevent />
    <div ref="windowRef" class="window" @mousedown.prevent="mousedown" @wheel.prevent>
      <div
        v-for="(item, index) in new Array(8)"
        class="circle"
        :key="index"
        @mousedown.prevent.stop="mousedown($event, true, index)" />
      <Toolbar
        ref="toolbarRef"
        :position="toolbarPosition"
        :windowRef="windowRef"
        @mousedown.stop
        @stopShot="stopShot" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import Toolbar from './Toolbar/Toolbar.vue'
import type { IPosition } from './Toolbar/const'

export type IProps = {
  maskZIndex?: number // 遮罩层的z-index
  windowWidth?: number // 初始视窗width
  windowHeight?: number // 初始视窗height
}

const props = withDefaults(defineProps<IProps>(), {
  maskZIndex: 999,
  windowWidth: 600,
  windowHeight: 400
})

// 视窗
const cropperRef = ref<HTMLDivElement>()
const maskRef = ref<HTMLDivElement>()
const windowRef = ref<HTMLDivElement>()
const shotting = ref(false) // 截图中
let stopResizeObserver: () => void | undefined
let mousePosition: { x: number; y: number } | undefined // 鼠标位置
let clickMouseCircle = false // 鼠标在圆圈上按下
let mouseCircleIndex = -1 // 圆圈的index，左上角是0，瞬时针递增
// 开启截图
const startShot = () => {
  shotting.value = true
  nextTick(() => {
    setIndex()
    initWindow()
    setMaskBorderWidth()
  })
  document.documentElement.addEventListener('keyup', escListener)
  stopResizeObserver = useResizeObserver(
    document.documentElement,
    () => {
      initWindow()
      setMaskBorderWidth()
    },
    {
      box: 'border-box'
    }
  ).stop
}
// 设置遮罩层的层级、视窗的层级
const setIndex = () => {
  maskRef.value && (maskRef.value.style.zIndex = String(props.maskZIndex - 1))
  windowRef.value && (windowRef.value.style.zIndex = String(props.maskZIndex))
}
// 初始化视窗初始位置、工具栏位置
const initWindow = () => {
  nextTick(() => {
    if (windowRef.value) {
      const viewWidth = document.documentElement.clientWidth
      const viewHeight = document.documentElement.clientHeight
      windowRef.value.style.width =
        viewWidth > props.windowWidth + 200 ? props.windowWidth + 'px' : viewWidth / 2 + 'px'
      windowRef.value.style.height =
        viewHeight > props.windowHeight + 200 ? props.windowHeight + 'px' : viewHeight / 2 + 'px'
      windowRef.value.style.top = (viewHeight - windowRef.value.offsetHeight) / 2 + 'px'
      windowRef.value.style.left = (viewWidth - windowRef.value.offsetWidth) / 2 + 'px'
    }
    toolbarPosition.value = undefined
  })
}
// 根据视窗的位置改变遮罩层的边框宽度
const setMaskBorderWidth = () => {
  nextTick(() => {
    const windowRect = windowRef.value?.getBoundingClientRect()
    maskRef.value &&
      windowRect &&
      (maskRef.value.style.borderWidth = `${windowRect.top}px ${
        document.documentElement.clientWidth - windowRect.right
      }px ${document.documentElement.clientHeight - windowRect.bottom}px ${windowRect.left}px`)
  })
}
// 鼠标按下（添加prevent修饰符以解决偶尔出现的鼠标变成禁止拖拽图标的bug）
const mousedown = (event: MouseEvent, circle?: boolean, index?: number) => {
  mousePosition = {
    x: event.clientX,
    y: event.clientY
  }
  clickMouseCircle = circle ?? false
  mouseCircleIndex = index ?? -1
  cropperRef.value?.addEventListener('mousemove', mousemove)
  cropperRef.value?.addEventListener('mouseleave', resetMouseEvent)
}
// 鼠标移动
const mousemove = (event: MouseEvent) => {
  if (mousePosition) {
    if (clickMouseCircle && mouseCircleIndex > -1) {
      resizeWindow(event)
    } else {
      moveWindow(event)
    }
  }
}
// 调整视窗尺寸
const resizeWindow = (event: MouseEvent) => {
  const { x, y, increaseWidth, increaseHeight, reduceWidth, reduceHeight } =
    getDirectionAndSize(event)
  switch (mouseCircleIndex) {
    case 0:
      changeWindow({ x, y, width: reduceWidth, height: reduceHeight })
      break
    case 1:
      changeWindow({ y, height: reduceHeight })
      break
    case 2:
      changeWindow({ y, width: increaseWidth, height: reduceHeight })
      break
    case 3:
      changeWindow({ width: increaseWidth })
      break
    case 4:
      changeWindow({ width: increaseWidth, height: increaseHeight })
      break
    case 5:
      changeWindow({ height: increaseHeight })
      break
    case 6:
      changeWindow({ x, width: reduceWidth, height: increaseHeight })
      break
    case 7:
      changeWindow({ x, width: reduceWidth })
      break
    default:
      return
  }
}
// 获取位移数据和尺寸数据
const getDirectionAndSize = (event: MouseEvent) => {
  const currentMousePosition = {
    x: event.clientX,
    y: event.clientY
  }
  let x =
    currentMousePosition.x -
    (mousePosition?.x ?? 0) +
    Number.parseInt(windowRef.value?.style?.left ?? '0')
  x < 0 && (x = 0)
  if (x + (windowRef.value?.offsetWidth ?? 0) > document.documentElement.clientWidth) {
    x = document.documentElement.clientWidth - (windowRef.value?.offsetWidth ?? 0)
  }
  let y =
    currentMousePosition.y -
    (mousePosition?.y ?? 0) +
    Number.parseInt(windowRef.value?.style?.top ?? '0')
  y < 0 && (y = 0)
  if (y + (windowRef.value?.offsetHeight ?? 0) > document.documentElement.clientHeight) {
    y = document.documentElement.clientHeight - (windowRef.value?.offsetHeight ?? 0)
  }
  let increaseWidth =
    currentMousePosition.x - (mousePosition?.x ?? 0) + (windowRef.value?.clientWidth ?? 0)
  increaseWidth < 0 && (increaseWidth = 0)
  let increaseHeight =
    currentMousePosition.y - (mousePosition?.y ?? 0) + (windowRef.value?.clientHeight ?? 0)
  increaseHeight < 0 && (increaseHeight = 0)
  let reduceWidth =
    (mousePosition?.x ?? 0) - currentMousePosition.x + (windowRef.value?.clientWidth ?? 0)
  reduceWidth < 0 && (reduceWidth = 0)
  let reduceHeight =
    (mousePosition?.y ?? 0) - currentMousePosition.y + (windowRef.value?.clientHeight ?? 0)
  reduceHeight < 0 && (reduceHeight = 0)
  mousePosition = currentMousePosition
  return {
    x,
    y,
    increaseWidth,
    increaseHeight,
    reduceWidth,
    reduceHeight
  }
}
// 改变window的位移、尺寸
const changeWindow = ({
  x,
  y,
  width,
  height
}: {
  x?: number
  y?: number
  width?: number
  height?: number
}) => {
  if (windowRef.value) {
    x !== undefined && windowRef.value && (windowRef.value.style.left = x + 'px')
    y !== undefined && windowRef.value && (windowRef.value.style.top = y + 'px')
    width !== undefined && windowRef.value && (windowRef.value.style.width = width + 'px')
    height !== undefined && windowRef.value && (windowRef.value.style.height = height + 'px')
  }
  setMaskBorderWidth()
  setToolbarPosition()
}
// 移动视窗
const moveWindow = (event: MouseEvent) => {
  const { x, y } = getDirectionAndSize(event)
  changeWindow({ x, y })
}
// 重置鼠标事件
const resetMouseEvent = () => {
  cropperRef.value?.removeEventListener('mousemove', mousemove)
  cropperRef.value?.removeEventListener('mouseleave', resetMouseEvent)
  mousePosition = undefined
  clickMouseCircle = false
  mouseCircleIndex = -1
}
// 结束截屏
const stopShot = () => {
  document.documentElement.removeEventListener('keyup', escListener)
  stopResizeObserver()
  shotting.value = false
}
// 按esc退出截屏
const escListener = (event: KeyboardEvent) => {
  if (event.code === 'Escape') {
    stopShot()
  }
}

// 工具栏
const toolbarRef = ref<InstanceType<typeof Toolbar>>()
const toolbarPosition = ref<IPosition>() // 工具栏位置
// 设置工具栏位置
const setToolbarPosition = () => {
  nextTick(() => {
    const toolbarHeight = toolbarRef.value?.$el.offsetHeight || 0
    const { top = 0, bottom = 0 } = windowRef.value?.getBoundingClientRect() || {}
    const yBottom = document.documentElement.clientHeight - bottom - toolbarHeight - 10
    const yTop = top - toolbarHeight - 10
    if (yBottom <= 0 && yTop <= 0) {
      toolbarPosition.value = 'inside'
    } else if (yBottom <= 0) {
      toolbarPosition.value = 'top'
    } else {
      toolbarPosition.value = undefined
    }
  })
}

defineExpose({
  startShot
})
</script>

<style scoped lang="scss">
.cropper {
  > .mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-color: rgb(0 0 0 / 20%);
    border-style: solid;
  }

  > .window {
    position: fixed;
    cursor: move;

    > .circle {
      position: absolute;
      width: 10px;
      height: 10px;
      background-color: #409eff;
      border: 1px solid #fff;
      border-radius: 50%;
    }

    > .circle:nth-child(1) {
      top: 0;
      left: 0;
      cursor: nwse-resize;
      transform: translate(-50%, -50%);
    }

    > .circle:nth-child(2) {
      top: 0;
      left: 50%;
      cursor: ns-resize;
      transform: translate(-50%, -50%);
    }

    > .circle:nth-child(3) {
      top: 0;
      right: 0;
      cursor: nesw-resize;
      transform: translate(50%, -50%);
    }

    > .circle:nth-child(4) {
      top: 50%;
      right: 0;
      cursor: ew-resize;
      transform: translate(50%, -50%);
    }

    > .circle:nth-child(5) {
      right: 0;
      bottom: 0;
      cursor: nwse-resize;
      transform: translate(50%, 50%);
    }

    > .circle:nth-child(6) {
      bottom: 0;
      left: 50%;
      cursor: ns-resize;
      transform: translate(-50%, 50%);
    }

    > .circle:nth-child(7) {
      bottom: 0;
      left: 0;
      cursor: nesw-resize;
      transform: translate(-50%, 50%);
    }

    > .circle:nth-child(8) {
      top: 50%;
      left: 0;
      cursor: ew-resize;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
