import type { LockInfo, UserInfo } from '/#/store';
import type { ProjectConfig } from '/#/config';
import type { RouteLocationNormalized } from 'vue-router';

import { createLocalStorage } from '/@/utils/cache';
import { Memory } from './memory';
import {
  TOKEN_KEY,
  USER_INFO_KEY,
  ROLES_KEY,
  LOCK_INFO_KEY,
  PROJ_CFG_KEY,
  APP_LOCAL_CACHE_KEY,
  MULTIPLE_TABS_KEY,
} from '/@/enums/cacheEnum';
/* 7天 */
import { DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting';
/* 解除双向绑定 */
import { toRaw } from 'vue';

import { pick, omit } from 'lodash-es';

/* 存储类的通用接口 */
interface BasicStore {
  [TOKEN_KEY]: string | number | null | undefined;
  [USER_INFO_KEY]: UserInfo;
  [ROLES_KEY]: string[];
  [LOCK_INFO_KEY]: LockInfo;
  [PROJ_CFG_KEY]: ProjectConfig;
  [MULTIPLE_TABS_KEY]: RouteLocationNormalized[];
}
type LocalStore = BasicStore;

/* 存储类的key键 */
export type BasicKeys = keyof BasicStore;
type LocalKeys = keyof LocalStore;

const ls = createLocalStorage(); // localstorage实例

// DEFAULT_CACHE_TIME 默认缓存时间
const localMemory = new Memory(DEFAULT_CACHE_TIME);

/* 初始化持久化缓存 */
function initPersistentMemory() {
  const localCache = ls.get(APP_LOCAL_CACHE_KEY);
  localCache && localMemory.resetCache(localCache);
  /*
   *  localMemory:对象 alive缓存的时间  cache为定义的存储数据的对象
   *    alive:time
   *    cache : {
   *      key:value
   *    }
   */
}

/* 基于Memory模拟实现的缓存类 */
export class Persistent {
  /* 获取缓存 */
  static getLocal<T>(key: LocalKeys) {
    return localMemory.get(key)?.value as Nullable<T>;
  }

  /* 设置缓存 */
  static setLocal(key: LocalKeys, value: LocalStore[LocalKeys], immediate = false): void {
    localMemory.set(key, toRaw(value));
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
  }

  /* 移除缓存 */
  static removeLocal(key: LocalKeys, immediate = false): void {
    localMemory.remove(key);
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
  }

  /* 清空缓存 */
  static clearLocal(immediate = false): void {
    localMemory.clear();
    immediate && ls.clear();
  }
}

window.addEventListener('beforeunload', function () {
  // TOKEN_KEY 在登录或注销时已经写入到storage了，此处为了解决同时打开多个窗口时token不同步的问题
  // LOCK_INFO_KEY 在锁屏和解锁时写入，此处也不应修改
  ls.set(APP_LOCAL_CACHE_KEY, {
    ...omit(localMemory.getCache, LOCK_INFO_KEY),
    ...pick(ls.get(APP_LOCAL_CACHE_KEY), [TOKEN_KEY, USER_INFO_KEY, LOCK_INFO_KEY]),
  });
});

function storageChange(e: any) {
  // console.log('storageChange:', e);
  const { key, newValue, oldValue } = e;

  if (!key) {
    Persistent.clearLocal();
    return;
  }

  if (!!newValue && !!oldValue) {
    if (APP_LOCAL_CACHE_KEY === key) {
      Persistent.clearLocal();
    }
  }
}

window.addEventListener('storage', storageChange);

initPersistentMemory();
