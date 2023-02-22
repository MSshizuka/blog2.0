import { defHttp } from '/@/utils/http/axios';

import {
  ArticleList,
  Article,
  GetCategoryModel,
  GetListByCommentModel,
  GetListByBrowseModel,
} from './model/indexModel';

import { commonSuccessModel, GetListModel } from '/@/api/common/indexModel';

enum Api {
  article = '/article',
  category = '/category',
  comment = '/comment',
  browse = '/article/browse',
  collectArticle = '/user/collect',
}

export function getArticleList(params) {
  return defHttp.get<GetListModel<ArticleList>>(
    { url: Api.article, params },
    { errorMessageMode: 'none' },
  );
}

export function createArticle(data) {
  return defHttp.post<commonSuccessModel>(
    { url: Api.article, data },
    { errorMessageMode: 'message' },
  );
}

export function getCategory(params) {
  return defHttp.get<GetCategoryModel>(
    { url: Api.category, params },
    { errorMessageMode: 'message' },
  );
}

export function getArticleListByComment() {
  return defHttp.get<GetListByCommentModel>({ url: Api.comment });
}

export function getArticleListByBrowse() {
  return defHttp.get<GetListByBrowseModel>({ url: Api.browse });
}

export function getTargetArticle(id, params) {
  return defHttp.get<Article>({ url: `${Api.article}/${id}`, params });
}

/* 获取用户收藏的所有文章 */
export function getCollectArticleList(params) {
  return defHttp.get<GetListModel<Article & { checked?: boolean }>>({
    url: Api.collectArticle,
    params,
  });
}
