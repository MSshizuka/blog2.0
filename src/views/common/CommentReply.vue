<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="评论详情"
    @visible-change="handleShow"
    :footer="null"
  >
    <div class="w-full h-6" style="color: #fb7299"> 对话列表 </div>
    <ul class="comment-wrapper" v-loading="loading">
      <li class="py-6" v-for="item in commentList" :key="item.id">
        <template v-if="isShielded(item)">
          <article class="flex">
            <img
              :src="item.userInfo.avatar"
              class="sm:w-full sm:h-full w-9 h-8"
              @error="handleImg"
            />
            <section class="sm:ml-6 ml-2 w-full">
              <div class="flex">
                <div class="i-name"> {{ item.userInfo.username }} </div>
                <div class="i-class"> {{ labelStr(item.userInfo.label) }} </div>
              </div>
              <div class="i-region">ip属地：{{ item.region || '未知' }}</div>
              <div class="text-gray-400">
                <time> {{ formatToDateTime(item.createTime as any) }} </time>
              </div>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <p class="text-dark-700 content-box" v-html="handleContent(item)"> </p>
              <div class="flex justify-between mb-2 w-full">
                <span>
                  <Icon
                    :icon="item.tempLikeStatus ? 'bxs:like' : 'bx:like'"
                    :color="item.tempLikeStatus ? '#fb7299' : '#a1a1aa'"
                    class="cursor-pointer"
                    @click="doAction(1, item)"
                  />
                  <span class="text-zinc-400 ml-1 mr-2">{{ item.likes }}</span>
                  <Icon
                    :icon="
                      item.tempUnlikeStatus
                        ? 'ant-design:dislike-filled'
                        : 'ant-design:dislike-outlined'
                    "
                    :color="item.tempUnlikeStatus ? '#fb7299' : '#a1a1aa'"
                    class="cursor-pointer unlike"
                    :class="user?.role === 'super' ? '' : 'mr-3'"
                    @click="doAction(2, item)"
                  />
                  <span v-if="user?.role === 'super'" class="text-zinc-400 ml-1 mr-2">{{
                    item.unlikes
                  }}</span>
                  <Icon
                    icon="icon-park-outline:share-two"
                    color="#a1a1aa"
                    class="cursor-pointer mr-3 share"
                    @click="doAction(3, item)"
                  />
                  <Icon
                    icon="material-symbols:mode-comment-outline"
                    color="#a1a1aa"
                    class="cursor-pointer mr-2 reply"
                    @click="doAction(4, item)"
                  />
                </span>
                <span
                  class="cursor-pointer"
                  @click="doAction(5, item)"
                  v-if="item.id !== commentId"
                >
                  <Icon icon="ion:flag-outline" color="#fb7299" />
                  <span class="text-zinc-400 ml-1">举报</span>
                </span>
              </div>
              <div class="w-full reply-wrap" v-show="item.doReply">
                <a-textarea
                  :placeholder="`@${item.userInfo.username}:`"
                  :maxlength="200"
                  showCount
                  v-model:value.trim="item.reply"
                  :autoSize="false"
                />
                <span class="flex justify-between w-full mt-4">
                  <a-button class="w-1/3" @click="cancelReply(item)"> 取消 </a-button>
                  <a-button class="w-1/3" type="primary" @click="sendMsg(item)"> 回复 </a-button>
                </span>
              </div>
            </section>
          </article>
        </template>
        <template v-else>
          <div>
            <span class="inline-block sm:w-full sm:h-full w-9 h-8 shield-comment"></span>
            <span class="inline sm:ml-6 ml-2 w-full text-stone-400">已为您屏蔽该条评论</span>
          </div>
        </template>
      </li>
    </ul>
  </BasicModal>
  <ReportModal @register="registerReport" :centered="true" @refresh-list="getCommentList" />
</template>

<script lang="ts" setup>
  import useUserActions from './hooks/useUserActions';
  import useComment from './hooks/useComment';

  import ReportModal from './ReplyModal.vue';

  import { ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getToken } from '/@/utils/auth';
  import { MessageComment } from '/@/api/message/model/indexModel';
  import useImgLoadError from '/@/hooks/web/useImgLoadError';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import Icon from '/@/components/Icon';
  import { findAllSubComment } from '/@/api/message/index';

  const props = defineProps({
    commentId: {
      type: Number,
      required: true,
    },
  });

  /* 回复的评论Id */
  const target = ref({ id: 0 });
  /* 获取评论列表 */
  const getCommentList = async () => {
    const { records } = await findAllSubComment({
      id: props.commentId,
    });
    records.forEach((item) => {
      item.initLikeStatus = item.tempLikeStatus = handleLikeStatus(item, 'like');
      item.initUnlikeStatus = item.tempUnlikeStatus = handleLikeStatus(item, 'unlike');
      item.doReply = false;
      item.reply = '';
    });
    commentList.value = records;
    target.value.id = records[0].id;
    loading.value = false;
    setModalProps({ loading: false, confirmLoading: false });
  };

  const { doAction, registerReport } = useUserActions();
  /* 评论相关 */
  const {
    user,
    labelStr,
    commentList,
    handleLikeStatus,
    replyComment,
    isShielded,
    handleContent,
    cancelReply,
  } = useComment(target, getCommentList, false);

  const loading = ref(false);

  const [register, { setModalProps }] = useModalInner();

  /* 展示弹窗前请求数据 */
  const handleShow = (visible: boolean) => {
    nextTick(() => {
      if (visible) {
        loading.value = true;
        setModalProps({ loading: true, confirmLoading: true });
        getCommentList();
      }
    });
  };

  /* 图片加载错误 */
  const { handleImg } = useImgLoadError();

  /* 评论 */
  const sendMsg = async (data: undefined | MessageComment) => {
    if (!getToken()) return createMessage.error('只有登录后才能评论哦~');
    await replyComment(data, getCommentList);
  };

  const { createMessage } = useMessage();
</script>

<style lang="less" scoped>
  :deep(textarea.ant-input) {
    background: #f4f6f7 !important;
    height: 100px;
    margin-bottom: 10px;
  }

  .title {
    display: block;
    border-left: 4px solid #0960bd;
    padding: 0 10px;
    margin: 20px 0;
    font-size: 20px;
    color: #444;
  }

  .comment-wrapper,
  .target-comment {
    margin-bottom: 20px;
    border-bottom: 1px solid #e5eaed;

    > li {
      border-top: 1px solid #e5eaed;

      img {
        max-width: 55px;
        max-height: 55px;
        border-radius: 50%;
        object-fit: cover;
      }

      .i-name {
        font-size: 14px;
        color: #444;
        font-weight: 700;
      }

      .i-class {
        background: #dff0d8;
        margin: 3px 8px 8px 10px;
        color: #3c763d;
        padding: 3px 6px;
        border-radius: 5px;
        line-height: 10px;
        font-weight: 400;
        font-size: 10px;
      }

      .i-region {
        font-size: 12px;
        color: #aaa;
      }

      .content-box {
        > img {
          display: inline !important;
        }
      }

      /* 踩 */
      .unlike,
      .share,
      .reply {
        vertical-align: -3px;
      }

      .shield-comment {
        max-width: 55px;
        max-height: 55px;
      }
    }
  }

  .target-comment {
    border: none;
    margin-bottom: 0px;

    li {
      border: none;
    }
  }
</style>
