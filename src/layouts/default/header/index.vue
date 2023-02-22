<template>
  <Header :class="getHeaderClass">
    <div :class="`${prefixCls}-left`">
      <AppLogo
        v-if="getShowHeaderLogo || !getIsMobile"
        :class="`${prefixCls}-logo`"
        :style="getLogoWidth"
      />
      <LayoutTrigger
        v-if="
          (getShowContent && getShowHeaderTrigger && !getSplit && !getIsMixSidebar) || getIsMobile
        "
        :sider="false"
      />
      <LayoutBreadcrumb v-if="getShowContent && getShowBread" />
    </div>

    <div :class="`${prefixCls}-menu`" v-if="getShowTopMenu && !getIsMobile">
      <LayoutMenu :isHorizontal="true" :splitType="getSplitType" :menuMode="getMenuMode" />
    </div>

    <div :class="`${prefixCls}-action`">
      <Search />
      <FullScreen v-if="getShowFullScreen" :class="`${prefixCls}-action__item fullscreen-item`" />
      <UserDropDown v-if="isLogined" />
      <UserAction v-else />
      <SettingDrawer :class="`${prefixCls}-action__item`" />
    </div>
  </Header>
</template>

<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { propTypes } from '/@/utils/propTypes';

  import { Layout } from 'ant-design-vue';
  import { AppLogo } from '/@/components/Application';
  import LayoutMenu from '../menu/index.vue';
  import LayoutTrigger from '../trigger/index.vue';

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

  import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';

  import { UserDropDown, LayoutBreadcrumb, FullScreen, UserAction, Search } from './components';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useDesign } from '/@/hooks/web/useDesign';
  // import { getToken } from '/@/utils/auth';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import SettingDrawer from '/@/layouts/default/setting/index.vue';
  const Header = Layout.Header;
  // const isLogined = computed(() => getToken());

  const useUserStore = useUserStoreWithOut();

  const isLogined = computed(() => useUserStore.getToken);

  const props = defineProps({
    fixed: propTypes.bool,
  });
  const { prefixCls } = useDesign('layout-header');

  const {
    getShowTopMenu,
    getSplit,
    getIsMixMode,
    getMenuWidth,
    getShowHeaderTrigger,
    getIsMixSidebar,
  } = useMenuSetting();

  const { getShowFullScreen, getShowHeaderLogo, getShowContent, getShowBread } = useHeaderSetting();

  const { getIsMobile } = useAppInject();

  const getHeaderClass = computed(() => {
    return [
      prefixCls,
      {
        [`${prefixCls}--fixed`]: props.fixed,
        [`${prefixCls}--mobile`]: unref(getIsMobile),
      },
    ];
  });

  const getLogoWidth = computed(() => {
    if (!unref(getIsMixMode) || unref(getIsMobile)) {
      return {};
    }
    const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth);
    return { width: `${width}px` };
  });

  const getSplitType = computed(() => {
    return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
  });

  const getMenuMode = computed(() => {
    return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null;
  });
</script>

<style lang="less">
  @import './index.less';
</style>
