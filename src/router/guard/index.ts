import type { Router } from 'vue-router';
import { createStateGuard } from './stateGuard';
import { setRouteChange } from '/@/logics/mitt/routeChange';
import { createParamMenuGuard } from './paramMenuGuard';
import { createPermissionGuard } from './permissionGuard';
import { useScrollTo } from '/@/hooks/event/useScrollTo';
import { getToken } from '/@/utils/auth';

export function setupRouterGuard(router: Router) {
  createPageGuard(router);
  createStateGuard(router);
  getToken() ? createPermissionGuard(router) : createParamMenuGuard(router);
}

/* 菜单改变创建页面守卫联动tab页 */
function createPageGuard(router: Router) {
  const loadedPageMap = new Map<string, boolean>();
  router.beforeEach(async (to) => {
    to.meta.loaded = !!loadedPageMap.get(to.path);
    setRouteChange(to);
    return true;
  });
  router.afterEach((to) => {
    loadedPageMap.set(to.path, true);
    const el = document.querySelector('.sup-layout-content');
    if (el) {
      const { start } = useScrollTo({ el: el, to: 0, duration: 100 });
      start();
    }
  });
}
