// import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';
import type { AppRouteRecordRaw } from '/@/router/types';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';
import {
  DASHBOARD_ROUTE,
  ARTICLE_ROUTE,
  MESSAGE_ROUTE,
  ABOUT_ROUTE,
  // JOTTINGS_ROUTE,
} from './page';

// const modules = import.meta.globEager('./modules/**/*.ts'); // 类似webpack的require.context 获取指定目录下的所有模块

// const routeModuleList: AppRouteModule[] = [];
// console.log('route modules', modules);
// Object.keys(modules).forEach((key) => {
//   /* 遍历加载路由模块 */
//   const mod = modules[key].default || {};
//   // console.log('mod', mod);
//   const modList = Array.isArray(mod) ? [...mod] : [mod];
//   routeModuleList.push(...modList);
// });

// export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/index.vue'),
  meta: {
    title: 'Login',
    hideMenu: true,
  },
};

// Basic routing without permission
// 基本路由
export const basicRoutes = [
  LoginRoute, //登录
  DASHBOARD_ROUTE,
  ARTICLE_ROUTE,
  MESSAGE_ROUTE,
  ABOUT_ROUTE,
  // JOTTINGS_ROUTE,
  REDIRECT_ROUTE, // 路由重定向
  PAGE_NOT_FOUND_ROUTE, // 404路由
];
