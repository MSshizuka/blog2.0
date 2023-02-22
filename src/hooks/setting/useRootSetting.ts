import type { ProjectConfig } from '/#/config';
import { computed } from 'vue';
import { useAppStore } from '/@/store/modules/app';

type RootSetting = Omit<ProjectConfig, 'headerSetting' | 'menuSetting'>;

export function useRootSetting() {
  const appStore = useAppStore();

  /* 设置按钮位置 固定顶部 */
  const getSettingButtonPosition = 'header';
  /* 是否使用错误处理  */
  const getUseErrorHandle = false;
  /* 是否展示页脚 */
  const getShowFooter = false;
  /* 是否显示面包屑图标 */
  const getShowBreadCrumbIcon = false;
  /* 是否使用色弱模式 */
  const getColorWeak = computed(() => appStore.getProjectConfig.colorWeak);
  /* 展示主题切换 */
  const getShowDarkModeToggle = true;
  /* 加载页面是否使用loading */
  const getPageLoading = computed(() => appStore.getPageLoading);

  /* 是否开启缓存 */
  const getOpenKeepAlive = computed(() => appStore.getProjectConfig.openKeepAlive);

  /* 是否支持iframe */
  const getCanEmbedIFramePage = computed(() => appStore.getProjectConfig.canEmbedIFramePage);

  /* 是否展示logo */
  const getShowLogo = computed(() => appStore.getProjectConfig.showLogo);

  /* 是否展示回到顶部 */
  const getUseOpenBackTop = computed(() => appStore.getProjectConfig.useOpenBackTop);

  /* 是否展示设置按钮 */
  const getShowSettingButton = computed(() => appStore.getProjectConfig.showSettingButton);

  /* 是否展示面包屑 */
  const getShowBreadCrumb = computed(() => appStore.getProjectConfig.showBreadCrumb);

  /* 是否全屏 */
  const getFullContent = computed(() => appStore.getProjectConfig.fullContent);

  /* 是否是灰色模式 */
  const getGrayMode = computed(() => appStore.getProjectConfig.grayMode);

  /* 锁屏时间 */
  const getLockTime = computed(() => appStore.getProjectConfig.lockTime);

  /* 获取当前主题 */
  const currentTheme = computed(() => appStore.getProjectConfig.themeName);

  /* 获取是否开启canvas */
  const getCanvas = computed(() => appStore.getProjectConfig.openCanvas);

  /* 注入store */
  function setRootSetting(setting: Partial<RootSetting>) {
    appStore.setProjectConfig(setting);
  }

  return {
    setRootSetting,
    getSettingButtonPosition,
    getFullContent,
    getColorWeak,
    getGrayMode,
    getPageLoading,
    getOpenKeepAlive,
    getCanEmbedIFramePage,
    getShowLogo,
    getUseErrorHandle,
    getShowBreadCrumb,
    getShowBreadCrumbIcon,
    getUseOpenBackTop,
    getShowSettingButton,
    getShowFooter,
    getLockTime,
    getShowDarkModeToggle,
    currentTheme,
    getCanvas,
  };
}
