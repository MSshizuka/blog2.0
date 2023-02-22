<template>
  <div class="w-full md:w-2/3 p-4 flex justify-around mx-auto flex-wrap">
    <ArticleList />
    <QuickAside />
  </div>
</template>

<script setup lang="ts">
  import ArticleList from '/@/views/common/ArticleList.vue';
  import QuickAside from '/@/views/common/QuickAside.vue';
</script>
