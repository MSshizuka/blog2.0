/**
 *  Vite Plugin for fast creating SVG sprites.
 * https://github.com/anncwb/vite-plugin-svg-icons
 */

/*
 *  预加载 在项目运行时就生成所有图标,只需操作一次 dom
 *  高性能 内置缓存,仅当文件被修改时才会重新生成
 */
import SvgIconsPlugin from 'vite-plugin-svg-icons';
import path from 'path';

export function configSvgIconsPlugin(isBuild: boolean) {
  const svgIconsPlugin = SvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    svgoOptions: isBuild,
    // default 指定symbolId格式
    symbolId: 'icon-[dir]-[name]',
  });
  return svgIconsPlugin;
}
