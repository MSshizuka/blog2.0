<template>
  <RouterView>
    <template #default="{ Component, route }">
      <transition
        :name="
          getTransitionName({
            route,
            enableTransition: getEnableTransition,
            def: getBasicTransition,
          })
        "
        mode="out-in"
        appear
      >
        <keep-alive v-if="openCache">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" />
      </transition>
    </template>
  </RouterView>
</template>

<script lang="ts" setup name="PageLayout">
  import { computed, unref } from 'vue';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
  import { getTransitionName } from './transition';

  const { getOpenKeepAlive } = useRootSetting();
  const { getBasicTransition, getEnableTransition } = useTransitionSetting();
  const openCache = computed(() => unref(getOpenKeepAlive));
</script>
