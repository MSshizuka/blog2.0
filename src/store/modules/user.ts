import type { ErrorMessageMode } from '/#/axios';
import type { RouteRecordRaw } from 'vue-router';
import { RoleEnum } from '/@/enums/roleEnum';
/* 定值 */
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { PageEnum } from '/@/enums/pageEnum';
// import { PermissionModeEnum } from '/@/enums/appEnum';
/* router */
import { router } from '/@/router';
/* store */
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { usePermissionStore } from '/@/store/modules/permission';
/* api */
import { GetUserInfoModel, LoginParams } from '/@/api/user/model/indexModel';
import { loginApi, getUserInfo, doLogout } from '/@/api/user';
/* utils */
import { getAuthCache, setAuthCache } from '/@/utils/auth';
/* hooks */
import { useMessage } from '/@/hooks/web/useMessage';
// import { usePermission } from '/@/hooks/web/usePermission';

interface UserState {
  userInfo: Nullable<GetUserInfoModel>;
  token?: string;
  role: RoleEnum | '';
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

const { createMessage } = useMessage();

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // role
    role: '',
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): GetUserInfoModel {
      return this.userInfo || getAuthCache<GetUserInfoModel>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getrole(): RoleEnum | '' {
      return this.role;
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setrole(role: RoleEnum) {
      this.role = role;
      setAuthCache(ROLES_KEY, role);
    },
    setUserInfo(info: GetUserInfoModel | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.role = '';
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        mode?: ErrorMessageMode;
      },
    ) {
      const { ...loginParams } = params;
      const { token, userId } = await loginApi(loginParams);
      this.setToken(token);
      return this.afterLoginAction(userId);
    },

    /* 登录之后的回调 */
    async afterLoginAction(userId: string | number): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      const userInfo = await this.getUserInfoAction(userId);
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        await router.replace(userInfo?.homePath || PageEnum.BASE_HOME);
      }
      return userInfo;
    },

    async getUserInfoAction(userId: string | number): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo(userId);
      const { role } = userInfo;
      this.setrole(role);
      this.setUserInfo(userInfo);
      return userInfo;
    },

    /**
     * @description: logout
     */
    async logout() {
      const { id, username } = this.getUserInfo;

      // const { setPermissionMode } = usePermission();
      // const permissionStore = usePermissionStore();
      if (this.getToken) {
        try {
          await doLogout({ id, username });
          createMessage.success('退出成功');
        } catch {
          console.error('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      window.location.href = `${window.location.origin}/dashboard`;
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
