import type { AppRouteRecordRaw } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';

// home
export const DASHBOARD_ROUTE: AppRouteRecordRaw = {
  path: '/',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard',
  meta: {
    title: '仪表盘',
    hideChildrenInMenu: true,
    icon: 'bx:bx-home',
  },
  children: [
    {
      path: 'dashboard',
      name: 'Home',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        hideMenu: true,
        hideBreadcrumb: true,
        title: '首页',
        currentActiveMenu: '/dashboard',
        icon: 'bx:bx-home',
      },
    },
  ],
};

export const ARTICLE_ROUTE: AppRouteRecordRaw = {
  path: '/article',
  name: 'Article',
  component: LAYOUT,
  redirect: '/article/list/front',
  meta: {
    icon: 'bx:category',
    title: '文章分类',
  },
  children: [
    {
      path: 'list/front',
      name: 'Front',
      meta: { title: '前端' },
      component: () => import('/@/views/article/list/index.vue'),
    },
    {
      path: 'list/back',
      name: 'Back',
      meta: { title: '后台' },
      component: () => import('/@/views/article/list/index.vue'),
    },
    {
      path: 'list/ops',
      name: 'Ops',
      meta: { title: '运维' },
      component: () => import('/@/views/article/list/index.vue'),
    },
    {
      path: 'detail',
      name: 'Detail',
      meta: { title: '详情', hideMenu: true },
      component: () => import('/@/views/article/detail/index.vue'),
    },
  ],
};

export const JOTTINGS_ROUTE: AppRouteRecordRaw = {
  path: '/relife',
  name: 'Relife',
  component: LAYOUT,
  redirect: '/relife/list',
  meta: {
    icon: 'icon-park-outline:collection-records',
    title: '生活点滴',
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'RelifeIndex',
      meta: { title: '生活点滴' },
      component: () => import('/@/views/article/list/index.vue'),
    },
  ],
};

export const MESSAGE_ROUTE: AppRouteRecordRaw = {
  path: '/message',
  name: 'Message',
  component: LAYOUT,
  redirect: '/message/index',
  meta: {
    icon: 'bx:message-detail',
    title: '留言板',
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'MessageIndex',
      meta: { title: '留言板' },
      component: () => import('/@/views/message/index.vue'),
    },
  ],
};

export const ABOUT_ROUTE: AppRouteRecordRaw = {
  path: '/about',
  name: 'ABOUT',
  component: LAYOUT,
  redirect: '/about/index',
  meta: {
    icon: 'mdi:access-point',
    title: '友链',
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'AboutIndex',
      meta: { title: '友链' },
      component: () => import('/@/views/about/index.vue'),
    },
  ],
};
