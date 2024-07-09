import type { ElButton } from 'element-plus'
import { Close, Download, DocumentCopy } from '@element-plus/icons-vue'

export type IPosition = 'inside' | 'top'

export const operateList: {
  type: InstanceType<typeof ElButton>['type']
  icon: InstanceType<typeof ElButton>['icon']
  operate: 'exit' | 'save' | 'copy'
  tooltip: string
}[] = [
  {
    type: 'warning',
    icon: Close,
    operate: 'exit',
    tooltip: '退出截屏'
  },
  {
    type: 'primary',
    icon: Download,
    operate: 'save',
    tooltip: '保存到文件'
  },
  {
    type: 'success',
    icon: DocumentCopy,
    operate: 'copy',
    tooltip: '复制到剪切板'
  }
]
