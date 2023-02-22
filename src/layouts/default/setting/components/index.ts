import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const SelectItem = createAsyncComponent(() => import('./SelectItem.vue'));
export const SwitchItem = createAsyncComponent(() => import('./SwitchItem.vue'));
