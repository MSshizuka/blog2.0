import { RoleEnum } from '/@/enums/roleEnum';

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

export interface PaginationModel {
  current: number;
  size: number;
}

export interface FriendLinkModel {
  logo: string;

  siteName: string;

  siteDesc: string;

  siteUrl: string;
}

export interface LikeAndCollectArticleModel {
  id: number | string;
  articleId: number | string;
  action: string;
}

export interface removeCollectArticleModel {
  ids: Array<number | string>;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  token: string;
  // user: GetUserInfoModel;
  userId: string | number;
  userName: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  id: number;
  // 用户名
  username: string;
  // 头像
  avatar: string;
  // 邮箱
  email: string;
  // 性别
  sex: number;
  // 标签
  label: number;
  // 是否友链
  showLink: boolean;
  // 友链信息
  logo: string;

  siteName: string;

  siteDesc: string;

  siteUrl: string;

  role?: RoleEnum;

  homePath?: string;

  phone: string;
}

export interface UploadApiResult {
  message: string;
  code: number;
  url: string;
}
