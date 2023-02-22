<template>
  <div
    class="w-full sm:w-1/2 mx-auto mt-1 xl:h-120 lg:h-100 md:h-80 sm:h-60 h-30 bg-dark-900/50 relative z-index-2 rounded head-img"
  >
    <div class="w-full h-full bg-dark-700/50 text-center flex justify-center items-center">
      <h1 class="text-white text-2xl lg:text-6xl md:text-5xl sm:text-4xl font-bold">{{
        articleInfo.title
      }}</h1>
    </div>
  </div>
  <div class="sm:w-1/2 w-full mx-auto bg-white rounded-xl sm:p-10 p-5 mt-12 relative z-index-2">
    <header class="w-full text-center mb-15">
      <h3 class="flex justify-between mb-5">
        <Tooltip title="返回" placement="top">
          <Icon
            icon="akar-icons:arrow-back-thick-fill"
            :size="30"
            @click="goback"
            class="cursor-pointer mb-6 pt-1"
          />
        </Tooltip>
        <span class="text-4xl font-bold">{{ articleInfo.title }}</span>
        <span class="w-10"></span>
      </h3>
      <span
        ><Icon icon="fa:user" class="mr-1" color="#757575" />发表于<Icon
          icon="bxs:time-five"
          class="mx-1 icon-clock"
          size="18"
          color="#666666"
        />{{ currentTime }}<Icon icon="fa:eye" class="mx-1 ml-3" color="#757575" />{{
          articleInfo.browse
        }}次浏览<Icon icon="bxs:like" class="mx-1 ml-3 icon-heart" size="18" color="#757575" />{{
          articleInfo.likes
        }}次点赞<Icon
          icon="ant-design:star-filled"
          class="mx-1 ml-3 icon-collect"
          size="18"
          color="#757575"
        />{{ articleInfo.collects }}次收藏
      </span>
    </header>
    <div ref="viewContainer" class="w-full h-auto mb-20"></div>
    <div class="my-4 w-full text-right">
      <button class="tec-button" @click="userOption('like')"
        ><Icon icon="bxs:like" class="icon-heart mr-1" size="18" color="#fb7299" />点赞 |
        {{ articleInfo.likes }}</button
      >
      <button class="tec-button" @click="userOption('collect')"
        ><Icon
          icon="ant-design:star-filled"
          class="mr-1 icon-collect"
          size="18"
          color="#fb7299"
        />收藏 | {{ articleInfo.collects }}</button
      >
    </div>
    <Comment />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';
  import { getTargetArticle } from '/@/api/article';
  import { likeAndCollectArticle } from '/@/api/user';
  import type { Article } from '/@/api/article/model/indexModel';
  import { useRoute, useRouter } from 'vue-router';
  import Comment from '/@/views/common/Comment.vue';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import defaultImg from '/@/assets/images/head.jpg';
  import { getToken } from '/@/utils/auth';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { useThrottleFn } from '@vueuse/core';

  const userStore = useUserStore();
  const { id } = userStore.getUserInfo || {};

  const route = useRoute();
  const router = useRouter();
  const articleInfo = ref<Article>({
    id: -1,
    title: '',
    likes: 0,
    collects: 0,
    browse: 0,
    content: '',
    comments: 0,
    subType: 0,
    type: 1,
    imageUrl: '',
    createTime: new Date(),
  });
  const viewContainer = ref(null);

  const { createMessage } = useMessage();

  const currentTime = computed(() => {
    return formatToDateTime(articleInfo.value.createTime as unknown as any);
  });

  const createArticle = async () => {
    const subject = route.path === '/relife/detail' ? 'relife' : 'article';
    try {
      articleInfo.value = await getTargetArticle(route.query.id, { subject });
    } catch (e) {
      goback();
    }
  };

  // const createJottings = async () => {
  //   const { content, title } = await getJottingsList(route.query.id);
  //   value.value = content;
  //   articleTitle.value = title;
  // };

  onMounted(async () => {
    await createArticle();
    const el = viewContainer.value;
    if (el) {
      Vditor.preview(el, articleInfo.value.content, {
        mode: 'dark',
        hljs: {
          style: 'vim',
          lineNumber: true,
        },
      });
    }
  });

  const goback = () => {
    router.back();
  };

  /* 背景图片 */
  const articleBg = computed(() => {
    return `url(${articleInfo.value.imageUrl || defaultImg})`;
  });

  /* 用户点赞收藏 */
  const userOption = (action: string) => {
    if (!getToken()) return createMessage.error('只有登录后才能操作哦~');
    userClickAction(action);
  };

  /* 点击事件节流 */
  const userClickAction = useThrottleFn(
    async (action: string) => {
      const articleId = route.query.id as string;
      const { message } = await likeAndCollectArticle({
        articleId,
        id,
        action,
      });
      createMessage.success(message);
      createArticle();
    },
    1000,
    false,
  );
</script>

<style lang="less" scoped>
  .head-img {
    background: v-bind(articleBg) no-repeat 50% 50%;
    background-size: cover;
  }

  textarea.ant-input {
    background-color: transparent !important;
    border: 1px solid #bdba07 !important;
  }

  .icon-clock {
    vertical-align: -3px !important;
  }

  .icon-heart,
  .icon-collect {
    vertical-align: -4px !important;
  }

  .tec-button {
    border: 1px solid #c95817;
    border-radius: 20px;
    padding: 5px 20px;
    margin-left: 15px;
    color: #c95817;
  }
</style>
