<template>
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="['Layout']">
        <component :is="Component" :key="route.meta.usePathKey1 ? route.path : undefined" />
      </keep-alive>
    </router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>
