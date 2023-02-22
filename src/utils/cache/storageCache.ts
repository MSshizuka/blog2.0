import { cacheCipher } from '/@/settings/encryptionSetting';
import type { EncryptionParams } from '/@/utils/cipher';
import { AesEncryption } from '/@/utils/cipher';
import { isNullOrUnDef } from '/@/utils/is';

export interface CreateStorageParams extends EncryptionParams {
  prefixKey: string;
  storage: Storage;
  hasEncrypt: boolean;
  timeout?: Nullable<number>;
}
export const createStorage = ({
  prefixKey = '',
  storage = localStorage,
  key = cacheCipher.key,
  iv = cacheCipher.iv,
  timeout = null,
  hasEncrypt = true,
}: Partial<CreateStorageParams> = {}) => {
  /**
   * Construction parameters can be passed into localStorage,
   * @class Cache
   * @example
   */
  const WebStorage = class WebStorage {
    /* 类的私有属性 */
    private storage: Storage;
    private prefixKey?: string;
    private encryption: AesEncryption; // 类  包含AES加解密方法
    private hasEncrypt: boolean; // 是否加密 production环境加密

    constructor() {
      /* 实例的属性 */
      this.storage = storage;
      this.prefixKey = prefixKey;
      this.encryption = new AesEncryption({ key, iv });
      this.hasEncrypt = hasEncrypt;
    }

    /* 类的静态方法 */
    private getKey(key: string) {
      // 缓存的键名拼接并转大写
      return `${this.prefixKey}${key}`.toUpperCase();
    }

    /* 设置缓存 */
    set(key: string, value: any, expire: number | null = timeout) {
      const stringData = JSON.stringify({
        value,
        time: Date.now(),
        expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null,
      });
      const stringifyValue = this.hasEncrypt
        ? this.encryption.encryptByAES(stringData)
        : stringData;
      this.storage.setItem(this.getKey(key), stringifyValue);
    }

    /* 获取缓存 */
    get(key: string, def: any = null): any {
      const val = this.storage.getItem(this.getKey(key));
      if (!val) return def;

      try {
        const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val;
        const data = JSON.parse(decVal);
        const { value, expire } = data;
        if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
          return value;
        }
        this.remove(key);
      } catch (e) {
        return def;
      }
    }

    /* 删除缓存 */
    remove(key: string) {
      this.storage.removeItem(this.getKey(key));
    }

    /* 清空缓存 */
    clear(): void {
      this.storage.clear();
    }
  };
  return new WebStorage();
};
