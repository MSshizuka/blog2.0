import { useAppStore } from '/@/store/modules/app';

import projectSetting from '/@/settings/projectSetting';
import { PermissionModeEnum } from '/@/enums/appEnum';

export function usePermission() {
  const appStore = useAppStore();

  /**
   * Change permission mode
   */
  async function setPermissionMode(mode: PermissionModeEnum) {
    appStore.setProjectConfig({
      permissionMode: (projectSetting.permissionMode = mode),
    });
    // location.reload();
  }

  return { setPermissionMode };
}
