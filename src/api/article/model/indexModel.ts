import { BaseUserInfo } from '/@/api/message/model/indexModel';

/* 列表文章 */
export interface ArticleList extends Article {
  categoryInfo: Category;
}

/* 详情文章 */
export interface Article {
  id: number;

  /* 文章标题 */
  title: string;

  // /* 评论数 */
  comments: number;

  /* 点赞数 */
  likes: number;

  /* 收藏数 */
  collects: number;

  /* 浏览量 */
  browse: number;

  /* 内容 默认md格式文档 */
  content: string;

  /* 背景图片 */
  imageUrl: string;

  /* 分类
   *  0 前端
   *  1 后端
   *  2 运维
   */
  type: number;

  /* 次分类 */
  subType: number;

  /* 创建时间 */
  createTime: Date;
}

export interface GetCategoryModel {
  type: Category;
  children: Array<Category>;
}

export interface Category {
  id: number;
  name: string;
}

export interface CommentModel {
  id: number;
  content: string;
  articleId: number;
  createTime: Date;
  userId: number;
  articleInfo: Article;
  userInfo: BaseUserInfo;
}

export type GetListByCommentModel = Array<CommentModel>;

export type GetListByBrowseModel = Array<Article>;
