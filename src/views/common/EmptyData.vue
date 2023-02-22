<template>
  <div class="w-full flex flex-col justify-center items-center">
    <img :src="emptyImg" alt="" /><p class="text-xl font-bold text-gray-700">抱歉！暂无数据！</p>
  </div>
</template>

<script setup lang="ts">
  import emptyImg from '/@/assets/images/not-data.png';
</script>
