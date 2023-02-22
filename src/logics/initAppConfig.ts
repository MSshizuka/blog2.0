/**
 * Application configuration
 */
import type { ProjectConfig } from '/#/config';

import { PROJ_CFG_KEY } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';

import { updateGrayMode } from '/@/logics/theme/updateGrayMode';
import { updateColorWeak } from '/@/logics/theme/updateColorWeak';
import { toggleCanvas } from '/@/logics/theme';
import { useAppStore } from '/@/store/modules/app';
import { getCommonStoragePrefix, getStorageShortName } from '/@/utils/env';

import { Persistent } from '/@/utils/cache/persistent';
import { deepMerge } from '/@/utils';

// Initial project configuration
export function initAppConfigStore() {
  const appStore = useAppStore();
  const unitProjCfg = JSON.parse(JSON.stringify(projectSetting));
  let projCfg: ProjectConfig = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig;
  projCfg = deepMerge(unitProjCfg, projCfg || {});
  const {
    grayMode,
    colorWeak,
    headerSetting: {},
    menuSetting: {},
  } = projCfg;
  try {
    grayMode && updateGrayMode(grayMode);
    colorWeak && updateColorWeak(colorWeak);
  } catch (error) {
    console.log(error);
  }
  appStore.setProjectConfig(projCfg);
  console.log('初始化projCfg', projCfg);

  setTimeout(() => {
    toggleCanvas(projCfg.openCanvas);
  });

  setTimeout(() => {
    clearObsoleteStorage();
  }, 16);
}

/**
 * As the version continues to iterate, there will be more and more cache keys stored in localStorage.
 * This method is used to delete useless keys
 */
export function clearObsoleteStorage() {
  const commonPrefix = getCommonStoragePrefix();
  const shortPrefix = getStorageShortName();

  [localStorage, sessionStorage].forEach((item: Storage) => {
    Object.keys(item).forEach((key) => {
      if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
        item.removeItem(key);
      }
    });
  });
}
