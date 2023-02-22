export interface GetListModel<T> {
  current: number;

  size: number;

  total: number;

  records: Array<T>;
}

export interface commonSuccessModel {
  message: string;
}
