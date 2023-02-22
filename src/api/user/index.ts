import { defHttp } from '/@/utils/http/axios';
import {
  GetUserInfoModel,
  LoginParams,
  LoginResultModel,
  PaginationModel,
  FriendLinkModel,
  LikeAndCollectArticleModel,
  removeCollectArticleModel,
} from './model/indexModel';
import { commonSuccessModel, GetListModel } from '../common/indexModel';

enum Api {
  user = '/user',
  Login = '/user/login',
  Logout = '/user/logout',
  linkList = '/user/friend-link',
  Verify = '/user/verify',
  Code = '/email/code',
  addArticleLikeAndCollect = '/user/addLikeAndCollectArticle',
  removeCollectArticle = '/user/removeCollectArticle',
  sendCode = '/user/sendCode',
  modifyPwd = '/user/modifyPwd',
}

import { UploadApiResult } from './model/indexModel';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';
import { RoleEnum } from '/@/enums/roleEnum';

const { uploadAvatarUrl = '', uploadLogoUrl = '' } = useGlobSetting();

/**
 * @description: Upload interface
 */
export function uploadAvatarApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadAvatarUrl,
      onUploadProgress,
    },
    params,
  );
}

export function uploadLogoApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadLogoUrl,
      onUploadProgress,
    },
    params,
  );
}

export function userRegister(data) {
  return defHttp.post<commonSuccessModel>({ url: Api.user, data });
}

export function loginApi(params: LoginParams) {
  return defHttp.post<LoginResultModel>({
    url: Api.Login,
    params,
  });
}

export function doLogout(data: Pick<GetUserInfoModel, 'id' | 'username'>) {
  return defHttp.post<commonSuccessModel>({ url: Api.Logout, data });
}

export function sendCode(data: { email?: string; phone?: string }) {
  return defHttp.post<commonSuccessModel>({ url: Api.sendCode, data });
}

export function modifyPwd(data: { code: string; password: string; email: string; phone: string }) {
  return defHttp.post<commonSuccessModel>({ url: Api.modifyPwd, data });
}

export function getLinkList(params: PaginationModel) {
  return defHttp.get<GetListModel<FriendLinkModel>>({ url: Api.linkList, params });
}

export function getUserInfo(id: string | number) {
  return defHttp.get<GetUserInfoModel & { role: RoleEnum; homePath: string }>({
    url: `${Api.user}/${id}`,
  });
}

export function modifyUserInfo(id: number, data: GetUserInfoModel) {
  return defHttp.patch<commonSuccessModel>({ url: `${Api.user}/${id}`, data });
}

export function verfiy(
  type: 'username' | 'email' | 'phone',
  data: Pick<GetUserInfoModel, 'username' | 'email' | 'phone'>,
) {
  return defHttp.post<commonSuccessModel>({
    url: `${Api.Verify}/${type}`,
    data,
  });
}

export function createCode(data: { email?: string; phone?: string }) {
  return defHttp.post<commonSuccessModel>({
    url: Api.Code,
    data,
  });
}

/* 给文章点赞和收藏 */
export function likeAndCollectArticle(data: LikeAndCollectArticleModel) {
  return defHttp.post<commonSuccessModel>({ url: Api.addArticleLikeAndCollect, data });
}

/* 用户取消收藏 */
export function removeCollectArticle(data: removeCollectArticleModel) {
  return defHttp.post<commonSuccessModel>({ url: Api.removeCollectArticle, data });
}

// export function getPermCode() {
//   return defHttp.get<string[]>({ url: Api.GetPermCode });
// }
