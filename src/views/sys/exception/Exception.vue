<template>
  <PageWrapper>
    <div class="!md:w-3/4 p-4 rounded mx-auto mt-6 not-found-box">
      <div class="w-full bg-white/80 h-auto py-6 rounded text-center relative">
        <div class="mx-auto relative img-box">
          <img :src="NotFound" alt="" class="relative not-found-img" />
        </div>
        <p class="text-xl text-purple-700/60 !sm:mt-16 !sm:text-3xl">
          抱歉！您没有权限访问该页面或该页面不存在!
        </p>
        <Button type="primary" class="mt-6 !sm:mt-30 mb-6" @click="goHome">回到首页</Button>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
  import NotFound from '/@/assets/images/not-data.png';
  import { Button } from 'ant-design-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { PageWrapper } from '/@/components/Page';

  const go = useGo();
  const goHome = () => {
    go('/');
  };
</script>

<style lang="less" scoped>
  .not-found-box {
    box-sizing: border-box;
  }

  .not-found-img {
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    max-width: 400px;
    object-fit: cover;
  }

  .img-box {
    min-height: 230px;
  }
</style>
