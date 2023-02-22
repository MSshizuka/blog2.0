import type { Menu } from '/@/router/types';
import { Ref } from 'vue';
import { watch, unref, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MenuSplitTyeEnum } from '/@/enums/menuEnum';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { getCurrentParentPath, getMenus } from '/@/router/menus';
import { usePermissionStore } from '/@/store/modules/permission';
import { useAppInject } from '/@/hooks/web/useAppInject';

import { Persistent } from '/@/utils/cache/persistent';
import { TOKEN_KEY } from '/@/enums/cacheEnum';

export function useSplitMenu(splitType: Ref<MenuSplitTyeEnum>) {
  // Menu array
  const menusRef = ref<Menu[]>([]);
  console.log('useRouter===>', useRouter());
  const { currentRoute } = useRouter();
  const { getIsMobile } = useAppInject();
  const permissionStore = usePermissionStore();
  const { getIsHorizontal } = useMenuSetting();

  const splitNotLeft = computed(
    () => unref(splitType) !== MenuSplitTyeEnum.LEFT && !unref(getIsHorizontal),
  );

  const normalType = computed(() => {
    return unref(splitType) === MenuSplitTyeEnum.NONE;
  });

  const hasPermission = computed(() => {
    console.log('bianhua', Persistent.getLocal(TOKEN_KEY));
    return Persistent.getLocal(TOKEN_KEY);
  });

  watch(
    [() => hasPermission.value],
    () => {
      genMenus();
    },
    {
      immediate: true,
    },
  );

  watch(
    [() => unref(currentRoute).path, () => unref(splitType)],
    async ([path]: [string, MenuSplitTyeEnum]) => {
      if (unref(splitNotLeft) || unref(getIsMobile)) return;

      const { meta } = unref(currentRoute);
      const currentActiveMenu = meta.currentActiveMenu as string;
      let parentPath = await getCurrentParentPath(path);
      if (!parentPath) {
        parentPath = await getCurrentParentPath(currentActiveMenu);
      }
      parentPath;
    },
    {
      immediate: true,
    },
  );

  watch(
    [() => permissionStore.getLastBuildMenuTime],
    () => {
      genMenus();
    },
    {
      immediate: true,
    },
  );

  async function genMenus() {
    // normal mode
    if (unref(normalType) || unref(getIsMobile)) {
      menusRef.value = await getMenus();
      return;
    }
  }

  return { menusRef };
}
