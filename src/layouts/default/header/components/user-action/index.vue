<template>
  <span @click="doAction('/login')" class="text-light-800 hover:text-white mx-4 cursor-pointer"
    >登录</span
  >
</template>

<script lang="ts" setup>
  import { useGo } from '/@/hooks/web/usePage';
  const go = useGo();
  const doAction = (path: string) => {
    go(path);
  };
</script>
