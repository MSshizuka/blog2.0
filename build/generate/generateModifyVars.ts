import { generateAntColors, primaryColor } from '../config/themeConfig';
import { getThemeVariables } from 'ant-design-vue/dist/theme';
import { resolve } from 'path';

/**
 * less global variable
 */
export function generateModifyVars(dark = false) {
  const palettes = generateAntColors(primaryColor); //#0960bd
  const primary = palettes[5]; //#0960bd
  // console.log(primaryColor, '当前主色为：', primary);

  const primaryColorObj: Record<string, string> = {}; // 数组色值转对象

  for (let index = 0; index < 10; index++) {
    primaryColorObj[`primary-${index + 1}`] = palettes[index];
  }

  /**
   *  @Param dark | compact
   *  @returns 颜色集合
   */
  const modifyVars = getThemeVariables({ dark });
  // console.log('``````', 'primary-color', primary);
  return {
    ...modifyVars,
    // Used for global import to avoid the need to import each style file separately

    /* 以下均为重写组件自带的默认颜色 */
    // reference:  Avoid repeated references 避免重复引用
    hack: `${modifyVars.hack} @import (reference) "${resolve('src/design/config.less')}";`,
    'primary-color': primary,
    ...primaryColorObj, // 替换自带的主色 primary-1 ...
    'info-color': primary,
    'processing-color': primary,
    'success-color': '#55D187', //  Success color
    'error-color': '#ED6F6F', //  False color
    'warning-color': '#EFBD47', //   Warning color
    //'border-color-base': '#EEEEEE',
    'font-size-base': '14px', //  Main font size
    'border-radius-base': '2px', //  Component/float fillet
    'link-color': primary, //   Link color
    'app-content-background': '#fafafa', //   Link color
  };
}
