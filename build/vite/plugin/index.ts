import type { Plugin } from 'vite';
/* 第三方插件 */
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import windiCSS from 'vite-plugin-windicss';
// import VitePluginCertificate from 'vite-plugin-mkcert';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
/* 包装的插件 */
import { configHtmlPlugin } from './html';
import { configCompressPlugin } from './compress';
import { configStyleImportPlugin } from './styleImport';
import { configThemePlugin } from './theme';
import { configSvgIconsPlugin } from './svgSprite';

/**
 *
 * @param viteEnv env文件的配置对象
 * @param isBuild 是否是线上环境
 * @returns
 */
export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;

  const vitePlugins: (Plugin | Plugin[])[] = [
    vue(), // 编译vue文件
    vueJsx(), // 编译vue的jsx语法
    vueSetupExtend(), // 支持在vue3 setup中 script上直接定义组件name
    // VitePluginCertificate({
    //   // 开发环境下安装证书
    //   source: 'coding',
    // }),
  ];

  // windicss样式配置
  vitePlugins.push(windiCSS());

  /*
   *  设置页面标题
   *  打包会生成 _app.config.js
   *  插件会生成script标签 src="./_app.config.js?版本号-时间戳" 然后插入到index.html中
   */
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // 用于生成 svg 雪碧图.
  vitePlugins.push(configSvgIconsPlugin(isBuild));

  // 由于vite本身已按需导入了组件库，因此仅样式不是按需导入的，因此只需按需导入样式即可
  vitePlugins.push(configStyleImportPlugin(isBuild));

  /*
   *  用于动态更改界面主题色的 vite 插件。
   *  在 vite 处理 css 后,动态解析 css 文本内符合插件配置的颜色值的时候,从所有输出的 css 文件提取指定的颜色样式代码。
   *  创建一个仅包含颜色样式的app-theme-style.css文件，动态插入到指定的位置(默认 body 底部)
   *  将所使用的自定义样式/组件库样式颜色替换为新的颜色,以达到动态更改项目主题色的目的
   */
  vitePlugins.push(configThemePlugin(isBuild));

  if (isBuild) {
    // 只在开发环境下执行
    // 压缩打包的文件
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE),
    );
  }

  return vitePlugins;
}
