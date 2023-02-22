<template>
  <Tooltip :title="getTitle" placement="bottom" :mouseEnterDelay="0.5">
    <span @click="toggle">
      <FullscreenOutlined v-if="!isFullscreen" />
      <FullscreenExitOutlined v-else />
    </span>
  </Tooltip>
</template>
<script lang="ts">
  import { defineComponent, computed, unref } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { useFullscreen } from '@vueuse/core';

  import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue';
  export default defineComponent({
    name: 'FullScreen',
    components: { FullscreenExitOutlined, FullscreenOutlined, Tooltip },

    setup() {
      /* requestFullscreen/exitFullscreen */
      const { toggle, isFullscreen } = useFullscreen();

      const getTitle = computed(() => {
        return unref(isFullscreen) ? '退出全屏' : '全屏';
      });

      return {
        getTitle,
        isFullscreen,
        toggle,
      };
    },
  });
</script>
