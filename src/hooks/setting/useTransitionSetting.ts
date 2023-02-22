/* 动画相关设置 */
import type { TransitionSetting } from '/#/config';
import { computed } from 'vue';
import { useAppStore } from '/@/store/modules/app';

export function useTransitionSetting() {
  const appStore = useAppStore();
  /* 是否启用动画 */
  const getEnableTransition = computed(() => appStore.getTransitionSetting?.enable);

  /* 是否开启进程条 */
  const getOpenNProgress = computed(() => appStore.getTransitionSetting?.openNProgress);

  /* 加载页面是否展示loading效果 */
  const getOpenPageLoading = computed((): boolean => {
    return !!appStore.getTransitionSetting?.openPageLoading;
  });

  /* 获取动画形式 */
  const getBasicTransition = computed(() => appStore.getTransitionSetting?.basicTransition);

  /* 注入store */
  function setTransitionSetting(transitionSetting: Partial<TransitionSetting>) {
    appStore.setProjectConfig({ transitionSetting });
  }
  return {
    setTransitionSetting,
    getEnableTransition,
    getOpenNProgress,
    getOpenPageLoading,
    getBasicTransition,
  };
}
