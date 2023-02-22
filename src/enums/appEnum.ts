/* 折叠菜单后不显示名称的最小宽度 */
export const SIDE_BAR_MINI_WIDTH = 48;
/* 折叠菜单后显示名称的最小宽度 */
export const SIDE_BAR_SHOW_TIT_MINI_WIDTH = 80;

/* 设置按钮的位置  默认顶部*/
export enum SettingButtonPositionEnum {
  AUTO = 'auto',
  HEADER = 'header',
  FIXED = 'fixed',
}

/* 会话超时处理 路由/页面 */
export enum SessionTimeoutProcessingEnum {
  ROUTE_JUMP,
  PAGE_COVERAGE,
}

/* 主题 */
export enum ThemeBgEnum {
  QUANYECHA = 'quanyecha',
  SHLE = 'shle',
  KENAN = 'kenan',
  DIANJUREN = 'dianjuren',
  SPY = 'spy',
  FGO = 'fgo',
}

/* 动画形式 */
export enum RouterTransitionEnum {
  ZOOM_FADE = 'zoom-fade',
  ZOOM_OUT = 'zoom-out',
  FADE_SIDE = 'fade-slide',
  FADE = 'fade',
  FADE_BOTTOM = 'fade-bottom',
  FADE_SCALE = 'fade-scale',
}

/**
 * 权限模式
 */
export enum PermissionModeEnum {
  // black
  BACK = 'BACK',
  // route mapping
  ROUTE_MAPPING = 'ROUTE_MAPPING',
}
