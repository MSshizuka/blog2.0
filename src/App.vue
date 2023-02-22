<template>
  <AppProvider>
    <RouterView />
  </AppProvider>
</template>

<script lang="ts" setup>
  import { AppProvider } from '/@/components/Application';
  import { ref } from 'vue';
  import { useThemeStore } from '/@/store/modules/theme';

  const useTheme = useThemeStore();

  const theme = ref({});

  const modules = import.meta.globEager('./assets/images/theme/**/*.**');

  Object.keys(modules).forEach((key) => {
    const keyAry = key.split('/');
    const len = keyAry.length - 1;
    let imgName = keyAry[len];
    const imgKey = `${keyAry[len - 1]}-${imgName}`.replace(/^([^.]+).+/, (...args) => args[1]);
    const mod = modules[key].default || {};
    theme.value[imgKey] = mod;
    useTheme.setThemeMap(theme.value);
  });
</script>
