<template>
  <div class="layout">
    <div class="header">
      <div class="title">
        <img v-if="showLogo" src="./images/logo.png" />
        <div>
          <img
            v-if="showLogo"
            :src="getImgSrc(imgPath, systemStore.dark ? 'title-dark' : 'title')" />
          <p>{{ CONFIG.appName }}</p>
        </div>
      </div>
      <Navigation />
      <div class="bottom" @click="toggleDark">
        <img :src="getImgSrc(imgPath, systemStore.dark ? 'apperance-dark' : 'apperance')" />
        <span>{{ systemStore.dark ? '浅色' : '深色' }}模式</span>
      </div>
      <div class="bottom">
        <img :src="getImgSrc(imgPath, systemStore.dark ? 'home-dark' : 'home')" />
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
import { useSystemStore } from '@/stores/system'
import { toggleDark } from '@/common/dark'
import { getImgSrc } from '@/common/utils'
import { imgPath, showLogo } from './const'

const systemStore = useSystemStore()
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
      font-weight: 600;
      color: var(--title-color);

      > img {
        margin-right: 10px;
      }
    }

    > .bottom {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px 0;
      font-size: 18px;
      font-weight: 700;
      color: var(--title-color);
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
  }
}

:root .layout {
  --title-color: #006aff;
}

:root.dark .layout {
  --title-color: #eceff8;
}
</style>
