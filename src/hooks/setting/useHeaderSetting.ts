/* 顶栏设置 */
import type { HeaderSetting } from '/#/config';
import { useAppStore } from '/@/store/modules/app';
import { computed, unref } from 'vue';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useFullContent } from '/@/hooks/web/useFullContent';
import { MenuModeEnum } from '/@/enums/menuEnum';

export function useHeaderSetting() {
  const { getFullContent } = useFullContent();
  const appStore = useAppStore();

  /* 是否展示全屏切换 */
  const getShowFullHeaderRef = computed(() => {
    return (
      !unref(getFullContent) &&
      unref(getShowMixHeaderRef) &&
      unref(getShowHeader) &&
      !unref(getIsTopMenu) &&
      !unref(getIsMixSidebar)
    );
  });

  /* 是否展示顶栏 */
  const getShowInsetHeaderRef = computed(() => {
    const need = !unref(getFullContent) && unref(getShowHeader);
    return (
      (need && !unref(getShowMixHeaderRef)) ||
      (need && unref(getIsTopMenu)) ||
      (need && unref(getIsMixSidebar))
    );
  });

  const {
    getMenuMode, // 菜单mode
    getSplit, // 是否分割
    getShowHeaderTrigger, // 展示头部切换按钮
    getIsSidebarType, // 是否是左侧菜单模式
    getIsMixSidebar, // 是否是左侧菜单混合模式 默认false
    getIsTopMenu, // 是否是顶部菜单模式
  } = useMenuSetting();
  /* 展示面包屑 logo */
  const { getShowBreadCrumb, getShowLogo } = useRootSetting();

  /* 是否展示头部混合菜单 */
  const getShowMixHeaderRef = computed(() => !unref(getIsSidebarType) && unref(getShowHeader));

  /* 展示顶栏菜单 */
  const getShowHeader = computed(() => appStore.getHeaderSetting.show);

  /* 是否是混合模式菜单 */
  const getFixed = computed(() => appStore.getHeaderSetting.fixed);

  /* 是否全屏切换 */
  const getShowFullScreen = computed(() => appStore.getHeaderSetting.showFullScreen);

  /* 是否展示通知 */
  const getShowNotice = computed(() => appStore.getHeaderSetting.showNotice);

  /* 是否展示面包屑 */
  const getShowBread = computed(() => {
    return (
      unref(getMenuMode) !== MenuModeEnum.HORIZONTAL && unref(getShowBreadCrumb) && !unref(getSplit)
    );
  });

  /* 是否展示顶栏logo */
  const getShowHeaderLogo = computed(() => {
    return (
      unref(getShowLogo) &&
      !unref(getIsSidebarType) &&
      !unref(getIsMixSidebar) &&
      !unref(getIsTopMenu)
    );
  });

  /* 展示面包屑或头部切换按钮 */
  const getShowContent = computed(() => {
    return unref(getShowBread) || unref(getShowHeaderTrigger);
  });

  /* 头部全局配置注入store */
  function setHeaderSetting(headerSetting: Partial<HeaderSetting>) {
    appStore.setProjectConfig({ headerSetting });
  }
  return {
    setHeaderSetting,
    getShowFullScreen,
    getShowNotice,
    getShowBread,
    getShowContent,
    getShowHeaderLogo,
    getShowHeader,
    getFixed,
    getShowMixHeaderRef,
    getShowFullHeaderRef,
    getShowInsetHeaderRef,
  };
}
