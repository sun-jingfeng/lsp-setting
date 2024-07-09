/**
 * 缓存资源的组合式函数，支持停止缓存
 * @param urlList 需要缓存的资源的链接地址数组
 * @param batchNum 每批缓存的数量
 */
export const useLoadImg = (urlList: readonly string[], batchNum = 3) => {
  const iUrlList = [...urlList]
  let continueLoop = true
  let controller = new AbortController()
  let batch: string[] = []
  let proList: Promise<Blob>[] = []
  const resList: Ref<(Blob | null)[]> = ref([])
  loop()

  function loop() {
    if (continueLoop && iUrlList.length) {
      batch = iUrlList.splice(0, batchNum)
      proList = batch.map(
        url =>
          new Promise((resolve, reject) => {
            fetch(url, { signal: controller.signal })
              .then(res => res.blob().then(resolve))
              .catch(reject)
          })
      )
      Promise.allSettled(proList).then(resultList => {
        continueLoop &&
          resultList.forEach(result => {
            resList.value.push(result.status === 'fulfilled' ? result.value : null)
          })
        loop()
      })
    }
  }

  function pauseLoad() {
    continueLoop = false
    controller.abort()
  }

  function continueLoad() {
    continueLoop = true
    controller = new AbortController()
    Promise.allSettled(proList).then(() => {
      iUrlList.unshift(...batch)
      loop()
    })
  }

  return { resList, pauseLoad, continueLoad }
}
