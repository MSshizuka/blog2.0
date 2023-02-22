import type { UserConfig, ConfigEnv } from 'vite';
import pkg from './package.json';
import dayjs from 'dayjs';
import { loadEnv } from 'vite';
import { resolve } from 'path';
import { generateModifyVars } from './build/generate/generateModifyVars';
import { createProxy } from './build/vite/proxy';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { OUTPUT_DIR } from './build/constant';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

const { dependencies, devDependencies, name, version } = pkg;
/* package.json里的数据 */

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

export default ({ command, mode }: ConfigEnv): UserConfig => {
  /*
   *    mode: development/production
   *    command: serve/build
   */
  const root = process.cwd(); // 当前工作路径 完整路径

  const env = loadEnv(mode, root); // 拿到对应环境的env文件里的变量 对象

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv;

  const isBuild = command === 'build';

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: [
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    server: {
      // 服务器配置
      host: true,
      https: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY), // 设置开发环境代理服务器
    },
    build: {
      // 打包配置
      minify: 'terser', //混淆器
      // target: 'es2015',
      // cssTarget: 'chrome86',
      outDir: OUTPUT_DIR, //输出地址 dist
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE, // 删除打印
        },
      },
      brotliSize: false, // 关闭可减少打包时间
      chunkSizeWarningLimit: 2000, //包大小超过告警
    },
    define: {
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false, //  开发调试
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars() /* 样式加载到全局 */,
          javascriptEnabled: true, // 仅样式按需导入 如果使用的是ant-design 系列的 需要配置这个 确保less安装在依赖 `yarn add less -D`
        },
      },
    },

    // The vite plugin used by the project. The quantity is large, so it is separately extracted and managed
    plugins: createVitePlugins(viteEnv, isBuild), // 插件安装

    optimizeDeps: {
      //强制预构建插件包
      // @iconify/iconify: The dependency is dynamically and virtually loaded by @purge-icons/generated, so it needs to be specified explicitly
      include: ['@vue/runtime-core', '@vue/shared', '@iconify/iconify'],
    },
  };
};
