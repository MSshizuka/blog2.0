<script lang="ts">
  import { defineComponent, toRefs, ref, unref } from 'vue';
  import { createAppProviderContext } from './useAppContext';
  import { createBreakpointListen } from '/@/hooks/event/useBreakpoint';
  import { prefixCls } from '/@/settings/projectSetting';
  import { useAppStore } from '/@/store/modules/app';

  const props = {
    prefixCls: { type: String, default: prefixCls },
  };

  export default defineComponent({
    name: 'AppProvider',
    inheritAttrs: false,
    props,
    setup(props, { slots }) {
      const isMobile = ref(false);
      const isSetState = ref(false);
      const appStore = useAppStore();
      const isIos = ref(false);

      // Monitor screen breakpoint information changes
      createBreakpointListen(({ screenMap, sizeEnum, width }) => {
        const lgWidth = screenMap.get(sizeEnum.LG);
        if (lgWidth) {
          isMobile.value = width.value - 1 < lgWidth;
        }
        isIos.value = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent);
        handleRestoreState();
      });

      const { prefixCls } = toRefs(props);

      // Inject variables into the global
      createAppProviderContext({ prefixCls, isMobile, isIos });

      /**
       * Used to maintain the state before the window changes
       */
      function handleRestoreState() {
        if (unref(isSetState)) {
          isSetState.value = false;
          const { menuMode, menuCollapsed, menuType, menuSplit } = appStore.getBeforeMiniInfo;
          appStore.setProjectConfig({
            menuSetting: {
              type: menuType,
              mode: menuMode,
              collapsed: menuCollapsed,
              split: menuSplit,
            },
          });
        }
      }
      return () => slots.default?.();
    },
  });
</script>
