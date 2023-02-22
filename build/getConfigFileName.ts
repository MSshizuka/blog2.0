/* 得到配置文件名 __PRODUCTION_${}_CONF__ */
export const getConfigFileName = (env: Record<string, any>) => {
  return `__PRODUCTION__${env.VITE_GLOB_LOGO_NAME || '__APP'}__CONF__`
    .toUpperCase()
    .replace(/\s/g, '');
};
