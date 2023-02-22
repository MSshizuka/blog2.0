import { isDevMode } from '/@/utils/env';

// System default cache time, in seconds
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

// aes encryption key
export const cacheCipher = {
  key: import.meta.env.VITE_ENCRYPTION_KEY as string,
  iv: import.meta.env.VITE_ENCRYPTION_IV as string,
};

// Whether the system cache is encrypted using aes
export const enableStorageEncryption = !isDevMode();
