import type { MenuSetting } from '/#/config';

import { computed, unref, ref } from 'vue';

import { useAppStore } from '/@/store/modules/app';

import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '/@/enums/appEnum';
import { MenuModeEnum, MenuTypeEnum, TriggerEnum } from '/@/enums/menuEnum';
import { useFullContent } from '/@/hooks/web/useFullContent';

const mixSideHasChildren = ref(false);

/* 监听设置的改变 */
export function useMenuSetting() {
  /* 是否设置为全屏内容 */
  const { getFullContent: fullContent } = useFullContent();

  const appStore = useAppStore();
  /* 是否展示左侧菜单 */
  const getShowSidebar = computed(() => {
    return (
      unref(getSplit) ||
      (unref(getShowMenu) && unref(getMenuMode) !== MenuModeEnum.HORIZONTAL && !unref(fullContent))
    );
  });

  /* 是否折叠菜单 */
  const getCollapsed = computed(() => appStore.getMenuSetting.collapsed);

  /* type和mode一起决定了菜单最终模式
   * 菜单模式:  左侧菜单模式     顶部菜单      左侧菜单混合模式    顶部菜单混合模式
   *    type:     sidebar      horizontal        mix-sidebar       horizontal
   *    mode:     inline       top-menu          inline              mix
   */
  /* 类型*/
  const getMenuType = computed(() => appStore.getMenuSetting.type);

  /* 模式 顶部菜单模式 HORIZONTAL 其余均为inline */
  const getMenuMode = computed(() => appStore.getMenuSetting.mode);

  /* 仅针对菜单在左侧的情况 菜单是否随右侧内容滑动 */
  const getMenuFixed = computed(() => appStore.getMenuSetting.fixed); // 默认true

  /* 左侧菜单是否展示 */
  const getShowMenu = computed(() => appStore.getMenuSetting.show);

  /* 菜单是否隐藏 */
  const getMenuHidden = computed(() => appStore.getMenuSetting.hidden);

  /* 获取菜单宽度 */
  const getMenuWidth = computed(() => appStore.getMenuSetting.menuWidth);

  /* 菜单折叠图标的位置 */
  const getTrigger = computed(() => appStore.getMenuSetting.trigger);

  /* 仅针对顶部混合模式菜单 */
  /* 菜单分割 1级菜单(顶栏)与子级菜单(侧边栏)分割 */
  const getSplit = computed(() => appStore.getMenuSetting.split);

  // /* 固定展开菜单 只针对左侧混合菜单 */
  const getMixSideFixed = computed(() => appStore.getMenuSetting.mixSideFixed);

  /* 是否是左侧菜单 */
  const getIsSidebarType = computed(() => unref(getMenuType) === MenuTypeEnum.SIDEBAR);

  /* 是否是顶部菜单 */
  const getIsTopMenu = computed(() => unref(getMenuType) === MenuTypeEnum.TOP_MENU);

  /* 是否展示顶部菜单 顶部菜单模式或混合模式下分割菜单则为true */
  const getShowTopMenu = computed(() => {
    return unref(getMenuMode) === MenuModeEnum.HORIZONTAL || unref(getSplit);
  });

  /* 触发收缩菜单的按钮是否在顶部 */
  const getShowHeaderTrigger = computed(() => {
    if (
      /* 顶部菜单 或 展示左侧菜单 */
      unref(getMenuType) === MenuTypeEnum.TOP_MENU ||
      !unref(getShowMenu) ||
      unref(getMenuHidden)
    ) {
      return false;
    }

    return unref(getTrigger) === TriggerEnum.HEADER;
  });

  /* 是否是顶部菜单模式 */
  const getIsHorizontal = computed(() => {
    return unref(getMenuMode) === MenuModeEnum.HORIZONTAL;
  });

  /* 是否是左侧混合菜单模式 */
  const getIsMixSidebar = computed(() => {
    return unref(getMenuType) === MenuTypeEnum.MIX_SIDEBAR;
  });

  /* 是否是顶部混合菜单模式 */
  const getIsMixMode = computed(() => {
    return unref(getMenuMode) === MenuModeEnum.INLINE && unref(getMenuType) === MenuTypeEnum.MIX;
  });

  /* 获取左侧菜单宽度 number类型*/
  const getRealWidth = computed(() => {
    if (unref(getIsMixSidebar)) {
      return unref(getCollapsed) && !unref(getMixSideFixed)
        ? unref(getMiniWidthNumber)
        : unref(getMenuWidth);
    }
    return unref(getCollapsed) ? unref(getMiniWidthNumber) : unref(getMenuWidth);
  });

  /* 获取菜单宽度实现 */
  const getMiniWidthNumber = computed(() => {
    const { collapsedShowTitle } = appStore.getMenuSetting;
    /* collapsedShowTitle：折叠菜单是否显示名称 */
    return collapsedShowTitle ? SIDE_BAR_SHOW_TIT_MINI_WIDTH : SIDE_BAR_MINI_WIDTH;
  });

  /* 内容宽度 */
  const getCalcContentWidth = computed(() => {
    const width =
      unref(getIsTopMenu) || !unref(getShowMenu) || (unref(getSplit) && unref(getMenuHidden))
        ? 0
        : unref(getIsMixSidebar)
        ? (unref(getCollapsed) ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH) +
          (unref(getMixSideFixed) && unref(mixSideHasChildren) ? unref(getRealWidth) : 0)
        : unref(getRealWidth);
    return `calc(100% - ${unref(width)}px)`;
  });

  // Set menu configuration
  function setMenuSetting(menuSetting: Partial<MenuSetting>): void {
    appStore.setProjectConfig({ menuSetting });
  }

  /* 展开与收缩切换后重置菜单配置 */
  function toggleCollapsed() {
    setMenuSetting({
      collapsed: !unref(getCollapsed),
    });
  }
  return {
    setMenuSetting,
    toggleCollapsed,
    getMenuFixed, // false
    getRealWidth,
    getMenuType,
    getMenuMode,
    getShowMenu,
    getCollapsed,
    getCalcContentWidth,
    getMenuWidth,
    getTrigger,
    getSplit,
    getIsHorizontal,
    getIsSidebarType,
    getShowTopMenu,
    getShowHeaderTrigger,
    getMenuHidden,
    getIsTopMenu,
    getShowSidebar,
    getIsMixMode,
    getIsMixSidebar,
    mixSideHasChildren,
  };
}
