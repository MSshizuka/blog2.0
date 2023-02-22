import { defHttp } from '/@/utils/http/axios';

import { commonSuccessModel, GetListModel } from '/@/api/common/indexModel';
import { MessageComment } from './model/indexModel';

enum Api {
  comment = '/comment',
  subComment = '/comment/findSubComment',
  toggleLikesComment = '/comment/toggleLikesComment',
  shieldComment = '/comment/shield',
  findAllSubComment = '/comment/findAllSubComments',
}

export function getMessageCommentList(params) {
  return defHttp.get<GetListModel<MessageComment>>({ url: `${Api.comment}/type`, params });
}

export function createMessageComment(data) {
  return defHttp.post<commonSuccessModel>({ url: Api.comment, data });
}

export function toggleLikes(data: { id: string; type: string; status: boolean }) {
  return defHttp.post<commonSuccessModel>({ url: Api.toggleLikesComment, data });
}

/* 举报评论 */
export function shieldComment(data: { id: string; value: string }) {
  return defHttp.post<commonSuccessModel>({ url: Api.shieldComment, data });
}

/* 弹窗查询子级评论列表 */
export function findSubComment(params) {
  return defHttp.get<GetListModel<MessageComment> & { currentComment: Array<MessageComment> }>({
    url: Api.subComment,
    params,
  });
}

/* 弹窗查询对话列表 */
export function findAllSubComment(params) {
  return defHttp.get<GetListModel<MessageComment>>({
    url: Api.findAllSubComment,
    params,
  });
}
