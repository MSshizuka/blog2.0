/* 环境变量配置 */
import type { GlobConfig } from '/#/config';
import { warn } from '/@/utils/log';
import { getAppEnvConfig } from '/@/utils/env';

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_LOGO_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_AVATAR_URL,
    VITE_GLOB_UPLOAD_LOGO_URL,
    VITE_GLOB_UPLOAD_ARTICLE_URL,
    VITE_ENCRYPTION_IV,
    VITE_ENCRYPTION_KEY,
  } = getAppEnvConfig();

  if (!/[a-zA-Z\_]*/.test(VITE_GLOB_LOGO_NAME)) {
    warn(
      `VITE_GLOB_LOGO_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`,
    );
  }

  /* 全局配置.env变量 */
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    logoName: VITE_GLOB_LOGO_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadAvatarUrl: VITE_GLOB_UPLOAD_AVATAR_URL,
    uploadLogoUrl: VITE_GLOB_UPLOAD_LOGO_URL,
    uploadArticleUrl: VITE_GLOB_UPLOAD_ARTICLE_URL,
    encryptionIv: VITE_ENCRYPTION_IV,
    encryptionKey: VITE_ENCRYPTION_KEY,
  };
  return glob as Readonly<GlobConfig>;
};
