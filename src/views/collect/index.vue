<template>
  <div class="w-full md:w-5/6 p-4 flex justify-center mx-auto flex-wrap">
    <div class="relative flex flex-col flex-wrap mx-auto z-index-2">
      <div v-if="articleList.length" v-loading="listLoading">
        <div
          class="relative w-full bg-dark-900/70 text-white overflow-hidden cursor-pointer mt-7 rounded-md z-index-3 flex justify-center list"
          v-for="item in articleList"
          :key="item.id"
          @click="toDetail(item)"
        >
          <div class="w-3/8 p-1 sm:p-4 flex relative justify-center align-center">
            <img :src="item.imageUrl" alt="" class="w-full relative z-index-4 left-bg" />
            <div
              class="top-2 left-2 w-5 h-5 rounded-1/2 bg-zinc-300 absolute z-index-5 !sm:top-5 !sm:left-5"
              v-if="mode === 'operate'"
            >
              <Icon
                icon="material-symbols:check-circle"
                color="#f10"
                :size="item.checked ? 20 : 0"
              />
            </div>
          </div>
          <div class="w-5/8 p-1 sm:p-4 flex flex-col justify-between">
            <header class="sm:w-full sm:text-3xl text-sm font-bold w-50 one-line title">{{
              item.title
            }}</header>
            <main
              class="text-xs sm:text-xl w-50 sm:w-auto"
              :class="getIsMobile ? 'one-line' : 'three-line'"
              :title="item.content"
              >{{ item.content }}</main
            >
            <div class="text-left flex justify-between">
              <div>
                <span class="mr-4 text-xs sm:text-sm">{{ item.comments }} 条评论</span>
                <span class="mr-4 text-xs sm:text-sm">{{ item.likes }} 条点赞</span>
                <span class="hidden sm:inline show">
                  <span class="mr-4">{{ item.browse }} 条浏览</span>
                  <span class="mr-4">{{ item.collects }} 条收藏</span>
                </span>
              </div>
              <span
                class="text-pink-600 text-xs"
                @click.stop="open([item.id])"
                v-if="mode === 'view'"
              >
                取消收藏
                <Icon
                  icon="material-symbols:delete-outline"
                  class="icon-cancel-collect"
                  size="20"
                />
              </span>
            </div>
          </div>
        </div>
        <div class="w-full flex py-2 items-center justify-between mt-6" v-if="pagination.total > 0">
          <div class="flex relative">
            <div class="flex" @click="toggleAllSelect" v-if="mode === 'operate'">
              <div
                class="item-select w-5 h-5 rounded-1/2 bg-zinc-300 mr-1 cursor-pointer z-index-5"
                v-if="mode === 'operate'"
              >
                <Icon
                  icon="material-symbols:check-circle"
                  color="#f10"
                  :size="20"
                  v-if="allSelectStatus === 'allSelected'"
                />
                <Icon
                  icon="ri:indeterminate-circle-fill"
                  color="#f10"
                  :size="20"
                  v-if="allSelectStatus === 'indeterminate'"
                />
              </div>
              <span class="mr-3 cursor-pointer text-pink-600">全选</span>
            </div>
            <span class="cursor-pointer text-fuchsia-600" @click="toggleMode">{{
              mode === 'view' ? '批量操作' : '返回'
            }}</span>
            <span
              v-if="mode === 'operate'"
              class="text-pink-600 ml-3 cursor-pointer"
              @click="open(selectIdS)"
            >
              取消收藏
            </span>
          </div>
          <a-pagination
            showLessItems
            size="small"
            :pageSize="pagination.pageSize"
            :total="pagination.total"
            :current="pagination.currentPage"
            :show-total="(total) => `共 ${total} 条`"
            @change="handlePageChange"
          />
        </div>
      </div>

      <div v-else class="w-full h-auto bg-white/50 mt-5 rounded">
        <EmptyData />
      </div>
    </div>

    <Modal
      @register="register"
      :min-height="20"
      :width="370"
      :centered="true"
      @refresh-list="createList"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive, computed } from 'vue';
  import { Pagination } from 'ant-design-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { getCollectArticleList } from '/@/api/article/index';
  import { Article } from '/@/api/article/model/indexModel';
  import { Icon } from '/@/components/Icon';
  import EmptyData from '../common/EmptyData.vue';
  import { useScrollTo } from '/@/hooks/event/useScrollTo';
  import { useModal } from '/@/components/Modal';
  import Modal from './Modal.vue';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { getIsMobile } = useAppInject();
  const { createMessage } = useMessage();

  const listLoading = ref(false);
  const mode = ref('view');
  const APagination = Pagination;
  const articleList = ref<Array<Article & { checked?: boolean }>>([]);
  const go = useGo();
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });

  const listTransform = computed(() => {
    return `${mode.value === 'view' ? 'scale(1.05)' : 'scale(1)'}`;
  });

  const listBoxShadow = computed(() => {
    return `${mode.value === 'view' ? '0 0 7px 5px rgb(85, 96, 255)' : 'none'}`;
  });

  /* 切换预览/操作模式 */
  const toggleMode = () => {
    mode.value = mode.value === 'operate' ? 'view' : 'operate';
  };

  /* 全选状态 */
  const allSelectStatus = computed(() => {
    const selectedList = articleList.value.filter((item) => item.checked);
    const artLen = articleList.value.length;
    const selectedLen = selectedList.length;
    if (selectedLen === artLen) {
      return 'allSelected';
    } else if (selectedLen > 0) {
      return 'indeterminate';
    } else {
      return 'empty';
    }
  });

  /* 全选点击 */
  const toggleAllSelect = () => {
    console.log('allSelectStatus', allSelectStatus.value);
    if (['empty', 'indeterminate'].includes(allSelectStatus.value)) {
      articleList.value.forEach((item) => (item.checked = true));
    } else {
      articleList.value.forEach((item) => (item.checked = false));
    }
  };

  /* 已选择的id数组 */
  const selectIdS = computed(() =>
    articleList.value.filter((item) => item.checked).map((item) => item.id),
  );

  /* 图片最大高度 */
  const imgMaxHeight = computed(() => {
    return `${getIsMobile.value ? '67px' : '244px'}`;
  });

  onMounted(async () => {
    await createList();
  });

  const createList = async () => {
    mode.value = 'view';
    try {
      listLoading.value = true;
      const { current, size, total, records } = await getCollectArticleList({
        current: pagination.currentPage,
        size: pagination.pageSize,
      });
      pagination.currentPage = current;
      pagination.pageSize = size;
      pagination.total = total;
      articleList.value = records;
    } finally {
      listLoading.value = false;
    }
  };

  const goTop = () => {
    const target = document.querySelector('.sup-layout-content')!;
    const { start } = useScrollTo({ el: target, to: 0, duration: 200 });
    start();
  };

  function handlePageChange(page: number) {
    pagination.currentPage = page;
    goTop();
    createList();
  }

  const [register, { openModal }] = useModal();

  /* 打开弹窗 */
  const open = (ids: number[] | string[]) => {
    if (!ids.length) return createMessage.warning('小宝贝，您能先选个再点吗？');
    openModal(true, {
      ids,
    });
  };

  const toDetail = (item) => {
    if (mode.value === 'operate') {
      item.checked = !item.checked;
      console.log('select');
    } else {
      go(`/article/detail?id=${item.id}`);
    }
  };
</script>

<style lang="less" scoped>
  .header-title {
    transform: translateY(-50%);
  }

  .one-line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .three-line {
    display: -webkit-box;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3; /* 这里是超出几行省略 */
    text-indent: 2rem;
  }

  .icon-cancel-collect {
    vertical-align: -5px !important;
  }

  .tips {
    line-height: 30px;
    color: #555;
    border-radius: 0 0 10px 10px;
  }

  .list {
    max-width: 1240px;
    max-height: 276px;

    &:hover {
      transform: v-bind(listTransform);
      box-shadow: v-bind(listBoxShadow);
    }

    .left-bg {
      // max-height: 244px;
      max-height: v-bind(imgMaxHeight);
      object-fit: cover;
    }

    .item-select {
      width: 20px;
      height: 20px;
      top: 5px;
      left: 5px;
    }
  }

  .ant-pagination {
    color: white !important;
  }
</style>
