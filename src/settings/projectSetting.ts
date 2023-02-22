import type { ProjectConfig } from '/#/config';
import { MenuTypeEnum, MenuModeEnum, TriggerEnum } from '/@/enums/menuEnum';
import {
  RouterTransitionEnum,
  SessionTimeoutProcessingEnum,
  PermissionModeEnum,
  ThemeBgEnum,
} from '/@/enums/appEnum';

export const prefixCls = 'sup';

// ! You need to clear the browser cache after the change
const setting: ProjectConfig = {
  openCanvas: false,

  themeName: ThemeBgEnum.DIANJUREN,

  showLogo: true,

  showSettingButton: true,

  // Session timeout processing
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,

  /* 权限模式 */
  permissionMode: PermissionModeEnum.ROUTE_MAPPING,

  // Website gray mode, open for possible mourning dates
  grayMode: false,

  colorWeak: false,

  // Whether to cancel the menu, the top, the multi-tab page display, for possible embedded in other systems
  fullContent: false,

  // Header configuration
  headerSetting: {
    show: true,
    fixed: true,
    showFullScreen: true,
    showNotice: true,
  },

  // Menu configuration
  /* type和mode一起决定了菜单的模式
   * 菜单模式:  左侧菜单模式     顶部菜单      左侧菜单混合模式    顶部菜单混合模式
   *    type:     sidebar      horizontal        mix-sidebar       horizontal
   *    mode:     inline       top-menu          inline              mix
   */
  menuSetting: {
    fixed: true,
    mode: MenuModeEnum.HORIZONTAL,
    type: MenuTypeEnum.TOP_MENU,
    menuWidth: 210,
    mixSideFixed: false,
    collapsed: false,
    show: true,
    // Whether to show dom
    hidden: false,
    collapsedShowTitle: false,
    trigger: TriggerEnum.HEADER,
    split: false,
  },

  // Transition Setting
  transitionSetting: {
    enable: true,
    basicTransition: RouterTransitionEnum.FADE_SIDE,
    openPageLoading: true,
    openNProgress: true,
  },
  openKeepAlive: false,
  lockTime: 0,
  showBreadCrumb: true,
  useOpenBackTop: true,
  canEmbedIFramePage: true,
};

export default setting;
