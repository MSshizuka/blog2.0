import { getStorageShortName } from '/@/utils/env';
/* createStorage 也即 create 方法 返回的是一个 WebStorage类的实例*/
import { createStorage as create, CreateStorageParams } from './storageCache';
import { enableStorageEncryption } from '/@/settings/encryptionSetting';
/* 默认缓存7天 */
import { DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting';

export type Options = Partial<CreateStorageParams>;

/* 生成存储配置 */
const createOptions = (storage: Storage, options: Options = {}): Options => {
  return {
    // No encryption in debug mode
    hasEncrypt: enableStorageEncryption, // 开发环境下false 不加密
    storage,
    prefixKey: getStorageShortName(), // sup + 环境模式 + 项目的版本号
    ...options,
  };
};

export const WebStorage = create(createOptions(localStorage)); //WebStorage类的实例

/* 默认创建localstorage */
export const createStorage = (storage: Storage = localStorage, options: Options = {}) => {
  return create(createOptions(storage, options));
};

/* 创建localstorage */
export const createLocalStorage = (options: Options = {}) => {
  return createStorage(localStorage, { ...options, timeout: DEFAULT_CACHE_TIME });
};

export default WebStorage;
