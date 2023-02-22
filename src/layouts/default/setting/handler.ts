import { HandlerEnum } from './enum';
// import { updateHeaderBgColor, updateSidebarBgColor } from '/@/logics/theme/updateBackground';
import { toggleCanvas } from '/@/logics/theme';
import { updateGrayMode } from '/@/logics/theme/updateGrayMode';
import { updateColorWeak } from '/@/logics/theme/updateColorWeak';
import { useAppStore } from '/@/store/modules/app';
import { ProjectConfig } from '/#/config';

export function baseHandler(event: HandlerEnum, value: any) {
  const appStore = useAppStore();
  const config = handler(event, value);
  appStore.setProjectConfig(config);
  console.log('appStore.get', appStore.getProjectConfig.openCanvas);
  // if (event === HandlerEnum.CHANGE_THEME) {
  //   updateHeaderBgColor();
  //   updateSidebarBgColor();
  // }
}

export function handler(event: HandlerEnum, value: any): DeepPartial<ProjectConfig> {
  switch (event) {
    case HandlerEnum.CHANGE_THEME:
      // changeTheme(value);
      return { themeName: value };
    case HandlerEnum.TOGGLE_CANVAS:
      toggleCanvas(value);
      return { openCanvas: value };
    case HandlerEnum.GRAY_MODE:
      updateGrayMode(value);
      return { grayMode: value };
    case HandlerEnum.COLOR_WEAK:
      updateColorWeak(value);
      return { colorWeak: value };
    default:
      return {};
  }
}
