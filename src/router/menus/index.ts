import type { Menu } from '/@/router/types';
import { usePermissionStore } from '/@/store/modules/permission';
import { getAllParentPath } from '/@/router/helper/menuHelper';
import { getToken } from '/@/utils/auth';

/* 获取菜单 */
export const getMenus = async (): Promise<Menu[]> => {
  const menus = await getAsyncMenus();
  return menus;
};

/* 获取菜单的实现 */
export function getAsyncMenus() {
  const permissionStore = usePermissionStore();
  // console.log(`permissionStore.getFrontMenuList.`, permissionStore.getFrontMenuList);
  const menuList = getToken() ? permissionStore.getBackMenuList : permissionStore.getFrontMenuList;
  console.log('getToken===>', getToken(), permissionStore.getFrontMenuList);
  return menuList.filter((item) => !item.hideMenu);
  // return permissionStore.getFrontMenuList.filter((item) => !item.hideMenu);
}

/* 获取当前路径 */
export async function getCurrentParentPath(currentPath: string) {
  const menus = await getAsyncMenus();
  const allParentPath = await getAllParentPath(menus, currentPath);
  // console.log('allParenPath', allParentPath);
  return allParentPath?.[0];
}

// Get the level 1 menu, delete children
// 获取1级菜单
export async function getShallowMenus(): Promise<Menu[]> {
  const menus = await getAsyncMenus();
  const shallowMenuList = menus.map((item) => ({ ...item, children: undefined }));
  // console.log('1级菜单：', shallowMenuList);
  return shallowMenuList;
}

// Get the children of the menu
// 获取子菜单
export async function getChildrenMenus(parentPath: string) {
  const menus = await await getAsyncMenus();
  const parent = menus.find((item) => item.path === parentPath);
  if (!parent || !parent.children || !!parent?.meta?.hideChildrenInMenu) {
    return [] as Menu[];
  }
  // console.log('子菜单：', parent.children);
  return parent.children;
}
