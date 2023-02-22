import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { TOKEN_KEY } from '/@/enums/cacheEnum';

export function getToken() {
  return getAuthCache(TOKEN_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  return Persistent.getLocal(key) as T;
}

export function setAuthCache(key: BasicKeys, value) {
  return Persistent.setLocal(key, value, true);
}

export function clearAuthCache(immediate = true) {
  return Persistent.clearLocal(immediate);
}
