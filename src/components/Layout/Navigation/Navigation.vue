<template>
  <el-menu class="navigation" :default-active="getIndex()">
    <template v-for="(item, index) in navigation" :key="index">
      <el-sub-menu v-if="item.children?.length" :key="index" :index="String(index)">
        <template #title>
          <img :src="getImgSrc(imgPath, item.label)" />
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item
          v-for="(item2, index2) in item.children"
          :key="index2"
          :index="`${index}-${index2}`"
          @click="$router.push({ name: item2.routeName })">
          <img :src="getImgSrc(imgPath, item2.label)" />
          <span>{{ item2.label }}</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :index="String(index)" @click="$router.push({ name: item.routeName })">
        <img :src="getImgSrc(imgPath, item.label)" />
        <span>{{ item.label }}</span>
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
  --el-menu-bg-color: var(--g-bg-2);
  --el-menu-hover-bg-color: var(--g-color-2);
  --el-menu-text-color: var(--g-text-color);
  --el-menu-active-color: var(--g-text-color);

  flex: 1;
  height: 0;
  overflow: auto;
  border: none;

  .el-menu-item.is-active {
    background-color: var(--g-color);
  }

  img {
    margin: 0 6px;
  }
}
</style>
