import { createVNode, render } from 'vue'
import Cropper from './Cropper/Cropper.vue'
import { ElMessage } from 'element-plus'
import type { IProps } from './Cropper/Cropper.vue'

export default (config?: IProps) => {
  const container = document.createElement('div') // 单独创建container的目的是避免在同一个容器中使用render时，后者vNode渲染时会杀死前者vNode
  const cropperVnode = createVNode(Cropper, config)
  render(cropperVnode, container)
  container.firstChild && document.body.appendChild(container.firstChild)

  return (cropperVnode.component?.exposed?.startShot ??
    (() => {
      ElMessage.warning('截屏失败！')
    })) as () => void
}
