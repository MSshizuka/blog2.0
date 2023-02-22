export interface category {
  label: string;
  value: string;
  children?: Array<category>;
}

export type categoryTree = Array<category>;
