import { defineComponent, unref } from 'vue';
import { BasicDrawer } from '/@/components/Drawer/index';
import { Divider } from 'ant-design-vue';
import { SelectItem, SwitchItem } from './components';
import { HandlerEnum, thememOptions } from './enum';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import SettingFooter from './SettingFooter.vue';

export default defineComponent({
  name: 'SettingDrawer',
  setup(_, { attrs }) {
    const { currentTheme, getCanvas, getGrayMode, getColorWeak } = useRootSetting();
    function renderTheme() {
      return (
        <>
          <SelectItem
            title="主题背景选择"
            def={unref(currentTheme)}
            event={HandlerEnum.CHANGE_THEME}
            options={thememOptions}
          />
          <SwitchItem
            title="背景动效开关"
            event={HandlerEnum.TOGGLE_CANVAS}
            def={unref(getCanvas)}
          />
          <SwitchItem title="灰色模式" event={HandlerEnum.GRAY_MODE} def={unref(getGrayMode)} />
          <SwitchItem title="色弱模式" event={HandlerEnum.COLOR_WEAK} def={unref(getColorWeak)} />
        </>
      );
    }

    return () => (
      <BasicDrawer {...attrs} title={'设置'} width={300} class="setting-drawer">
        {renderTheme()}
        <Divider />
        <SettingFooter />
      </BasicDrawer>
    );
  },
});
