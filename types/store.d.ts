import { RoleInfo } from '/@/api/sys/model/userModel';

// Lock screen information
export interface LockInfo {
  pwd?: string | undefined;
  isLock?: boolean;
}

export interface UserInfo {
  userId: string | number;
  userName: string;
  homePath?: string;
  roles: RoleInfo[];
  realName: string;
  avatar: string;
  desc?: string;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
