import { computed, ref, Ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { MessageComment } from '/@/api/message/model/indexModel';
import { getAuthCache, getToken } from '/@/utils/auth';
import { useMessage } from '/@/hooks/web/useMessage';
import { getMessageCommentList, createMessageComment } from '/@/api/message/index';
import { USER_INFO_KEY } from '/@/enums/cacheEnum';
import { GetUserInfoModel } from '/@/api/user/model/indexModel';
import { labelList } from '../../profile/data';
import { isFunction } from '/@/utils/is';
import useAnalyzeEmoji from './useAnalyzeEmoji';
import useLayoutGoTop from './useLayoutGoTop';

const typeMap = {
  '/relife/detail': 3,
  '/message/index': 2,
  '/article/detail': 1,
};

export default (
  target?: Ref<MessageComment | { id: number }>,
  afterBc?: Function,
  oneLevelModal?: boolean,
) => {
  const { createMessage } = useMessage();
  const { handleEmoji } = useAnalyzeEmoji();
  const { goTop } = useLayoutGoTop();
  const commentList = ref<Array<MessageComment>>([]);
  const route = useRoute();
  const content = ref('');
  const user = getAuthCache<GetUserInfoModel>(USER_INFO_KEY);
  const pagination = reactive({
    current: 1,
    size: 10,
    total: 0,
  });

  const type = computed(() => {
    console.log('route.path===>', route.path);
    return typeMap[route.path];
  });

  /* 评论 */
  const sendMsg = async (data: undefined | MessageComment) => {
    if (!getToken()) return createMessage.error('只有登录后才能评论哦~');
    try {
      if (!data) {
        await createComment();
      } else {
        await replyComment(data, afterBc);
      }
    } finally {
      content.value = '';
      queryCommentList();
    }
  };

  /* 评论文章 */
  const createComment = async () => {
    if (!content.value) {
      return createMessage.error('评论内容不能为空哦~');
    }
    const { message } = await createMessageComment({
      type: type.value,
      content: content.value,
      articleId: route.query.id,
    });
    createMessage.success(message);
  };

  /* 回复评论 */
  const replyComment = async (item, afterBc?) => {
    if (!item.reply) {
      return createMessage.error('回复内容不能为空哦~');
    }
    const { message } = await createMessageComment({
      type: type.value,
      content: item.reply,
      pid: item.id,
      articleId: route.query.id,
    });
    createMessage.success(message);
    afterBc && isFunction(afterBc) && (await afterBc());
  };

  /* 获取评论数据 */
  const queryCommentList = async () => {
    const { current, size, total, records } = await getMessageCommentList({
      ...pagination,
      type: type.value,
      articleId: route.query.id,
    });
    records.forEach((item) => {
      item.initLikeStatus = item.tempLikeStatus = handleLikeStatus(item, 'like');
      item.initUnlikeStatus = item.tempUnlikeStatus = handleLikeStatus(item, 'unlike');
      item.doReply = false;
      item.reply = '';
    });
    commentList.value = records;
    pagination.current = current;
    pagination.size = size;
    pagination.total = total;
  };

  /* 初始化点赞、点踩数据 */
  const handleLikeStatus = (item: MessageComment, type: string) => {
    if (!getToken()) return false;
    const list = type === 'like' ? item.likesUsers : item.unlikesUsers;
    return list.find((item) => +item.id === +user.id) ? true : false;
  };

  /* 取消回复 */
  const cancelReply = (item: MessageComment) => {
    item.doReply = false;
  };

  /* 是否需要对当前用户屏蔽此条评论 */
  const isShielded = (item: MessageComment) => {
    if (!getToken()) return true;
    return item.shieldUsers.find((item) => +item.id === +user.id) ? false : true;
  };

  /* 处理弹窗内的评论 emoji转义 */
  /* 处理评论 */
  const handleContent = (item) => {
    const id = oneLevelModal ? item.pid : item.id;
    // console.log('commentList===>', id, target?.value.id, id === target?.value.id);
    if (id === target?.value.id) {
      return handleEmoji(item.content);
    } else {
      const replyComment = commentList.value.find((comment) => comment.id === item.pid);
      return `回复 <span class="text-blue-400">@${
        replyComment?.userInfo.username
      } </span> ${handleEmoji(item.content)}`;
    }
  };

  /* 处理分页 */
  const handlePageChange = (page: number) => {
    pagination.current = page;
    goTop(500);
    queryCommentList();
  };

  /* 标签中文化 */
  const labelStr = (label: number) => {
    return labelList.find((item) => item.value === label)!.label;
  };

  /* 背景颜色 */
  const currentBgColor = computed(() => bgColorMap[route.path] || '#fff');
  const bgColorMap = {
    '/message/index': '#fff',
    '/article/detail': 'transparent',
  };

  return {
    handleEmoji,
    content,
    queryCommentList,
    sendMsg,
    commentList,
    pagination,
    cancelReply,
    isShielded,
    handlePageChange,
    handleLikeStatus,
    labelStr,
    currentBgColor,
    replyComment,
    user,
    handleContent,
  };
};
