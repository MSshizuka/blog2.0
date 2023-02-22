/**
 * Used to package and output gzip. Note that this does not work properly in Vite, the specific reason is still being investigated
 * https://github.com/anncwb/vite-plugin-compression
 */
import type { Plugin } from 'vite';
import compressPlugin from 'vite-plugin-compression';

// 使用 gzip 或者 brotli 来压缩资源. brotli压缩率高于gzip nginx需要额外配置
export function configCompressPlugin(
  compress: 'gzip' | 'brotli' | 'none', // 压缩方式
  deleteOriginFile = false, //是否删除源文件
): Plugin | Plugin[] {
  const compressList = compress.split(',');

  const plugins: Plugin[] = [];

  if (compressList.includes('gzip')) {
    plugins.push(
      compressPlugin({
        ext: '.gz',
        deleteOriginFile,
      }),
    );
  }

  if (compressList.includes('brotli')) {
    plugins.push(
      compressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress', // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
        deleteOriginFile,
      }),
    );
  }
  return plugins;
}
