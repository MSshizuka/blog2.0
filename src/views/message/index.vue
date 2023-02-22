<template>
  <div class="w-full md:w-2/3 p-4 flex justify-around mx-auto flex-wrap">
    <Message />
    <QuickAside />
  </div>
</template>

<script setup lang="ts">
  import Message from '/@/views/message/Message.vue';
  import QuickAside from '/@/views/common/QuickAside.vue';
</script>
