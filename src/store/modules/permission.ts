import type { AppRouteRecordRaw, Menu } from '/@/router/types';

import { defineStore } from 'pinia';
import { store } from '/@/store';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { flatMultiLevelRoutes, transformObjToRoute } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';
import { PageEnum } from '/@/enums/pageEnum';
import { basicRoutes } from '/@/router/routes';
import { usePermission } from '/@/hooks/web/usePermission';
import { filter } from '/@/utils/helper/treeHelper';
import { getToken } from '/@/utils/auth';
import { getMenuList } from '/@/api/sys/menu';

interface PermissionState {
  isDynamicAddedRoute: boolean; // 路由是否动态添加
  lastBuildMenuTime: number; // 触发菜单更新
  frontMenuList: Menu[];
  backMenuList: Menu[];
}

/* 权限store */
export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    isDynamicAddedRoute: false,
    lastBuildMenuTime: 0,
    frontMenuList: [],
    backMenuList: [],
  }),
  getters: {
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
  },
  actions: {
    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list;
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },

    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.frontMenuList = [];
      this.lastBuildMenuTime = 0;
    },

    /* 构建路由 */
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      // const appStore = useAppStoreWithOut();
      const { setPermissionMode } = usePermission();
      setPermissionMode(PermissionModeEnum.BACK);
      let routes: AppRouteRecordRaw[] = [];

      const permissionMode = getToken()
        ? PermissionModeEnum.BACK
        : PermissionModeEnum.ROUTE_MAPPING;
      // const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig;

      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return;
        let homePath: string = PageEnum.BASE_HOME;
        // console.log('patchHomeAffix homePath:', homePath);
        /*  */
        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/';
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route;
            const currentPath = path.startsWith('/') ? path : parentPath + path;
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string;
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true });
                // console.log('patcher后的route', route);
                throw new Error('end');
              }
            }
            children && children.length > 0 && patcher(children, currentPath);
          });
        }
        try {
          patcher(routes);
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return;
      };

      switch (permissionMode) {
        case PermissionModeEnum.ROUTE_MAPPING:
          console.log('前端路由映射模式');
          routes.push(...basicRoutes);
          const menuList = transformRouteToMenu(routes, true);
          menuList.sort((a, b) => {
            return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
          });

          this.setFrontMenuList(menuList);
          // Convert multi-level routing to level 2 routing
          routes = flatMultiLevelRoutes(routes);
          break;
        case PermissionModeEnum.BACK:
          let routeList: AppRouteRecordRaw[] = [];
          try {
            routeList = (await getMenuList()) as AppRouteRecordRaw[];
          } catch (error) {
            console.error(error);
          }

          // Dynamically introduce components
          routeList = transformObjToRoute(routeList);

          //  Background routing to menu structure
          const backMenuList = transformRouteToMenu(routeList);
          this.setBackMenuList(backMenuList);

          // remove meta.ignoreRoute item
          routeList = filter(routeList, routeRemoveIgnoreFilter);
          routeList = routeList.filter(routeRemoveIgnoreFilter);

          routeList = flatMultiLevelRoutes(routeList);
          routes = [...routeList];
          break;
      }

      patchHomeAffix(routes);
      return routes;
    },
  },
});

// Need to be used outside the setup
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
