import { unref } from 'vue';
import { MessageComment } from '/@/api/message/model/indexModel';
import { getToken } from '/@/utils/auth';
import { useMessage } from '/@/hooks/web/useMessage';
import { useDebounceFn } from '@vueuse/shared';
import { toggleLikes } from '/@/api/message/index';
import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
import { useModal } from '/@/components/Modal';

export default () => {
  const { createMessage } = useMessage();
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const [registerReport, { openModal: openReportModal }] = useModal();

  /* 点赞评论分享举报 */
  const doAction = (num: number, payload: MessageComment) => {
    if (!getToken() && num !== 3) return createMessage.error('只有登录后才能操作哦~');
    switch (num) {
      case 1:
      case 2:
        toggleLikeComment(payload, num);
        break;
      case 3:
        shareSite();
        break;
      case 4:
        payload.doReply = !payload.doReply;
        break;
      case 5:
        open(payload);
        break;
    }
  };

  /* 点赞取消 */
  const toggleLikeComment = async (payload: MessageComment, num) => {
    let type;
    if (num === 1) {
      type = 'like';
      payload.tempLikeStatus = !payload.tempLikeStatus;
      if (payload.tempLikeStatus) {
        payload.likes = +payload.likes + 1;
        if (payload.tempUnlikeStatus) {
          payload.tempUnlikeStatus = false;
          payload.unlikes <= 0 ? (payload.unlikes = 0) : (payload.unlikes -= 1);
        }
      } else {
        payload.likes <= 0 ? (payload.likes = 0) : (payload.likes -= 1);
      }
    } else {
      type = 'unlike';
      payload.tempUnlikeStatus = !payload.tempUnlikeStatus;
      if (payload.tempUnlikeStatus) {
        payload.unlikes = +payload.unlikes + 1;
        if (payload.tempLikeStatus) {
          payload.tempLikeStatus = false;
          payload.likes <= 0 ? (payload.likes = 0) : (payload.likes -= 1);
        }
      } else {
        payload.unlikes <= 0 ? (payload.unlikes = 0) : (payload.unlikes -= 1);
      }
    }
    doLikesAction(payload, type);
  };

  /* 防抖包装点赞、点踩请求 */
  const doLikesAction = useDebounceFn(async (payload, type) => {
    const status = type === 'like' ? payload.tempLikeStatus : payload.tempUnlikeStatus;
    await toggleLikes({ id: payload.id, type, status });
  }, 400);

  /* 分享网站地址 */
  const shareSite = () => {
    clipboardRef.value = window.location.href;
    if (unref(copiedRef)) {
      createMessage.warning('链接复制成功，快去分享吧！');
    }
  };

  /* 打开举报弹窗 */
  const open = (data: MessageComment) => {
    openReportModal(true, {
      id: data.id,
    });
  };

  return {
    doAction,
    registerReport,
  };
};
