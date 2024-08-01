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
          <img class="suffix" src="./images/active.png" />
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :index="String(index)" @click="$router.push({ name: item.routeName })">
        <img class="prefix" :src="getImgSrc(imgPath, item.label)" />
        <span>{{ item.label }}</span>
        <img class="suffix" src="./images/active.png" />
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { getIndex, imgPath, navigation } from './const'
import { getImgSrc } from '@/common/utils'
</script>

<style scoped lang="scss">
.navigation {
  --el-menu-text-color: var(--g-text-color);
  --el-menu-active-color: var(--g-text-color);
  --el-menu-item-font-size: 18px;
  --el-menu-item-height: 58px;
  --el-menu-sub-item-height: 58px;
  --el-menu-hover-bg-color: #183860;

  flex: 1;
  height: 0;
  overflow: auto;
  border: none;

  .prefix {
    margin: 0 6px;
  }

  .suffix {
    display: none;
  }

  .el-menu-item.is-active {
    position: relative;
    background-color: var(--menu-active-bg);

    > .suffix {
      position: absolute;
      right: 0;
      display: initial;
    }
  }
}
</style>
