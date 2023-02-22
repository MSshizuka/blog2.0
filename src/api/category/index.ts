import { defHttp } from '/@/utils/http/axios';

import { categoryTreeModel } from './model/indexModel';

enum Api {
  allCategory = '/category/all',
}

export function getCategory() {
  return defHttp.get<categoryTreeModel>({ url: Api.allCategory });
}
