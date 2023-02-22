import type { Router } from 'vue-router';
import { configureDynamicParamsMenu } from '../helper/menuHelper';
import { Menu } from '../types';

import { usePermissionStoreWithOut } from '/@/store/modules/permission';
import { getToken } from '/@/utils/auth';

const blackList = ['/profile/index', '/article/publish'];
export function createParamMenuGuard(router: Router) {
  const permissionStore = usePermissionStoreWithOut();
  permissionStore.buildRoutesAction();
  // debugger;
  // router.replace('/dashboard/index');
  router.beforeEach(async (to, _, next) => {
    if (blackList.includes(to.path) && !getToken()) {
      next('/404');
    }

    if (getToken() && to.path === '/login') {
      next(_.path);
    }

    if (to.path === '/') {
      next('/dashboard');
    }
    // filter no name route
    if (!to.name) {
      next();
      return;
    }

    // menu has been built.
    if (!permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    let menus: Menu[] = [];
    menus = permissionStore.getFrontMenuList;
    menus.forEach((item) => configureDynamicParamsMenu(item, to.params));

    next();
  });
}
