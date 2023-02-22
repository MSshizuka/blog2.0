/**
 * Used to monitor routing changes to change the status of menus and tabs. There is no need to monitor the route, because the route status change is affected by the page rendering time, which will be slow
 */

import mitt from '/@/utils/mitt';
import type { RouteLocationNormalized } from 'vue-router';
import { getRawRoute } from '/@/utils';

const emitter = mitt();

const key = Symbol();

let lastChangeTab: RouteLocationNormalized;

/* 设置路由变化赋值 */
export function setRouteChange(lastChangeRoute: RouteLocationNormalized) {
  const r = getRawRoute(lastChangeRoute);
  emitter.emit(key, r);
  lastChangeTab = r;
}

/* 监听路由改变 */
export function listenerRouteChange(
  callback: (route: RouteLocationNormalized) => void,
  immediate = true,
) {
  // console.log('lastChangeTab', lastChangeTab);
  emitter.on(key, callback);
  immediate && lastChangeTab && callback(lastChangeTab);
}

/* 移除标签页队列变化 */
export function removeTabChangeListener() {
  emitter.clear();
}
