type IdObj = { id: string };

export interface MessageComment {
  id: number;
  pid: number;
  content: string;
  createTime: Date;
  userId: number;
  region: string;
  likes: number;
  unlikes: number;
  userInfo: BaseUserInfo;
  likesUsers: Array<IdObj>;
  unlikesUsers: Array<IdObj>;
  shieldUsers: Array<IdObj>;
  replyCount: number;
  tempLikeStatus?: boolean;
  tempUnlikeStatus?: boolean;
  initLikeStatus?: boolean;
  initUnlikeStatus?: boolean;
  doReply?: boolean;
  reply?: string;
  children?: Array<MessageComment>;
}

export interface BaseUserInfo {
  id: number;
  label: number;
  username: string;
  avatar: string;
}
