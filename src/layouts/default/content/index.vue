<template>
  <div :class="[prefixCls, getLayoutContentMode]" v-loading="getOpenPageLoading && getPageLoading">
    <div class="base-page"><PageLayout /></div>
    <LayoutFooter class="relative" />
  </div>
</template>
<script lang="ts" setup name="LayoutContent">
  import PageLayout from '/@/layouts/page/index.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
  import { useContentViewHeight } from './useContentViewHeight';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  const LayoutFooter = createAsyncComponent(() => import('/@/views/dashboard/Footer.vue'));

  const { prefixCls } = useDesign('layout-content');
  const { getOpenPageLoading } = useTransitionSetting();
  const { getLayoutContentMode, getPageLoading } = useRootSetting();

  useContentViewHeight();
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-content';

  .@{prefix-cls} {
    margin-top: 48px;
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    z-index: 2;

    &.fixed {
      width: 1200px;
      margin: 0 auto;
    }

    &-loading {
      position: absolute;
      top: 200px;
      z-index: @page-loading-z-index;
    }

    .rain {
      position: absolute;
      width: 2px;
      height: 45px;
      background: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.6));
    }

    .base-page {
      min-height: calc(100vh - 226px);
    }
  }
</style>
