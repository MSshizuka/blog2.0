<template>
  <HeaderTrigger v-if="!sider" />
</template>
<script lang="ts" setup name="LayoutTrigger">
  import { propTypes } from '/@/utils/propTypes';
  import HeaderTrigger from './HeaderTrigger.vue';
  defineProps({ sider: propTypes.bool.def(true) });
</script>
