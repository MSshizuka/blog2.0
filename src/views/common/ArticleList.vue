<template>
  <div class="relative text-white flex flex-col flex-wrap !md:w-7/12 w-full mx-auto z-index-2">
    <div class="relative overflow-hidden mt-7 bg-white rounded p-4" v-if="isShowLabel">
      <div class="ui label">
        <a href="javascript:;">{{ currentType?.name }}</a>
      </div>
      <div class="mt-15">
        <Button
          :type="currentActiveIndex === index ? 'primary' : 'default'"
          class="mr-2 rounded"
          v-for="({ id, name }, index) in subTypeList"
          :key="id"
          @click="changeBtnActive(index)"
        >
          {{ name }}
        </Button>
      </div>
    </div>

    <div v-if="articleList.length" v-loading="listLoading">
      <div
        class="relative w-full overflow-hidden text-center mt-7 h-80 cursor-pointer z-index-3 list"
        :style="`background: url(${item.imageUrl}) no-repeat;background-size: cover;background-position: 50% 50%`"
        v-for="item in articleList"
        :key="item.id"
        @click="toDetail(item.id)"
      >
        <div class="ui label">
          <a href="javascript:;">{{ item.categoryInfo.name }}</a>
        </div>
        <header
          class="absolute w-full text-center z-index-10 top-40 text-3xl font-medium header-title"
          >{{ item.title }}
        </header>
        <article class="absolute w-full px-12 top-40 z-index-10 h-11 hidden overflow-hidden article"
          >{{ item.content }}
        </article>
        <footer class="absolute w-full pl-10 text-left h-8 z-index-10 bottom-0 bg-white tips">
          {{ formatToDateTime(item.createTime as any ) }} {{ item.comments }}条评论
          {{ item.likes }}条点赞 {{ item.browse }}条浏览
        </footer>
        <div class="absolute w-full h-80 top-72 bg-dark-900/50 z-index-4 rounded mark"></div>
      </div>
      <div class="flex py-2 items-center justify-end mt-6" v-if="pagination.total > 0">
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

    <div v-else class="w-full h-auto bg-white/50 mt-5 rounded" v-loading="listLoading">
      <EmptyData v-if="listLoading === false" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, reactive } from 'vue';
  import { Button } from '/@/components/Button';
  import { Pagination } from 'ant-design-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import useLayoutGoTop from './hooks/useLayoutGoTop';
  import { useRoute } from 'vue-router';
  import { getArticleList, getCategory } from '/@/api/article/index';
  import { ArticleList, Category } from '/@/api/article/model/indexModel';
  import type { CategoryCondition } from './types';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import EmptyData from './EmptyData.vue';

  const listLoading = ref(false);
  const { goTop } = useLayoutGoTop();
  const APagination = Pagination;
  const articleList = ref<Array<ArticleList>>([]);
  const go = useGo();
  const route = useRoute();
  const currentType = ref<Category>();
  const currentActiveIndex = ref(0);
  const subTypeList = ref<Array<Category>>([]);
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });

  const showLabelBlackList = ['/dashboard', '/relife/list', '/relife/detail'];
  const isShowLabel = computed(() => !showLabelBlackList.includes(route.path));

  onMounted(async () => {
    if (isShowLabel.value) {
      await createCategory();
    }
    await createList();
  });

  const createCategory = async () => {
    const { type, children } = await getCategory({
      path: /\/[^/]+$/.exec(route.path)![0],
    });
    currentType.value = type;
    subTypeList.value = children;
  };

  const createList = async () => {
    const categoryCondition: CategoryCondition = {
      type: undefined,
      subType: undefined,
      path: route.path,
    };

    if (isShowLabel.value) {
      const subType = subTypeList.value[currentActiveIndex.value];
      categoryCondition.type = currentType.value!.id;
      if (subType.id !== -1) {
        categoryCondition.subType = subType.id;
      }
    }

    try {
      listLoading.value = true;
      const keyword = route.query.k;
      const { current, size, total, records } = await getArticleList({
        current: pagination.currentPage,
        size: pagination.pageSize,
        keyword,
        ...categoryCondition,
      });
      pagination.currentPage = current;
      pagination.pageSize = size;
      pagination.total = total;
      articleList.value = records;
    } finally {
      listLoading.value = false;
    }
  };

  const changeBtnActive = (index: number) => {
    currentActiveIndex.value = index;
    createList();
  };

  function handlePageChange(page: number) {
    pagination.currentPage = page;
    goTop();
    createList();
  }

  const toDetail = (id: number) => {
    const perfixUrl = route.path.includes('relife') ? '/relife/detail?id=' : '/article/detail?id=';
    go(`${perfixUrl}${id}`);
  };
</script>

<style lang="less" scoped>
  .header-title {
    transform: translateY(-50%);
  }

  .article {
    word-break: break-all;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    /* 这里是超出几行省略 */
    text-indent: 2rem;
  }

  .tips {
    line-height: 30px;
    color: #555;
  }

  .mark {
    transition: top 0.05s linear;
  }

  .list {
    clip-path: polygon(0% 50%, 50% 10%, 100% 50%, 50% 90%);
    transition: all 0.2s linear;
  }

  .list:hover {
    // transform: scale(1.02);
    box-shadow: 0 0 7px 5px rgb(85, 96, 255);
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);

    .mark {
      top: 0;
    }

    .header-title {
      top: 30%;
    }

    .article {
      display: -webkit-box;
    }
  }

  .ant-pagination {
    color: white !important;
  }
</style>
