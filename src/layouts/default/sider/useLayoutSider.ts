import type { Ref } from 'vue';

import { computed, unref, ref } from 'vue';
// import { computed, unref, onMounted, nextTick, ref } from 'vue';

import { TriggerEnum } from '/@/enums/menuEnum';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
// import { useDebounceFn } from '@vueuse/core';

import { SIDE_BAR_MINI_WIDTH } from '/@/enums/appEnum';

/**
 * Handle related operations of menu events
 */
export function useSiderEvent() {
  const brokenRef = ref(false);

  const getCollapsedWidth = computed(() => {
    return unref(brokenRef) ? 0 : SIDE_BAR_MINI_WIDTH;
  });

  function onBreakpointChange(broken: boolean) {
    brokenRef.value = broken;
  }

  return { getCollapsedWidth, onBreakpointChange };
}

/**
 * Handle related operations of menu folding
 */
export function useTrigger(getIsMobile: Ref<boolean>) {
  const { getTrigger, getSplit } = useMenuSetting();
  /* HEADER  false */

  const getShowTrigger = computed(() => {
    const trigger = unref(getTrigger);

    return (
      trigger !== TriggerEnum.NONE &&
      !unref(getIsMobile) &&
      (trigger === TriggerEnum.FOOTER || unref(getSplit))
    );
  });

  const getTriggerAttr = computed(() => {
    if (unref(getShowTrigger)) {
      return {};
    }
    return {
      trigger: null,
    };
  });

  return { getTriggerAttr, getShowTrigger };
}
