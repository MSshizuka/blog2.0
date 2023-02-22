import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
import FullScreen from './FullScreen.vue';

export const UserDropDown = createAsyncComponent(() => import('./user-dropdown/index.vue'));

export const UserAction = createAsyncComponent(() => import('./user-action/index.vue'));

export const LayoutBreadcrumb = createAsyncComponent(() => import('./Breadcrumb.vue'));

export const Search = createAsyncComponent(() => import('./Search.vue'));

export { FullScreen };
