<template>
  <div class="layout">
    <div class="header">
      <img src="./images/logo.png" />
      <h2 class="g-ml-base">{{ CONFIG.appName }}</h2>
    </div>
    <div class="main">
      <router-view v-slot="{ Component, route }">
        <keep-alive :include="['home']">
          <component
            :is="route.matched.find(item => item.name === 'layout') ? Component : undefined"
            :key="route.meta.usePathKey2 ? route.path : undefined" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CONFIG } from '@/common/const'
</script>

<style scoped lang="scss">
.layout {
  height: 100%;

  > .header {
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 40px;
    line-height: 60px;
    color: var(--el-color-white);
    background-color: var(--el-color-primary);
  }

  > .main {
    height: calc(100% - 60px);
  }
}
</style>
