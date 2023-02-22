/**
 * Vite plugin for website theme color switching
 * https://github.com/anncwb/vite-plugin-theme
 */
import type { Plugin } from 'vite';
import path from 'path';
import {
  viteThemePlugin,
  antdDarkThemePlugin,
  mixLighten, // 白色混合 fff
  mixDarken, // 黑色混合 000
  tinycolor,
} from 'vite-plugin-theme';
import { getThemeColors, generateColors } from '../../config/themeConfig';
/* 所有的颜色值对象 默认非暗系*/
import { generateModifyVars } from '../../generate/generateModifyVars';

/* 配置主题颜色 */
export function configThemePlugin(isBuild: boolean): Plugin[] {
  // console.log('change????');

  // colors:[包含rgba和16进制颜色值]
  const colors = generateColors({
    mixDarken,
    mixLighten,
    tinycolor,
  });
  const plugin = [
    viteThemePlugin({
      /* 自定义选择器转换 */
      resolveSelector: (s) => {
        s = s.trim();
        switch (s) {
          case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
            return '.ant-steps-item-icon > .ant-steps-icon';
          case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)':
          case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover':
          case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active':
            return s;
          case '.ant-steps-item-icon > .ant-steps-icon':
            return s;
          case '.ant-select-item-option-selected:not(.ant-select-item-option-disabled)':
            return s;
          default:
            if (s.indexOf('.ant-btn') >= -1) {
              // 按钮被重新定制过，需要过滤掉class防止覆盖
              return s;
            }
        }
        return s.startsWith('[data-theme') ? s : `[data-theme] ${s}`;
      },
      /* 如果 css 内包含在该数组内的颜色值，则会抽取出 css */
      colorVariables: [...getThemeColors(), ...colors],
    }),
    antdDarkThemePlugin({
      preloadFiles: [
        path.resolve(process.cwd(), 'node_modules/ant-design-vue/dist/antd.less'),
        //path.resolve(process.cwd(), 'node_modules/ant-design-vue/dist/antd.dark.less'),
        path.resolve(process.cwd(), 'src/design/index.less'),
      ],
      filter: (id) => (isBuild ? !id.endsWith('antd.less') : true),
      // extractCss: false,
      darkModifyVars: {
        // 暗系颜色
        ...generateModifyVars(true),
        'text-color': '#c9d1d9',
        'primary-1': 'rgb(255 255 255 / 8%)',
        'text-color-base': '#c9d1d9',
        'component-background': '#151515',
        'heading-color': 'rgb(255 255 255 / 65%)',
        // black: '#0e1117',
        // #8b949e
        'text-color-secondary': '#8b949e',
        'border-color-base': '#303030',
        // 'border-color-split': '#30363d',
        'item-active-bg': '#111b26',
        'app-content-background': '#1e1e1e',
        'tree-node-selected-bg': '#11263c',

        'alert-success-border-color': '#274916',
        'alert-success-bg-color': '#162312',
        'alert-success-icon-color': '#49aa19',
        'alert-info-border-color': '#153450',
        'alert-info-bg-color': '#111b26',
        'alert-info-icon-color': '#177ddc',
        'alert-warning-border-color': '#594214',
        'alert-warning-bg-color': '#2b2111',
        'alert-warning-icon-color': '#d89614',
        'alert-error-border-color': '#58181c',
        'alert-error-bg-color': '#2a1215',
        'alert-error-icon-color': '#a61d24',
      },
    }),
  ];

  return plugin as unknown as Plugin[];
}
