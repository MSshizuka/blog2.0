<template>
  <div class="p-4">
    <Avatar class="enter-y relative z-index-2" />
    <div
      class="h-30 py-5 relative z-index-2 text-center desc-word !sm:text-3xl !md:text-4xl !lg:text-5xl text-xl ellipsis-2 select-none"
    >
      贵有恒，何必三更起五更眠；最无益，只怕一日曝十日寒
    </div>

    <div class="w-full md:w-2/3 sm:flex sm:justify-around mx-auto sm:flex-wrap">
      <ArticleList />
      <QuickAside />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Avatar from './Avatar.vue';
  import ArticleList from '/@/views/common/ArticleList.vue';
  import QuickAside from '/@/views/common/QuickAside.vue';
</script>

<style lang="less" scoped>
  .desc-word {
    background: linear-gradient(166deg, #41e24f, #4233e4, #e74c3c, #8e44ad, #40e1d2, #ffff01);
    background-size: 500%;
    animation: gradual 17s linear infinite;
    background-clip: text;
    color: transparent;
    line-height: 20px;
  }
</style>
