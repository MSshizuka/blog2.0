<template>
  <div class="p-4">
    <div class="w-full">
      <div class="w-full h-70 flex items-center justify-center relative">
        <img
          :src="avatarUrl"
          alt="おう"
          class="w-30 h-30 cursor-pointer z-index-2 transform hover:rotate-360 duration-500 transition-all rounded-1/2"
        />
        <div class="circle-0 circle-run"></div>
        <div class="circle-1 circle-run"></div>
        <div class="circle-2 circle-run"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import avatarUrl from '/@/assets/images/avatar.jpg';
</script>

<style lang="less" scoped>
  .circle-run {
    position: absolute;
    border: 3px solid transparent;
    border-radius: 50%;
  }

  .circle-0 {
    width: 140px;
    height: 140px;
    border-left-color: #ff4111;
    border-right-color: #ffeb38;
    animation: circle-run 2s 0.6s linear infinite;
  }

  .circle-1 {
    width: 180px;
    height: 180px;
    border-top-color: #14b8a6;
    border-bottom-color: #3bdfee;
    animation: circle-run 2.8s 0.4s linear infinite;
  }

  .circle-2 {
    width: 230px;
    height: 230px;
    border-left-color: #53ff6a;
    border-right-color: #ff41c6;
    animation: circle-run 3.6s 0.2s linear infinite;
  }
</style>
