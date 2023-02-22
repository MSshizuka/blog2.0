import { ThemeBgEnum, RouterTransitionEnum } from '/@/enums/appEnum';

export const thememOptions = [
  {
    value: ThemeBgEnum.QUANYECHA,
    label: '犬夜叉',
  },
  {
    value: ThemeBgEnum.SHLE,
    label: 'shle',
  },
  {
    value: ThemeBgEnum.KENAN,
    label: '名侦探柯南',
  },
  {
    value: ThemeBgEnum.DIANJUREN,
    label: '电锯人',
  },
  {
    value: ThemeBgEnum.SPY,
    label: '间谍过家家',
  },
  {
    value: ThemeBgEnum.FGO,
    label: 'Fate/Grand Order',
  },
];

export enum HandlerEnum {
  CHANGE_THEME,
  TOGGLE_CANVAS,
  GRAY_MODE,
  COLOR_WEAK,
}

export const routerTransitionOptions = [
  RouterTransitionEnum.ZOOM_FADE,
  RouterTransitionEnum.FADE,
  RouterTransitionEnum.ZOOM_OUT,
  RouterTransitionEnum.FADE_SIDE,
  RouterTransitionEnum.FADE_BOTTOM,
  RouterTransitionEnum.FADE_SCALE,
].map((item) => {
  return {
    label: item,
    value: item,
  };
});
