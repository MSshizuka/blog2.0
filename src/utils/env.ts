import type { GlobEnvConfig } from '/#/config';

import { warn } from '/@/utils/log';
import pkg from '../../package.json';
import { getConfigFileName } from '../../build/getConfigFileName';

export function getCommonStoragePrefix() {
  const { VITE_GLOB_LOGO_NAME } = getAppEnvConfig();
  return `${VITE_GLOB_LOGO_NAME}__${getEnv()}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env);

  const ENV = (import.meta.env.DEV
    ? // Get the global configuration (the configuration will be extracted independently when packaging)
      (import.meta.env as unknown as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown as GlobEnvConfig;

  // console.log('ENV', ENV);

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_LOGO_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_AVATAR_URL,
    VITE_GLOB_UPLOAD_LOGO_URL,
    VITE_GLOB_UPLOAD_ARTICLE_URL,
    VITE_ENCRYPTION_KEY,
    VITE_ENCRYPTION_IV,
  } = ENV;

  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_LOGO_NAME)) {
    warn(
      `VITE_GLOB_LOGO_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`,
    );
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_LOGO_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_ARTICLE_URL,
    VITE_GLOB_UPLOAD_AVATAR_URL,
    VITE_GLOB_UPLOAD_LOGO_URL,
    VITE_ENCRYPTION_KEY,
    VITE_ENCRYPTION_IV,
  };
}

/**
 * @description: Development mode
 */
export const devMode = 'development';

/**
 * @description: Production mode
 */
export const prodMode = 'production';

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}
