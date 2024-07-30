<template>
  <div class="layout">
    <div class="header">
      <div class="title">
        <img src="./images/logo.png" />
        <div>
          <img src="./images/title.png" />
          <p>{{ CONFIG.appName }}</p>
        </div>
      </div>
      <Navigation />
      <div class="bottom">
        <img src="./images/home.png" />
        <span>回到首页</span>
      </div>
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
import { RouterView } from 'vue-router'
import Navigation from './Navigation/Navigation.vue'
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  height: 100%;

  > .header {
    display: flex;
    flex-direction: column;
    width: 230px;
    background-color: var(--g-bg-2);

    > .title {
      display: flex;
      align-items: center;
      height: 90px;
      padding: 0 12px;
      font-size: 24px;

      > img {
        margin-right: 10px;
      }
    }

    > .bottom {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px 0;
      color: #adbce1;
      letter-spacing: 8px;
      cursor: pointer;

      > img {
        margin-right: 8px;
      }
    }
  }

  > .main {
    flex: 1;
    width: 0;
    padding: 16px;
    overflow: auto;
  }
}
</style>
