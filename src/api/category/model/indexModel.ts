export interface category {
  id: number;
  name: string;
  pid: number;
  children?: Array<category>;
}

export type categoryTreeModel = Array<category>;
