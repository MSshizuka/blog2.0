<template>
  <main class="w-11/12 md:w-3/4 mx-auto bg-white/50 p-2 sm:p-8 mt-7 rounded relative z-index-3">
    <article class="flex justify-center">
      <div class="flex-col">
        <div class="w-22 h-22 cursor-pointer mx-auto header-img overflow-hidden rounded-1/2">
          <img :src="headerImg" alt="" class="w-full" />
        </div>
        <p class="font-bold text-xl mt-5 w-full">Hi，我是おう，前端萌新一枚~~</p>
      </div>
    </article>

    <article>
      <div>
        <div class="flex">
          <h4 class="friend-link">友链：</h4>
        </div>
        <main class="w-full">
          <div v-if="linkList.length" class="flex flex-start flex-wrap">
            <div
              class="w-full sm:w-1/3 md:w-1/3 lg:w-1/4 border rounded flex flex-col text-center cursor-pointer m-8 p-4 link-item"
              v-for="{ logo, siteUrl, siteDesc, siteName } in linkList"
              :key="siteUrl"
              @click="toSite(siteUrl)"
            >
              <div class="w-18 h-18 cursor-pointer mx-auto rounded-1/2 overflow-hidden">
                <img
                  :src="logo"
                  @error="handleImg"
                  alt="网站logo"
                  class="w-full h-full site-logo"
                />
              </div>
              <p class="mt-2">{{ siteName }}</p>
              <Divider style="border-color: #0960bd" dashed />
              <p class="ellipsis-2 text-left" style="text-indent: 2em" :title="siteDesc">{{
                siteDesc
              }}</p>
            </div>
            <div class="w-full flex py-2 justify-end mt-6" v-if="pagination.total > 0">
              <a-pagination
                showLessItems
                size="small"
                :pageSize="pagination.size"
                :total="pagination.total"
                :current="pagination.current"
                :show-total="(total) => `共 ${total} 条`"
                @change="handlePageChange"
            /></div>
          </div>

          <EmptyData v-else />
        </main>
      </div>
    </article>
  </main>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { Divider } from 'ant-design-vue';
  import { getLinkList } from '/@/api/user';
  import { FriendLinkModel } from '/@/api/user/model/indexModel';
  import { Pagination } from 'ant-design-vue';
  import EmptyData from '../common/EmptyData.vue';
  import headerImg from '/@/assets/images/avatar.jpg';
  import useImgLoadError from '/@/hooks/web/useImgLoadError';
  const { handleImg } = useImgLoadError();

  const APagination = Pagination;
  const linkList = ref<Array<FriendLinkModel>>([]);
  const pagination = reactive({
    size: 9,
    current: 1,
    total: 0,
  });

  const handlePageChange = (page: number) => {
    pagination.current = page;
    createLinkList();
  };

  const toSite = (url: string) => {
    window.open(url, '_blank');
  };

  const createLinkList = async () => {
    const { current, size, total, records } = await getLinkList({ ...pagination });
    linkList.value = records;
    pagination.current = current;
    pagination.size = size;
    pagination.total = total;
  };

  createLinkList();
</script>

<style lang="less" scoped>
  .header-img {
    transition: all 0.25s linear;
  }

  .header-img:hover {
    transform: rotate(360deg);
  }

  .friend-link {
    border-left: 4px solid #0960bd;
    padding-left: 20px;
    font-size: 16px;
    font-weight: 600;
  }

  .link-item:hover {
    transform: translateY(-5px);
    transform: scale(1.02);
    box-shadow: 0 0 2px 2px rgb(85, 96, 255);
    background: linear-gradient(
      to right,
      #b5eeba67,
      #756aee62,
      #df827881,
      #c77be780,
      #89ebe170,
      #e2e27d94
    );
    background-size: 500%;
    animation: gradual 17s linear infinite;
  }

  .site-logo {
    object-fit: cover;
  }
</style>
