import type { ProjectConfig } from '/#/config';
import { MenuTypeEnum, MenuModeEnum, TriggerEnum } from '/@/enums/menuEnum';
import {
  PermissionModeEnum,
  RouterTransitionEnum,
  SessionTimeoutProcessingEnum,
  ThemeBgEnum,
} from '/@/enums/appEnum';

// ! You need to clear the browser cache after the change
const setting: ProjectConfig = {
  openCanvas: false,

  themeName: ThemeBgEnum.SHLE,

  // Whether to show the configuration button
  showSettingButton: true,

  // Session timeout processing
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,

  // Website gray mode, open for possible mourning dates
  grayMode: false,

  // Permission mode
  permissionMode: PermissionModeEnum.ROUTE_MAPPING,

  // Color Weakness Mode

  // Whether to cancel the menu, the top, the multi-tab page display, for possible embedded in other systems
  fullContent: false,

  // content mode

  // Whether to display the logo
  showLogo: true,

  // Whether to show footer

  // Header configuration
  headerSetting: {
    // header bg color
    // Fixed at the top
    fixed: true,
    // Whether to show top
    show: true,
    // Whether to enable the lock screen function
    // Whether to show the full screen button
    showFullScreen: true,
    // Whether to show the document button
    // Whether to show the notification button
    showNotice: true,
    // Whether to display the menu search
  },

  // Menu configuration
  menuSetting: {
    // sidebar menu bg color
    //  Whether to fix the left menu
    fixed: true,
    // Menu collapse
    collapsed: false,
    // Whether to display the menu name when folding the menu
    collapsedShowTitle: false,
    // Whether it can be dragged
    // Only limited to the opening of the left menu, the mouse has a drag bar on the right side of the menu
    // Whether to show no dom
    show: true,
    // Whether to show dom
    hidden: false,
    // Menu width
    menuWidth: 210,
    // Menu mode
    mode: MenuModeEnum.INLINE,
    // Menu type
    type: MenuTypeEnum.SIDEBAR,
    // Menu theme
    // Split menu
    split: false,
    // Top menu layout
    // Fold trigger position
    trigger: TriggerEnum.HEADER,
    // Turn on accordion mode, only show a menu
    // Switch page to close menu
    // Module opening method ‘click’ |'hover'
    // Fixed expanded menu
    mixSideFixed: false,
  },

  // Transition Setting
  transitionSetting: {
    //  Whether to open the page switching animation
    // The disabled state will also disable pageLoadinng
    enable: true,

    // Route basic switching animation
    basicTransition: RouterTransitionEnum.FADE_SIDE,

    // Whether to open page switching loading
    // Only open when enable=true
    openPageLoading: true,

    // Whether to open the top progress bar
    openNProgress: false,
  },

  // Whether to enable KeepAlive cache is best to close during development, otherwise the cache needs to be cleared every time
  openKeepAlive: true,

  // Automatic screen lock time, 0 does not lock the screen. Unit minute default 0
  lockTime: 0,

  // Whether to show breadcrumbs
  showBreadCrumb: true,

  // Whether to show the breadcrumb icon

  // Use error-handler-plugin

  // Whether to open back to top
  useOpenBackTop: true,

  //  Is it possible to embed iframe pages
  canEmbedIFramePage: true,

  // Whether to delete unclosed messages and notify when switching the interface

  // Whether to cancel the http request that has been sent but not responded when switching the interface.
  // If it is enabled, I want to overwrite a single interface. Can be set in a separate interface
};

export default setting;
