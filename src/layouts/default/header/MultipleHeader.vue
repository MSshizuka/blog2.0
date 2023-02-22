<template>
  <!-- <div :style="getPlaceholderDomStyle" v-if="getIsShowPlaceholderDom"></div> -->
  <div :style="getWrapStyle" :class="getClass">
    <LayoutHeader v-if="getShowInsetHeaderRef" />
  </div>
</template>
<script lang="ts" setup name="LayoutMultipleHeader">
  import { unref, computed, CSSProperties } from 'vue';
  import LayoutHeader from './index.vue';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useDesign } from '/@/hooks/web/useDesign';

  const HEADER_HEIGHT = 48;
  const { prefixCls } = useDesign('layout-multiple-header');
  const { getCalcContentWidth } = useMenuSetting();
  const { getIsMobile } = useAppInject();
  const { getFixed, getShowInsetHeaderRef, getShowFullHeaderRef, getHeaderTheme } =
    useHeaderSetting();

  const getWrapStyle = computed((): CSSProperties => {
    const style: CSSProperties = {};
    if (unref(getFixed)) {
      style.width = unref(getIsMobile) ? '100%' : unref(getCalcContentWidth);
    }
    if (unref(getShowFullHeaderRef)) {
      style.top = `${HEADER_HEIGHT}px`;
    }
    return style;
  });

  const getIsFixed = computed(() => {
    return unref(getFixed) || unref(getShowFullHeaderRef);
  });

  const getClass = computed(() => {
    return [
      prefixCls,
      `${prefixCls}--${unref(getHeaderTheme)}`,
      { [`${prefixCls}--fixed`]: unref(getIsFixed) },
    ];
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-layout-multiple-header';

  .@{prefix-cls} {
    transition: width 0.2s;
    flex: 0 0 auto;

    &--dark {
      margin-left: -1px;
    }

    &--fixed {
      position: fixed;
      top: 0;
      z-index: @multiple-tab-fixed-z-index;
      width: 100%;
    }
  }
</style>
