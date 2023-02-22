<template>
  <div class="relative text-white flex flex-col flex-wrap !md:w-7/12 w-full mx-auto z-index-2 mt-7">
    <section class="relative bg-white p-5 mb-6 rounded">
      <header>
        <h1 class="text-center font-bold text-2xl">留言板</h1>
      </header>
      <section>
        <h2 class="text-center font-bold">小伙伴有什么想说的话，就到这里来尽情倾诉吧QwQ</h2>
        <div class="pic-wrapper">
          <img :src="img" alt="" class="w-full" />
        </div>
      </section>
    </section>
    <div class="p-5 bg-white rounded">
      <Comment />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import Comment from '/@/views/common/Comment.vue';
  import { useThemeStore } from '/@/store/modules/theme';
  import { useAppStore } from '/@/store/modules/app';
  const appStore = useAppStore();

  const useTheme = useThemeStore();

  const img = computed(
    () => useTheme.getThemeMap[`${appStore.getProjectConfig.themeName}-message`],
  );
</script>

<style lang="less" scoped>
  .pic-wrapper {
    width: 100%;
    height: auto;
    max-height: 385px;
    overflow: hidden;
  }
</style>
