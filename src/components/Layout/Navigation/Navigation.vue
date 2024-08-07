<template>
  <el-menu class="navigation" :default-active="getIndex()">
    <template v-for="(item, index) in navigation" :key="index">
      <el-sub-menu v-if="item.children?.length" :key="index" :index="String(index)">
        <template #title>
          <img class="prefix" :src="getImgSrc(imgPath, item.label)" />
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item
          v-for="(item2, index2) in item.children"
          :key="index2"
          :index="`${index}-${index2}`"
          @click="$router.push({ name: item2.routeName })">
          <img class="prefix" :src="getImgSrc(imgPath, item2.label)" />
          <span>{{ item2.label }}</span>
          <img
            class="suffix"
            :src="getImgSrc(imgPath, systemStore.dark ? 'active-dark' : 'active')" />
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :index="String(index)" @click="$router.push({ name: item.routeName })">
        <img
          class="prefix"
          :src="
            getImgSrc(
              imgPath,
              route.name === item.routeName
                ? systemStore.dark
                  ? `${item.label}-active-dark`
                  : `${item.label}-active`
                : systemStore.dark
                ? `${item.label}-dark`
                : item.label
            )
          " />
        <span>{{ item.label }}</span>
        <img
          class="suffix"
          :src="getImgSrc(imgPath, systemStore.dark ? 'active-dark' : 'active')" />
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { useSystemStore } from '@/stores/system'
import { getIndex, imgPath, navigation } from './const'
import { getImgSrc } from '@/common/utils'

const systemStore = useSystemStore()

const route = useRoute()
</script>

<style scoped lang="scss">
.navigation {
  --el-menu-text-color: var(--g-text-color-3);
  --el-menu-active-color: var(--g-text-color-3);
  --el-menu-item-font-size: 18px;
  --el-menu-item-height: 58px;
  --el-menu-sub-item-height: 58px;
  --el-menu-hover-bg-color: var(--menu-hover-bg);

  flex: 1;
  height: 0;
  overflow: auto;
  font-weight: 700;
  letter-spacing: 8px;
  border: none;

  .prefix {
    margin: 0 12px;
  }

  .suffix {
    display: none;
  }

  .el-menu-item.is-active {
    position: relative;
    color: var(--menu-active-color);
    background-color: var(--menu-active-bg);

    > .suffix {
      position: absolute;
      right: 0;
      display: initial;
    }
  }
}

:root .navigation {
  --menu-active-bg: #e5f0ff;
  --menu-active-color: #006aff;
  --menu-hover-bg: #eff6ff;
}

:root.dark .navigation {
  --menu-active-bg: #006aff;
  --menu-active-color: #eceff8;
  --menu-hover-bg: #183860;
}
</style>
