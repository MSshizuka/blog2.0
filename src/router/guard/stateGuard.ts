import type { Router } from 'vue-router';
// import { useAppStore } from '/@/store/modules/app';
// import { useUserStore } from '/@/store/modules/user';
import { PageEnum } from '/@/enums/pageEnum';
import { removeTabChangeListener } from '/@/logics/mitt/routeChange';

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    // Just enter the login page and clear the authentication information
    if (to.path === PageEnum.BASE_LOGIN) {
      // const userStore = useUserStore();
      // const appStore = useAppStore();
      // appStore.resetAllState();
      // userStore.resetState();
      removeTabChangeListener();
    }
  });
}
