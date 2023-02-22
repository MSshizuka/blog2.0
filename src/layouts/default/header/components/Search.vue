<template>
  <div class="flex flex-row-reverse search-wrap items-center">
    <Icon
      icon="material-symbols:search"
      class="cursor-pointer search-icon ml-2"
      @click="searchArticle"
    />

    <Input
      v-model:value.trim="keyword"
      placeholder="输入标题关键词查询"
      class="base-input text-fuchsia-500"
      allow-clear
      @change="searchArticle"
      @press-enter="searchArticle"
      :maxlength="50"
    />
  </div>
</template>

<script lang="ts" setup>
  import Icon from '/@/components/Icon';
  import { Input } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { useDebounceFn } from '@vueuse/shared';
  import { useRouter, useRoute } from 'vue-router';
  const router = useRouter();
  const route = useRoute();
  const keyword = ref('');

  onMounted(() => {
    const k = route.query.k as string | undefined;
    k ? (keyword.value = k) : null;
  });

  const searchArticle = useDebounceFn(() => {
    const k = encodeURIComponent(keyword.value);
    router.push(`/dashboard${keyword.value ? `?k=${k}` : ''}`);
  }, 500);
</script>

<style lang="less" scoped>
  .search-wrap {
    line-height: 48px;

    .base-input {
      padding-left: 0;
      padding-right: 0;
      outline: none;
      border-radius: 0;
      border: none;
      background: transparent;
      color: #d946ef;
      border-bottom: 1px solid rgba(255, 255, 255, 0.6);

      :deep(.ant-input) {
        color: #d946ef;
        background-color: transparent;
      }

      :deep(.anticon.ant-input-clear-icon) {
        color: #d946ef;
      }

      &:hover {
        width: 100%;
      }

      &::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }

      &:focus {
        outline: none;
        border: none;
        box-shadow: none;
        color: #d946ef;
        border-bottom: 1px solid rgba(255, 255, 255, 0.6);
      }
    }

    .search-icon:hover + .base-input {
      width: 100%;
    }
  }
</style>
