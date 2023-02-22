<template>
  <main class="relative bg-color mb-6 rounded">
    <section>
      <h3 class="font-bold text-xl mb-3">发表评论</h3>
      <form>
        <a-textarea
          :rows="2"
          showCount
          placeholder="说点什么呢``"
          :maxlength="200"
          v-model:value.trim="content"
        />
        <ClickOutSide @click-outside="handleClickOutside">
          <div :class="!isShow ? 'OwO' : 'OwO OwO-open'">
            <div class="OwO-logo" @click.stop="toggle">
              <span>OwO表情</span>
            </div>
            <div class="OwO-body" @click.stop>
              <ul class="OwO-items OwO-items-show" ref="OwORef">
                <li
                  class="OwO-item"
                  v-for="(oitem, index) in EmojiList"
                  :key="'oitem' + index"
                  @click="choseEmoji(oitem.title)"
                >
                  <img :src="oitem.url" alt="" class="emo-img" />
                </li>
              </ul>
              <div class="OwO-bar">
                <ul class="OwO-packages">
                  <li
                    class="OwO-package"
                    :class="currentEmojiIndex === index ? 'active' : ''"
                    v-for="(item, index) in EmojiNameList"
                    :key="item"
                    @click="changeTab(index)"
                    >{{ item }}</li
                  >
                </ul>
              </div>
            </div>
          </div>
        </ClickOutSide>
        <a-button class="w-full" type="primary" @click="sendMsg(undefined)"> 咻~~ </a-button>
      </form>
    </section>
    <div v-if="pagination.total">
      <section>
        <a href="javascript:;" class="title">活捉 {{ pagination.total }} 条</a>
        <ul class="comment-wrapper">
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
                  <p class="text-dark-700 content-box" v-html="handleEmoji(item.content)"> </p>
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
                    <span class="cursor-pointer" @click="doAction(5, item)">
                      <Icon icon="ion:flag-outline" color="#fb7299" />
                      <span class="text-zinc-400 ml-1">举报</span>
                    </span>
                  </div>
                  <div class="w-full reply-wrap" v-show="item.doReply">
                    <a-textarea
                      :placeholder="`@${item.userInfo.username}:`"
                      :maxlength="200"
                      showCount
                      v-model:value="item.reply"
                      :autoSize="false"
                    />
                    <span class="flex justify-between w-full mt-4">
                      <a-button class="w-1/3" @click="cancelReply(item)"> 取消 </a-button>
                      <a-button class="w-1/3" type="primary" @click="sendMsg(item)">
                        回复
                      </a-button>
                    </span>
                  </div>
                  <div
                    v-show="!item.doReply"
                    v-if="item.children && item.children.length > 0"
                    class="w-full h-auto bg-zinc-200/50 p-4"
                    @click="showComemntDetailList(item.id)"
                  >
                    <p class="cursor-pointer" v-for="n in item.children.slice(0, 3)" :key="n.id">
                      <span class="two-line">
                        <i class="text-blue-600 not-italic">{{ n.userInfo.username }}</i>
                        <span :title="n.content" class="text-neutral-800">：{{ n.content }}</span>
                      </span>
                    </p>
                    <p v-if="item.replyCount > 3" class="text-blue-600 cursor-pointer">更多回复</p>
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
      </section>
      <div class="flex py-2 items-center justify-end mt-6" v-if="pagination.total > 0">
        <a-pagination
          showLessItems
          size="small"
          :pageSize="pagination.size"
          :total="pagination.total"
          :current="pagination.current"
          :show-total="(total) => `共 ${total} 条`"
          @change="handlePageChange"
        />
      </div>
    </div>
    <EmptyData v-else />

    <ReportModal @register="registerReport" :centered="true" @refresh-list="queryCommentList" />
    <CommentModal
      :default-fullscreen="true"
      :canFullscreen="false"
      :comment-id="commentId"
      @register="registerComment"
      @refresh-list="queryCommentList"
    />
  </main>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  //Emoji
  import useAnalyzeEmoji from './hooks/useAnalyzeEmoji';
  import useUserActions from './hooks/useUserActions';
  import useComment from './hooks/useComment';
  import useImgLoadError from '/@/hooks/web/useImgLoadError';
  import { Pagination } from 'ant-design-vue';
  import { formatToDateTime } from '/@/utils/dateUtil';
  /* 举报弹窗 */
  import ReportModal from './ReplyModal.vue';
  import CommentModal from './CommentModal.vue';
  import { useModal } from '/@/components/Modal';
  import Icon from '/@/components/Icon';
  import { ClickOutSide } from '/@/components/ClickOutSide';
  import EmptyData from './EmptyData.vue';
  const APagination = Pagination;
  const OwORef = ref(null);
  const commentId = ref(0);
  /* 点赞等行为 */
  const { doAction, registerReport } = useUserActions();
  /* 默认图 */
  const { handleImg } = useImgLoadError();
  /* 评论相关 */
  const {
    handlePageChange,
    cancelReply,
    isShielded,
    sendMsg,
    queryCommentList,
    content,
    pagination,
    commentList,
    labelStr,
    currentBgColor,
    user,
  } = useComment();
  /* emoji */
  const {
    handleEmoji,
    EmojiList,
    toggle,
    changeTab,
    EmojiNameList,
    currentEmojiIndex,
    isShow,
    choseEmoji,
    handleClickOutside,
  } = useAnalyzeEmoji(content, OwORef);

  onMounted(queryCommentList);

  /* 打开评论弹窗 */
  const [registerComment, { openModal: openCommentModal }] = useModal();
  const showComemntDetailList = (id: number) => {
    commentId.value = +id;
    openCommentModal();
  };
</script>

<style lang="less" scoped>
  @import url('./emot.less');

  .bg-color {
    background-color: v-bind(currentBgColor);
  }

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

  .comment-wrapper {
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
</style>
