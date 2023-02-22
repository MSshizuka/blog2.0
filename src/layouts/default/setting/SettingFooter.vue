<template>
  <div :class="prefixCls">
    <a-button color="warning" block @click="handleResetSetting" class="my-3">
      <RedoOutlined class="mr-2" />
      重置
    </a-button>
  </div>
</template>
<script lang="ts" setup name="SettingFooter">
  import { RedoOutlined } from '@ant-design/icons-vue';
  import { unref } from 'vue';
  import { useAppStore } from '/@/store/modules/app';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updateColorWeak } from '/@/logics/theme/updateColorWeak';
  import { updateGrayMode } from '/@/logics/theme/updateGrayMode';
  import defaultSetting from '/@/settings/projectSetting';
  import { toggleCanvas } from '/@/logics/theme';
  console.log('defaultSetting====>', defaultSetting);

  const { prefixCls } = useDesign('setting-footer');
  const { createMessage } = useMessage();
  const appStore = useAppStore();

  function handleResetSetting() {
    try {
      appStore.setProjectConfig(unref(defaultSetting));
      const { colorWeak, grayMode, openCanvas } = defaultSetting;
      // updateTheme(themeColor);
      updateColorWeak(colorWeak);
      updateGrayMode(grayMode);
      toggleCanvas(openCanvas);
      createMessage.success('重置成功');
    } catch (error: any) {
      createMessage.error(error);
    }
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-setting-footer';

  .@{prefix-cls} {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
